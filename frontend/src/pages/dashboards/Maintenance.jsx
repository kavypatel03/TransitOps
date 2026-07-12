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
  MoreVertical,
  X,
  Truck,
  CheckCircle,
  AlertOctagon
} from 'lucide-react';
import toast from 'react-hot-toast';

import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../../context/AuthContext';

const Maintenance = () => {
  const { user } = useAuth();
  const isDriver = (user?.role || '').toLowerCase().replace(/\s+/g, '_') === 'driver';
  const [vehicles, setVehicles] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ vehicleId: '', date: '' });
  const [activeFilter, setActiveFilter] = useState('All Vehicles');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [vehRes, maintRes, tripsRes] = await Promise.all([
          fetch('http://localhost:5000/api/vehicles', { headers }),
          fetch('http://localhost:5000/api/maintenance', { headers }),
          fetch('http://localhost:5000/api/trips', { headers })
        ]);
        
        if (vehRes.ok && maintRes.ok && tripsRes.ok) {
          let fetchedVehicles = await vehRes.json();
          let fetchedHistory = await maintRes.json();
          const fetchedTrips = await tripsRes.json();

          const normalizedRole = (user?.role || '').toLowerCase().replace(/\s+/g, '_');
          if (normalizedRole === 'driver') {
            const activeTrip = fetchedTrips.find(t => t.driver?.name === user?.name && t.status !== 'Completed' && t.status !== 'Cancelled');
            if (activeTrip && activeTrip.vehicle) {
              const assignedVehicle = fetchedVehicles.find(v => v._id === activeTrip.vehicle._id) || activeTrip.vehicle;
              fetchedVehicles = [assignedVehicle];
              fetchedHistory = fetchedHistory.filter(h => {
                const hId = typeof h.vehicle === 'object' ? h.vehicle._id : h.vehicle;
                return hId === assignedVehicle._id;
              });
            } else {
              fetchedVehicles = [];
              fetchedHistory = [];
            }
          }

          setVehicles(fetchedVehicles);
          setHistory(fetchedHistory);
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    if (user) {
      fetchData();
    }
  }, [user]);

  const getVehicleImg = (type) => {
    if (type?.includes('Van')) return '🚐';
    return '🚛';
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const selectedVehicle = vehicles.find(v => v._id === formData.vehicleId);
    if (!selectedVehicle) {
      toast.error('Please select a vehicle');
      return;
    }

    const newTask = {
      _id: Date.now().toString(),
      description: 'Scheduled Service Task',
      date: formData.date || new Date().toISOString(),
      status: 'Open',
      cost: 0,
      vehicle: selectedVehicle
    };
    
    setHistory([newTask, ...history]);
    setIsModalOpen(false);
    setFormData({ vehicleId: '', date: '' });
    toast.success('Service task added successfully (Mock)');
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => {
      if (activeFilter === 'All Vehicles') return true;
      if (activeFilter === 'Urgent') return v.status === 'Maintenance' || v.status === 'Out of Service' || v.status === 'In Shop';
      if (activeFilter === 'Scheduled') return v.status === 'Available' || v.status === 'On Trip';
      return true;
    });
  }, [vehicles, activeFilter]);

  if (isDriver) {
    if (loading) return <DashboardLayout title="Maintenance"><p className="p-8">Loading...</p></DashboardLayout>;
    
    if (vehicles.length === 0) {
      return (
        <DashboardLayout title="My Vehicle Maintenance">
          <div className="flex flex-col items-center justify-center p-12 bg-white rounded-2xl border border-slate-100 shadow-sm mt-8">
             <AlertOctagon className="w-12 h-12 text-slate-300 mb-4" />
             <h3 className="text-xl font-bold text-slate-900">No Vehicle Assigned</h3>
             <p className="text-slate-500">You currently do not have an active trip, so no vehicle is assigned to you.</p>
          </div>
        </DashboardLayout>
      );
    }

    const v = vehicles[0];

    return (
      <DashboardLayout title="My Vehicle Maintenance">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
              <div className="flex justify-between items-start mb-6 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="font-bold text-slate-900 text-xl">{v.modelName}</h4>
                  <p className="text-sm text-slate-500 mt-1 font-medium tracking-wide">{v.registrationNumber}</p>
                </div>
                <div className={`px-3 py-1 text-xs font-bold rounded-full shadow-sm ${v.status === 'Maintenance' ? 'bg-red-100 text-red-600' : 'bg-emerald-100 text-emerald-600'}`}>
                  {v.status}
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Odometer</p>
                  <p className="font-semibold text-slate-900 text-lg">{(v.odometer || 0).toLocaleString()} km</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Vehicle Type</p>
                  <p className="font-semibold text-slate-900 text-lg">{v.type}</p>
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Max Load Capacity</p>
                  <p className="font-semibold text-slate-900 text-lg">{v.maxLoadCapacity} kg</p>
                </div>
              </div>
              
              <button 
                onClick={() => {
                  setFormData({ vehicleId: v._id, date: '' });
                  setIsModalOpen(true);
                }}
                className="w-full mt-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-colors flex items-center justify-center gap-2 shadow-lg shadow-slate-900/20"
              >
                <AlertTriangle className="w-4 h-4" /> Report Issue
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
            <div className="mb-6 flex justify-between items-center border-b border-slate-100 pb-4">
              <h3 className="text-xl font-bold text-slate-900">Service History</h3>
              <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">{history.length} Tasks</span>
            </div>
            
            <div className="space-y-4">
              {history.length === 0 ? (
                <p className="text-slate-500 py-8 text-center font-medium">No service history for this vehicle.</p>
              ) : (
                history.map(task => (
                  <div key={task._id} className="flex items-start gap-4 p-4 rounded-xl border border-slate-100 bg-slate-50/50">
                    <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-100 shrink-0">
                      <Wrench className="w-5 h-5 text-slate-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h4 className="font-bold text-slate-900">{task.description}</h4>
                        <span className={`px-2 py-1 text-[10px] font-bold rounded-full ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {task.status || 'Open'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 flex items-center gap-2">
                        <Clock className="w-3 h-3" /> {new Date(task.date).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Modal for reporting issue */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
              <div className="flex justify-between items-center p-6 border-b border-slate-100">
                <h2 className="text-xl font-bold text-slate-900">Report Issue</h2>
                <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <form onSubmit={handleRegister} className="p-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Issue Date</label>
                    <input type="datetime-local" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle</label>
                    <input type="text" readOnly value={v.registrationNumber} className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-500 outline-none" />
                  </div>
                </div>
                <div className="mt-8 flex gap-3">
                  <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                  <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800">Submit Report</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout title="Maintenance & Repairs">
      


      <div className="w-full">
        {/* Header/Filters */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
          <div className="flex bg-slate-100 p-1 rounded-lg">
            {!isDriver ? (
              <>
                <button 
                  onClick={() => setActiveFilter('All Vehicles')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeFilter === 'All Vehicles' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'}`}>All Vehicles</button>
                <button 
                  onClick={() => setActiveFilter('Urgent')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeFilter === 'Urgent' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Urgent</button>
                <button 
                  onClick={() => setActiveFilter('Scheduled')}
                  className={`px-4 py-1.5 text-sm font-semibold rounded-md transition-all ${activeFilter === 'Scheduled' ? 'bg-white text-slate-900 shadow-sm font-bold' : 'text-slate-500 hover:text-slate-900'}`}>Scheduled</button>
              </>
            ) : (
              <button className="px-4 py-1.5 text-sm font-bold bg-white text-slate-900 rounded-md shadow-sm">Your Vehicle</button>
            )}
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto">

            <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800">
              <Plus className="w-4 h-4" /> Add Service Task
            </button>
          </div>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? <p className="text-slate-500">Loading...</p> : filteredVehicles.map((v) => (
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
                </div>
                
                <div className="mb-4">
                  <div className="flex justify-between text-xs font-semibold mb-2">
                    <span className="text-slate-500">Odometer: <span className="text-slate-900">{(v.odometer || 0).toLocaleString()} km</span></span>
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

                <button 
                  onClick={() => {
                    setFormData({ vehicleId: v._id, date: '' });
                    setIsModalOpen(true);
                  }}
                  className="w-full py-2 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Wrench className="w-4 h-4" /> Schedule Repair
                </button>
              </div>
            </div>
          ))}
        </div>
        
        {/* Active Maintenance Tasks List */}
        <div className="mt-12 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Active Service Tasks</h3>
            <span className="px-3 py-1 bg-blue-100 text-blue-700 font-bold text-xs rounded-full">{history.length} Tasks</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Task ID</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Date</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Vehicle</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Description</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Cost</th>
                </tr>
              </thead>
              <tbody>
                {history.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="py-8 text-center text-slate-500 font-medium">No service tasks found.</td>
                  </tr>
                ) : (
                  history.map(task => (
                    <tr key={task._id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">#{task._id?.toString().slice(-6) || 'N/A'}</td>
                      <td className="py-3 px-4 text-sm text-slate-600">{new Date(task.date).toLocaleDateString()}</td>
                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-900">{task.vehicle?.registrationNumber || 'Unknown'}</p>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-700">{task.description}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs font-bold rounded-full ${task.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                          {task.status || 'Open'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm font-bold text-slate-900 text-right">
                        ₹{task.cost?.toLocaleString() || 0}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Add Service Task</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Select Vehicle</label>
                  <select required value={formData.vehicleId} onChange={e => setFormData({...formData, vehicleId: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option value="">Select a vehicle...</option>
                    {vehicles.map(v => (
                      <option key={v._id} value={v._id}>
                        {v.registrationNumber} - {v.modelName}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Service Date</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default Maintenance;
