import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Truck, 
  Box, 
  Navigation,
  DollarSign,
  Download,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  Search
} from 'lucide-react';

const vehicles = [
  { reg: 'ABC-1234', name: 'Volvo FH16', model: '2023 Heavy Duty', type: 'Semi-Trailer', capacity: '40,000 kg', odo: '12,450 km', cost: '$145,000', status: 'Available', statusColor: 'bg-emerald-50 text-emerald-600' },
  { reg: 'XYZ-9876', name: 'Mercedes Actros', model: '2022 Long Haul', type: 'Flatbed', capacity: '32,000 kg', odo: '84,100 km', cost: '$128,500', status: 'On Trip', statusColor: 'bg-blue-50 text-blue-600' },
  { reg: 'LMN-5544', name: 'Scania R500', model: '2021 V8 Special', type: 'Refrigerated', capacity: '28,000 kg', odo: '156,000 km', cost: '$115,000', status: 'In Shop', statusColor: 'bg-orange-50 text-orange-600' },
  { reg: 'KRT-8822', name: 'Isuzu Forward', model: '2020 City Logistics', type: 'Box Truck', capacity: '12,000 kg', odo: '45,200 km', cost: '$65,000', status: 'Available', statusColor: 'bg-emerald-50 text-emerald-600' },
  { reg: 'DEF-4433', name: 'DAF XF', model: '2019 Euro 6', type: 'Tanker', capacity: '35,000 kg', odo: '210,500 km', cost: '$98,000', status: 'Retired', statusColor: 'bg-slate-100 text-slate-500' },
];

const FleetRegistry = () => {
  return (
    <DashboardLayout title="Vehicle Registry">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">TOTAL FLEET</p>
            <h3 className="text-3xl font-bold text-slate-900">124</h3>
          </div>
          <div className="p-3 bg-slate-900 rounded-2xl">
            <Truck className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">OPERATIONAL</p>
            <h3 className="text-3xl font-bold text-slate-900">98</h3>
          </div>
          <div className="p-3 bg-emerald-500 rounded-2xl">
            <Box className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">ACTIVE TRIPS</p>
            <h3 className="text-3xl font-bold text-slate-900">42</h3>
          </div>
          <div className="p-3 bg-blue-500 rounded-2xl">
            <Navigation className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">MONTHLY CAPEX</p>
            <h3 className="text-3xl font-bold text-slate-900">$2.4M</h3>
          </div>
          <div className="p-3 bg-orange-500 rounded-2xl">
            <DollarSign className="w-6 h-6 text-white" />
          </div>
        </div>

      </div>

      {/* Main Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
        
        {/* Table Toolbar */}
        <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="relative w-full sm:w-96">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Search className="h-4 w-4" />
            </div>
            <input
              type="text"
              placeholder="Search by registration, model, or driver..."
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
              <Plus className="w-4 h-4" />
              Add Vehicle
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider bg-slate-50/50">
                <th className="p-4 pl-6">Reg. Number</th>
                <th className="p-4">Vehicle Name</th>
                <th className="p-4">Model</th>
                <th className="p-4">Type</th>
                <th className="p-4">Capacity</th>
                <th className="p-4">Odometer</th>
                <th className="p-4">Acq. Cost</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {vehicles.map((v) => (
                <tr key={v.reg} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-slate-900">{v.reg}</td>
                  <td className="p-4 text-slate-600">{v.name}</td>
                  <td className="p-4 text-slate-500">{v.model}</td>
                  <td className="p-4 text-slate-500">{v.type}</td>
                  <td className="p-4 text-slate-600">{v.capacity}</td>
                  <td className="p-4 text-slate-500">{v.odo}</td>
                  <td className="p-4 text-slate-900 font-medium">{v.cost}</td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${v.statusColor}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button className="p-1 hover:text-slate-600 transition-colors"><Eye className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      <button className="p-1 hover:text-slate-600 transition-colors"><MoreHorizontal className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing 1-5 of 42 vehicles</div>
          <div className="flex items-center gap-1">
            <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">&lt;</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full bg-slate-900 text-white font-medium">1</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">2</button>
            <button className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-slate-100 transition-colors">3</button>
            <button className="p-1 text-slate-400 hover:text-slate-600 transition-colors">&gt;</button>
          </div>
        </div>

      </div>

      {/* Bottom Distribution & Acquisitions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Load Capacity Distribution */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <Box className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-900">Load Capacity Distribution</h3>
          </div>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600">Light Duty (0-10t)</span>
                <span className="text-slate-900">24 Units</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-300 h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>
            
            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600">Medium Duty (10-25t)</span>
                <span className="text-slate-900">32 Units</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-900 h-full rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm font-medium mb-2">
                <span className="text-slate-600">Heavy Duty (25t+)</span>
                <span className="text-slate-900">12 Units</span>
              </div>
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                <div className="bg-slate-400 h-full rounded-full" style={{ width: '20%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Acquisitions & Retirements */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
          <div className="flex items-center gap-2 mb-6">
            <DollarSign className="w-5 h-5 text-slate-400" />
            <h3 className="text-lg font-bold text-slate-900">Recent Acquisitions & Retirements</h3>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Volvo FH16 (ABC-1234)</p>
                  <p className="text-xs text-slate-500">Acquisition • Oct 24, 2023</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">$145,000</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-slate-100 bg-slate-50">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-slate-200 text-slate-500 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Freightliner M2 (DEF-4433)</p>
                  <p className="text-xs text-slate-500">Retirement • Oct 15, 2023</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">Salvage: $12,000</span>
            </div>

            <div className="flex items-center justify-between p-4 rounded-xl border border-emerald-100 bg-emerald-50/30">
              <div className="flex items-center gap-4">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold text-slate-900 text-sm">Scania G450 (GHT-9900)</p>
                  <p className="text-xs text-slate-500">Acquisition • Oct 02, 2023</p>
                </div>
              </div>
              <span className="font-bold text-slate-900">$132,000</span>
            </div>
          </div>
        </div>

      </div>

    </DashboardLayout>
  );
};

export default FleetRegistry;
