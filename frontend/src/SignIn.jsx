import React, { useState } from 'react';
import { Mail, Lock, Eye, EyeOff, Activity, CheckCircle, ShieldCheck, ExternalLink } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import warehouseImg from './assets/warehouse.jpg';
import logoImg from './assets/logo.png';

const SignIn = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/userLogin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, rememberMe }),
      });
      
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to sign in');
      }

      if (rememberMe) {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data));
      } else {
        sessionStorage.setItem('token', data.token);
        sessionStorage.setItem('user', JSON.stringify(data));
      }
      toast.success('Successfully logged in!');
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

      {/* Right Column - Sign In Form */}
      <div className="w-1/2 flex items-center justify-center p-6 sm:p-12 bg-white">
        <div className="w-full max-w-2xl">
          <div className="mb-10 flex items-center justify-center">
            <img src={logoImg} alt="TransitOps Logo" className="h-12 w-auto" />
          </div>
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900 mb-3">Sign In</h2>
            <p className="text-slate-500 text-sm">
              Enter your credentials to access the TransitOps portal.
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSignIn}>
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

            {/* Password Input */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-slate-700" htmlFor="password">
                  Password
                </label>
                <a href="#" className="text-xs font-medium text-slate-500 hover:text-slate-800 transition-colors">
                  Forgot password?
                </a>
              </div>
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

            {/* Remember Me */}
            <div className="flex items-center">
              <input
                id="remember-me"
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 text-slate-900 focus:ring-slate-900 border-slate-300 rounded cursor-pointer accent-slate-900"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-600 cursor-pointer">
                Keep me signed in for 30 days
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full bg-[#141416] hover:bg-black text-white font-semibold py-3.5 px-4 rounded-xl transition-all duration-200 ease-in-out transform shadow-lg shadow-slate-900/20 ${loading ? 'opacity-70 cursor-not-allowed' : 'hover:-translate-y-[1px] active:translate-y-0 active:shadow-none'}`}
            >
              {loading ? 'Signing In...' : 'Sign In to Dashboard'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-8 pt-8 border-t border-slate-100 flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500">
              Don't have an account?{' '}
              <Link to="/register" className="font-semibold text-slate-900 hover:underline">
                Create Account
              </Link>
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-400">
              <a href="#" className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                Privacy Policy <ExternalLink className="h-3 w-3" />
              </a>
              <span>•</span>
              <a href="#" className="flex items-center gap-1 hover:text-slate-600 transition-colors">
                Terms of Service <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
