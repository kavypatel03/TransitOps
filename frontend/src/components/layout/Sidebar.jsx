
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Truck, 
  Users, 
  Map, 
  Wrench, 
  DollarSign, 
  BarChart3, 
  Settings, 
  LogOut 
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import logoImg from '../../assets/logo.png';
import clsx from 'clsx';
import { twMerge } from 'tailwind-merge';

const cn = (...inputs) => twMerge(clsx(inputs));

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard, roles: ['Fleet Manager', 'Driver', 'Financial Analyst'] },
  { name: 'Fleet Registry', path: '/fleet', icon: Truck, roles: ['Fleet Manager', 'Financial Analyst'] },
  { name: 'Driver Management', path: '/drivers', icon: Users, roles: ['Fleet Manager', 'Safety Officer'] },
  { name: 'Trip Dispatcher', path: '/trips', icon: Map, roles: ['Fleet Manager', 'Driver'] },
  { name: 'Maintenance', path: '/maintenance', icon: Wrench, roles: ['Fleet Manager', 'Driver', 'Safety Officer'] },
  { name: 'Expenses & Fuel', path: '/expenses', icon: DollarSign, roles: ['Fleet Manager', 'Financial Analyst'] },
  { name: 'Reports', path: '/reports', icon: BarChart3, roles: ['Fleet Manager', 'Safety Officer', 'Financial Analyst'] },
  { name: 'Settings', path: '/settings', icon: Settings, roles: ['Fleet Manager'] },
];

const Sidebar = () => {
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
    <div className="w-64 bg-[#0F172A] min-h-screen text-slate-400 flex flex-col justify-between">
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
  );
};

export default Sidebar;
