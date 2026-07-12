import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Activity, ShieldCheck, ExternalLink, User, Briefcase, Phone, KeyRound } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import warehouseImg from '../assets/warehouse.jpg';
import logoImg from '../assets/logo.png';

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/userRegister', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, role, phone }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to register');
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      toast.success('Account created successfully!');
      navigate('/home');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50 font-sans">
      {/* Left Column - Branding & Illustration */}
      <div className="flex w-1/2 flex-col justify-between bg-slate-900 p-12 text-white">
        <div className="max-w-2xl mx-auto w-full pt-8 flex flex-col items-center lg:items-start text-center lg:text-left">

          <div className="w-full relative rounded-2xl overflow-hidden bg-slate-800 p-2 shadow-2xl border border-slate-700/50 mb-10">
            <img 
              src={warehouseImg} 
              alt="Logistics Dashboard Illustration" 
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>

          <h1 className="text-4xl lg:text-5xl font-bold leading-tight mb-6">
            Intelligent Transport<br />Operations at Scale.
          </h1>
          
          <p className="text-slate-400 text-lg max-w-sm">
            The next-generation platform for fleet management, real-time logistics tracking, and enterprise resource optimization.
          </p>
        </div>

        <div className="max-w-2xl mx-auto w-full flex justify-between items-center text-sm text-slate-500 mt-12">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4" />
            <span>ISO 27001 Certified</span>
          </div>
          <div className="flex items-center gap-2">
            <Activity className="w-4 h-4" />
            <span>99.9% Uptime SLA</span>
          </div>
        </div>
      </div>

      {/* Right Column - Registration Form */}
      <div className="w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-2xl">
          <div className="mb-8 flex items-center justify-center">
            <img src={logoImg} alt="TransitOps Logo" className="h-12 w-auto" />
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Create Account</h2>
            <p className="text-slate-500 text-sm">
              Register for the TransitOps portal to manage operations.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleRegister}>
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-5 w-5" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="email">
                Enterprise Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-5 w-5" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="phone">
                Contact Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-5 w-5" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>



            {/* Role Select */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="role">
                Account Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="h-5 w-5" />
                </div>
                <select
                  id="role"
                  className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="Fleet Manager">Fleet Manager</option>
                  <option value="Driver">Driver</option>
                  <option value="Safety Officer">Safety Officer</option>
                  <option value="Financial Analyst">Financial Analyst</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-5 w-5" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-12 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors tracking-widest placeholder:tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
            </div>



            {/* Terms Checkbox */}
            <div className="flex items-start pt-2">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 mt-0.5 text-slate-900 focus:ring-slate-900 border-slate-300 rounded cursor-pointer accent-slate-900"
              />
              <label htmlFor="terms" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                I agree to the <a href="#" className="font-semibold text-slate-900 hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-slate-900 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#141416] hover:bg-black text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 ease-in-out transform shadow-lg shadow-slate-900/20 mt-2 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-[1px] active:translate-y-0 active:shadow-none'}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <Link to="/" className="font-semibold text-slate-900 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Registration;
