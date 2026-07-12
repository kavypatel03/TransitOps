import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  IndianRupee, 
  TrendingUp, 
  Wallet, 
  Leaf, 
  Download,
  Plus,
  Filter,
  X
} from 'lucide-react';
import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
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

const ExpensesFuel = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', vehicle: '', station: '', volume: '', price: '' });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const res = await fetch('http://localhost:5000/api/expenses', {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (res.ok) {
          setExpenses(data);
        }
      } catch (err) {
        console.error('Failed to fetch expenses', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExpenses();
  }, []);

  const fuelLogs = expenses.filter(e => e.type === 'Fuel');

  const handleRegister = (e) => {
    e.preventDefault();
    const volNum = parseFloat(formData.volume) || 0;
    const priceNum = parseFloat(formData.price) || 0;
    
    const newLog = {
      _id: `FL-${Math.floor(1000 + Math.random() * 9000)}`,
      date: formData.date,
      vehicle: { registrationNumber: formData.vehicle },
      station: formData.station,
      type: 'Fuel',
      liters: volNum,
      cost: volNum * priceNum
    };
    
    setExpenses([newLog, ...expenses]);
    setIsModalOpen(false);
    setFormData({ date: '', vehicle: '', station: '', volume: '', price: '' });
    toast.success('Expense added successfully');
  };

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
          <button onClick={() => setIsModalOpen(true)} className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
            <Plus className="w-4 h-4" /> Add Expense
          </button>
        </div>
      </div>

      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-blue-50 rounded-xl">
              <IndianRupee className="w-5 h-5 text-blue-500" />
            </div>
            <span className="flex items-center text-xs font-bold text-red-600 bg-red-50 px-2 py-1 rounded">
              ↘ +12.5%
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Monthly Fuel Cost</p>
          <h3 className="text-3xl font-bold text-slate-900">₹42,850</h3>
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
          <h3 className="text-3xl font-bold text-slate-900">₹68,200</h3>
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
              <YAxis yAxisId="left" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} tickFormatter={(val) => `₹${val/1000}k`} />
              <Tooltip 
                cursor={{fill: '#f8fafc'}}
                contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
              />
              <Bar yAxisId="left" dataKey="fuel" fill="#0f172a" radius={[4, 4, 0, 0]} barSize={32} name="Fuel Cost (₹)" />
              
              {/* Fake line overlay to match design */}
              <Line yAxisId="left" type="monotone" dataKey="general" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981', stroke: '#fff', strokeWidth: 2}} name="General Expenses (₹)" />
            </BarChart>
          </ResponsiveContainer>
        </div>
        
        <div className="flex justify-center items-center gap-6 mt-4 pt-4 border-t border-slate-50">
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <div className="w-3 h-3 bg-[#0f172a] rounded"></div> Fuel Cost (₹)
          </div>
          <div className="flex items-center gap-2 text-xs font-medium text-slate-600">
            <div className="w-3 h-3 rounded-full border-2 border-[#10b981] bg-white"></div> General Expenses (₹)
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
              {loading ? (
                <tr><td colSpan="7" className="p-4 text-center text-slate-500">Loading expenses...</td></tr>
              ) : fuelLogs.map((log) => (
                <tr key={log._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="p-4 pl-6 text-slate-400 font-medium text-xs">{log._id.slice(-6)}</td>
                  <td className="p-4 text-slate-600">{new Date(log.date).toLocaleDateString()}</td>
                  <td className="p-4 font-semibold text-slate-900">{log.vehicle?.registrationNumber || 'Unknown'}</td>
                  <td className="p-4 text-slate-600 flex items-center gap-2">
                    <div className="p-1.5 bg-blue-50 text-blue-500 rounded"><IndianRupee className="w-3 h-3" /></div>
                    Fuel
                  </td>
                  <td className="p-4 text-slate-600">{log.liters || 0} L</td>
                  <td className="p-4 text-slate-500">{log.liters ? `₹${(log.cost/log.liters).toFixed(2)}` : '-'}</td>
                  <td className="p-4 pr-6 font-bold text-slate-900">₹{log.cost.toLocaleString()}</td>
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

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Record Fuel Expense</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Date</label>
                  <input type="date" required value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle</label>
                  <input type="text" required value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="VOL-FH16-01" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Gas Station</label>
                  <input type="text" required value={formData.station} onChange={e => setFormData({...formData, station: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Shell Express" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Volume (L)</label>
                    <input type="number" step="0.01" required value={formData.volume} onChange={e => setFormData({...formData, volume: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="450" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Price per L (₹)</label>
                    <input type="number" step="0.01" required value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="1.42" />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800">Save Expense</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default ExpensesFuel;
