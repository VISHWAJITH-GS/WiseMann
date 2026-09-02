import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex min-h-screen bg-white">
      <Sidebar />
      <main className="min-w-0 flex-1 overflow-auto lg:ml-64">
        <div className="min-h-screen w-full pt-16 lg:pt-0">
          {children}
        </div>
      </main>
    </div>
  );
}
