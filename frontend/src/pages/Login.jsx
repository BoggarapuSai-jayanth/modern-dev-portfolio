import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
      const response = await fetch(`${backendUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      
      if (data.success) {
        localStorage.setItem('isAuthenticated', 'true');
        localStorage.setItem('token', data.token);
        navigate('/admin');
      } else {
        alert(data.message || 'Invalid password');
      }
    } catch (error) {
      console.error("Login error:", error);
      // Fallback for purely frontend testing if backend is down
      if (password === 'adminpassword123') {
        localStorage.setItem('isAuthenticated', 'true');
        navigate('/admin');
      } else {
        alert('Server unreachable, and fallback password invalid.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative px-4">
      <div className="absolute inset-0 bg-primary/10 blur-[120px] -z-10 mix-blend-screen" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md p-8 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl"
      >
        <h2 className="text-3xl font-bold mb-6 text-center text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Admin Access</h2>
        
        <form onSubmit={handleLogin} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg bg-black/40 border border-white/10 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white placeholder-gray-500"
              placeholder="Enter admin password"
            />
          </div>
          
          <button 
            type="submit"
            className="w-full py-3 px-4 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors shadow-[0_0_20px_rgba(109,40,217,0.3)]"
          >
            Authenticate
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;
