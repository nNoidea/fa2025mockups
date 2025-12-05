import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, User, AlertCircle, LayoutDashboard } from 'lucide-react';

const CockpitLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/cockpit/dashboard';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!username || !password) {
      setError('Gebruikersnaam en wachtwoord zijn verplicht');
      return;
    }

    if (username && password) {
      const success = await login(username, password);
      if (success) {
        // Cockpit is for everyone, but mostly employees. 
        // We don't strictly restrict managers from seeing the cockpit if they want.
        navigate(from, { replace: true });
      } else {
        setError('Ongeldige gebruikersnaam of wachtwoord');
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 rounded-2xl shadow-2xl w-full max-w-md overflow-hidden border border-slate-700">
        <div className="bg-primary p-8 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 mb-4">
            <LayoutDashboard className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white">Cockpit Login</h1>
          <p className="text-slate-300 mt-2">Personeelsplanning & Dashboard</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6" noValidate>
            {error && (
              <div className="bg-red-500/10 text-red-400 p-3 rounded-lg text-sm flex items-center gap-2 border border-red-500/20">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Gebruikersnaam</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-slate-500"
                  placeholder="Gebruikersnaam"
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-300 mb-1">Wachtwoord</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-900 border border-slate-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all placeholder-slate-500"
                  placeholder="••••••••"
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-500" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-primary hover:bg-primary/90 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Aanmelden
            </button>
          </form>
        </div>
        
        <div className="bg-slate-900/50 p-4 text-center border-t border-slate-700">
          <p className="text-xs text-slate-500">
            &copy; 2025 Scheduling Cockpit.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CockpitLoginPage;
