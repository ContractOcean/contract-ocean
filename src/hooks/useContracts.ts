import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export interface Contract {
  id: string;
  name: string;
  counterparty: string;
  owner_id: string;
  owner_name: string;
  category: string;
  status: 'draft' | 'in_review' | 'sent' | 'awaiting_signature' | 'signed' | 'completed' | 'expiring_soon' | 'archived';
  created_at: string;
  updated_at: string;
  expiry_date: string;
  value: number;
  signature_status: string;
  content: unknown;
}

interface UseContractsReturn {
  contracts: Contract[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  refetch: () => Promise<void>;
  createContract: (contract: Partial<Contract>) => Promise<{ data: Contract | null; error: string | null }>;
}

export function useContracts(): UseContractsReturn {
  const { user, profile } = useAuth();
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('contracts')
      .select('*')
      .order('updated_at', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setContracts((data as Contract[]) || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  async function createContract(contract: Partial<Contract>) {
    if (!user) return { data: null, error: 'Not authenticated' };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: err } = await (supabase.from('contracts') as any)
      .insert({
        name: contract.name || 'Untitled Contract',
        counterparty: contract.counterparty || '',
        owner_id: user.id,
        owner_name: profile?.full_name || '',
        category: contract.category || 'Service',
        status: contract.status || 'draft',
        value: contract.value || 0,
        signature_status: contract.signature_status || 'Not sent',
        content: contract.content || null,
        expiry_date: contract.expiry_date || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (!err && data) {
      setContracts((prev) => [data as Contract, ...prev]);
    }
    return { data: data as Contract | null, error: err?.message ?? null };
  }

  return {
    contracts,
    loading,
    error,
    isEmpty: !loading && contracts.length === 0,
    refetch: fetch,
    createContract,
  };
}
