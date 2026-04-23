export interface User {
  id: string;
  phone?: string;
  name?: string;
  email?: string;
  plan?: string;
  websiteUrl?: string;
  businessName?: string;
  businessType?: string;
  role?: 'user' | 'admin';
  credits?: number;
  referralCode?: string;
  pushToken?: string;
}

export interface Website {
  id: string;
  user_id: string;
  site_id: string;
  subdomain?: string;
  custom_domain?: string;
  business_name: string;
  html_content?: string;
  theme_color?: string;
  services?: Record<string, unknown>;
  contact?: Record<string, unknown>;
  template?: string;
  status: 'draft' | 'live' | 'paused' | 'deleted';
  deployed_url?: string;
  visitors?: number;
  leads?: number;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  type: 'ai' | 'support' | 'admin';
  status: 'active' | 'resolved' | 'archived';
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  sender_type: 'user' | 'ai' | 'admin';
  content: string;
  metadata?: Record<string, unknown>;
  created_at: string;
}

export interface Subscription {
  id: string;
  user_id: string;
  plan: 'trial' | 'pro';
  amount: number;
  status: 'active' | 'expiring' | 'expired' | 'cancelled';
  razorpay_subscription_id?: string;
  start_date: string;
  end_date: string;
  created_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  subscription_id?: string;
  amount: number;
  method?: string;
  transaction_id?: string;
  razorpay_payment_id?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  plan?: string;
  created_at: string;
}

export interface Notification {
  id: string;
  title: string;
  body: string;
  type: 'chat' | 'update' | 'promo' | 'alert' | 'info';
  target: 'all' | 'pro' | 'free' | 'specific';
  status: 'draft' | 'sent' | 'scheduled';
  target_user_ids?: string[];
  created_at: string;
}

export interface Offer {
  id: string;
  name: string;
  description?: string;
  plan_type: string;
  price: number;
  original_price?: number;
  trial_days?: number;
  features?: string[];
  is_active: boolean;
  sort_order?: number;
  created_at: string;
}

export interface AdminDashboardStats {
  totalUsers: number;
  activeSites: number;
  totalRevenue: number;
  pendingPayments: number;
}
