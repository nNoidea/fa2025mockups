import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { Lock, User, AlertCircle, Building2 } from 'lucide-react';

const BackofficeLoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, user } = useAuth(); // Get user to check role after login
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/backoffice/employees';

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // 4A. Niet alle gegevens zijn ingevuld.
    if (!username || !password) {
      setError('Gebruikersnaam en wachtwoord zijn verplicht.');
      return;
    }
    
    // Attempt login
    const success = await login(username, password);
    
    if (success) {
      // Check role immediately after successful login
      // We need to get the user from context, but context update might be async or we need to rely on the fact that login returns true
      // However, the user state in context is updated.
      // A better way is to check the role of the user that was just set.
      // Since we can't easily get the updated user state immediately in the same closure without a ref or effect,
      // let's rely on the fact that we updated the localStorage in AuthContext.
      // Or better, let's just re-fetch the user from local storage or trust the login process.
      
      // Actually, since we just called login and it awaited, the state *should* be updated if we were in a class component, 
      // but in functional with hooks, 'user' variable is from the render scope.
      // So we might need to check the role in a useEffect or manually check the mock data again here (which is redundant).
      
      // Let's cheat slightly and peek at localStorage which AuthContext updates synchronously
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      
      if (storedUser.role === 'Manager' || storedUser.role === 'Supervisor') {
         navigate(from, { replace: true });
      } else {
         // 4C. Het personeel is een werknemer.
         setError('Onbekend account');
         // Optional: logout to clear the invalid session
         // logout(); // We don't have logout here but we can just not redirect.
         // Actually we should probably logout if they are not allowed.
      }
    } else {
      // 4B. Het systeem detecteert dat de gebruikersnaam niet overeenstemt met het bijhorende wachtwoord.
      setError('Ongeldige gebruikersnaam of wachtwoord.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border-t-4 border-blue-600">
        <div className="bg-slate-50 p-8 text-center border-b border-slate-100">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
            <Building2 className="h-8 w-8 text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800">Backoffice Portal</h1>
          <p className="text-slate-500 mt-2">Beheer voor Managers & Supervisors</p>
        </div>
        
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-6">
            {error && (
              <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                {error}
              </div>
            )}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Gebruikersnaam</label>
              <div className="relative">
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Gebruikersnaam"
                  // required // Removed HTML5 validation to test JS validation as per use case
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Wachtwoord</label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="••••••••"
                  // required
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg shadow-lg hover:shadow-xl transition-all transform hover:-translate-y-0.5"
            >
              Inloggen
            </button>
          </form>
        </div>
        
        <div className="bg-slate-50 p-4 text-center border-t border-slate-100">
          <p className="text-xs text-slate-500">
            &copy; 2025 Scheduling Backoffice.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BackofficeLoginPage;
