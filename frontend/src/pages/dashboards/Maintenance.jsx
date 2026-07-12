import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Wrench, 
  Clock, 
  AlertTriangle, 
  ShieldCheck, 
  Search, 
  Filter, 
  Plus, 
  MoreVertical 
} from 'lucide-react';

import { useState, useEffect } from 'react';

const Maintenance = () => {
  const [vehicles, setVehicles] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [vehRes, maintRes] = await Promise.all([
          fetch('http://localhost:5000/api/vehicles', { headers }),
          fetch('http://localhost:5000/api/maintenance', { headers })
        ]);
        
        if (vehRes.ok && maintRes.ok) {
          setVehicles(await vehRes.json());
          setHistory(await maintRes.json());
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getVehicleImg = (type) => {
    if (type?.includes('Van')) return '🚐';
    return '🚛';
  };
  return (
    <DashboardLayout title="Maintenance & Repairs">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 h-[140px]">
          <div className="p-4 bg-blue-50 rounded-2xl">
            <Wrench className="w-6 h-6 text-blue-500" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Vehicles In Shop</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-slate-900">12</h3>
              <span className="text-sm font-medium text-slate-400 mb-1">+2 this week</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 h-[140px]">
          <div className="p-4 bg-slate-50 rounded-2xl">
            <Clock className="w-6 h-6 text-slate-600" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Upcoming Services</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-slate-900">08</h3>
              <span className="text-sm font-medium text-slate-400 mb-1">Next 7 days</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 h-[140px]">
          <div className="p-4 bg-red-50 rounded-2xl">
            <AlertTriangle className="w-6 h-6 text-red-500" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Overdue Maintenance</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-slate-900">03</h3>
              <span className="text-sm font-medium text-slate-400 mb-1">-1 resolved</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4 h-[140px]">
          <div className="p-4 bg-emerald-50 rounded-2xl">
            <ShieldCheck className="w-6 h-6 text-emerald-500" />
          </div>
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Fleet Health</p>
            <div className="flex items-end gap-2">
              <h3 className="text-3xl font-bold text-slate-900">94%</h3>
              <span className="text-sm font-medium text-slate-400 mb-1">Optimal</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        
        {/* Left Side: Vehicle Grid */}
        <div className="flex-1">
          {/* Header/Filters */}
          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
            <div className="flex bg-slate-100 p-1 rounded-lg">
              <button className="px-4 py-1.5 text-sm font-bold bg-white text-slate-900 rounded-md shadow-sm">All Vehicles</button>
              <button className="px-4 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900">Urgent</button>
              <button className="px-4 py-1.5 text-sm font-semibold text-slate-500 hover:text-slate-900">Scheduled</button>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Filters
              </button>
              <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800">
                <Plus className="w-4 h-4" /> Add Service Task
              </button>
            </div>
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {loading ? <p className="text-slate-500">Loading...</p> : vehicles.map((v) => (
              <div key={v._id} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow relative">
                {v.status === 'In Shop' && (
                  <div className={`absolute top-3 right-3 px-3 py-1 text-xs font-bold rounded-full shadow-sm z-10 bg-blue-500 text-white`}>
                    In Shop
                  </div>
                )}
                <div className="h-32 bg-slate-100 flex items-center justify-center text-6xl">
                  {getVehicleImg(v.type)}
                </div>
                <div className="p-5">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-900 text-lg leading-tight">{v.modelName}</h4>
                      <p className="text-xs text-slate-500 mt-1 font-medium tracking-wide">{v.registrationNumber}</p>
                    </div>
                    <button className="text-slate-400 hover:text-slate-600"><MoreVertical className="w-5 h-5" /></button>
                  </div>
                  
                  <div className="mb-4">
                    <div className="flex justify-between text-xs font-semibold mb-2">
                      <span className="text-slate-500">Odometer: <span className="text-slate-900">{v.odometer.toLocaleString()} km</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full bg-slate-900`} style={{ width: `50%` }}></div>
                    </div>
                  </div>

                  <div className="flex justify-between text-xs mb-5">
                    <div>
                      <p className="text-slate-400 uppercase font-bold tracking-wider mb-1 text-[10px]">VEHICLE TYPE</p>
                      <p className="font-semibold text-slate-700">{v.type}</p>
                    </div>
                  </div>

                  <button className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2">
                    <Wrench className="w-4 h-4" /> Schedule Repair
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Log Form & History */}
        <div className="w-full lg:w-96 flex flex-col gap-6 shrink-0">
          
          {/* Form */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-900 mb-1">Log Maintenance</h3>
            <p className="text-sm text-slate-500 mb-6">Enter details for recent repairs or services</p>
            
            <form className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SELECT VEHICLE</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Search className="h-4 w-4" />
                  </div>
                  <input type="text" placeholder="Q VIN or Plate Number" className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>

              <div className="flex gap-4">
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SERVICE TYPE</label>
                  <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900">
                    <option></option>
                  </select>
                </div>
                <div className="space-y-1.5 w-32">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">EST. COST</label>
                  <input type="text" placeholder="$ 0.00" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SERVICE CENTER</label>
                <input type="text" placeholder="Precision Fleet Garage" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
              </div>

              <div className="flex gap-4 mb-6">
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">SERVICE DATE</label>
                  <input type="text" className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div className="space-y-1.5 flex-1">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">STATUS</label>
                  <select className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900">
                    <option></option>
                  </select>
                </div>
              </div>

              <button type="button" className="w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
                Save Entry
              </button>
            </form>
          </div>

          {/* History */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex-1">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <Clock className="w-5 h-5 text-slate-400" /> Service History
              </h3>
              <button className="text-xs font-semibold text-slate-500 hover:text-slate-900">View All</button>
            </div>

            <div className="space-y-5">
              {loading ? <p className="text-xs text-slate-500">Loading history...</p> : history.map((h) => (
                <div key={h._id} className="flex gap-4">
                  <div className="mt-1">
                    <div className="w-2 h-2 rounded-full bg-slate-300"></div>
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between mb-1">
                      <p className="font-semibold text-slate-900 text-sm">{h.description}</p>
                      <span className="text-xs font-medium text-slate-400">{new Date(h.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-xs text-slate-500 mb-1">{h.vehicle?.registrationNumber || 'Unknown Vehicle'}</p>
                    <div className="flex justify-between items-end">
                      <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${h.status === 'Closed' ? 'text-emerald-500 bg-emerald-50' : 'text-orange-500 bg-orange-50'}`}>{h.status}</span>
                      <span className="text-sm font-bold text-slate-900">${h.cost.toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between items-center">
              <span className="flex items-center gap-1.5 text-xs font-medium text-slate-500">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> All systems verified
              </span>
              <button className="text-xs font-semibold text-slate-900">Generate Report</button>
            </div>
          </div>

          {/* Insight Widget */}
          <div className="bg-[#18181B] rounded-2xl p-6 shadow-sm border border-slate-800 text-white relative overflow-hidden">
            <Wrench className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-800 opacity-50 -rotate-12" />
            <div className="relative z-10">
              <p className="text-[10px] font-bold tracking-wider text-slate-400 mb-2 uppercase">INSIGHT OF THE MONTH</p>
              <p className="font-bold text-sm leading-relaxed mb-4">
                Preventive care reduced downtime by 14.2% this quarter.
              </p>
              <button className="text-xs font-bold flex items-center gap-1 px-3 py-1.5 bg-[#27272A] hover:bg-[#3F3F46] rounded-lg transition-colors">
                View Analytics <span className="text-slate-400 ml-1">&gt;</span>
              </button>
            </div>
          </div>

        </div>
      </div>

    </DashboardLayout>
  );
};

export default Maintenance;
