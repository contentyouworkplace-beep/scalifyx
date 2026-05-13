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

const API_BASE_URL = '/api';

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
      console.log('🔄 Fetching profile for userId:', userId);
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) {
        console.warn(`⚠️ Profile query error (code: ${error.code}):`, error.message);
        if (error.code === 'PGRST116') {
          console.log('📝 Profile not found, creating fallback profile with plan=free');
          const { data: authUser } = await supabase.auth.getUser();
          const email = authUser?.user?.email || '';
          const name = authUser?.user?.user_metadata?.name || '';
          const { data: newProfile, error: insertError } = await supabase
            .from('profiles')
            .upsert({ id: userId, email, name, plan: 'free' }, { onConflict: 'id' })
            .select()
            .single();
          if (insertError) {
            console.error('❌ Fallback profile creation error:', insertError);
            throw insertError;
          }
          console.log('✅ Fallback profile created with plan=free');
          data = newProfile;
        } else {
          throw error;
        }
      } else if (data) {
        console.log('✅ Profile found in database:', { plan: data.plan, email: data.email });
      }

      if (!data) throw new Error('No profile found');

      // If phone is missing from profile, recover it from auth user_metadata and save it
      if (!data.phone) {
        const { data: authUser } = await supabase.auth.getUser();
        const phoneFromMeta = authUser?.user?.user_metadata?.phone;
        if (phoneFromMeta) {
          await supabase.from('profiles').update({ phone: phoneFromMeta }).eq('id', userId);
          data.phone = phoneFromMeta;
        }
      }

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

      const { data: websites } = await supabase
        .from('websites')
        .select('deployed_url')
        .eq('user_id', userId)
        .eq('status', 'live')
        .limit(1);

      const website = websites?.[0];
      if (website?.deployed_url) {
        profile.websiteUrl = website.deployed_url;
      }

      console.log('✅ Profile fetched and set in AuthContext:', { plan: profile.plan, name: profile.name });
      setUser(profile);
    } catch (e) {
      console.error('💥 Failed to fetch profile:', e);
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string, name?: string, phone?: string) => {
    try {
      console.log('🔄 [1] Starting signup for:', email);
      const res = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name: name || '', phone: phone || '' }),
      });

      const result = await res.json();
      console.log('📝 [2] Signup endpoint response:', { status: res.status, success: result.success, message: result.message, error: result.error });
      if (!res.ok || !result.success) {
        return { success: false, error: result.error || 'Sign up failed' };
      }

      console.log('🔐 [3] Signing in user after successful signup...');
      const { error: signInError } = await supabase.auth.signInWithPassword({ email, password });
      if (signInError) {
        console.error('❌ [3] Sign in failed:', signInError.message);
        return { success: false, error: signInError.message };
      }

      console.log('✅ [4] Sign in successful - onAuthStateChange should trigger fetchProfile');
      return { success: true };
    } catch (e: unknown) {
      const message = e instanceof Error ? e.message : 'Sign up failed';
      console.error('💥 Signup error:', message);
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
