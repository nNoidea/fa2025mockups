import React, { createContext, useContext, useState, ReactNode } from 'react';
import { mockEmployees } from '../data/mockData';

export type UserRole = 'Manager' | 'Supervisor' | 'Werknemer';

interface User {
  username: string;
  role: UserRole;
  name: string;
}

interface AuthContextType {
  user: User | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      const parsedUser = JSON.parse(savedUser);
      // Sync with mock data to ensure fresh details
      const foundEmployee = mockEmployees.find(
        emp => emp.firstName.toLowerCase() === parsedUser.username.toLowerCase() || 
               emp.email.toLowerCase() === parsedUser.username.toLowerCase()
      );
      
      if (foundEmployee) {
        const updatedUser = {
          username: foundEmployee.firstName,
          role: foundEmployee.role as UserRole,
          name: `${foundEmployee.firstName} ${foundEmployee.lastName}`.trim(),
        };
        // Update local storage with fresh data
        localStorage.setItem('user', JSON.stringify(updatedUser));
        return updatedUser;
      }
      return parsedUser;
    }
    return null;
  });

  const login = async (username: string, password: string): Promise<boolean> => {
    // Mock authentication logic - check against mockEmployees
    // For this mock, we accept any password as long as it's not empty
    if (password) {
      // Special case for generic manager login
      if (username.toLowerCase() === 'manager') {
         const managerUser: User = {
          username: 'manager',
          role: 'Manager',
          name: 'Almighty Manager',
        };
        setUser(managerUser);
        localStorage.setItem('user', JSON.stringify(managerUser));
        return true;
      }

      const foundEmployee = mockEmployees.find(
        emp => emp.firstName.toLowerCase() === username.toLowerCase() || 
               emp.email.toLowerCase() === username.toLowerCase()
      );

      if (foundEmployee) {
        const newUser: User = {
          username: foundEmployee.firstName,
          role: foundEmployee.role as UserRole,
          name: `${foundEmployee.firstName} ${foundEmployee.lastName}`.trim(),
        };
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        return true;
      }
    }
    return false;
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
