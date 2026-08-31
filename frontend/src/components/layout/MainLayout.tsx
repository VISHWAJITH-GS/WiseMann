import type { ReactNode } from 'react';
import Sidebar from './Sidebar';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-white">
      <Sidebar />
      <main className="flex-1 lg:ml-64 overflow-auto">
        <div className="w-full h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
