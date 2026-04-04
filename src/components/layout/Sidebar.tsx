import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, FolderOpen, Sparkles, Users, BarChart3,
  Settings, CreditCard, ChevronLeft, ChevronRight, Waves
} from 'lucide-react';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Contracts', icon: FileText, path: '/contracts' },
  { label: 'Templates', icon: FolderOpen, path: '/templates' },
  { label: 'AI Generator', icon: Sparkles, path: '/ai-generator', badge: 'AI' },
  { label: 'Contacts', icon: Users, path: '/contacts' },
  { label: 'Analytics', icon: BarChart3, path: '/analytics' },
];

const bottomNavItems = [
  { label: 'Billing', icon: CreditCard, path: '/billing' },
  { label: 'Settings', icon: Settings, path: '/settings' },
];

export default function Sidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path: string) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <aside className={`flex flex-col bg-white border-r border-slate-200/80 transition-all duration-200 ease-out ${collapsed ? 'w-[68px]' : 'w-[252px]'} h-screen sticky top-0 z-40`}>
      {/* Logo */}
      <div className={`flex items-center h-[64px] px-4 border-b border-slate-100 ${collapsed ? 'justify-center' : 'gap-3'}`}>
        <div className="w-8 h-8 bg-ocean-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Waves className="w-4.5 h-4.5 text-white" />
        </div>
        {!collapsed && (
          <div className="flex flex-col min-w-0">
            <span className="text-[15px] font-semibold text-slate-900 tracking-[-0.01em]">Contract Ocean</span>
            <span className="text-[11px] text-slate-400 font-medium">Workspace</span>
          </div>
        )}
      </div>

      {/* Main nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        {navItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 cursor-pointer group relative
                ${active
                  ? 'bg-ocean-50 text-ocean-700 shadow-[inset_0_1px_2px_rgba(10,122,255,0.08)]'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }
                ${collapsed ? 'justify-center px-2' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-ocean-600' : 'text-slate-400 group-hover:text-slate-500'}`} strokeWidth={active ? 2 : 1.75} />
              {!collapsed && (
                <>
                  <span className="truncate">{item.label}</span>
                  {item.badge && (
                    <span className="ml-auto text-[10px] font-semibold bg-gradient-to-r from-ocean-500 to-violet-500 text-white px-1.5 py-0.5 rounded-md">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="px-3 pb-3 space-y-0.5 border-t border-slate-100 pt-3">
        {bottomNavItems.map((item) => {
          const active = isActive(item.path);
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium transition-all duration-150 cursor-pointer group
                ${active
                  ? 'bg-ocean-50 text-ocean-700'
                  : 'text-slate-500 hover:bg-slate-50 hover:text-slate-700'
                }
                ${collapsed ? 'justify-center px-2' : ''}
              `}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className={`w-[18px] h-[18px] flex-shrink-0 ${active ? 'text-ocean-600' : 'text-slate-400 group-hover:text-slate-500'}`} strokeWidth={1.75} />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </button>
          );
        })}

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-[13.5px] font-medium text-slate-400 hover:bg-slate-50 hover:text-slate-500 transition-all duration-150 cursor-pointer mt-1"
        >
          {collapsed ? <ChevronRight className="w-[18px] h-[18px]" /> : <ChevronLeft className="w-[18px] h-[18px]" />}
          {!collapsed && <span>Collapse</span>}
        </button>
      </div>
    </aside>
  );
}
