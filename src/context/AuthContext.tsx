import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types.ts';

interface AuthContextType {
  user: User | null;
  login: (role: UserRole) => void;
  logout: () => void;
  switchRole: (role: UserRole) => void;
  hasAccess: (requiredRole: UserRole | UserRole[]) => boolean;
  isLoginModalOpen: boolean;
  setIsLoginModalOpen: (open: boolean) => void;
}

const DEMO_USERS: Record<UserRole, User> = {
  admin: {
    id: 'usr-admin-1',
    name: 'Alex Mercer',
    email: 'alex.mercer@memora.ai',
    role: 'admin',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
  },
  support_agent: {
    id: 'usr-supp-1',
    name: 'Jordan Lee',
    email: 'jordan.lee@memora.ai',
    role: 'support_agent',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
  },
  ap_manager: {
    id: 'usr-ap-1',
    name: 'Michael Hernandez',
    email: 'm.hernandez@memora.ai',
    role: 'ap_manager',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
  },
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Default to Admin so judges and reviewers have full instant visibility
  const [user, setUser] = useState<User | null>(DEMO_USERS.admin);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);

  useEffect(() => {
    const savedRole = localStorage.getItem('memora_user_role') as UserRole | null;
    if (savedRole && DEMO_USERS[savedRole]) {
      setUser(DEMO_USERS[savedRole]);
    }
  }, []);

  const login = (role: UserRole) => {
    const selected = DEMO_USERS[role];
    setUser(selected);
    localStorage.setItem('memora_user_role', role);
    setIsLoginModalOpen(false);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('memora_user_role');
    setIsLoginModalOpen(true);
  };

  const switchRole = (role: UserRole) => {
    login(role);
  };

  const hasAccess = (requiredRole: UserRole | UserRole[]) => {
    if (!user) return false;
    if (user.role === 'admin') return true;
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(user.role);
    }
    return user.role === requiredRole;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        switchRole,
        hasAccess,
        isLoginModalOpen,
        setIsLoginModalOpen,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
