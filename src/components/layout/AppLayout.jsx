import React, { useState } from 'react';
import Sidebar from './Sidebar';
import MobileNav from './MobileNav';
import { cn } from '@/lib/utils';

export default function AppLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      </div>

      {/* Mobile Nav */}
      <div className="md:hidden">
        <MobileNav />
      </div>

      {/* Main Content */}
      <main
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen",
          "pt-16 md:pt-0",
          collapsed ? "md:ml-[72px]" : "md:ml-[260px]"
        )}
      >
        <div className="p-4 md:p-8 max-w-[1600px] mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}