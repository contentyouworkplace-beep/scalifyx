'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import type { Session } from '@supabase/supabase-js';
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role?: string;
  plan?: string;
  business_name?: string;
  business_type?: string;
  referral_code?: string;
  created_at?: string;
  [key: string]: any;
}

export type { User };

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.scalifyx.com/api';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoading: boolean;
  isAdmin: boolean;
  signUp: (email: string, password: string, name?: string, phone?: string) => Promise<{ success: boolean; error?: string }>;
  signIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateUser: (data: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isAdmin = user?.role === 'admin';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setIsLoading(false);
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session?.user) {
        fetchProfile(session.user.id);
      } else {
        setUser(null);
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (userId: string) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error && error.code === 'PGRST116') {
        const { data: authUser } = await supabase.auth.getUser();
        const email = authUser?.user?.email || '';
        const name = authUser?.user?.user_metadata?.name || '';
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .upsert({ id: userId, email, name }, { onConflict: 'id' })
          .select()
          .single();
        if (insertError) throw insertError;
        data = newProfile;
      }

      if (!data) throw new Error('No profile found');

      const profile: User = {
        id: data.id,
        phone: data.phone,
        name: data.name,
        email: data.email,
        plan: data.plan,
        businessName: data.business_name,
        businessType: data.business_type,
        role: data.role,
        credits: data.credits,
        referralCode: data.referral_code,
      };

      const { data: website } = await supabase
        .from('websites')
        .select('deployed_url')
        .eq('user_id', userId)
        .eq('status', 'live')
        .limit(1)
        .single();

      if (website?.deployed_url) {
        profile.websiteUrl = website.deployed_url;
      }

      setUser(profile);
    } catch (e) {
      console.error('Failed to fetch profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string, phone?: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || '', phone: phone || '' }),
      });

      const result = await res.json();
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Sign up failed' };
      }

      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) return { success: false, error: signInError.message };

      return { success: true };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Sign up failed';
      return { success: false, error: message };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return { success: false, error: error.message };
      return { success: true };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Sign in failed';
      return { success: false, error: message };
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
  };

  const updateUser = (data: Partial<User>) => {
    if (user) setUser({ ...user, ...data });
  };

  return (
    <AuthContext.Provider value={{ user, session, isLoading, isAdmin, signUp, signIn, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}
