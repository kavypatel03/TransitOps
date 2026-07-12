import React from 'react';
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

const reports = [
  { name: 'Monthly Fleet Utilization', date: 'Jul 01, 2024', type: 'Performance', format: 'PDF, Excel', status: 'Available' },
  { name: 'Q2 Financial Expenditure', date: 'Jul 01, 2024', type: 'Financial', format: 'PDF, CSV', status: 'Available' },
  { name: 'Driver Safety Compliance', date: 'Jun 28, 2024', type: 'Safety', format: 'PDF', status: 'Available' },
  { name: 'Emissions & Carbon Footprint', date: 'Jun 25, 2024', type: 'Environmental', format: 'PDF, Excel', status: 'Available' },
  { name: 'Maintenance Cost Analysis', date: 'Jun 15, 2024', type: 'Financial', format: 'PDF, CSV', status: 'Available' },
  { name: 'Weekly Route Optimization', date: 'Jun 14, 2024', type: 'Operations', format: 'Excel', status: 'Available' },
];

const Reports = () => {
  return (
    <DashboardLayout title="Reports & Analytics">
      
      {/* Header Actions */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 mb-1">Report Center</h2>
          <p className="text-sm text-slate-500">Generate, view, and schedule automated enterprise reports.</p>
        </div>
        <button className="flex items-center justify-center gap-2 px-6 py-2.5 text-sm font-bold text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20">
          <FileText className="w-4 h-4" /> Generate Custom Report
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        
        {/* Left Side: Report Categories & Generation */}
        <div className="xl:col-span-2 space-y-8">
          
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
            <div className="p-6 border-b border-slate-100 flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <FileSearch className="w-5 h-5 text-slate-400" /> Recent Reports
              </h3>
              <div className="flex gap-2">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Calendar className="h-4 w-4" />
                  </div>
                  <input type="text" defaultValue="Last 30 Days" className="pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 focus:outline-none focus:border-slate-300 cursor-pointer" readOnly />
                </div>
                <button className="flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-100">
                  <Filter className="w-4 h-4" /> Filter
                </button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/50 text-slate-500 text-xs font-semibold uppercase tracking-wider border-b border-slate-100">
                    <th className="p-4 pl-6">Report Name</th>
                    <th className="p-4">Type</th>
                    <th className="p-4">Generated On</th>
                    <th className="p-4">Formats</th>
                    <th className="p-4 pr-6 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  {reports.map((report, idx) => (
                    <tr key={idx} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
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
                      <td className="p-4 text-slate-500 font-medium">{report.date}</td>
                      <td className="p-4 text-slate-400 text-xs">{report.format}</td>
                      <td className="p-4 pr-6 text-right">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-700 bg-white border border-slate-200 rounded hover:bg-slate-50 shadow-sm">
                          <Download className="w-3.5 h-3.5" /> Download
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 border-t border-slate-100 text-center">
              <button className="text-sm font-semibold text-slate-500 hover:text-slate-900">Load More Reports</button>
            </div>
          </div>

        </div>

        {/* Right Side: Automated Schedules */}
        <div className="w-full flex flex-col gap-6">
          
          <div className="bg-[#18181B] rounded-2xl p-6 shadow-sm border border-slate-800 text-white relative overflow-hidden">
            <PieChart className="absolute -bottom-6 -right-6 w-32 h-32 text-slate-800 opacity-50 -rotate-12" />
            <div className="relative z-10">
              <h3 className="text-lg font-bold mb-2">Automated Data Sync</h3>
              <p className="text-sm text-slate-400 leading-relaxed mb-6">
                Your enterprise data automatically syncs with your connected BI tools (Tableau, PowerBI) every 24 hours.
              </p>
              <div className="flex gap-2">
                <button className="flex-1 py-2.5 bg-white text-slate-900 text-sm font-bold rounded-lg hover:bg-slate-100 transition-colors text-center">
                  Sync Now
                </button>
                <button className="flex-1 py-2.5 bg-[#27272A] text-white text-sm font-bold rounded-lg hover:bg-[#3F3F46] border border-[#3F3F46] transition-colors text-center">
                  Settings
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex-1">
            <h3 className="text-lg font-bold text-slate-900 mb-6">Scheduled Reports</h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Weekly Executive Summary</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-2">Sent every Monday at 08:00 AM</p>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-300 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-400 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-500 border-2 border-white"></div>
                  </div>
                </div>
              </div>

              <div className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl bg-slate-50 hover:border-slate-300 transition-colors cursor-pointer">
                <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">Monthly Fleet OPEX</h4>
                  <p className="text-xs text-slate-500 mt-1 mb-2">Sent on the 1st of every month</p>
                  <div className="flex -space-x-2">
                    <div className="w-6 h-6 rounded-full bg-slate-800 border-2 border-white"></div>
                    <div className="w-6 h-6 rounded-full bg-slate-600 border-2 border-white flex items-center justify-center text-[8px] text-white font-bold">+2</div>
                  </div>
                </div>
              </div>

            </div>

            <button className="w-full mt-6 py-2 border-2 border-dashed border-slate-200 text-slate-500 text-sm font-bold rounded-xl hover:bg-slate-50 hover:text-slate-700 hover:border-slate-300 transition-all">
              + New Schedule
            </button>
          </div>

        </div>
      </div>
      
    </DashboardLayout>
  );
};

export default Reports;
