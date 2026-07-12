import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import DashboardLayout from './components/layout/DashboardLayout';

import SignIn from './pages/SignIn';
import Registration from './pages/Registration';
import Home from './pages/Home';
import Overview from './pages/dashboards/Overview';
import FleetRegistry from './pages/dashboards/FleetRegistry';
import DriverManagement from './pages/dashboards/DriverManagement';
import TripDispatcher from './pages/dashboards/TripDispatcher';
import Maintenance from './pages/dashboards/Maintenance';
import ExpensesFuel from './pages/dashboards/ExpensesFuel';
import Reports from './pages/dashboards/Reports';
import Settings from './pages/dashboards/Settings';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/register" element={<Registration />} />
          <Route path="/home" element={<Home />} />
          
          <Route path="/dashboard" element={
            <ProtectedRoute>
              <Overview />
            </ProtectedRoute>
          } />

          <Route path="/fleet" element={
            <ProtectedRoute allowedRoles={['fleet_manager', 'financial_analyst']}>
              <FleetRegistry />
            </ProtectedRoute>
          } />

          <Route path="/drivers" element={
            <ProtectedRoute allowedRoles={['fleet_manager', 'safety_officer']}>
              <DriverManagement />
            </ProtectedRoute>
          } />

          <Route path="/trips" element={
            <ProtectedRoute allowedRoles={['fleet_manager', 'driver']}>
              <TripDispatcher />
            </ProtectedRoute>
          } />

          <Route path="/maintenance" element={
            <ProtectedRoute allowedRoles={['fleet_manager', 'driver', 'safety_officer']}>
              <Maintenance />
            </ProtectedRoute>
          } />

          <Route path="/expenses" element={
            <ProtectedRoute allowedRoles={['fleet_manager', 'financial_analyst']}>
              <ExpensesFuel />
            </ProtectedRoute>
          } />

          <Route path="/reports" element={
            <ProtectedRoute allowedRoles={['fleet_manager', 'financial_analyst', 'safety_officer']}>
              <Reports />
            </ProtectedRoute>
          } />

          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
