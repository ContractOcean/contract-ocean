import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/AuthContext';

export interface Template {
  id: string;
  name: string;
  category: string;
  description: string;
  useCase: string;
  estimatedTime: string;
  popular: boolean;
  recommended: boolean;
  usageCount: number;
  content: unknown;
  type: 'system' | 'custom';
  userId: string | null;
  createdAt: string;
}

// Map Supabase snake_case → app camelCase
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapTemplate(row: any): Template {
  return {
    id: row.id,
    name: row.name,
    category: row.category,
    description: row.description,
    useCase: row.use_case || '',
    estimatedTime: row.estimated_time || '10 min',
    popular: row.popular || false,
    recommended: row.recommended || false,
    usageCount: row.usage_count || 0,
    content: row.content,
    type: row.type || 'system',
    userId: row.user_id,
    createdAt: row.created_at,
  };
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
      setTemplates((data || []).map(mapTemplate));
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
        use_case: template.useCase,
        estimated_time: template.estimatedTime,
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
      const mapped = mapTemplate(data);
      setTemplates((prev) => [mapped, ...prev]);
      return { data: mapped, error: null };
    }
    return { data: null, error: err?.message ?? null };
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
