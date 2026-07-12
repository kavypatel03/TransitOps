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
import * as XLSX from 'xlsx';

const ExpensesFuel = () => {
  const [expenses, setExpenses] = useState([]);
  const [trips, setTrips] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ date: '', vehicle: '', station: '', volume: '', price: '' });
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [expRes, tripsRes, vehRes] = await Promise.all([
          fetch('/api/expenses', { headers }),
          fetch('/api/trips', { headers }),
          fetch('/api/vehicles', { headers })
        ]);
        
        if (expRes.ok && tripsRes.ok && vehRes.ok) {
          setExpenses(await expRes.json());
          setTrips(await tripsRes.json());
          setVehicles(await vehRes.json());
        } else if (expRes.ok) {
          setExpenses(await expRes.json());
        }
      } catch (err) {
        console.error('Failed to fetch data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalExpenses = expenses.reduce((sum, e) => sum + e.cost, 0);
  
  const monthlyFuelCost = expenses.reduce((sum, e) => {
    const d = new Date(e.date);
    const isThisMonth = d.getMonth() === new Date().getMonth() && d.getFullYear() === new Date().getFullYear();
    return (e.type === 'Fuel' && isThisMonth) ? sum + e.cost : sum;
  }, 0);
  
  const totalFuelVolume = expenses.reduce((sum, e) => (e.type === 'Fuel' ? sum + (e.liters || 0) : sum), 0);
  const totalDistance = trips.reduce((sum, t) => sum + (t.plannedDistance || 0), 0);
  
  const averageMileage = totalFuelVolume > 0 ? (totalDistance / totalFuelVolume).toFixed(1) : '0.0';
  const fuelEfficiency = averageMileage > 12 ? 'Optimal' : (averageMileage > 8 ? 'Average' : 'Poor');
  const grade = averageMileage > 12 ? 'Grade A' : (averageMileage > 8 ? 'Grade B' : 'Grade C');

  const fuelLogs = expenses.filter(e => e.type === 'Fuel');

  const totalRecords = fuelLogs.length;
  const totalPages = Math.ceil(totalRecords / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLogs = fuelLogs.slice(startIndex, startIndex + itemsPerPage);

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(p => p + 1);
  };
  
  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(p => p - 1);
  };

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

  const handleExport = () => {
    const exportData = fuelLogs.map(log => ({
      'Ref ID': log._id.slice(-6),
      'Date': new Date(log.date).toLocaleDateString(),
      'Vehicle': log.vehicle?.registrationNumber || 'Unknown',
      'Gas Station': log.station || 'Unknown',
      'Volume (L)': log.liters || 0,
      'Total Cost (₹)': log.cost
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Fuel_Expenses");
    
    XLSX.writeFile(workbook, "TransitOps_Fuel_Report.xlsx");
    toast.success('Report exported to Excel!');
  };

  return (
    <DashboardLayout title="Fuel & Expenses">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Financial Overview</h2>
          <p className="text-sm text-slate-500">Track fleet costs, fuel logs and operational efficiency.</p>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <button onClick={handleExport} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <button onClick={() => setIsModalOpen(true)} className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
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
            <span className="flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
              Current Month
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Monthly Fuel Cost</p>
          <h3 className="text-3xl font-bold text-slate-900">₹{monthlyFuelCost.toLocaleString()}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-emerald-50 rounded-xl">
              <TrendingUp className="w-5 h-5 text-emerald-500" />
            </div>
            <span className="flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
              Overall
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Average Mileage</p>
          <h3 className="text-3xl font-bold text-slate-900">{averageMileage} km/L</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-orange-50 rounded-xl">
              <Wallet className="w-5 h-5 text-orange-500" />
            </div>
            <span className="flex items-center text-xs font-bold text-slate-600 bg-slate-100 px-2 py-1 rounded">
              All Time
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Total Expenses</p>
          <h3 className="text-3xl font-bold text-slate-900">₹{totalExpenses.toLocaleString()}</h3>
        </div>

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col justify-center h-[140px]">
          <div className="flex justify-between items-start mb-2">
            <div className="p-3 bg-cyan-50 rounded-xl">
              <Leaf className="w-5 h-5 text-cyan-500" />
            </div>
            <span className="flex items-center text-xs font-bold text-cyan-700 bg-cyan-100 px-2 py-1 rounded">
              {grade}
            </span>
          </div>
          <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">Fuel Efficiency</p>
          <h3 className="text-3xl font-bold text-slate-900">{fuelEfficiency}</h3>
        </div>
      </div>

      {/* Table Section */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
        <div className="overflow-x-auto rounded-t-2xl">
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
              ) : currentLogs.map((log) => (
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
          <div>Showing {totalRecords === 0 ? 0 : startIndex + 1} to {Math.min(startIndex + itemsPerPage, totalRecords)} of {totalRecords} records</div>
          <div className="flex gap-2">
            <button onClick={handlePrev} disabled={currentPage === 1} className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 text-slate-600 disabled:opacity-50">Previous</button>
            <button onClick={handleNext} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 bg-white border border-slate-200 rounded hover:bg-slate-50 font-medium text-slate-900 disabled:opacity-50">Next</button>
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
                  <select required value={formData.vehicle} onChange={e => setFormData({...formData, vehicle: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 bg-white">
                    <option value="" disabled>Select a vehicle</option>
                    {vehicles.map(v => (
                      <option key={v._id} value={v.registrationNumber}>
                        {v.registrationNumber} - {v.modelName}
                      </option>
                    ))}
                  </select>
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
