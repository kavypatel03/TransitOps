

import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  FileText, 
  Download, 
  BarChart2, 
  PieChart, 
  TrendingUp, 
  Calendar,
  Filter,
  CheckCircle,
  FileSearch,
  Users
} from 'lucide-react';

import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

const REPORTS_LIST = [
  { id: 'financial_expenditure', name: 'Overall Financial Expenditure', type: 'Financial', desc: 'Comprehensive breakdown of all fleet expenses (Fuel, Tolls, Misc).' },
  { id: 'maintenance_audit', name: 'Maintenance Cost Audit', type: 'Financial', desc: 'Detailed log of all vehicle repairs and scheduled maintenance costs.' },
  { id: 'trip_performance', name: 'Fleet Utilization & Trips', type: 'Performance', desc: 'Summary of all dispatched and completed trips with distance and cargo data.' },
];

const Reports = () => {
  const [data, setData] = useState({ expenses: [], maintenance: [], trips: [], vehicles: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };
        
        const [expRes, maintRes, tripRes, vehRes] = await Promise.all([
          fetch('/api/expenses', { headers }),
          fetch('/api/maintenance', { headers }),
          fetch('/api/trips', { headers }),
          fetch('/api/vehicles', { headers })
        ]);

        if (expRes.ok && maintRes.ok && tripRes.ok && vehRes.ok) {
          setData({
            expenses: await expRes.json(),
            maintenance: await maintRes.json(),
            trips: await tripRes.json(),
            vehicles: await vehRes.json()
          });
        }
      } catch (err) {
        toast.error('Failed to load data for reports');
      } finally {
        setLoading(false);
      }
    };
    fetchAllData();
  }, []);

  const handleDownload = (reportId) => {
    if (loading) {
       toast.error('Data is still loading, please wait.');
       return;
    }
    
    let exportData = [];
    let filename = '';

    if (reportId === 'financial_expenditure') {
      exportData = data.expenses.map(e => ({
        'Date': new Date(e.date).toLocaleDateString(),
        'Expense Type': e.type,
        'Vehicle Reg': e.vehicle?.registrationNumber || 'Unknown',
        'Details/Station': e.station || 'N/A',
        'Cost (₹)': e.cost
      }));
      filename = 'Financial_Expenditure_Report.xlsx';
    } else if (reportId === 'maintenance_audit') {
      exportData = data.maintenance.map(m => ({
        'Date': new Date(m.date).toLocaleDateString(),
        'Vehicle Reg': m.vehicle?.registrationNumber || 'Unknown',
        'Description': m.description,
        'Status': m.status,
        'Cost (₹)': m.cost
      }));
      filename = 'Maintenance_Audit_Report.xlsx';
    } else if (reportId === 'trip_performance') {
      exportData = data.trips.map(t => ({
        'Created At': new Date(t.createdAt).toLocaleDateString(),
        'Source': t.source,
        'Destination': t.destination,
        'Vehicle': t.vehicle?.registrationNumber || 'Unknown',
        'Driver': t.driver?.name || 'Unknown',
        'Status': t.status,
        'Distance (km)': t.plannedDistance,
        'Cargo (kg)': t.cargoWeight
      }));
      filename = 'Fleet_Utilization_Report.xlsx';
    }

    if (exportData.length === 0) {
      toast.error('No data available for this report.');
      return;
    }

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report_Data");
    XLSX.writeFile(workbook, filename);
    toast.success(`Successfully exported ${filename}`);
  };

  return (
    <DashboardLayout title="Reports & Analytics">
      
      {/* Header Actions */}
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Financial Data Center</h2>
          <p className="text-sm text-slate-500">Generate real-time exports of fleet financial and operational metrics.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        
        {/* Report Categories & Generation */}
        <div className="space-y-8">
          
          {/* Quick Categories */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-blue-50 text-blue-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-500 group-hover:text-white transition-colors">
                <BarChart2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Performance</h3>
              <p className="text-xs text-slate-500">Utilization & Efficiency</p>
            </div>
            
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-emerald-500 group-hover:text-white transition-colors">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Financial</h3>
              <p className="text-xs text-slate-500">Costs & Revenue</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500 group-hover:text-white transition-colors">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Compliance</h3>
              <p className="text-xs text-slate-500">Safety & Regulations</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:border-slate-300 transition-colors cursor-pointer group">
              <div className="w-12 h-12 bg-purple-50 text-purple-500 rounded-full flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Drivers</h3>
              <p className="text-xs text-slate-500">Activity & Hours</p>
            </div>
          </div>

          {/* Generated Reports List */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-slate-400" /> Recent Reports
              </h3>
              <div className="flex gap-2 w-full md:w-auto">
                <div className="relative flex-1 md:flex-none">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input type="text" defaultValue="Last 30 Days" className="pl-9 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-slate-300 cursor-pointer" readOnly />
                </div>
                <button className="flex items-center justify-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4 pl-6">Report Category</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Description</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {REPORTS_LIST.map((report) => (
                    <tr key={report.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                      <td className="p-4 pl-6">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 text-slate-500 rounded-lg">
                            <FileText className="w-4 h-4" />
                          </div>
                          <span className="font-semibold text-slate-900">{report.name}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs font-semibold rounded-md">
                          {report.type}
                        </span>
                      </td>
                      <td className="p-4 text-slate-500 text-xs">{report.desc}</td>
                      <td className="p-4 pr-6 text-right">
                        <button 
                          onClick={() => handleDownload(report.id)}
                          disabled={loading}
                          className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-emerald-50 hover:text-emerald-700 hover:border-emerald-200 shadow-sm transition-colors disabled:opacity-50"
                        >
                          <Download className="w-4 h-4" /> Export Excel
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
      
    </DashboardLayout>
  );
};

export default Reports;
