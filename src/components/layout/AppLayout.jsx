import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { cn } from '@/lib/utils';
import { dataClient } from '@/lib/data-client';

export default function AppLayout({ children }) {
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const isAuthRoute = router.pathname === '/login';

  useEffect(() => {
    if (isAuthRoute) {
      setAuthChecked(true);
      setIsAuthenticated(true);
      return;
    }

    let active = true;
    dataClient.auth.me().then((user) => {
      if (!active) return;
      setIsAuthenticated(Boolean(user));
      setAuthChecked(true);
      if (!user) {
        router.replace(`/login?next=${encodeURIComponent(router.asPath)}`);
      }
    });

    return () => {
      active = false;
    };
  }, [isAuthRoute, router.asPath, router]);

  if (isAuthRoute) return <>{children}</>;

  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-sm text-muted-foreground">
        Checking your session...
      </div>
    );
  }

  if (!isAuthenticated) return null;

  return (
    <div className="min-h-screen bg-background">
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      <div className="md:hidden">
        <MobileNav />
      </div>

      <main
        className={cn(
          'transition-all duration-300 ease-in-out min-h-screen',
          'pt-16 md:pt-0',
          collapsed ? 'md:ml-[72px]' : 'md:ml-[260px]'
        )}
      >
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}