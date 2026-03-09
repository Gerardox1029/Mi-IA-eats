import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';
import Mascot from './Mascot';

export default function Layout() {
  const location = useLocation();
  const isSplash = location.pathname === '/';

  return (
    <div className="flex-1 flex flex-col h-full w-full overflow-hidden bg-[var(--color-light-bg)]">
      {/* Main scrollable content area */}
      <main className="flex-1 overflow-y-auto hide-scrollbar flex flex-col relative w-full h-full">
        <Outlet />
      </main>

      {/* Conditionally render Floating Mascot */}
      {!isSplash && <Mascot />}

      {/* Conditionally render Bottom Navigation */}
      {!isSplash && <BottomNav />}
    </div>
  );
}
