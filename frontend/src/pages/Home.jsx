import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Frontend guard checking if user is logged in
    const user = localStorage.getItem('user') || sessionStorage.getItem('user');
    if (!user) {
      toast.error('Please Login to access Full App', { id: 'auth-error' });
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Call backend to destroy session cookie
      await fetch('http://localhost:5000/userLogout', {
        method: 'POST',
      });
      // Clear frontend state
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      toast.success('Logged out successfully');
      navigate('/');
    } catch (err) {
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
