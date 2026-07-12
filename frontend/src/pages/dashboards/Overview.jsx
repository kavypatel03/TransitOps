import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Truck, 
  Users, 
  Clock, 
  Activity,
  AlertTriangle,
  Plus,
  Map,
  Wrench,
  DollarSign
} from 'lucide-react';
import { useState, useEffect } from 'react';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';

const utilizationData = [
  { day: 'Mon', value: 110 },
  { day: 'Tue', value: 120 },
  { day: 'Wed', value: 130 },
  { day: 'Thu', value: 140 },
  { day: 'Fri', value: 150 },
  { day: 'Sat', value: 90 },
  { day: 'Sun', value: 80 },
];

const fuelData = [
  { month: 'Jan', cost: 4200 },
  { month: 'Feb', cost: 3800 },
  { month: 'Mar', cost: 4500 },
  { month: 'Apr', cost: 5100 },
  { month: 'May', cost: 4800 },
  { month: 'Jun', cost: 5300 },
];



const Overview = () => {
  const [data, setData] = useState({ vehicles: [], drivers: [], trips: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [vehRes, drvRes, trpRes] = await Promise.all([
          fetch('http://localhost:5000/api/vehicles', { headers }),
          fetch('http://localhost:5000/api/drivers', { headers }),
          fetch('http://localhost:5000/api/trips', { headers })
        ]);
        
        if (vehRes.ok && drvRes.ok && trpRes.ok) {
          setData({
            vehicles: await vehRes.json(),
            drivers: await drvRes.json(),
            trips: await trpRes.json()
          });
        }
      } catch (err) {
        console.error('Failed to fetch overview data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress': return 'bg-slate-900 text-white';
      case 'Completed': return 'bg-emerald-500 text-white';
      case 'Cancelled': return 'bg-red-500 text-white';
      case 'Scheduled': default: return 'bg-slate-100 text-slate-700';
    }
  };

  return (
    <DashboardLayout title="Operational Overview">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Truck className="w-5 h-5 text-slate-700" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              ↗ +12%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Active Vehicles</p>
          <h3 className="text-3xl font-bold text-slate-900">{data.vehicles.filter(v => v.status === 'On Trip').length || 0}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Users className="w-5 h-5 text-blue-600" />
            </div>
            <span className="flex items-center text-xs font-medium text-red-600 bg-red-50 px-2 py-1 rounded-md">
              ↘ -2%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Available Drivers</p>
          <h3 className="text-3xl font-bold text-slate-900">{data.drivers.filter(d => d.status === 'Available').length || 0}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Clock className="w-5 h-5 text-orange-500" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              ↗ +5%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Pending Trips</p>
          <h3 className="text-3xl font-bold text-slate-900">{data.trips.filter(t => t.status === 'Scheduled').length || 0}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Activity className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="flex items-center text-xs font-medium text-emerald-600 bg-emerald-50 px-2 py-1 rounded-md">
              ↗ +3.1%
            </span>
          </div>
          <p className="text-slate-500 text-sm font-medium mb-1">Fleet Utilization</p>
          <h3 className="text-3xl font-bold text-slate-900">89.4%</h3>
        </div>

      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        
        {/* Utilization Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 lg:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Fleet Utilization Trend</h3>
              <p className="text-sm text-slate-500">Daily active vs total vehicles (Last 7 Days)</p>
            </div>
            <span className="text-xs font-medium bg-slate-100 text-slate-600 px-3 py-1 rounded-full">Avg. 84.2%</span>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={utilizationData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#0f172a" 
                  strokeWidth={3} 
                  dot={false}
                  activeDot={{ r: 6, fill: '#0f172a', stroke: '#fff', strokeWidth: 2 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Fuel Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="mb-6">
            <h3 className="text-lg font-bold text-slate-900">Monthly Fuel Expenditure</h3>
            <p className="text-sm text-slate-500">Cost analysis in USD ($)</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip 
                  cursor={{fill: '#f8fafc'}}
                  contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Bar dataKey="cost" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={32} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        
        {/* Live Trip Dispatch Table */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 xl:col-span-2">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="text-lg font-bold text-slate-900">Live Trip Dispatch</h3>
              <p className="text-sm text-slate-500">Currently active and pending logistics movements</p>
            </div>
            <button className="text-sm font-medium text-slate-600 bg-slate-50 hover:bg-slate-100 px-4 py-2 rounded-lg transition-colors border border-slate-200">
              View All Trips
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-500 text-sm">
                  <th className="pb-4 font-medium">Trip ID</th>
                  <th className="pb-4 font-medium">Vehicle & Driver</th>
                  <th className="pb-4 font-medium">Route (Src / Dest)</th>
                  <th className="pb-4 font-medium">Status</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                {loading ? (
                  <tr><td colSpan="4" className="py-4 text-center text-slate-500">Loading trips...</td></tr>
                ) : data.trips.slice(0, 5).map((trip) => (
                  <tr key={trip._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                    <td className="py-4 font-medium text-slate-900">{trip._id.slice(-6)}</td>
                    <td className="py-4">
                      <p className="font-semibold text-slate-900">{trip.vehicle?.modelName || 'N/A'}</p>
                      <p className="text-slate-500 text-xs">{trip.driver?.name || 'N/A'}</p>
                    </td>
                    <td className="py-4 text-slate-600 flex items-center gap-2">
                      <Map className="w-4 h-4 text-slate-400 shrink-0" />
                      {trip.source || 'Unknown'} → {trip.destination || 'Unknown'}
                    </td>
                    <td className="py-4">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(trip.status)}`}>
                        {trip.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Alerts & Actions */}
        <div className="flex flex-col gap-6">
          
          {/* Maintenance Alerts */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Wrench className="w-5 h-5 text-slate-400" />
                Maintenance Alerts
              </h3>
              <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">3 Critical</span>
            </div>
            
            <div className="space-y-4">
              <div className="flex gap-4 items-start p-3 rounded-xl border border-red-100 bg-red-50/30">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="flex justify-between w-full gap-2">
                    <p className="font-semibold text-slate-900 text-sm">Brake Pad Replacement</p>
                    <span className="text-[10px] font-bold text-red-600 bg-red-100 px-1.5 py-0.5 rounded shrink-0">OVERDUE</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Vehicle: Volvo FH16 (TR-442)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 rounded-xl border border-orange-100 bg-orange-50/30">
                <AlertTriangle className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" />
                <div>
                  <div className="flex justify-between w-full gap-2">
                    <p className="font-semibold text-slate-900 text-sm">Engine Oil Service</p>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">IN 3 DAYS</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Vehicle: Mack Anthem (TR-552)</p>
                </div>
              </div>

              <div className="flex gap-4 items-start p-3 rounded-xl border border-red-100 bg-red-50/30">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                <div>
                  <div className="flex justify-between w-full gap-2">
                    <p className="font-semibold text-slate-900 text-sm">Tire Rotation Needed</p>
                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-1.5 py-0.5 rounded shrink-0">TODAY</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">Vehicle: Freightliner (TR-901)</p>
                </div>
              </div>
            </div>

            <button className="w-full mt-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors">
              View Maintenance Hub
            </button>
          </div>

          {/* Quick Operations */}
          <div className="bg-[#18181B] rounded-2xl p-6 shadow-sm border border-slate-800 text-white">
            <h3 className="text-lg font-bold mb-4">Quick Operations</h3>
            <div className="space-y-3">
              <button className="w-full flex items-center gap-3 bg-[#27272A] hover:bg-[#3F3F46] p-3 rounded-xl transition-colors text-sm font-medium">
                <Plus className="w-4 h-4 text-slate-400" />
                Dispatch New Trip
              </button>
              <button className="w-full flex items-center gap-3 bg-[#27272A] hover:bg-[#3F3F46] p-3 rounded-xl transition-colors text-sm font-medium">
                <Truck className="w-4 h-4 text-slate-400" />
                Add New Vehicle
              </button>
              <button className="w-full flex items-center gap-3 bg-[#27272A] hover:bg-[#3F3F46] p-3 rounded-xl transition-colors text-sm font-medium">
                <Activity className="w-4 h-4 text-slate-400" />
                Generate Report
              </button>
              <button className="w-full flex items-center gap-3 bg-[#27272A] hover:bg-[#3F3F46] p-3 rounded-xl transition-colors text-sm font-medium">
                <DollarSign className="w-4 h-4 text-slate-400" />
                Log Fuel Expense
              </button>
            </div>
          </div>

        </div>

      </div>

    </DashboardLayout>
  );
};

export default Overview;
