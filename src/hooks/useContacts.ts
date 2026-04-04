import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export interface Contact {
  id: string;
  name: string;
  email: string;
  role: string;
  company: string;
  phone: string;
  tags: string[];
  contractCount: number;
  status: 'active' | 'inactive';
  lastActivity: string;
  createdAt: string;
}

// Map Supabase snake_case → app camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapContact(row: any): Contact {
  return {
    id: row.id,
    name: row.name,
    email: row.email || '',
    role: row.role || '',
    company: row.company || '',
    phone: row.phone || '',
    tags: row.tags || [],
    contractCount: row.contract_count || 0,
    status: row.status || 'active',
    lastActivity: row.last_activity || row.created_at,
    createdAt: row.created_at,
  };
}

interface UseContactsReturn {
  contacts: Contact[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  refetch: () => Promise<void>;
  createContact: (contact: Partial<Contact>) => Promise<{ data: Contact | null; error: string | null }>;
}

export function useContacts(): UseContactsReturn {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('contacts')
      .select('*')
      .order('last_activity', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setContacts((data || []).map(mapContact));
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  async function createContact(contact: Partial<Contact>) {
    if (!user) return { data: null, error: 'Not authenticated' };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: err } = await (supabase.from('contacts') as any)
      .insert({
        name: contact.name || '',
        email: contact.email || '',
        role: contact.role || '',
        company: contact.company || '',
        phone: contact.phone || '',
        tags: contact.tags || [],
        contract_count: 0,
        status: 'active',
        last_activity: new Date().toISOString(),
        owner_id: user.id,
      })
      .select()
      .single();

    if (!err && data) {
      const mapped = mapContact(data);
      setContacts((prev) => [mapped, ...prev]);
      return { data: mapped, error: null };
    }
    return { data: null, error: err?.message ?? null };
  }

  return {
    contacts,
    loading,
    error,
    isEmpty: !loading && contacts.length === 0,
    refetch: fetch,
    createContact,
  };
}
