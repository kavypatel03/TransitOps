import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  useEffect(() => {
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!user) {
      toast.error('Please Login to access Full App', { id: 'auth-error' });
      navigate('/');
    } else {
      // Redirect to proper dashboard
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await fetch('/userLogout', { method: 'POST' });
      logout();
      toast.success('Logged out successfully');
      navigate('/');
    } catch {
      toast.error('Failed to logout');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 font-sans p-6">
      <div className="text-center bg-white p-12 rounded-3xl shadow-sm border border-slate-100">
        <h1 className="text-4xl font-bold text-slate-900 mb-4">Welcome to TransitOps</h1>
        <p className="text-slate-500 mb-8 text-lg">Your central dashboard for fleet operations.</p>
        <button 
          onClick={handleLogout}
          className="inline-block bg-[#141416] hover:bg-black text-white font-semibold py-3 px-8 rounded-xl transition-all shadow-lg hover:-translate-y-[1px]"
        >
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default Home;
