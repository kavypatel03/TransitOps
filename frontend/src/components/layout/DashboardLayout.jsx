
import Sidebar from './Sidebar';
import Header from './Header';

const DashboardLayout = ({ children, title }) => {
  return (
    <div className="flex h-screen bg-slate-50 font-sans overflow-hidden">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={title} />
        {/* Main Content Area */}
        <main className="flex-1 overflow-y-scroll bg-slate-50 p-8">
          {children}
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
