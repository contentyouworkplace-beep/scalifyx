'use client';

import { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAuth } from '../../context/AuthContext';
import { Logo } from '../../components/Logo';
import Link from 'next/link';

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signIn, signUp, user, isLoading, isAdmin } = useAuth();

  const [isSignUp, setIsSignUp] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (searchParams.get('tab') === 'signup') setIsSignUp(true);
  }, [searchParams]);

  useEffect(() => {
    if (!isLoading && user) {
      router.replace(isAdmin ? '/admin' : '/dashboard');
    }
  }, [user, isLoading, isAdmin, router]);

  // Animate the loading dots
  useEffect(() => {
    if (!loading) return;
    const base = isSignUp ? 'Creating your account' : 'Signing you in';
    let dots = 0;
    setLoadingText(base);
    const interval = setInterval(() => {
      dots = (dots + 1) % 4;
      setLoadingText(base + '.'.repeat(dots));
    }, 400);
    return () => clearInterval(interval);
  }, [loading, isSignUp]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setLoading(true);

    const result = isSignUp
      ? await signUp(email, password, name)
      : await signIn(email, password);

    if (!result.success) {
      setError(result.error || 'Something went wrong');
      setLoading(false);
    } else {
      setSuccess(true);
      setLoadingText(isSignUp ? 'Account created! Redirecting...' : 'Welcome back! Redirecting...');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <Link href="/" className="flex justify-center mb-2"><Logo size={44} /></Link>
        <p className="text-center text-zinc-500 mb-8">
          {isSignUp ? 'Create your account' : 'Welcome back'}
        </p>

        <div className="p-8 rounded-2xl bg-card border border-border">
          {/* Tabs */}
          <div className="flex mb-6 bg-surface rounded-lg p-1">
            <button
              onClick={() => { setIsSignUp(false); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${!isSignUp ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => { setIsSignUp(true); setError(''); }}
              className={`flex-1 py-2 rounded-md text-sm font-medium transition ${isSignUp ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <div>
                <label className="block text-sm text-zinc-400 mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 bg-inputBg border border-border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition"
                  placeholder="Your name"
                />
              </div>
            )}
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-3 bg-inputBg border border-border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition"
                placeholder="you@example.com"
              />
            </div>
            <div>
              <label className="block text-sm text-zinc-400 mb-1">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-3 bg-inputBg border border-border rounded-lg text-white placeholder-zinc-600 focus:outline-none focus:border-primary transition"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">{error}</div>
            )}

            {/* Loading / Success state overlay */}
            {loading && (
              <div className="flex flex-col items-center gap-3 py-2">
                {!success ? (
                  <div className="w-8 h-8 border-[3px] border-primary border-t-transparent rounded-full animate-spin" />
                ) : (
                  <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary animate-[scaleIn_0.3s_ease-out]">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                )}
                <p className="text-sm text-zinc-400 min-w-[200px] text-center">{loadingText}</p>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-primary hover:bg-primary-dark text-white rounded-lg font-semibold transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    {isSignUp ? 'Signing Up...' : 'Signing In...'}
                  </span>
                )
                : isSignUp ? 'Create Account' : 'Sign In'
              }
            </button>
          </form>
        </div>

        <p className="text-center text-zinc-600 text-sm mt-6">
          By continuing, you agree to our Terms of Service.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
