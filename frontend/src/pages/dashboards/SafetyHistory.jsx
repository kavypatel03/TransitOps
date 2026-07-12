import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { ShieldCheck, Calendar, Clock, AlertOctagon, Map, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const SafetyHistory = () => {
  const [completedTrips, setCompletedTrips] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrips = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/trips', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          const pastTrips = data.filter(t => t.status === 'Completed' || t.status === 'Cancelled');
          setCompletedTrips(pastTrips.reverse());
        }
      } catch (err) {
        console.error(err);
        toast.error('Failed to load trips');
      } finally {
        setLoading(false);
      }
    };
    fetchTrips();
  }, []);

  return (
    <DashboardLayout title="Safety History & Recent Trips">
       <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 mb-8">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><ShieldCheck className="w-6 h-6 text-emerald-500" /> Completed Trips Overview</h2>
            <span className="px-4 py-2 bg-slate-100 text-slate-700 font-bold text-sm rounded-xl">{completedTrips.length} Recorded Trips</span>
         </div>

         {loading ? (
            <p className="text-slate-500 p-8 text-center">Loading past trips...</p>
         ) : completedTrips.length === 0 ? (
            <div className="p-12 text-center border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50">
               <AlertOctagon className="w-12 h-12 text-slate-300 mx-auto mb-4" />
               <h3 className="text-lg font-bold text-slate-700">No Recent Trips Found</h3>
               <p className="text-slate-500 mt-2">Completed trips will appear here for safety auditing.</p>
            </div>
         ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
               {completedTrips.map(trip => (
                 <div key={trip._id} className="p-6 border border-slate-200 rounded-2xl hover:border-slate-300 transition-colors shadow-sm bg-slate-50/50">
                    <div className="flex justify-between items-start mb-4 border-b border-slate-100 pb-4">
                       <div>
                          <span className={`px-2 py-1 text-[10px] font-bold rounded-full mb-2 inline-block ${trip.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                             {trip.status}
                          </span>
                          <h4 className="font-bold text-slate-900 text-lg flex items-center gap-2">
                             <Map className="w-4 h-4 text-slate-400" /> {trip.source} &rarr; {trip.destination}
                          </h4>
                       </div>
                       <div className="text-right">
                          <p className="text-xs text-slate-400 font-bold uppercase">Date Recorded</p>
                          <p className="text-sm font-semibold text-slate-700">{new Date(trip.createdAt).toLocaleDateString()}</p>
                       </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mb-4">
                       <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Driver</p>
                          <p className="font-semibold text-slate-800">{trip.driver?.name || 'Unknown'}</p>
                          <p className="text-xs text-slate-500 mt-1">{trip.driver?.contactNumber || 'No Contact'}</p>
                       </div>
                       <div className="bg-white p-3 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-400 font-bold uppercase mb-1">Vehicle</p>
                          <p className="font-semibold text-slate-800">{trip.vehicle?.modelName || 'Unknown'}</p>
                          <p className="text-xs text-slate-500 mt-1">{trip.vehicle?.registrationNumber || 'N/A'}</p>
                       </div>
                    </div>

                    <div className="bg-slate-100 p-4 rounded-xl flex items-center justify-between">
                       <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Cargo Weight</p>
                          <p className="font-bold text-slate-900">{trip.cargoWeight} kg</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Distance</p>
                          <p className="font-bold text-slate-900">{trip.plannedDistance} km</p>
                       </div>
                       <div>
                          <p className="text-xs text-slate-500 font-bold uppercase">Safety Log</p>
                          <p className="font-bold text-emerald-600 flex items-center gap-1"><CheckCircle className="w-3 h-3" /> Audited</p>
                       </div>
                    </div>
                 </div>
               ))}
            </div>
         )}
       </div>
    </DashboardLayout>
  );
};

export default SafetyHistory;
