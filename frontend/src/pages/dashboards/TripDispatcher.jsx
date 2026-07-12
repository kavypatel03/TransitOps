import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  MapPin, 
  Calendar, 
  Clock, 
  Map, 
  ShieldCheck, 
  Navigation, 
  CalendarCheck,
  AlertOctagon
} from 'lucide-react';

const TripDispatcher = () => {
  return (
    <DashboardLayout title="New Trip Dispatch">
      
      <div className="w-full">
        {/* Wizard Header */}
        <div className="bg-white p-8 rounded-t-2xl border border-slate-100 border-b-0">
          <div className="flex justify-between items-start mb-10">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">Dispatcher Wizard</h2>
              <p className="text-slate-500">Configure and activate a new logistics route with automated fleet verification.</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-slate-900">Step 1 of 5</p>
              <p className="text-lg font-bold text-slate-900">Trip Information</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex justify-between relative px-4">
            <div className="absolute top-4 left-12 right-12 h-0.5 bg-slate-100 -z-10"></div>
            
            <div className="flex flex-col items-center gap-3 bg-white px-2">
              <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-sm">1</div>
              <span className="text-xs font-bold text-slate-900 tracking-wider">TRIP INFO</span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-white px-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">2</div>
              <span className="text-xs font-bold text-slate-500 tracking-wider">VEHICLE</span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-white px-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">3</div>
              <span className="text-xs font-bold text-slate-500 tracking-wider">DRIVER</span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-white px-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">4</div>
              <span className="text-xs font-bold text-slate-500 tracking-wider">CARGO</span>
            </div>
            <div className="flex flex-col items-center gap-3 bg-white px-2 opacity-50">
              <div className="w-8 h-8 rounded-full bg-slate-100 text-slate-500 flex items-center justify-center font-bold text-sm">5</div>
              <span className="text-xs font-bold text-slate-500 tracking-wider">REVIEW</span>
            </div>
          </div>
        </div>

        {/* Wizard Form Content */}
        <div className="bg-slate-50/50 p-8 border border-slate-100 rounded-b-2xl shadow-sm pb-12">
          
          <div className="bg-white p-8 rounded-2xl border border-slate-200 mb-8">
            <div className="flex justify-between items-center mb-6 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Define the Route</h3>
                <p className="text-sm text-slate-500">Enter pick-up and drop-off logistics centers.</p>
              </div>
              <span className="flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold">
                <ShieldCheck className="w-4 h-4" /> System Verified
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Source Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <input type="text" defaultValue="Los Angeles Logistics Hub" className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none" />
                </div>
                <p className="text-xs text-emerald-600 font-medium flex items-center gap-1 mt-1">
                  <ShieldCheck className="w-3 h-3" /> Address verified in system
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Destination Location</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <input type="text" defaultValue="San Francisco Port Terminal" className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Departure Date</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="h-5 w-5" />
                  </div>
                  <input type="text" defaultValue="2024-06-15" className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Departure Time</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Clock className="h-5 w-5" />
                  </div>
                  <input type="text" defaultValue="08:00" className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700">Estimated Distance (km)</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                    <Map className="h-5 w-5" />
                  </div>
                  <input type="text" defaultValue="612.4 km" className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 outline-none" readOnly />
                </div>
              </div>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3">
              <AlertOctagon className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-slate-700 text-sm">Route Efficiency Optimization</p>
                <p className="text-slate-500 text-sm mt-1">The suggested route takes I-5 N, avoiding known construction delays near Santa Barbara. Estimated fuel consumption: 142.5L.</p>
              </div>
            </div>

          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button className="px-6 py-3 text-slate-500 font-semibold text-sm hover:text-slate-900 transition-colors">
              &lt; Back
            </button>
            <button className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
              Continue &gt;
            </button>
          </div>
          
        </div>

        {/* Bottom Badges */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="bg-white border border-slate-200 border-dashed rounded-xl p-4 flex items-center gap-4">
            <div className="p-2 bg-slate-50 rounded-lg">
              <ShieldCheck className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">SAFETY CHECK</p>
              <p className="font-semibold text-slate-900 text-sm">Compliance Active</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 border-dashed rounded-xl p-4 flex items-center gap-4">
            <div className="p-2 bg-slate-50 rounded-lg">
              <Navigation className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">GPS TRACKING</p>
              <p className="font-semibold text-slate-900 text-sm">Live Link Ready</p>
            </div>
          </div>
          <div className="bg-white border border-slate-200 border-dashed rounded-xl p-4 flex items-center gap-4">
            <div className="p-2 bg-slate-50 rounded-lg">
              <CalendarCheck className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">SCHEDULER</p>
              <p className="font-semibold text-slate-900 text-sm">Auto-Sync Enabled</p>
            </div>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default TripDispatcher;
