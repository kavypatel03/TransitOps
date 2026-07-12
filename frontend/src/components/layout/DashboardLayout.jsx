import { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, title }) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} setIsOpen={setSidebarOpen} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} onMenuClick={() => setSidebarOpen(true)} />
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-scroll bg-slate-50 p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
