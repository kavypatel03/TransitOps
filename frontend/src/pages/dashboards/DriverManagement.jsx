import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Users, 
  UserCheck, 
  AlertOctagon, 
  ShieldAlert,
  Search,
  Filter,
  Download,
  Plus,
  MoreHorizontal,
  Clock,
  X,
  Edit2,
  Trash2,
  PhoneCall
} from 'lucide-react';
import toast from 'react-hot-toast';
import * as XLSX from 'xlsx';

import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';

const DriverManagement = () => {
  const { user } = useAuth();
  const isSafetyOfficer = (user?.role || '').toLowerCase().replace(/\s+/g, '_') === 'safety_officer';
  const [trips, setTrips] = useState([]);
  const [safetyDriverDetailsModal, setSafetyDriverDetailsModal] = useState(null);

  const [drivers, setDrivers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ name: '', id: '', phone: '', class: 'Class A' });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', name: '', licenseNumber: '', phone: '', class: 'Class A', status: 'Available' });

  const fetchDrivers = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('/api/drivers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setDrivers(data);
      }

      const tripsRes = await fetch('/api/trips', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const tripsData = await tripsRes.json();
      if (tripsRes.ok) {
        setTrips(tripsData);
      }
    } catch (err) {
      console.error('Failed to fetch drivers', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
  }, []);

  const openEditModal = (driver) => {
    setEditFormData({
      id: driver._id,
      name: driver.name || '',
      licenseNumber: driver.licenseNumber || '',
      phone: driver.contactNumber || '',
      class: driver.licenseCategory || 'Class A',
      status: driver.status || 'Available'
    });
    setIsEditModalOpen(true);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const updatedDriver = {
        name: editFormData.name,
        licenseNumber: editFormData.licenseNumber,
        contactNumber: editFormData.phone,
        licenseCategory: editFormData.class,
        status: editFormData.status
      };

      const res = await fetch(`/api/drivers/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedDriver)
      });

      if (res.ok) {
        toast.success('Driver updated successfully');
        setIsEditModalOpen(false);
        fetchDrivers();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update driver');
      }
    } catch (err) {
      toast.error('An error occurred while updating driver');
    }
  };

  const handleDelete = async (driver) => {
    if (driver.status === 'On Trip') {
      toast.error('Cannot delete driver while they are On Trip');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this driver?')) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`/api/drivers/${driver._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Driver deleted successfully');
        fetchDrivers();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to delete driver');
      }
    } catch (err) {
      toast.error('An error occurred while deleting driver');
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'text-emerald-600 bg-emerald-50 border border-emerald-100';
      case 'On Trip': return 'text-blue-600 bg-blue-50 border border-blue-100';
      case 'Suspended': return 'text-red-600 bg-red-50 border border-red-100';
      default: return 'text-slate-600 bg-slate-50 border border-slate-200';
    }
  };

  const exportToExcel = () => {
    const exportData = drivers.map(d => ({
      "Name": d.name || 'Unknown Driver',
      "License ID": d.licenseNumber,
      "Contact": d.contactNumber,
      "License Class": d.licenseCategory,
      "Expiry Date": new Date(d.licenseExpiryDate).toLocaleDateString(),
      "Safety Score": d.safetyScore,
      "Status": d.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Drivers");
    XLSX.writeFile(workbook, "Driver_Management.xlsx");
    toast.success("Excel exported successfully");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const newDriver = {
      _id: Date.now().toString(),
      name: formData.name,
      licenseNumber: formData.id,
      contactNumber: formData.phone,
      licenseCategory: formData.class,
      licenseExpiryDate: new Date().toISOString(),
      safetyScore: 100,
      status: 'Available'
    };
    setDrivers([newDriver, ...drivers]);
    setIsModalOpen(false);
    setFormData({ name: '', id: '', phone: '', class: 'Class A' });
    toast.success('Driver registered successfully (Mock)');
  };
  return (
    <DashboardLayout title="Driver Management">
      


      {/* Main Content Area */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 mb-8">
        
        {/* Header & Tools */}
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="h-4 w-4" />
              </div>
              <input type="text" placeholder="Search by name, license, or phone..." className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" />
            </div>
            <button className="flex items-center justify-center px-4 py-2 text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50">
              <Filter className="w-4 h-4" />
            </button>
          </div>
          
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 w-full md:w-auto justify-end">
            <span className="text-sm text-slate-500">Showing {drivers.length} active driver(s)</span>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <button onClick={exportToExcel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
                <Download className="w-4 h-4" /> Export Excel
              </button>
              {!isSafetyOfficer && (
                <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
                  <Plus className="w-4 h-4" /> Register Driver
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[800px]">
            <thead>
              <tr className="border-b border-slate-100 text-slate-500 text-sm font-medium">
                <th className="p-4 pl-6">Driver Details</th>
                <th className="p-4">License Category</th>
                <th className="p-4">Expiry Status</th>
                <th className="p-4">Safety Score</th>
                <th className="p-4">Operational Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              {loading ? (
                <tr><td colSpan="6" className="p-4 text-center text-slate-500">Loading drivers...</td></tr>
              ) : drivers.map((d, i) => (
                <tr key={d._id} className="border-b border-slate-50 hover:bg-slate-50/50">
                  <td className="p-4 pl-6">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold">{d.name ? d.name.charAt(0) : '?'}</div>
                      <div>
                        <p className="font-semibold text-slate-900">{d.name || 'Unknown Driver'}</p>
                        <p className="text-xs text-slate-500 flex items-center gap-2">
                          <span>{d.licenseNumber}</span> • <span>{d.contactNumber}</span>
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4 text-slate-600 font-medium">{d.licenseCategory}</td>
                  <td className="p-4">
                    <div className="flex items-center gap-2 text-slate-500">
                      <span className="font-medium text-xs">{new Date(d.licenseExpiryDate).toLocaleDateString()}</span>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <span className={`font-bold ${d.safetyScore >= 90 ? 'text-emerald-600' : d.safetyScore >= 80 ? 'text-emerald-500' : 'text-red-500'}`}>{d.safetyScore}</span>
                      <div className="w-24 h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${d.safetyScore >= 90 ? 'bg-emerald-500' : d.safetyScore >= 80 ? 'bg-emerald-400' : 'bg-red-500'}`} style={{ width: `${d.safetyScore}%` }}></div>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(d.status)}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {d.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      {isSafetyOfficer ? (
                        <button onClick={() => setSafetyDriverDetailsModal(d)} className="px-3 py-1.5 bg-slate-900 text-white rounded-lg text-xs font-bold hover:bg-slate-800 shadow-sm">
                           View Details
                        </button>
                      ) : (
                        <>
                          <button onClick={() => openEditModal(d)} className="p-1 hover:text-blue-600 transition-colors">
                            <Edit2 className="w-5 h-5" />
                          </button>
                          <button 
                            onClick={() => handleDelete(d)} 
                            className={`p-1 transition-colors ${d.status === 'On Trip' ? 'opacity-30 cursor-not-allowed' : 'hover:text-red-600 cursor-pointer'}`}
                            title={d.status === 'On Trip' ? "Cannot delete while on trip" : "Delete Driver"}
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>



      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Register New Driver</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">License ID</label>
                  <input type="text" required value={formData.id} onChange={e => setFormData({...formData, id: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="TX-1234567" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input type="text" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="(555) 000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">License Class</label>
                  <select value={formData.class} onChange={e => setFormData({...formData, class: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option value="Class A">Class A</option>
                    <option value="Class B">Class B</option>
                    <option value="Class C">Class C</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800">Register</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Edit Driver</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Full Name</label>
                  <input type="text" required value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="John Doe" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">License ID</label>
                  <input type="text" required value={editFormData.licenseNumber} onChange={e => setEditFormData({...editFormData, licenseNumber: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="TX-1234567" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Phone Number</label>
                  <input type="text" required value={editFormData.phone} onChange={e => setEditFormData({...editFormData, phone: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="(555) 000-0000" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">License Class</label>
                  <select value={editFormData.class} onChange={e => setEditFormData({...editFormData, class: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option value="Class A">Class A</option>
                    <option value="Class B">Class B</option>
                    <option value="Class C">Class C</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Suspended">Suspended</option>
                  </select>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800">Update Driver</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Safety Officer Detailed Modal */}
      {safetyDriverDetailsModal && isSafetyOfficer && (() => {
        const d = safetyDriverDetailsModal;
        const activeTrip = trips.find(t => t.driver?._id === d._id && t.status !== 'Completed' && t.status !== 'Cancelled');
        const v = activeTrip?.vehicle;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className="bg-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-xl">
              <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><ShieldAlert className="w-5 h-5 text-red-500" /> Emergency Monitoring View</h2>
                <button onClick={() => setSafetyDriverDetailsModal(null)} className="text-slate-400 hover:text-slate-600 bg-white p-2 rounded-full border border-slate-200 shadow-sm">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Driver Information</h3>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase">Name</p>
                      <p className="font-semibold text-slate-800 text-lg">{d.name}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase">Contact</p>
                      <p className="font-semibold text-slate-800 text-lg">{d.contactNumber}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-xs text-slate-400 font-bold uppercase">Status</p>
                      <p className={`font-semibold text-lg ${d.status === 'On Trip' ? 'text-blue-600' : 'text-slate-600'}`}>{d.status}</p>
                    </div>
                 </div>
                 
                 <div className="space-y-4">
                    <h3 className="font-bold text-slate-900 border-b border-slate-100 pb-2">Active Vehicle</h3>
                    {v ? (
                      <>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-400 font-bold uppercase">Model</p>
                          <p className="font-semibold text-slate-800 text-lg">{v.modelName}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-400 font-bold uppercase">Registration</p>
                          <p className="font-semibold text-slate-800 text-lg">{v.registrationNumber}</p>
                        </div>
                        <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                          <p className="text-xs text-slate-400 font-bold uppercase">Location / Route</p>
                          <p className="font-semibold text-slate-800 text-lg">{activeTrip.source} &rarr; {activeTrip.destination}</p>
                        </div>
                      </>
                    ) : (
                      <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 h-full flex items-center justify-center text-center">
                        <p className="text-slate-500 font-medium">Driver is not currently assigned to any active trip.</p>
                      </div>
                    )}
                 </div>
              </div>
              <div className="p-6 bg-red-50 border-t border-red-100">
                <a href={`tel:112`} className="w-full py-4 bg-red-600 text-white font-bold rounded-xl text-center shadow-lg shadow-red-600/20 hover:bg-red-700 transition-colors flex items-center justify-center gap-2">
                   <PhoneCall className="w-5 h-5" /> Auto-Call Emergency Service
                </a>
              </div>
            </div>
          </div>
        );
      })()}

    </DashboardLayout>
  );
};

export default DriverManagement;
