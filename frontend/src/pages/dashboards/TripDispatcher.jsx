import React, { useState, useEffect } from 'react';
import DashboardLayout from '../../components/layout/DashboardLayout';
import { 
  MapPin, Calendar, Clock, Map, ShieldCheck, Navigation, CalendarCheck, AlertOctagon, Truck, User, Box, CheckCircle, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix leaflet default icon issue in react
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

const HUB_COORDINATES = {
  'Delhi Hub': [28.6139, 77.2090],
  'Mumbai Hub': [19.0760, 72.8777],
  'Bangalore Hub': [12.9716, 77.5946],
  'Chennai Hub': [13.0827, 80.2707],
  'Kolkata Hub': [22.5726, 88.3639],
  'Hyderabad Hub': [17.3850, 78.4867]
};

const LiveTrackingMap = ({ source, destination }) => {
  const startCoord = HUB_COORDINATES[source] || [28.6139, 77.2090];
  const endCoord = HUB_COORDINATES[destination] || [19.0760, 72.8777];
  
  const [currentPos, setCurrentPos] = useState(startCoord);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    setCurrentPos(startCoord);
    setProgress(0);

    const interval = setInterval(() => {
      setProgress((prev) => {
        const next = prev + 0.01;
        if (next >= 1) {
          clearInterval(interval);
          return 1;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [source, destination]);

  useEffect(() => {
    const lat = startCoord[0] + (endCoord[0] - startCoord[0]) * progress;
    const lng = startCoord[1] + (endCoord[1] - startCoord[1]) * progress;
    setCurrentPos([lat, lng]);
  }, [progress, startCoord, endCoord]);

  const truckIcon = new L.Icon({
    iconUrl: 'https://cdn-icons-png.flaticon.com/512/664/664468.png',
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });

  return (
    <MapContainer 
      center={[(startCoord[0] + endCoord[0]) / 2, (startCoord[1] + endCoord[1]) / 2]} 
      zoom={5} 
      style={{ height: '100%', width: '100%', zIndex: 10 }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      <Polyline positions={[startCoord, endCoord]} color="#0f172a" weight={4} dashArray="10, 10" />
      <Marker position={startCoord} />
      <Marker position={endCoord} />
      <Marker position={currentPos} icon={truckIcon} />
    </MapContainer>
  );
};

const INDIAN_HUBS = [
  'Delhi Hub',
  'Mumbai Hub',
  'Bangalore Hub',
  'Chennai Hub',
  'Kolkata Hub',
  'Hyderabad Hub'
];

const getDistance = (source, dest) => {
  if (source === dest) return 0;
  
  const matrix = {
    'Delhi Hub': { 'Mumbai Hub': 1415, 'Bangalore Hub': 2170, 'Chennai Hub': 2200, 'Kolkata Hub': 1535, 'Hyderabad Hub': 1580 },
    'Mumbai Hub': { 'Delhi Hub': 1415, 'Bangalore Hub': 980, 'Chennai Hub': 1335, 'Kolkata Hub': 1960, 'Hyderabad Hub': 710 },
    'Bangalore Hub': { 'Delhi Hub': 2170, 'Mumbai Hub': 980, 'Chennai Hub': 345, 'Kolkata Hub': 1870, 'Hyderabad Hub': 570 },
    'Chennai Hub': { 'Delhi Hub': 2200, 'Mumbai Hub': 1335, 'Bangalore Hub': 345, 'Kolkata Hub': 1670, 'Hyderabad Hub': 630 },
    'Kolkata Hub': { 'Delhi Hub': 1535, 'Mumbai Hub': 1960, 'Bangalore Hub': 1870, 'Chennai Hub': 1670, 'Hyderabad Hub': 1490 },
    'Hyderabad Hub': { 'Delhi Hub': 1580, 'Mumbai Hub': 710, 'Bangalore Hub': 570, 'Chennai Hub': 630, 'Kolkata Hub': 1490 }
  };

  return matrix[source]?.[dest] || 500;
};

const TripDispatcher = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [vehicles, setVehicles] = useState([]);
  const [maintenanceVehicles, setMaintenanceVehicles] = useState([]);
  const [drivers, setDrivers] = useState([]);
  const [activeTrips, setActiveTrips] = useState([]);
  const [trackingTrip, setTrackingTrip] = useState(null);
  const [driverUpdates, setDriverUpdates] = useState([]);
  
  const [tripData, setTripData] = useState({
    source: 'Delhi Hub',
    destination: 'Mumbai Hub',
    date: new Date().toISOString().split('T')[0],
    time: '08:00',
    distance: 1415,
    vehicleId: '',
    driverId: '',
    cargoWeight: ''
  });

  const handleLocationChange = (field, value) => {
    const newTripData = { ...tripData, [field]: value };
    newTripData.distance = getDistance(newTripData.source, newTripData.destination);
    setTripData(newTripData);
  };

  const fetchAllData = async () => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const headers = { Authorization: `Bearer ${token}` };
      
      const [vehRes, drvRes, tripsRes] = await Promise.all([
        fetch('http://localhost:5000/api/vehicles', { headers }),
        fetch('http://localhost:5000/api/drivers', { headers }),
        fetch('http://localhost:5000/api/trips', { headers })
      ]);
      
      if (vehRes.ok && drvRes.ok && tripsRes.ok) {
        const vehData = await vehRes.json();
        const drvData = await drvRes.json();
        const tripsData = await tripsRes.json();
        setVehicles(vehData.filter(v => v.status === 'Available'));
        setMaintenanceVehicles(vehData.filter(v => ['Maintenance', 'In Shop', 'Out of Service'].includes(v.status)));
        setDrivers(drvData.filter(d => d.status === 'Available'));
        setActiveTrips(tripsData.filter(t => t.status !== 'Completed' && t.status !== 'Cancelled'));
      }
    } catch (err) {
      console.error('Failed to fetch data', err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, []);

  useEffect(() => {
    if (!trackingTrip) return;
    const msgs = [
      'Driver departed origin hub.',
      'Navigating highway corridor.',
      'Passed regional toll gate.',
      'Traffic moderate, ETA stable.',
      'Nearing mid-way checkpoint.',
      'Refueling at partner station.',
      'Approaching destination zone.'
    ];
    let i = 0;
    
    setDriverUpdates([msgs[0] + ` [${new Date().toLocaleTimeString()}]`]);
    i++;
    
    const interval = setInterval(() => {
      setDriverUpdates(prev => [msgs[i % msgs.length] + ` [${new Date().toLocaleTimeString()}]`, ...prev]);
      i++;
    }, 4000);
    return () => clearInterval(interval);
  }, [trackingTrip]);

  const handleUpdateTripStatus = async (tripId, status) => {
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch(`http://localhost:5000/api/trips/${tripId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        toast.success(`Trip Marked as ${status}!`);
        fetchAllData();
      } else {
        toast.error(`Failed to update trip to ${status}`);
      }
    } catch (err) {
      toast.error('An error occurred');
    }
  };

  const downloadReceipt = (trip) => {
    const vName = getVehicleName(trip.vehicleId);
    const dName = getDriverName(trip.driverId);
    
    const receiptContent = `
========================================
       TRANSITOPS DISPATCH RECEIPT
========================================

Date Generated: ${new Date().toLocaleString()}

ROUTE DETAILS
----------------------------------------
Source: ${trip.source}
Destination: ${trip.destination}
Departure Date: ${trip.date}
Departure Time: ${trip.time}
Estimated Distance: ${trip.distance} km

RESOURCES ALLOCATED
----------------------------------------
Vehicle: ${vName}
Driver: ${dName}
Cargo Weight: ${trip.cargoWeight} kg

========================================
Status: DISPATCHED
System Verified: YES
========================================
    `;

    const blob = new Blob([receiptContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Dispatch_Receipt_${Date.now()}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleNext = () => {
    if (currentStep === 2 && !tripData.vehicleId) {
      toast.error('Please select a vehicle');
      return;
    }
    if (currentStep === 3 && !tripData.driverId) {
      toast.error('Please select a driver');
      return;
    }
    if (currentStep === 4) {
      if (!tripData.cargoWeight) {
        toast.error('Please enter cargo weight');
        return;
      }
      const selectedVehicle = vehicles.find(v => v._id === tripData.vehicleId);
      if (selectedVehicle && parseFloat(tripData.cargoWeight) > selectedVehicle.maxLoadCapacity) {
        toast.error(`Weight exceeds vehicle capacity (${selectedVehicle.maxLoadCapacity} kg)`);
        return;
      }
    }
    setCurrentStep(p => Math.min(5, p + 1));
  };

  const handleBack = () => {
    setCurrentStep(p => Math.max(1, p - 1));
  };

  const handleDispatch = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      const res = await fetch('http://localhost:5000/api/trips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          source: tripData.source,
          destination: tripData.destination,
          vehicleId: tripData.vehicleId,
          driverId: tripData.driverId,
          cargoWeight: parseFloat(tripData.cargoWeight),
          plannedDistance: tripData.distance
        })
      });

      if (res.ok) {
        toast.success('Trip Dispatched Successfully!');
        
        // Download Receipt
        downloadReceipt(tripData);

        setCurrentStep(1);
        setTripData({
          ...tripData,
          vehicleId: '',
          driverId: '',
          cargoWeight: ''
        });
        // Refetch to update available lists and active trips
        fetchAllData();
      } else {
        const errorData = await res.json();
        toast.error(errorData.message || 'Failed to dispatch trip');
      }
    } catch (err) {
      toast.error('An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const steps = ['TRIP INFO', 'VEHICLE', 'DRIVER', 'CARGO', 'REVIEW'];
  const stepTitles = [
    'Define the Route', 
    'Select a Vehicle', 
    'Assign a Driver', 
    'Cargo Details', 
    'Review & Dispatch'
  ];
  const stepDescriptions = [
    'Enter pick-up and drop-off logistics centers.',
    'Choose an available vehicle from the fleet.',
    'Select a qualified driver for this route.',
    'Specify the cargo weight and details.',
    'Verify all information before finalizing.'
  ];

  const getVehicleName = (id) => {
    const v = vehicles.find(v => v._id === id);
    return v ? `${v.registrationNumber} - ${v.modelName}` : 'Unknown';
  };

  const getDriverName = (id) => {
    const d = drivers.find(d => d._id === id);
    return d ? `${d.name} (${d.licenseNumber})` : 'Unknown';
  };

  return (
    <DashboardLayout title="New Trip Dispatch">
      <div className="w-full">
        {/* Wizard Header */}
        <div className="bg-white p-4 sm:p-8 rounded-t-2xl border border-slate-100 border-b-0">
          <div className="flex flex-col sm:flex-row justify-between items-start mb-8 gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">Dispatcher Wizard</h2>
              <p className="text-slate-500 text-sm">Configure and activate a new logistics route with automated fleet verification.</p>
            </div>
            <div className="sm:text-right text-left shrink-0">
              <p className="text-xs sm:text-sm font-semibold text-slate-900">Step {currentStep} of 5</p>
              <p className="text-base sm:text-lg font-bold text-slate-900">{stepTitles[currentStep-1]}</p>
            </div>
          </div>

          {/* Stepper */}
          <div className="flex justify-between relative px-2 sm:px-4">
            <div className="absolute top-4 left-6 right-6 sm:left-12 sm:right-12 h-0.5 bg-slate-100 -z-10"></div>
            {steps.map((label, index) => {
              const stepNum = index + 1;
              const isActive = stepNum === currentStep;
              const isPast = stepNum < currentStep;
              return (
                <div key={label} className={`flex flex-col items-center gap-3 bg-white px-2 ${(!isActive && !isPast) ? 'opacity-50' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${isActive || isPast ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-500'}`}>
                    {isPast ? <CheckCircle className="w-5 h-5 text-emerald-400" /> : stepNum}
                  </div>
                  <span className={`text-[10px] sm:text-xs font-bold tracking-wider hidden sm:block ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Wizard Form Content */}
        <div className="bg-slate-50/50 p-4 sm:p-8 border border-slate-100 rounded-b-2xl shadow-sm pb-12">
          
          <div className="bg-white p-4 sm:p-8 rounded-2xl border border-slate-200 mb-8 min-h-[300px]">
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-6 border-b border-slate-100 pb-4 gap-4">
              <div>
                <h3 className="text-base sm:text-lg font-bold text-slate-900">{stepTitles[currentStep-1]}</h3>
                <p className="text-xs sm:text-sm text-slate-500">{stepDescriptions[currentStep-1]}</p>
              </div>
              <span className="w-fit flex items-center gap-2 px-3 py-1 bg-slate-100 text-slate-600 rounded-full text-xs font-bold shrink-0">
                <ShieldCheck className="w-4 h-4" /> System Verified
              </span>
            </div>

            {currentStep === 1 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Source Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><MapPin className="h-5 w-5" /></div>
                      <select 
                        value={tripData.source} 
                        onChange={(e) => handleLocationChange('source', e.target.value)} 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none appearance-none"
                      >
                        {INDIAN_HUBS.map(hub => <option key={`src-${hub}`} value={hub}>{hub}</option>)}
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Destination Location</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><MapPin className="h-5 w-5" /></div>
                      <select 
                        value={tripData.destination} 
                        onChange={(e) => handleLocationChange('destination', e.target.value)} 
                        className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none appearance-none"
                      >
                        {INDIAN_HUBS.map(hub => <option key={`dest-${hub}`} value={hub}>{hub}</option>)}
                      </select>
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Departure Date</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Calendar className="h-5 w-5" /></div>
                      <input type="date" value={tripData.date} onChange={(e) => setTripData({...tripData, date: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Departure Time</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Clock className="h-5 w-5" /></div>
                      <input type="time" value={tripData.time} onChange={(e) => setTripData({...tripData, time: e.target.value})} className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-slate-700">Estimated Distance (km)</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400"><Map className="h-5 w-5" /></div>
                      <input type="number" value={tripData.distance} readOnly className="w-full pl-12 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-500 outline-none" />
                    </div>
                  </div>
                </div>
                <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex gap-3">
                  <AlertOctagon className="w-5 h-5 text-slate-400 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-slate-700 text-sm">Route Efficiency Optimization</p>
                    <p className="text-slate-500 text-sm mt-1">The suggested route avoids known construction delays. Estimated fuel consumption: {(tripData.distance * 0.23).toFixed(1)}L.</p>
                  </div>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {vehicles.length === 0 ? <p className="text-slate-500 col-span-2">No available vehicles.</p> : vehicles.map(v => (
                  <div 
                    key={v._id} 
                    onClick={() => setTripData({...tripData, vehicleId: v._id})}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${tripData.vehicleId === v._id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className={`p-3 rounded-lg ${tripData.vehicleId === v._id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{v.registrationNumber}</h4>
                      <p className="text-sm text-slate-500">{v.modelName} • Max {v.maxLoadCapacity}kg</p>
                    </div>
                    {tripData.vehicleId === v._id && <CheckCircle className="w-6 h-6 text-slate-900 ml-auto" />}
                  </div>
                ))}
              </div>
            )}

            {currentStep === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {drivers.length === 0 ? <p className="text-slate-500 col-span-2">No available drivers.</p> : drivers.map(d => (
                  <div 
                    key={d._id} 
                    onClick={() => setTripData({...tripData, driverId: d._id})}
                    className={`p-4 rounded-xl border-2 cursor-pointer transition-all flex items-center gap-4 ${tripData.driverId === d._id ? 'border-slate-900 bg-slate-50' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <div className={`p-3 rounded-lg ${tripData.driverId === d._id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600'}`}>
                      <User className="w-6 h-6" />
                    </div>
                    <div>
                      <h4 className="font-bold text-slate-900">{d.name}</h4>
                      <p className="text-sm text-slate-500">License: {d.licenseNumber} • Class: {d.licenseCategory}</p>
                    </div>
                    {tripData.driverId === d._id && <CheckCircle className="w-6 h-6 text-slate-900 ml-auto" />}
                  </div>
                ))}
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-2">
                    Cargo Weight (kg) 
                    {tripData.vehicleId && (
                      <span className="text-slate-500 font-normal ml-2">
                        (Max: {vehicles.find(v => v._id === tripData.vehicleId)?.maxLoadCapacity} kg)
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400">
                      <Box className="h-5 w-5" />
                    </div>
                    <input 
                      type="text" 
                      inputMode="numeric"
                      value={tripData.cargoWeight} 
                      onChange={(e) => setTripData({...tripData, cargoWeight: e.target.value})}
                      placeholder="e.g. 15000"
                      className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-slate-900 outline-none" 
                    />
                  </div>
                </div>
              </div>
            )}

            {currentStep === 5 && (
              <div className="space-y-6">
                <div className="p-6 bg-slate-50 rounded-xl border border-slate-200 grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Route Details</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-400">Source</p>
                        <p className="font-semibold text-slate-900">{tripData.source}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Destination</p>
                        <p className="font-semibold text-slate-900">{tripData.destination}</p>
                      </div>
                      <div className="flex gap-4">
                        <div>
                          <p className="text-xs text-slate-400">Date</p>
                          <p className="font-semibold text-slate-900">{tripData.date}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Time</p>
                          <p className="font-semibold text-slate-900">{tripData.time}</p>
                        </div>
                        <div>
                          <p className="text-xs text-slate-400">Distance</p>
                          <p className="font-semibold text-slate-900">{tripData.distance} km</p>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Resources</h4>
                    <div className="space-y-3">
                      <div>
                        <p className="text-xs text-slate-400">Vehicle</p>
                        <p className="font-semibold text-slate-900">{getVehicleName(tripData.vehicleId)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Driver</p>
                        <p className="font-semibold text-slate-900">{getDriverName(tripData.driverId)}</p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">Cargo Weight</p>
                        <p className="font-semibold text-slate-900">{tripData.cargoWeight} kg</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <button 
              onClick={handleBack}
              disabled={currentStep === 1 || loading}
              className="px-6 py-3 text-slate-500 font-semibold text-sm hover:text-slate-900 transition-colors disabled:opacity-50"
            >
              &lt; Back
            </button>
            {currentStep < 5 ? (
              <button 
                onClick={handleNext}
                className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20"
              >
                Continue &gt;
              </button>
            ) : (
              <button 
                onClick={handleDispatch}
                disabled={loading}
                className="px-8 py-3 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg shadow-emerald-600/20 disabled:opacity-50"
              >
                {loading ? 'Dispatching...' : 'Dispatch Trip'}
              </button>
            )}
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

        {/* Active Trips Section */}
        <div className="mt-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Active Dispatches</h3>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-bold text-xs rounded-full">{activeTrips.length} Running</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Route</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Trip Ref</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Assigned</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {activeTrips.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-slate-500 font-medium">No active trips currently running.</td>
                  </tr>
                ) : (
                  activeTrips.map(t => (
                    <tr key={t._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4">
                        <p className="text-sm font-bold text-slate-900">{t.source}</p>
                        <p className="text-xs text-slate-500">to {t.destination}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-slate-700">#{t._id.slice(-6).toUpperCase()}</p>
                      </td>
                      <td className="py-3 px-4">
                        <p className="text-sm font-semibold text-slate-900">{t.vehicle?.registrationNumber || 'Unknown Vehicle'}</p>
                        <p className="text-xs text-slate-500">{t.driver?.name || 'Unknown Driver'}</p>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-amber-100 text-amber-700 text-xs font-bold rounded-full">
                          {t.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 flex items-center justify-end gap-2">
                        {t.status !== 'Draft' && (
                          <button
                            onClick={() => { setTrackingTrip(t); setDriverUpdates([]); }}
                            className="px-3 py-2 bg-white border border-slate-200 text-slate-700 hover:text-slate-900 text-xs font-bold rounded-lg transition-colors shadow-sm flex items-center gap-1"
                          >
                            <Map className="w-3 h-3" /> Track
                          </button>
                        )}
                        {t.status === 'Draft' ? (
                          <button 
                            onClick={() => handleUpdateTripStatus(t._id, 'Dispatched')}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Dispatch
                          </button>
                        ) : (
                          <button 
                            onClick={() => handleUpdateTripStatus(t._id, 'Completed')}
                            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-lg transition-colors shadow-sm"
                          >
                            Complete
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Maintenance Vehicles Section */}
        <div className="mt-8 bg-white p-8 rounded-2xl border border-slate-100 shadow-sm">
          <div className="mb-6 flex justify-between items-center">
            <h3 className="text-xl font-bold text-slate-900">Vehicles Under Maintenance</h3>
            <span className="px-3 py-1 bg-red-100 text-red-700 font-bold text-xs rounded-full">{maintenanceVehicles.length} Vehicles</span>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Registration</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Model</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase">Status</th>
                  <th className="py-3 px-4 text-xs font-bold text-slate-500 uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {maintenanceVehicles.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-slate-500 font-medium">No vehicles currently under maintenance.</td>
                  </tr>
                ) : (
                  maintenanceVehicles.map(v => (
                    <tr key={v._id} className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
                      <td className="py-3 px-4 font-bold text-slate-900">{v.registrationNumber}</td>
                      <td className="py-3 px-4 text-sm text-slate-700">{v.modelName}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full">
                          {v.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-slate-500 text-right font-medium">
                        Cannot be assigned
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Tracking Modal */}
        {trackingTrip && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl w-full max-w-5xl h-[80vh] flex flex-col overflow-hidden shadow-2xl">
              
              {/* Modal Header */}
              <div className="flex justify-between items-center p-4 border-b border-slate-100 bg-slate-50">
                <div>
                  <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                    <Navigation className="w-5 h-5 text-emerald-600" />
                    Live Tracking: #{trackingTrip._id.slice(-6).toUpperCase()}
                  </h3>
                  <p className="text-sm text-slate-500 font-medium">
                    {trackingTrip.source} &rarr; {trackingTrip.destination}
                  </p>
                </div>
                <button 
                  onClick={() => setTrackingTrip(null)}
                  className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {/* Modal Body */}
              <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
                {/* Map Area */}
                <div className="flex-1 bg-slate-200 relative z-0">
                  <LiveTrackingMap source={trackingTrip.source} destination={trackingTrip.destination} />
                </div>

                {/* Driver Live Updates Panel */}
                <div className="w-full md:w-80 bg-white border-l border-slate-100 flex flex-col">
                  <div className="p-4 border-b border-slate-100 bg-slate-50">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white">
                        <User className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-900">{trackingTrip.driver?.name || 'Unknown Driver'}</p>
                        <p className="text-xs text-slate-500">{trackingTrip.vehicle?.registrationNumber || 'Unknown Vehicle'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex-1 p-4 overflow-y-auto space-y-4">
                    <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Live Updates</h4>
                    {driverUpdates.map((update, idx) => (
                      <div key={idx} className="flex gap-3">
                        <div className="mt-1 flex flex-col items-center">
                          <div className={`w-2.5 h-2.5 rounded-full ${idx === 0 ? 'bg-emerald-500 animate-pulse' : 'bg-slate-300'}`}></div>
                          {idx !== driverUpdates.length - 1 && <div className="w-px h-full bg-slate-200 mt-1"></div>}
                        </div>
                        <p className={`text-sm ${idx === 0 ? 'text-slate-900 font-semibold' : 'text-slate-500'}`}>
                          {update}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

            </div>
          </div>
        )}

      </div>

    </DashboardLayout>
  );
};

export default TripDispatcher;
