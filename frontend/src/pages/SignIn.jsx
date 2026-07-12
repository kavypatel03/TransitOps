import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Activity, CheckCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import warehouseImg from '../assets/warehouse.jpg';
import logoImg from '../assets/logo.png';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = (e) => {
    e.preventDefault();
    navigate('/home');
  };

  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-white p-2 sm:p-4 font-sans">
      <div className="flex w-full max-w-5xl flex-col lg:flex-row overflow-hidden rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
        {/* Left Column - Branding & Illustration */}
        <div className="flex w-full lg:w-1/2 flex-col justify-between bg-slate-900 p-6 lg:p-8 text-white">
          <div className="max-w-2xl mx-auto w-full pt-4 flex flex-col items-center lg:items-start text-center lg:text-left">

            <div className="w-full relative rounded-xl overflow-hidden mb-8 max-h-48 lg:max-h-60">
              <img 
                src={warehouseImg} 
                alt="Logistics Dashboard Illustration" 
                className="w-full h-auto object-cover"
              />
            </div>

            <h1 className="text-3xl lg:text-4xl font-bold leading-tight mb-4">
              Intelligent Transport<br />Operations at Scale.
            </h1>
            
            <p className="text-slate-400 text-sm max-w-md">
              The next-generation platform for fleet management, real-time logistics tracking, and enterprise resource optimization.
            </p>
          </div>
        </div>

      {/* Right Column - Sign In Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          <div className="mb-4 flex items-center justify-center">
            <img src={logoImg} alt="TransitOps Logo" className="h-8 w-auto" />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Sign In</h2>
            <p className="text-slate-500 text-xs">
              Enter your credentials to access the TransitOps portal.
            </p>
          </div>

          <form className="space-y-4" onSubmit={handleSignIn}>
            {/* Email Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="email">
                Enterprise Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  id="email"
                  type="email"
                  placeholder="name@company.com"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-12 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors tracking-widest placeholder:tracking-widest"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            {/* Remember Me */}
            <div className="flex items-center pt-1">
              <input
                id="remember-me"
                type="checkbox"
                className="h-3.5 w-3.5 text-slate-900 focus:ring-slate-900 border-slate-300 rounded cursor-pointer accent-slate-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-xs text-slate-600 cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-[#141416] hover:bg-black text-white font-semibold py-2.5 px-4 rounded-xl transition-all duration-200 ease-in-out transform hover:-translate-y-[1px] shadow-md shadow-slate-900/10 active:translate-y-0 active:shadow-none mt-2 text-xs cursor-pointer"
            >
              Sign In to Dashboard
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center gap-2">
            <p className="text-xs text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-slate-900 hover:underline">
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default SignIn;
