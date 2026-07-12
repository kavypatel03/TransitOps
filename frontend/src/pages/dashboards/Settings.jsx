

import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  User, 
  Building, 
  Bell, 
  Lock, 
  Globe, 
  Database,
  Smartphone,
  CreditCard,
  LogOut
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <DashboardLayout title="System Settings">
      
      <div className="w-full flex flex-col md:flex-row gap-8">
        
        {/* Settings Navigation Sidebar */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-2 space-y-1">
            <div className="px-4 py-2 mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Personal</h3>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 bg-slate-50 text-slate-900 font-semibold rounded-xl text-sm transition-colors">
              <User className="w-4 h-4" /> Profile & Account
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl text-sm transition-colors">
              <Bell className="w-4 h-4" /> Notifications
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl text-sm transition-colors">
              <Lock className="w-4 h-4" /> Security & Privacy
            </button>

            <div className="px-4 py-2 mt-4 mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Workspace</h3>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl text-sm transition-colors">
              <Building className="w-4 h-4" /> Enterprise Details
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl text-sm transition-colors">
              <CreditCard className="w-4 h-4" /> Billing & Plans
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl text-sm transition-colors">
              <Database className="w-4 h-4" /> Data Integrations
            </button>
            
            <div className="px-4 py-2 mt-4 mb-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Preferences</h3>
            </div>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl text-sm transition-colors">
              <Globe className="w-4 h-4" /> Language & Region
            </button>
            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium rounded-xl text-sm transition-colors">
              <Smartphone className="w-4 h-4" /> Device Management
            </button>

            <div className="my-2 border-t border-slate-100"></div>
            
            <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-2.5 text-red-600 hover:bg-red-50 font-bold rounded-xl text-sm transition-colors">
              <LogOut className="w-4 h-4" /> Sign Out
            </button>
          </div>
        </div>

        {/* Settings Content Area */}
        <div className="flex-1 space-y-6">
          
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Profile Information</h2>
            
            <div className="flex items-center gap-6 mb-8">
              <div className="w-24 h-24 rounded-full bg-slate-900 text-white flex items-center justify-center text-3xl font-bold">
                {user?.name?.charAt(0) || 'A'}
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-900">{user?.name || 'Administrator'}</h3>
                <p className="text-sm text-slate-500 mb-3">{user?.role?.replace('_', ' ').toUpperCase() || 'SYSTEM ADMIN'}</p>
                <div className="flex gap-2">
                  <button className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 text-sm font-semibold rounded-lg transition-colors">Change Avatar</button>
                  <button className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-600 text-sm font-semibold rounded-lg transition-colors">Remove</button>
                </div>
              </div>
            </div>

            <form className="space-y-6 max-w-2xl">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input type="text" defaultValue={user?.name || 'Administrator'} className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Email Address</label>
                  <input type="email" defaultValue={user?.email || 'admin@transitops.io'} className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-900" readOnly />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Job Title</label>
                <input type="text" defaultValue="Head of Logistics Operations" className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Bio</label>
                <textarea rows="4" defaultValue="Overseeing daily fleet dispatch, driver compliance, and route optimization across the west coast region." className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"></textarea>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t border-slate-100">
                <button type="button" className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-sm font-bold rounded-xl transition-colors">Cancel</button>
                <button type="button" className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white text-sm font-bold rounded-xl transition-colors shadow-lg shadow-slate-900/20">Save Changes</button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h2 className="text-xl font-bold text-slate-900 mb-6 pb-4 border-b border-slate-100">Regional Preferences</h2>
            
            <div className="max-w-2xl space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Time Zone</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option>Pacific Time (PT) - Los Angeles</option>
                    <option>Eastern Time (ET) - New York</option>
                    <option>Central Time (CT) - Chicago</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Date Format</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option>MM/DD/YYYY</option>
                    <option>DD/MM/YYYY</option>
                    <option>YYYY-MM-DD</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Distance Unit</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option>Kilometers (km)</option>
                    <option>Miles (mi)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700">Currency</label>
                  <select className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option>USD ($)</option>
                    <option>EUR (€)</option>
                    <option>GBP (£)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      
    </DashboardLayout>
  );
};

export default Settings;
