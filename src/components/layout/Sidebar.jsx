import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import {
  LayoutDashboard, Package, ShoppingCart, PlusCircle, Settings, LogOut,
  ChevronLeft, ChevronRight, BarChart3, Boxes, TrendingDown, Bell, UserCog
} from 'lucide-react';
import { dataClient } from '@/lib/data-client';
import { cn } from '@/lib/utils';

const baseNavItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: ShoppingCart, label: 'Sales', path: '/Sales' },
  { icon: TrendingDown, label: 'Stock Movements', path: '/stock-movements' },
  { icon: Bell, label: 'Reorder Alerts', path: '/reorder-alerts' },
  { icon: PlusCircle, label: 'Add Product', path: '/addProducts' },
  { icon: Boxes, label: 'Manage Products', path: '/manage-products' },
  { icon: BarChart3, label: 'Reports', path: '/Reports' },
  { icon: Settings, label: 'Settings', path: '/Settings' },
];

export default function Sidebar({ collapsed, setCollapsed }) {
  const router = useRouter();
  const currentPath = router.asPath.split('?')[0].toLowerCase();
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    let active = true;
    dataClient.auth.me().then((user) => {
      if (active) setCurrentUser(user);
    });

    return () => {
      active = false;
    };
  }, []);

  const navItems = [
    ...baseNavItems,
    ...(currentUser?.role === 'admin' ? [{ icon: UserCog, label: 'User Management', path: '/user-management' }] : []),
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 h-screen bg-sidebar text-sidebar-foreground z-40 flex flex-col transition-all duration-300 ease-in-out border-r border-sidebar-border',
        collapsed ? 'w-[72px]' : 'w-[260px]'
      )}
    >
      <div className={cn(
        'h-16 flex items-center border-b border-sidebar-border shrink-0',
        collapsed ? 'justify-center px-0' : 'gap-3 px-5'
      )}>
        <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-sidebar-primary shrink-0">
          <img src="/gpp.png" alt="gpp logo" className="w-full h-full object-contain" />
        </div>
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-semibold text-sidebar-accent-foreground text-sm tracking-tight whitespace-nowrap">
              GPP Powers Gadgetshop
            </span>
          </div>
        )}
      </div>

      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = currentPath === item.path.toLowerCase();
          return (
            <Link
              key={item.path}
              href={item.path}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200',
                isActive
                  ? 'bg-sidebar-primary text-sidebar-primary-foreground shadow-lg shadow-sidebar-primary/20'
                  : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
              )}
            >
              <item.icon className="w-[18px] h-[18px] shrink-0" />
              {!collapsed && <span className="truncate">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-sidebar-border space-y-1">
        <button
          onClick={() => dataClient.auth.logout()}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-sidebar-foreground hover:bg-red-500/10 hover:text-red-400 transition-all duration-200"
        >
          <LogOut className="w-[18px] h-[18px] shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-all duration-200"
        >
          {collapsed ? (
            <ChevronRight className="w-[18px] h-[18px] shrink-0" />
          ) : (
            <>
              <ChevronLeft className="w-[18px] h-[18px] shrink-0" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}