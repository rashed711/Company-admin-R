
import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSettings } from '../../contexts/AppSettingsContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { config } = useAppSettings();
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-[rgb(var(--color-background))]" dir={config.dir}>
      <div className="no-print">
        <Sidebar isSidebarOpen={isSidebarOpen} setSidebarOpen={setSidebarOpen} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="no-print">
          <Header setSidebarOpen={setSidebarOpen} />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-[rgb(var(--color-background))] p-6 sm:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;