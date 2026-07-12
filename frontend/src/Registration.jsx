import React, { useState } from 'react';

const roles = [
  { id: 'fleet-manager', title: 'Fleet Manager', description: 'Oversees fleet assets, maintenance, and operational efficiency.', icon: '🏢' },
  { id: 'driver', title: 'Driver', description: 'Creates trips, assigns vehicles and drivers, and monitors active deliveries.', icon: '🚚' },
  { id: 'safety-officer', title: 'Safety Officer', description: 'Ensures driver compliance, tracks license validity, and monitors safety scores.', icon: '🛡️' },
  { id: 'financial-analyst', title: 'Financial Analyst', description: 'Reviews operational expenses, fuel consumption, and profitability.', icon: '📈' },
];

export default function Registration() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleSelect = (roleId) => {
    setFormData(prev => ({ ...prev, role: roleId }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registration Data:', formData);
    alert(`Registered successfully as ${formData.role || 'User'}!`);
  };

  return (
    <div className="relative w-full min-h-screen flex justify-center items-center p-8 box-border overflow-hidden">
      {/* Background animated shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute rounded-full blur-[80px] -top-[10%] -left-[10%] w-[40vw] h-[40vw] bg-[rgba(108,92,231,0.4)] animate-float-1"></div>
        <div className="absolute rounded-full blur-[80px] -bottom-[10%] -right-[5%] w-[35vw] h-[35vw] bg-[rgba(253,121,168,0.3)] animate-float-2"></div>
        <div className="absolute rounded-full blur-[80px] top-[40%] left-[60%] w-[25vw] h-[25vw] bg-[rgba(0,206,201,0.3)] animate-float-3"></div>
      </div>
      
      {/* Glassmorphism Card */}
      <div className="bg-white/5 backdrop-blur-md border border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] rounded-3xl p-12 w-full max-w-[800px] z-10 opacity-0 translate-y-5 animate-slide-up">
        
        <div className="text-center mb-10 flex flex-col items-center">
          <img src="/logo.png" alt="TransitOps Logo" className="w-24 h-24 mb-4 object-contain" />
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-white to-[#a29bfe] bg-clip-text text-transparent">
            TransitOps Registration
          </h2>
          <p className="text-white/70 text-lg m-0">Join the Smart Transport Operations Platform</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label htmlFor="fullName" className="text-sm font-medium text-white/90 ml-1">Full Name</label>
            <input 
              type="text" 
              id="fullName" 
              name="fullName" 
              value={formData.fullName} 
              onChange={handleChange} 
              placeholder="Enter your full name"
              className="bg-black/20 border border-white/10 rounded-xl p-4 text-white text-base font-sans transition-all duration-300 placeholder:text-white/30 focus:outline-none focus:border-secondary focus:bg-black/30 focus:ring-4 focus:ring-primary/20"
              required 
            />
          </div>

          <div className="flex flex-col gap-2">
            <label htmlFor="email" className="text-sm font-medium text-white/90 ml-1">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              value={formData.email} 
              onChange={handleChange} 
              placeholder="name@company.com"
              className="bg-black/20 border border-white/10 rounded-xl p-4 text-white text-base font-sans transition-all duration-300 placeholder:text-white/30 focus:outline-none focus:border-secondary focus:bg-black/30 focus:ring-4 focus:ring-primary/20"
              required 
            />
          </div>

          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="password" className="text-sm font-medium text-white/90 ml-1">Password</label>
              <input 
                type="password" 
                id="password" 
                name="password" 
                value={formData.password} 
                onChange={handleChange} 
                placeholder="••••••••"
                className="bg-black/20 border border-white/10 rounded-xl p-4 text-white text-base font-sans transition-all duration-300 placeholder:text-white/30 focus:outline-none focus:border-secondary focus:bg-black/30 focus:ring-4 focus:ring-primary/20"
                required 
              />
            </div>
            <div className="flex flex-col gap-2 flex-1">
              <label htmlFor="confirmPassword" className="text-sm font-medium text-white/90 ml-1">Confirm Password</label>
              <input 
                type="password" 
                id="confirmPassword" 
                name="confirmPassword" 
                value={formData.confirmPassword} 
                onChange={handleChange} 
                placeholder="••••••••"
                className="bg-black/20 border border-white/10 rounded-xl p-4 text-white text-base font-sans transition-all duration-300 placeholder:text-white/30 focus:outline-none focus:border-secondary focus:bg-black/30 focus:ring-4 focus:ring-primary/20"
                required 
              />
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-white/90 ml-1">Select Your Role</label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {roles.map(role => (
                <div 
                  key={role.id}
                  onClick={() => handleRoleSelect(role.id)}
                  className={`relative overflow-hidden rounded-2xl p-6 cursor-pointer transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] border ${
                    formData.role === role.id 
                      ? 'bg-primary/20 border-primary shadow-[0_8px_24px_rgba(108,92,231,0.2)]' 
                      : 'bg-white/[0.03] border-white/[0.08] hover:bg-white/[0.08] hover:-translate-y-1 hover:border-white/20'
                  }`}
                >
                  {formData.role === role.id && (
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(108,92,231,0.4)_0%,transparent_70%)] pointer-events-none"></div>
                  )}
                  <div className="text-3xl mb-4">{role.icon}</div>
                  <h3 className="text-lg text-white m-0 mb-2 font-semibold">{role.title}</h3>
                  <p className="text-sm text-white/60 m-0 leading-relaxed">{role.description}</p>
                </div>
              ))}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={!formData.role}
            className="group relative overflow-hidden bg-gradient-to-br from-primary to-accent text-white border-none rounded-xl p-5 text-lg font-semibold cursor-pointer mt-6 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:grayscale hover:not-disabled:-translate-y-0.5 hover:not-disabled:shadow-[0_10px_20px_rgba(108,92,231,0.3)] active:not-disabled:translate-y-[1px]"
          >
            Create Account
            <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-to-r from-transparent via-white/20 to-transparent rotate-45 opacity-0 group-hover:not-disabled:opacity-100 group-hover:not-disabled:animate-shimmer transition-opacity duration-500 pointer-events-none"></div>
          </button>
        </form>
      </div>
    </div>
  );
}
