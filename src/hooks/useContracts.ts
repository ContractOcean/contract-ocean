import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export interface Contract {
  id: string;
  name: string;
  counterparty: string;
  owner: string;
  category: string;
  status: 'draft' | 'in_review' | 'sent' | 'awaiting_signature' | 'signed' | 'completed' | 'expiring_soon' | 'archived';
  createdDate: string;
  lastUpdated: string;
  expiryDate: string;
  value: number;
  signatureStatus: string;
  content: unknown;
}

// Map Supabase snake_case → app camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapContract(row: any): Contract {
  return {
    id: row.id,
    name: row.name,
    counterparty: row.counterparty,
    owner: row.owner_name || '',
    category: row.category,
    status: row.status,
    createdDate: row.created_at,
    lastUpdated: row.updated_at,
    expiryDate: row.expiry_date,
    value: Number(row.value) || 0,
    signatureStatus: row.signature_status,
    content: row.content,
  };
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
      setContracts((data || []).map(mapContract));
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
        signature_status: contract.signatureStatus || 'Not sent',
        content: contract.content || null,
        expiry_date: contract.expiryDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
      })
      .select()
      .single();

    if (!err && data) {
      const mapped = mapContract(data);
      setContracts((prev) => [mapped, ...prev]);
      return { data: mapped, error: null };
    }
    return { data: null, error: err?.message ?? null };
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
