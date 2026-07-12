import { useState, useEffect } from 'react';
import { Mail, Lock, Eye, EyeOff, User, Briefcase, Phone } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';
import warehouseImg from '../assets/warehouse.jpg';
import logoImg from '../assets/logo.png';

const Registration = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  useEffect(() => {
    // If user is already logged in, instantly redirect to home
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (user) {
      navigate('/home');
    }
  }, [navigate]);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/userRegister', {
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
      login(data);
      toast.success('Account created successfully!');
      navigate('/dashboard');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
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

      {/* Right Column - Registration Form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center bg-white p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-xl">
          <div className="mb-4 flex items-center justify-center">
            <img src={logoImg} alt="TransitOps Logo" className="h-8 w-auto" />
          </div>
          <div className="mb-4">
            <h2 className="text-xl font-bold text-slate-900 mb-1">Create Account</h2>
            <p className="text-slate-500 text-xs">
              Register for the TransitOps portal to manage operations.
            </p>
          </div>

          <form className="space-y-3" onSubmit={handleRegister}>
            {/* Name Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="name">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="h-4 w-4" />
                </div>
                <input
                  id="name"
                  type="text"
                  placeholder="John Doe"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

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
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="phone">
                Contact Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Phone className="h-4 w-4" />
                </div>
                <input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>
            </div>

            {/* Role Select */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="role">
                Account Role
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Briefcase className="h-4 w-4" />
                </div>
                <select
                  id="role"
                  className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors appearance-none"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  required
                >
                  <option value="" disabled>Select your role</option>
                  <option value="fleet_manager">Fleet Manager</option>
                  <option value="driver">Driver</option>
                  <option value="safety_officer">Safety Officer</option>
                  <option value="financial_analyst">Financial Analyst</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-slate-400">
                  <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
                </div>
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1">
              <label className="text-xs font-medium text-slate-700" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-12 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-colors tracking-widest placeholder:tracking-widest"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
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



            {/* Terms Checkbox */}
            <div className="flex items-start pt-1">
              <input
                id="terms"
                type="checkbox"
                checked={acceptedTerms}
                onChange={(e) => setAcceptedTerms(e.target.checked)}
                className="h-3.5 w-3.5 mt-0.5 text-slate-900 focus:ring-slate-900 border-slate-300 rounded cursor-pointer accent-slate-900"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-slate-600 cursor-pointer">
                I agree to the <a href="#" className="font-semibold text-slate-900 hover:underline">Terms of Service</a> and <a href="#" className="font-semibold text-slate-900 hover:underline">Privacy Policy</a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={!acceptedTerms || loading}
              className={`w-full font-semibold py-2 px-4 rounded-xl transition-all duration-200 ease-in-out transform shadow-md text-white mt-1 text-xs
                ${(acceptedTerms && !loading)
                  ? 'bg-[#141416] hover:bg-black hover:-translate-y-[1px] shadow-slate-900/10 active:translate-y-0 active:shadow-none cursor-pointer' 
                  : 'bg-slate-300 shadow-none cursor-not-allowed text-slate-500 opacity-70'}`}
            >
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="mt-4 pt-3 border-t border-slate-100 flex flex-col items-center gap-2">
            <p className="text-xs text-slate-500">
              Already have an account?{' '}
              <Link to="/" className="font-semibold text-slate-900 hover:underline">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Registration;
