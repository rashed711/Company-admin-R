
import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAppSettings } from '../../contexts/AppSettingsContext';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  const { config } = useAppSettings();

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900" dir={config.dir}>
      <div className="no-print">
        <Sidebar />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="no-print">
          <Header />
        </div>
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;