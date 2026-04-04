import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  use_case: string;
  estimated_time: string;
  popular: boolean;
  recommended: boolean;
  usage_count: number;
  content: unknown;
  type: 'system' | 'custom';
  user_id: string | null;
  created_at: string;
}

interface UseTemplatesReturn {
  templates: Template[];
  systemTemplates: Template[];
  customTemplates: Template[];
  loading: boolean;
  error: string | null;
  isEmpty: boolean;
  refetch: () => Promise<void>;
  duplicateTemplate: (template: Template, newName?: string) => Promise<{ data: Template | null; error: string | null }>;
}

export function useTemplates(): UseTemplatesReturn {
  const { user } = useAuth();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetch = useCallback(async () => {
    if (!user) { setLoading(false); return; }
    setLoading(true);
    setError(null);

    const { data, error: err } = await supabase
      .from('templates')
      .select('*')
      .order('usage_count', { ascending: false });

    if (err) {
      setError(err.message);
    } else {
      setTemplates((data as Template[]) || []);
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { fetch(); }, [fetch]);

  const systemTemplates = templates.filter((t) => t.type === 'system');
  const customTemplates = templates.filter((t) => t.type === 'custom');

  async function duplicateTemplate(template: Template, newName?: string) {
    if (!user) return { data: null, error: 'Not authenticated' };

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data, error: err } = await (supabase.from('templates') as any)
      .insert({
        name: newName || `${template.name} (Copy)`,
        category: template.category,
        description: template.description,
        use_case: template.use_case,
        estimated_time: template.estimated_time,
        popular: false,
        recommended: false,
        usage_count: 0,
        content: template.content,
        type: 'custom',
        user_id: user.id,
      })
      .select()
      .single();

    if (!err && data) {
      setTemplates((prev) => [data as Template, ...prev]);
    }
    return { data: data as Template | null, error: err?.message ?? null };
  }

  return {
    templates,
    systemTemplates,
    customTemplates,
    loading,
    error,
    isEmpty: !loading && templates.length === 0,
    refetch: fetch,
    duplicateTemplate,
  };
}
