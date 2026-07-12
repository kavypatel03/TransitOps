import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  DollarSign, 
  TrendingUp, 
  Wallet, 
  Leaf, 
  Download,
  Plus,
  Filter
} from 'lucide-react';
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

const trendData = [
  { month: 'Jan', fuel: 32000, general: 15000 },
  { month: 'Feb', fuel: 34000, general: 16000 },
  { month: 'Mar', fuel: 30000, general: 14000 },
  { month: 'Apr', fuel: 38000, general: 21000 },
  { month: 'May', fuel: 41000, general: 19000 },
  { month: 'Jun', fuel: 39000, general: 22000 },
];

const fuelLogs = [
  { id: 'FL-9021', date: '2024-06-12', vehicle: 'VOL-FH16-01', station: 'Shell Express A4', volume: '450 L', price: '$1.42', total: '$639.00' },
  { id: 'FL-9022', date: '2024-06-12', vehicle: 'MB-ACT-45', station: 'BP Logistics Hub', volume: '380 L', price: '$1.39', total: '$528.20' },
  { id: 'FL-9023', date: '2024-06-11', vehicle: 'SCA-R500-12', station: 'Circle K Depot', volume: '520 L', price: '$1.45', total: '$754.00' },
  { id: 'FL-9024', date: '2024-06-11', vehicle: 'MAN-TGX-08', station: 'Shell Express A4', volume: '410 L', price: '$1.42', total: '$582.20' },
  { id: 'FL-9025', date: '2024-06-10', vehicle: 'VOL-FH16-05', station: 'Texaco Truck Stop', volume: '490 L', price: '$1.40', total: '$686.00' },
];

const ExpensesFuel = () => {
  return (
    <DashboardLayout title="Fuel & Expenses">
      
      {/* Header Actions */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Financial Overview</h2>
          <p className="text-sm text-slate-500">Track fleet costs, fuel logs and operational efficiency.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-blue-50 rounded-xl">
              <DollarSign className="w-5 h-5 text-blue-500" />
            </div>
            <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
              ↘ +12.5%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Monthly Fuel Cost</p>
          <h3 className="text-3xl font-bold text-slate-900">$42,850</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              ↗ +2.1%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Average Mileage</p>
          <h3 className="text-3xl font-bold text-slate-900">14.2 km/L</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Wallet className="w-5 h-5 text-orange-500" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              ↗ -4.3%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Expenses</p>
          <h3 className="text-3xl font-bold text-slate-900">$68,200</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-cyan-50 rounded-xl">
              <Leaf className="w-5 h-5 text-cyan-500" />
            </div>
            <span className="flex items-center text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-1 rounded">
              ↗ Grade A
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Fuel Efficiency</p>
          <h3 className="text-3xl font-bold text-slate-900">Optimal</h3>
        </div>
      </div>

      {/* Chart Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 mb-8">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Expenditure & Consumption Trends</h3>
            <p className="text-sm text-slate-500">Comparison of fuel spend vs volume over the last 6 months</p>
          </div>
          <div className="flex items-center text-xs font-semibold">
            <button className="px-3 py-1.5 text-slate-900 bg-slate-100 rounded-l-lg border-r border-slate-200">Last 6 Months</button>
            <button className="px-3 py-1.5 text-slate-500 hover:bg-slate-50 rounded-r-lg border border-transparent">Yearly</button>
          </div>
        </div>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={trendData} margin={{ top: 10, right: 0, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `$${val/1000}k`} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar yAxisId="left" dataKey="fuel" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={32} name="Fuel Cost ($)" />
              
              {/* Fake line overlay to match design */}
              <Line yAxisId="left" type="monotone" dataKey="general" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2}} name="General Expenses ($)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center items-center gap-6 mt-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <div className="w-3 h-3 bg-[#0f172a] rounded"></div> Fuel Cost ($)
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <div className="w-3 h-3 rounded-full border-2 border-[#10b981] bg-white"></div> General Expenses ($)
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
        <div className="p-4 border-b border-slate-100 flex justify-between items-center bg-slate-50/50 rounded-t-2xl">
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-white shadow-sm border border-slate-200 rounded-lg text-sm font-bold text-slate-900">Fuel Logs</button>
            <button className="px-4 py-2 text-sm font-semibold text-slate-500 hover:text-slate-900">General Expenses</button>
          </div>
          <button className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-700 bg-white px-3 py-1.5 border border-slate-200 rounded-lg">
            <Filter className="w-4 h-4" /> Filter by vehicle...
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <th className="p-4 pl-6">Ref ID</th>
                <th className="p-4">Date</th>
                <th className="p-4">Vehicle</th>
                <th className="p-4">Gas Station</th>
                <th className="p-4">Volume (L)</th>
                <th className="p-4">Price /L</th>
                <th className="p-4 pr-6">Total Cost</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {fuelLogs.map((log) => (
                <tr key={log.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="p-4 pl-6 text-slate-400 font-medium text-xs">{log.id}</td>
                  <td className="p-4 text-slate-600">{log.date}</td>
                  <td className="p-4 font-semibold text-slate-900">{log.vehicle}</td>
                  <td className="p-4 text-slate-600 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-500 rounded"><DollarSign className="w-3 h-3" /></div>
                    {log.station}
                  </td>
                  <td className="p-4 text-slate-600">{log.volume}</td>
                  <td className="p-4 text-slate-500">{log.price}</td>
                  <td className="p-4 pr-6 font-bold text-slate-900">{log.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing 5 of 142 records</div>
          <div className="flex gap-2">
            <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-400">Previous</button>
            <button className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 font-medium text-slate-900">Next</button>
          </div>
        </div>
      </div>

    </DashboardLayout>
  );
};

export default ExpensesFuel;
