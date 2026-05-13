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
        return Response.json(data);
      }
    }
  } catch (error) {
    console.error('Backend auth error:', error instanceof Error ? error.message : String(error));
  }

  // Fallback for signup: use Supabase directly
  if (endpoint === '/signup') {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
      );

      const { email, password, name, phone } = body;
      if (!email || !password) {
        return Response.json({ error: 'Email and password required' }, { status: 400 });
      }

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { name: name || '' } },
      });

      if (authError) {
        return Response.json({ error: authError.message }, { status: 400 });
      }

      // Create trial subscription and profile with plan='trial' from the start
      const userId = authData.user?.id;
      if (userId) {
        const trialEndDate = new Date();
        trialEndDate.setDate(trialEndDate.getDate() + 7);

        // Create profile with plan='trial' from the beginning
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({
            id: userId,
            email,
            name: name || '',
            phone: phone || '',
            plan: 'trial',
            trialEndsAt: trialEndDate.toISOString(),
          });

        if (profileError) {
          console.warn('Profile creation error (non-blocking):', profileError);
        }

        // Create trial subscription
        const { error: subError } = await supabase
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
          console.warn('Trial subscription error (non-blocking):', subError);
        }
      }

      return Response.json({
        success: true,
        userId: authData.user?.id,
        trialActivated: true,
        message: '7-day free trial activated',
      });
    } catch (error) {
      console.error('Supabase fallback error:', error instanceof Error ? error.message : String(error));
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
