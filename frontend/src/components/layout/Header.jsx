
import { Search, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const Header = ({ title = "Dashboard", onMenuClick, isSidebarOpen }) => {
  const { user } = useAuth();

  return (
    <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-4 md:px-8">
      <div className="flex items-center gap-4">
        {!isSidebarOpen && (
          <button 
            onClick={onMenuClick}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <Menu className="w-6 h-6" />
          </button>
        )}
        <h1 className="text-xl font-semibold text-slate-800">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
            <Search className="h-4 w-4" />
          </div>
          <input
            type="text"
            placeholder="Search fleet, trips, or drivers..."
            className="pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 w-72"
          />
        </div>



        {/* User Profile */}
        <div className="flex items-center gap-3 border-l border-slate-200 pl-6">
          <div className="text-right hidden sm:block">
            <p className="text-sm font-semibold text-slate-800">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-500 capitalize">{user?.role?.replace('_', ' ') || 'Role'}</p>
          </div>
          <div className="h-10 w-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold shrink-0">
            {user?.name?.charAt(0) || 'U'}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
