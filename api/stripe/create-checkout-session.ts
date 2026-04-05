import type { VercelRequest, VercelResponse } from '@vercel/node';
import Stripe from 'stripe';
import { createClient } from '@supabase/supabase-js';

// ─── Env validation ─────────────────────────────────────────────────────────

const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY;
const SUPABASE_URL = process.env.VITE_SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const APP_URL = process.env.APP_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:5173');

const PRICE_MAP: Record<string, string | undefined> = {
  pro: process.env.STRIPE_PRICE_PRO_MONTHLY,
  business: process.env.STRIPE_PRICE_BUSINESS_MONTHLY,
};

const VALID_PLANS = ['pro', 'business'] as const;

// ─── Handler ────────────────────────────────────────────────────────────────

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Validate server env vars
  if (!STRIPE_SECRET_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    return res.status(500).json({ error: 'Server configuration error' });
  }

  // ─── STEP 1: Authenticate user from JWT (not from body) ────────────────
  // The frontend sends the Supabase access token in the Authorization header.
  // We verify it server-side — this is the ONLY trusted source of user identity.

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid authorization token.' });
  }

  const accessToken = authHeader.replace('Bearer ', '');

  // Create a Supabase client with the user's token to verify identity
  const supabaseAuth = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);
  const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(accessToken);

  if (authError || !user) {
    return res.status(401).json({ error: 'Invalid or expired session. Please sign in again.' });
  }

  // ─── STEP 2: Validate request body (plan only — no userId from client) ─

  const { plan } = req.body || {};

  if (!plan || !VALID_PLANS.includes(plan)) {
    return res.status(400).json({ error: 'Invalid plan. Must be "pro" or "business".' });
  }

  const priceId = PRICE_MAP[plan];
  if (!priceId) {
    return res.status(500).json({ error: `Price not configured for plan: ${plan}` });
  }

  // ─── STEP 3: Fetch user profile using server-verified user.id ──────────

  try {
    const stripe = new Stripe(STRIPE_SECRET_KEY);
    const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, email, full_name, company_name, stripe_customer_id, workspace_id')
      .eq('id', user.id) // user.id comes from verified JWT, NOT from client body
      .single();

    if (profileError || !profile) {
      return res.status(404).json({ error: 'User profile not found.' });
    }

    // ─── STEP 4: Resolve or create Stripe customer ───────────────────────

    let customerId = profile.stripe_customer_id;

    if (!customerId) {
      const customer = await stripe.customers.create({
        email: profile.email,
        name: profile.full_name || undefined,
        metadata: {
          supabase_user_id: profile.id,
          workspace_id: profile.workspace_id || '',
          company_name: profile.company_name || '',
        },
      });

      customerId = customer.id;

      await supabase
        .from('profiles')
        .update({ stripe_customer_id: customerId })
        .eq('id', profile.id);
    }

    // ─── STEP 5: Create Checkout Session ─────────────────────────────────

    const baseUrl = APP_URL.replace(/\/$/, '');

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      customer: customerId,
      line_items: [{ price: priceId, quantity: 1 }],
      success_url: `${baseUrl}/billing/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/billing?checkout=cancelled`,
      metadata: {
        workspace_id: profile.workspace_id || '',
        plan_key: plan,
        supabase_user_id: profile.id,
      },
      subscription_data: {
        metadata: {
          workspace_id: profile.workspace_id || '',
          plan_key: plan,
          supabase_user_id: profile.id,
        },
      },
    });

    // Return only the redirect URL — nothing sensitive
    return res.status(200).json({ url: session.url });

  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return res.status(500).json({ error: `Checkout failed: ${message}` });
  }
}
