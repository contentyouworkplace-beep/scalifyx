import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

function db() {
  return createClient(SUPABASE_URL, SERVICE_KEY || ANON_KEY);
}

async function getAuthUser(req: Request) {
  const jwt = req.headers.get('authorization')?.replace(/^Bearer\s+/i, '').trim();
  if (!jwt) return null;
  const { data: { user } } = await createClient(SUPABASE_URL, ANON_KEY).auth.getUser(jwt);
  return user ?? null;
}

async function getProfile(userId: string) {
  const { data } = await db().from('profiles').select('role, name').eq('id', userId).maybeSingle();
  return data;
}

import { TASKS } from '@/lib/tasks';

// ── GET /api/work/:userId ──────────────────────────────────────────────────────
// Returns tasks (with completion) + all comments for each task
async function handleGet(req: Request, targetUserId: string) {
  const authUser = await getAuthUser(req);
  if (!authUser) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfile(authUser.id);
  const isAdmin = profile?.role === 'admin';

  // Non-admin can only view their own board
  if (!isAdmin && authUser.id !== targetUserId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  const [progressData, commentsData, targetProfile] = await Promise.all([
    db().from('website_progress').select('task_key, completed, completed_at').eq('user_id', targetUserId),
    db().from('task_comments').select('id, task_key, content, author_name, author_role, created_at').eq('user_id', targetUserId).order('created_at', { ascending: true }),
    db().from('profiles').select('name, business_name').eq('id', targetUserId).maybeSingle(),
  ]);

  const completedKeys = new Set((progressData.data || []).filter((r: any) => r.completed).map((r: any) => r.task_key));
  const completedAt: Record<string, string> = {};
  (progressData.data || []).forEach((r: any) => { if (r.completed) completedAt[r.task_key] = r.completed_at; });

  const commentsByTask: Record<string, any[]> = {};
  (commentsData.data || []).forEach((c: any) => {
    if (!commentsByTask[c.task_key]) commentsByTask[c.task_key] = [];
    commentsByTask[c.task_key].push(c);
  });

  const tasks = TASKS.map(t => ({
    ...t,
    completed: completedKeys.has(t.key),
    completed_at: completedAt[t.key] || null,
    comments: commentsByTask[t.key] || [],
  }));

  return Response.json({
    success: true,
    tasks,
    userName: targetProfile.data?.name || '',
    businessName: targetProfile.data?.business_name || '',
    totalTasks: TASKS.length,
    completedCount: completedKeys.size,
  });
}

// ── POST /api/work/:userId/complete ────────────────────────────────────────────
// Admin only: toggle task complete/incomplete
async function handleComplete(req: Request, targetUserId: string) {
  const authUser = await getAuthUser(req);
  if (!authUser) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfile(authUser.id);
  if (profile?.role !== 'admin') return Response.json({ error: 'Admin only' }, { status: 403 });

  let body: { task_key: string; completed: boolean };
  try { body = await req.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }

  const { task_key, completed } = body;

  if (completed) {
    await db().from('website_progress').upsert(
      { user_id: targetUserId, task_key, completed: true, completed_at: new Date().toISOString() },
      { onConflict: 'user_id,task_key' }
    );
  } else {
    await db().from('website_progress').delete().eq('user_id', targetUserId).eq('task_key', task_key);
  }

  return Response.json({ success: true });
}

// ── POST /api/work/:userId/comment ─────────────────────────────────────────────
// Both admin and user can post a comment on any task
async function handleComment(req: Request, targetUserId: string) {
  const authUser = await getAuthUser(req);
  if (!authUser) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfile(authUser.id);
  const isAdmin = profile?.role === 'admin';

  // Must be admin OR the user whose board this is
  if (!isAdmin && authUser.id !== targetUserId) {
    return Response.json({ error: 'Forbidden' }, { status: 403 });
  }

  let body: { task_key: string; content: string };
  try { body = await req.json(); } catch { return Response.json({ error: 'Invalid body' }, { status: 400 }); }

  const { task_key, content } = body;
  if (!content?.trim()) return Response.json({ error: 'Comment cannot be empty' }, { status: 400 });

  const authorName = profile?.name || (isAdmin ? 'Admin' : 'You');

  const { data, error } = await db().from('task_comments').insert({
    user_id: targetUserId,
    task_key,
    content: content.trim(),
    author_id: authUser.id,
    author_name: authorName,
    author_role: isAdmin ? 'admin' : 'user',
  }).select().maybeSingle();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json({ success: true, comment: data });
}

// ── DELETE /api/work/:userId/comment/:commentId ────────────────────────────────
async function handleDeleteComment(req: Request, targetUserId: string, commentId: string) {
  const authUser = await getAuthUser(req);
  if (!authUser) return Response.json({ error: 'Unauthorized' }, { status: 401 });

  const profile = await getProfile(authUser.id);
  const isAdmin = profile?.role === 'admin';

  // Admin can delete any comment; user can delete own comment
  if (isAdmin) {
    await db().from('task_comments').delete().eq('id', commentId);
  } else {
    await db().from('task_comments').delete().eq('id', commentId).eq('author_id', authUser.id);
  }

  return Response.json({ success: true });
}

// ── Router ────────────────────────────────────────────────────────────────────

export async function GET(req: Request, { params }: { params: { slug: string[] } }) {
  const [userId] = params.slug;
  if (userId) return handleGet(req, userId);
  return Response.json({ error: 'Not found' }, { status: 404 });
}

export async function POST(req: Request, { params }: { params: { slug: string[] } }) {
  const [userId, action] = params.slug;
  if (!userId) return Response.json({ error: 'Not found' }, { status: 404 });
  if (action === 'complete') return handleComplete(req, userId);
  if (action === 'comment') return handleComment(req, userId);
  return Response.json({ error: 'Not found' }, { status: 404 });
}

export async function DELETE(req: Request, { params }: { params: { slug: string[] } }) {
  const [userId, action, commentId] = params.slug;
  if (action === 'comment' && commentId) return handleDeleteComment(req, userId, commentId);
  return Response.json({ error: 'Not found' }, { status: 404 });
}
