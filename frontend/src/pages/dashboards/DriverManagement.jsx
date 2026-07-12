import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Users, 
  UserCheck, 
  AlertOctagon, 
  ShieldAlert,
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Clock
} from 'lucide-react';

import { useState, useEffect } from 'react';

const DriverManagement = () => {
  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDrivers = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/drivers', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setDrivers(data);
        }
      } catch (err) {
        console.error('Failed to fetch drivers', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDrivers();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'text-emerald-600 bg-emerald-50 border border-emerald-100';
      case 'On Trip': return 'text-blue-600 bg-blue-50 border border-blue-100';
      case 'Suspended': return 'text-red-600 bg-red-50 border border-red-100';
      default: return 'text-slate-600 bg-slate-50 border border-slate-200';
    }
  };
  return (
    <DashboardLayout title="Driver Management">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">TOTAL DRIVERS</p>
            <h3 className="text-3xl font-bold text-slate-900">{drivers.length}</h3>
            <p className="text-xs text-slate-500 mt-1">Total fleet drivers</p>
          </div>
          <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center text-white">
            <Users className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">AVAILABLE NOW</p>
            <h3 className="text-3xl font-bold text-slate-900">{drivers.filter(d => d.status === 'Available').length}</h3>
            <p className="text-xs text-slate-500 mt-1">Ready for dispatch</p>
          </div>
          <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center text-white">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">COMPLIANCE ALERTS</p>
            <h3 className="text-3xl font-bold text-slate-900">
              {drivers.filter(d => {
                const expiry = new Date(d.licenseExpiryDate);
                const now = new Date();
                const diffTime = expiry - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                return diffDays < 30; // expires in less than 30 days
              }).length}
            </h3>
            <p className="text-xs text-slate-500 mt-1">Upcoming license expires</p>
          </div>
          <div className="w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center text-white">
            <AlertOctagon className="w-6 h-6" />
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">AVERAGE SAFETY</p>
            <h3 className="text-3xl font-bold text-slate-900">
              {drivers.length > 0 ? (drivers.reduce((acc, curr) => acc + (curr.safetyScore || 0), 0) / drivers.length).toFixed(1) : 0}%
            </h3>
            <p className="text-xs text-slate-500 mt-1">Fleet-wide performance</p>
          </div>
          <div className="w-12 h-12 bg-purple-500 rounded-full flex items-center justify-center text-white">
            <ShieldAlert className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
        
        {/* Header & Tools */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex gap-4 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input type="text" placeholder="Search by name, license, or phone..." className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <button className="flex items-center justify-center px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <span className="text-sm text-slate-500 mr-2">Showing {drivers.length} active driver(s)</span>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <Download className="w-4 h-4" /> Export CSV
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800">
              <Plus className="w-4 h-4" /> Register New Driver
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-sm font-medium">
                <th className="p-4 pl-6">Driver Details</th>
                <th className="p-4">License Category</th>
                <th className="p-4">Expiry Status</th>
                <th className="p-4">Safety Score</th>
                <th className="p-4">Operational Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center text-slate-500">Loading drivers...</td></tr>
              ) : drivers.map((d, i) => (
                <tr key={d._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">{d.name ? d.name.charAt(0) : '?'}</div>
                      <div>
                        <p className="font-semibold text-slate-900">{d.name || 'Unknown Driver'}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{d.licenseNumber}</span> • <span>{d.contactNumber}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{d.licenseCategory}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="font-medium text-xs">{new Date(d.licenseExpiryDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${d.safetyScore >= 90 ? 'text-emerald-600' : d.safetyScore >= 80 ? 'text-emerald-500' : 'text-red-500'}`}>{d.safetyScore}</span>
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${d.safetyScore >= 90 ? 'bg-emerald-500' : d.safetyScore >= 80 ? 'bg-emerald-400' : 'bg-red-500'}`} style={{ width: `${d.safetyScore}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(d.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <button className="p-2 text-slate-400 hover:text-slate-600">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Compliance Tracker */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-emerald-500" /> Compliance Tracker
          </h3>
          <p className="text-sm text-slate-500 mb-6">Upcoming safety certifications and renewals.</p>
          
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-orange-100 bg-orange-50/50 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-900 text-sm">Annual Medical Check</p>
                <p className="text-xs text-slate-500">Due in 14 days</p>
              </div>
              <span className="text-xs font-bold text-orange-600 bg-orange-100 px-2 py-1 rounded">Urgent</span>
            </div>
            <div className="p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 flex justify-between items-center">
              <div>
                <p className="font-semibold text-slate-900 text-sm">Hazardous Material Cert</p>
                <p className="text-xs text-slate-500">Completed 12/2023</p>
              </div>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-2 py-1 rounded">Valid</span>
            </div>
          </div>
          <button className="w-full mt-6 py-2 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">View Full Compliance Report</button>
        </div>

        {/* Availability Heatmap */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <h3 className="text-lg font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" /> Availability Heatmap
          </h3>
          <p className="text-sm text-slate-500 mb-6">Driver distribution for next 24 hours.</p>
          
          <div className="space-y-5">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700">Morning (06:00 - 12:00)</span>
                <span className="text-slate-500">85% Full</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-[85%] h-full bg-slate-800 rounded-full"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700">Afternoon (12:00 - 18:00)</span>
                <span className="text-emerald-600">42% Avail</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-[42%] h-full bg-emerald-500 rounded-full"></div></div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2">
                <span className="text-slate-700">Night (18:00 - 06:00)</span>
                <span className="text-slate-400">12% Standby</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden"><div className="w-[12%] h-full bg-slate-300 rounded-full"></div></div>
            </div>
          </div>
        </div>

        {/* Need Assistance? */}
        <div className="bg-[#18181B] rounded-2xl p-6 shadow-sm border border-slate-800 text-white flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold mb-3">Need Assistance?</h3>
            <p className="text-sm text-slate-400 leading-relaxed mb-4">
              Having trouble verifying a driver's background check?
            </p>
            <p className="text-sm text-slate-400 leading-relaxed">
              Our system automatically syncs with national DOT databases twice a day to ensure license validity.
            </p>
          </div>
          <button className="w-full mt-6 py-3 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors">
            Contact Support
          </button>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default DriverManagement;
