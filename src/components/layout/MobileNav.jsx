import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Menu, X, LayoutDashboard, Package, ShoppingCart, PlusCircle, Settings, LogOut, BarChart3, Boxes } from 'lucide-react';
import { dataClient } from '@/lib/data-client';
import { cn } from '@/lib/utils';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/' },
  { icon: Package, label: 'Inventory', path: '/inventory' },
  { icon: ShoppingCart, label: 'Sales', path: '/sales' },
  { icon: PlusCircle, label: 'Add Product', path: '/add-product' },
  { icon: Boxes, label: 'Manage', path: '/manage' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

export default function MobileNav() {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const currentPath = router.asPath.split('?')[0].toLowerCase();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-50 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
            <img src="/gpp.png" alt="gpp logo" className="w-16 h-20  object-contain" />
          </div>
          <span className="font-semibold text-sm">GPP Power Gadgetshop</span>
        </div>
        <button onClick={() => setOpen(!open)} className="p-2 rounded-lg hover:bg-accent transition-colors">
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </header>

      {open && (
        <div className="fixed inset-0 z-40 pt-16 bg-background/95 backdrop-blur-sm">
          <nav className="p-4 space-y-1">
            {navItems.map((item) => {
              const isActive = currentPath === item.path.toLowerCase();
              return (
                <Link
                  key={item.path}
                  href={item.path}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all',
                    isActive ? 'bg-primary text-primary-foreground' : 'text-foreground hover:bg-accent'
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
            <button
              onClick={() => {
                setOpen(false);
                dataClient.auth.logout();
              }}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all"
            >
              <LogOut className="w-5 h-5" />
              <span>Logout</span>
            </button>
          </nav>
        </div>
      )}
    </>
  );
}