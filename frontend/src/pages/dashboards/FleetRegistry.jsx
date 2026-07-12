import React from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  Truck, 
  Box, 
  Navigation,
  IndianRupee,
  Download,
  Plus,
  Filter,
  Eye,
  Edit2,
  Trash2,
  MoreHorizontal,
  Search,
  X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { useState, useEffect, useMemo } from 'react';
import * as XLSX from 'xlsx';

const FleetRegistry = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ reg: '', name: '', model: '', type: 'Semi-Trailer', capacity: '', cost: '' });
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editFormData, setEditFormData] = useState({ id: '', reg: '', name: '', model: '', type: 'Semi-Trailer', capacity: '', cost: '', status: '' });
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/vehicles', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      if (res.ok) {
        setVehicles(data);
      }
    } catch (err) {
      console.error('Failed to fetch vehicles', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Available': return 'bg-emerald-50 text-emerald-600';
      case 'On Trip': return 'bg-blue-50 text-blue-600';
      case 'In Shop': return 'bg-orange-50 text-orange-600';
      default: return 'bg-slate-100 text-slate-500';
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const newVehicle = {
        registrationNumber: formData.reg,
        modelName: `${formData.name} ${formData.model}`,
        type: formData.type,
        maxLoadCapacity: parseFloat(formData.capacity.replace(/,/g, '')) || 0,
        odometer: 0,
        acquisitionCost: parseFloat(formData.cost.replace(/,/g, '').replace('₹', '')) || 0,
        status: 'Available'
      };

      const res = await fetch('http://localhost:5000/api/vehicles', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(newVehicle)
      });

      if (res.ok) {
        toast.success('Vehicle added successfully');
        setIsModalOpen(false);
        setFormData({ reg: '', name: '', model: '', type: 'Semi-Trailer', capacity: '', cost: '' });
        fetchVehicles(); // Reload
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to add vehicle');
      }
    } catch (err) {
      toast.error('An error occurred while adding vehicle');
    }
  };

  const handleDelete = async (vehicle) => {
    if (vehicle.status === 'On Trip') {
      toast.error('Cannot delete vehicle while it is On Trip');
      return;
    }
    if (!window.confirm('Are you sure you want to delete this vehicle?')) return;
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/vehicles/${vehicle._id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        toast.success('Vehicle deleted successfully');
        fetchVehicles();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to delete vehicle');
      }
    } catch (err) {
      toast.error('An error occurred while deleting vehicle');
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const updatedVehicle = {
        registrationNumber: editFormData.reg,
        modelName: `${editFormData.name} ${editFormData.model}`.trim(),
        type: editFormData.type,
        maxLoadCapacity: parseFloat(editFormData.capacity.toString().replace(/,/g, '')) || 0,
        acquisitionCost: parseFloat(editFormData.cost.toString().replace(/,/g, '').replace('₹', '')) || 0,
        status: editFormData.status
      };

      const res = await fetch(`http://localhost:5000/api/vehicles/${editFormData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(updatedVehicle)
      });

      if (res.ok) {
        toast.success('Vehicle updated successfully');
        setIsEditModalOpen(false);
        fetchVehicles();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to update vehicle');
      }
    } catch (err) {
      toast.error('An error occurred while updating vehicle');
    }
  };

  const openEditModal = (vehicle) => {
    const parts = vehicle.modelName.split(' ');
    const name = parts[0] || '';
    const model = parts.slice(1).join(' ') || '';
    setEditFormData({
      id: vehicle._id,
      reg: vehicle.registrationNumber,
      name,
      model,
      type: vehicle.type,
      capacity: vehicle.maxLoadCapacity,
      cost: vehicle.acquisitionCost,
      status: vehicle.status
    });
    setIsEditModalOpen(true);
  };

  const filteredVehicles = useMemo(() => {
    return vehicles.filter(v => 
      (v.registrationNumber?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (v.modelName?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  }, [vehicles, searchQuery]);

  const totalPages = Math.ceil(filteredVehicles.length / itemsPerPage);
  
  const currentVehicles = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredVehicles.slice(start, start + itemsPerPage);
  }, [filteredVehicles, currentPage]);

  const exportToExcel = () => {
    const exportData = filteredVehicles.map(v => ({
      "Reg. Number": v.registrationNumber,
      "Vehicle Name": v.modelName,
      "Type": v.type,
      "Capacity (kg)": v.maxLoadCapacity,
      "Odometer (km)": v.odometer,
      "Acq. Cost (₹)": v.acquisitionCost,
      "Status": v.status
    }));

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Vehicles");
    XLSX.writeFile(workbook, "Fleet_Registry.xlsx");
    toast.success("Excel exported successfully");
  };

  const totalFleet = vehicles.length;
  const operationalFleet = vehicles.filter(v => v.status === 'Available' || v.status === 'On Trip').length;
  const activeTrips = vehicles.filter(v => v.status === 'On Trip').length;
  const monthlyCapex = vehicles.reduce((sum, v) => sum + (v.acquisitionCost || 0), 0);
  const formattedCapex = monthlyCapex >= 1000000 
    ? `₹${(monthlyCapex / 1000000).toFixed(1)}M` 
    : `₹${monthlyCapex.toLocaleString()}`;
  return (
    <DashboardLayout title="Vehicle Registry">
      
      {/* Top Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">TOTAL FLEET</p>
            <h3 className="text-3xl font-bold text-slate-900">{totalFleet}</h3>
          </div>
          <div className="p-3 bg-slate-900 rounded-2xl">
            <Truck className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">OPERATIONAL</p>
            <h3 className="text-3xl font-bold text-slate-900">{operationalFleet}</h3>
          </div>
          <div className="p-3 bg-emerald-500 rounded-2xl">
            <Box className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">ACTIVE TRIPS</p>
            <h3 className="text-3xl font-bold text-slate-900">{activeTrips}</h3>
          </div>
          <div className="p-3 bg-blue-500 rounded-2xl">
            <Navigation className="w-6 h-6 text-white" />
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center justify-between h-[140px]">
          <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">TOTAL CAPEX</p>
            <h3 className="text-3xl font-bold text-slate-900">{formattedCapex}</h3>
          </div>
          <div className="p-3 bg-orange-500 rounded-2xl">
            <IndianRupee className="w-6 h-6 text-white" />
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
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1); // Reset page on search
              }}
              placeholder="Search by registration, model..."
              className="pl-10 pr-4 py-2 w-full bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900"
            />
          </div>
          
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Filter className="w-4 h-4" />
              Filters
            </button>
            <button onClick={exportToExcel} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors">
              <Download className="w-4 h-4" />
              Export Excel
            </button>
            <button onClick={() => setIsModalOpen(true)} className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-900 rounded-xl hover:bg-slate-800 transition-colors">
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
              {loading ? (
                <tr><td colSpan="9" className="p-4 text-center text-slate-500">Loading vehicles...</td></tr>
              ) : currentVehicles.map((v) => (
                <tr key={v._id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                  <td className="p-4 pl-6 font-semibold text-slate-900">{v.registrationNumber}</td>
                  <td className="p-4 text-slate-600">{v.modelName}</td>
                  <td className="p-4 text-slate-500">{v.modelName}</td>
                  <td className="p-4 text-slate-500">{v.type}</td>
                  <td className="p-4 text-slate-600">{v.maxLoadCapacity?.toLocaleString()} kg</td>
                  <td className="p-4 text-slate-500">{v.odometer?.toLocaleString()} km</td>
                  <td className="p-4 text-slate-900 font-medium">₹{v.acquisitionCost?.toLocaleString()}</td>
                  <td className="p-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(v.status)}`}>
                      {v.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6 text-right">
                    <div className="flex items-center justify-end gap-2 text-slate-400">
                      <button onClick={() => openEditModal(v)} className="p-1 hover:text-blue-600 transition-colors"><Edit2 className="w-4 h-4" /></button>
                      <button 
                        onClick={() => handleDelete(v)} 
                        className={`p-1 transition-colors ${v.status === 'On Trip' ? 'opacity-30 cursor-not-allowed' : 'hover:text-red-600 cursor-pointer'}`}
                        title={v.status === 'On Trip' ? "Cannot delete while on trip" : "Delete Vehicle"}
                      ><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm text-slate-500">
          <div>Showing {filteredVehicles.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-{Math.min(currentPage * itemsPerPage, filteredVehicles.length)} of {filteredVehicles.length} vehicles</div>
          <div className="flex items-center gap-1">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            >&lt;</button>
            
            {[...Array(totalPages)].map((_, i) => (
               <button 
                 key={i + 1}
                 onClick={() => setCurrentPage(i + 1)}
                 className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${currentPage === i + 1 ? 'bg-slate-900 text-white font-medium' : 'hover:bg-slate-100 text-slate-700'}`}
               >
                 {i + 1}
               </button>
            ))}

            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1 text-slate-400 hover:text-slate-600 transition-colors disabled:opacity-50"
            >&gt;</button>
          </div>
        </div>

      </div>



      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">
            <div className="flex justify-between items-center p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-900">Add New Vehicle</h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleRegister} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Registration Plate</label>
                  <input type="text" required value={formData.reg} onChange={e => setFormData({...formData, reg: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="ABC-1234" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Make & Name</label>
                  <input type="text" required value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Volvo FH16" />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Model / Year</label>
                  <input type="text" required value={formData.model} onChange={e => setFormData({...formData, model: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="2024 Heavy Duty" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Type</label>
                    <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                      <option value="Semi-Trailer">Semi-Trailer</option>
                      <option value="Flatbed">Flatbed</option>
                      <option value="Box Truck">Box Truck</option>
                      <option value="Refrigerated">Refrigerated</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Capacity</label>
                    <input type="text" required value={formData.capacity} onChange={e => setFormData({...formData, capacity: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="40,000 kg" />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setIsModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800">Save Vehicle</button>
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
              <h2 className="text-xl font-bold text-slate-900">Edit Vehicle</h2>
              <button onClick={() => setIsEditModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleEditSubmit} className="p-6 max-h-[80vh] overflow-y-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Registration Plate</label>
                  <input type="text" required value={editFormData.reg} onChange={e => setEditFormData({...editFormData, reg: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="TX-1234-AB" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Make / Brand</label>
                    <input type="text" required value={editFormData.name} onChange={e => setEditFormData({...editFormData, name: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="Volvo" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Model Name</label>
                    <input type="text" required value={editFormData.model} onChange={e => setEditFormData({...editFormData, model: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="FH16" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Vehicle Type</label>
                  <select value={editFormData.type} onChange={e => setEditFormData({...editFormData, type: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option value="Heavy Duty">Heavy Duty</option>
                    <option value="Semi-Trailer">Semi-Trailer</option>
                    <option value="Delivery Van">Delivery Van</option>
                    <option value="Box Truck">Box Truck</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Status</label>
                  <select value={editFormData.status} onChange={e => setEditFormData({...editFormData, status: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900">
                    <option value="Available">Available</option>
                    <option value="On Trip">On Trip</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Out of Service">Out of Service</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Max Capacity (kg)</label>
                    <input type="text" required value={editFormData.capacity} onChange={e => setEditFormData({...editFormData, capacity: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="25,000" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-1">Acquisition Cost</label>
                    <input type="text" required value={editFormData.cost} onChange={e => setEditFormData({...editFormData, cost: e.target.value})} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900" placeholder="₹145,000" />
                  </div>
                </div>
              </div>
              <div className="mt-8 flex gap-3">
                <button type="button" onClick={() => setIsEditModalOpen(false)} className="flex-1 px-4 py-2 border border-slate-200 text-slate-600 font-semibold rounded-xl hover:bg-slate-50">Cancel</button>
                <button type="submit" className="flex-1 px-4 py-2 bg-slate-900 text-white font-semibold rounded-xl hover:bg-slate-800">Update Vehicle</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </DashboardLayout>
  );
};

export default FleetRegistry;
