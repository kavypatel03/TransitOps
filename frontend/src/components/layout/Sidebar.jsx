import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Map, 
  Wrench, 
  IndianRupee, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

export const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['driver', 'financial_analyst'] },
  { name: 'Fleet Registry', path: '/fleet', icon: Truck, roles: ['fleet_manager', 'financial_analyst'] },
  { name: 'Driver Management', path: '/drivers', icon: Users, roles: ['fleet_manager', 'safety_officer'] },
  { name: 'Trip Dispatcher', path: '/trips', icon: Map, roles: ['fleet_manager', 'driver'] },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ['fleet_manager', 'driver', 'safety_officer'] },
  { name: 'Expenses & Fuel', path: '/expenses', icon: IndianRupee, roles: ['fleet_manager', 'financial_analyst'] },
  { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['safety_officer', 'financial_analyst'] },
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['fleet_manager'] },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const allowedNavItems = NAV_ITEMS.filter(item => 
    !item.roles || item.roles.includes(user?.role)
  );

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden transition-opacity"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div 
        className={cn(
          "fixed lg:static inset-y-0 left-0 z-50 w-64 bg-[#0F172A] min-h-screen text-slate-400 flex flex-col justify-between transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div>
        {/* Logo Section */}
        <div className="h-16 flex items-center px-6 mt-4 mb-4">
          <div className="flex items-center gap-3 bg-white p-1.5 rounded-lg">
            <img src={logoImg} alt="TransitOps Logo" className="h-6 w-auto" />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col gap-1 px-4">
          {allowedNavItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              onClick={() => setIsOpen(false)}
              className={({ isActive }) =>
                cn(
                  "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                  isActive
                    ? "bg-[#1E293B] text-white"
                    : "hover:bg-[#1E293B]/50 hover:text-slate-200"
                )
              }
            >
              <item.icon className="w-5 h-5" />
              {item.name}
            </NavLink>
          ))}
        </nav>
      </div>

      {/* Footer / Logout */}
      <div className="p-4 border-t border-slate-800">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium hover:bg-[#1E293B] hover:text-white transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Sign Out
        </button>
      </div>
    </div>
    </>
  );
};

export default Sidebar;
