export async function POST(req: Request, { params }: { params: { slug: string[] } }) {
  const endpoint = `/${params.slug.join('/')}`;
  const body = await req.json();

  // Try backend first
  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL;
    if (backendUrl) {
      const url = `${backendUrl}/api/auth${endpoint}`;
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await response.json();
      if (response.ok) {
        console.log('✅ Backend auth endpoint succeeded for', endpoint);
        return Response.json(data);
      } else {
        console.warn(`⚠️ Backend auth endpoint returned ${response.status} for ${endpoint}:`, data);
      }
    }
  } catch (error) {
    console.error('💥 Backend auth error:', error instanceof Error ? error.message : String(error));
  }

  // Fallback for signup: use Supabase directly
  if (endpoint === '/signup') {
    try {
      console.log('🔄 Using Supabase fallback for signup (backend unavailable or failed)');
      const { createClient } = await import('@supabase/supabase-js');
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
      const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';
      const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

      const supabase = createClient(supabaseUrl, anonKey);

      const { email, password, name, phone } = body;
      if (!email || !password) {
        return Response.json({ error: 'Email and password required' }, { status: 400 });
      }

      // Create auth user — store phone+name in user_metadata as a reliable carrier
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: name || '', phone: phone || '' } },
      });

      if (authError) {
        console.error('❌ Auth user creation failed:', authError.message);
        return Response.json({ error: authError.message }, { status: 400 });
      }

      // Create trial subscription and profile with plan='trial' from the start
      const userId = authData.user?.id;
      if (userId) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        // Pick the best client for DB writes (needs to bypass RLS):
        // 1. Service role key (full bypass) — requires SUPABASE_SERVICE_ROLE_KEY env var
        // 2. User's own session token — RLS allows user to write their own profile row
        // 3. Anon fallback — may fail RLS but won't crash signup
        let writeClient;
        if (serviceRoleKey) {
          writeClient = createClient(supabaseUrl, serviceRoleKey);
          console.log('🔑 Using service role key for profile write');
        } else if (authData.session?.access_token) {
          writeClient = createClient(supabaseUrl, anonKey, {
            global: { headers: { Authorization: `Bearer ${authData.session.access_token}` } },
          });
          console.log('🔑 Using user session token for profile write');
        } else {
          writeClient = supabase;
          console.warn('⚠️ No service role key or session — profile write may be blocked by RLS');
        }

        const { error: profileError } = await writeClient
          .from('profiles')
          .upsert({
            id: userId,
            email,
            name: name || '',
            phone: phone || '',
            plan: 'trial',
          })
          .select();

        if (profileError) {
          console.error('❌ Profile creation error:', profileError);
        } else {
          console.log('✅ Profile created via Supabase fallback:', { userId, plan: 'trial', email, phone: phone ? '***' : 'N/A' });
        }

        // Create trial subscription
        const { error: subError } = await writeClient
          .from('subscriptions')
          .insert({
            user_id: userId,
            plan: 'trial',
            amount: 0,
            status: 'active',
            start_date: new Date().toISOString(),
            end_date: trialEndDate.toISOString(),
            auto_renew: false,
          });

        if (subError) {
          console.error('❌ Trial subscription creation error:', subError);
        } else {
          console.log('✅ Trial subscription created via Supabase fallback:', { userId });
        }
      }

      return Response.json({
        success: true,
        userId: authData.user?.id,
        trialActivated: true,
        message: '7-day free trial activated',
      });
    } catch (error) {
      console.error('💥 Supabase fallback error:', error instanceof Error ? error.message : String(error));
      return Response.json(
        { error: 'Authentication service unavailable' },
        { status: 503 }
      );
    }
  }

  return Response.json(
    { error: 'Authentication service unavailable' },
    { status: 503 }
  );
}

export async function GET(req: Request, { params }: { params: { slug: string[] } }) {
  const endpoint = `/${params.slug.join('/')}`;

  try {
    const backendUrl = process.env.BACKEND_URL || process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3001';
    const url = `${backendUrl}/api/auth${endpoint}`;

    const authHeader = req.headers.get('authorization');

    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(authHeader && { authorization: authHeader }),
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return Response.json(data, { status: response.status });
    }

    return Response.json(data);
  } catch (error) {
    console.error('Auth proxy error:', error instanceof Error ? error.message : String(error));
    return Response.json(
      { error: 'Authentication service unavailable' },
      { status: 503 }
    );
  }
}
