import { useNavigate } from 'react-router-dom';
import { Plus, FileText, Sparkles, ArrowRight } from 'lucide-react';

interface EmptyStateAction {
  label: string;
  route: string;
  primary?: boolean;
  icon?: React.ElementType;
}

interface EmptyStateProps {
  icon?: React.ElementType;
  title: string;
  description: string;
  actions?: EmptyStateAction[];
}

export default function EmptyState({ icon: Icon, title, description, actions }: EmptyStateProps) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center py-20 px-4">
      {Icon && (
        <div className="mb-5 w-16 h-16 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-center">
          <Icon className="w-7 h-7 text-slate-300" />
        </div>
      )}
      <h3 className="text-[17px] font-semibold text-slate-900 text-center">{title}</h3>
      <p className="mt-2 text-[14px] text-slate-500 text-center max-w-sm leading-relaxed">{description}</p>

      {actions && actions.length > 0 && (
        <div className="mt-6 flex items-center gap-3">
          {actions.map((action) => {
            const ActionIcon = action.icon || (action.primary ? Plus : ArrowRight);
            return (
              <button
                key={action.label}
                onClick={() => navigate(action.route)}
                className={`flex items-center gap-2 px-5 py-2.5 text-[13px] font-semibold rounded-lg transition-colors ${
                  action.primary
                    ? 'bg-ocean-600 text-white hover:bg-ocean-700 shadow-sm'
                    : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
                }`}
              >
                <ActionIcon className="w-4 h-4" />
                {action.label}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ─── Pre-built empty states for each page ───────────────────────────────────

export function ContractsEmptyState() {
  return (
    <EmptyState
      icon={FileText}
      title="No contracts yet"
      description="Create your first contract from a template or start from scratch."
      actions={[
        { label: 'Use Template', route: '/templates', primary: true, icon: FileText },
        { label: 'Create from Scratch', route: '/ai-generator', icon: Sparkles },
      ]}
    />
  );
}

export function ContactsEmptyState() {
  return (
    <EmptyState
      icon={Plus}
      title="No contacts yet"
      description="Add your first contact to start sending contracts faster."
      actions={[
        { label: 'Add Contact', route: '/contacts', primary: true, icon: Plus },
      ]}
    />
  );
}

export function AnalyticsEmptyState() {
  return (
    <EmptyState
      icon={FileText}
      title="No analytics data yet"
      description="Analytics will appear once you send your first contract."
      actions={[
        { label: 'Create & Send Contract', route: '/ai-generator', primary: true, icon: Sparkles },
      ]}
    />
  );
}

export function NotificationsEmptyState() {
  return (
    <div className="py-8 text-center">
      <p className="text-[13px] text-slate-400">You&rsquo;re all caught up.</p>
    </div>
  );
}

export function BillingEmptyState() {
  return (
    <div className="py-8 text-center">
      <p className="text-[14px] text-slate-400">No billing history yet.</p>
      <p className="text-[12px] text-slate-300 mt-1">Invoices will appear here after your first payment.</p>
    </div>
  );
}

export function DashboardEmptyState() {
  return (
    <EmptyState
      icon={Sparkles}
      title="Create your first contract in seconds"
      description="Get started by using a template or generating a contract with AI. Your dashboard will come alive as you create and manage agreements."
      actions={[
        { label: 'Create Contract', route: '/ai-generator', primary: true, icon: Sparkles },
        { label: 'Use Template', route: '/templates', icon: FileText },
      ]}
    />
  );
}
