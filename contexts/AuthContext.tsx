
import React, { createContext, useState, useContext, ReactNode } from 'react';
import { User, Role, Permission, ALL_PERMISSIONS } from '../types';

// Define available roles and their permissions
export const ROLES: Record<'admin' | 'accountant' | 'sales_manager' | 'sales_person', Role> = {
    admin: {
        id: 'admin',
        name: 'Admin',
        // The admin role is granted all permissions dynamically.
        permissions: ALL_PERMISSIONS,
    },
    accountant: {
        id: 'accountant',
        name: 'Accountant',
        permissions: [
            "dashboard:financials:view",
            "sales:quotations:view_all",
            "sales:invoices:view_all",
            "purchases:invoices:view_all",
            "contacts:customers:view_all",
            "contacts:customers:view_statement",
            "contacts:suppliers:view_all",
            "accounting:chart-of-accounts:view", "accounting:chart-of-accounts:create", "accounting:chart-of-accounts:edit",
            "accounting:journal-entries:view", "accounting:journal-entries:create", "accounting:journal-entries:edit",
            "accounting:receipt-vouchers:view", "accounting:receipt-vouchers:create",
            "accounting:payment-vouchers:view", "accounting:payment-vouchers:create",
        ],
    },
    sales_manager: {
        id: 'sales_manager',
        name: 'Sales Manager',
        permissions: [
            "sales:quotations:create", "sales:quotations:view_team", "sales:quotations:edit_team", "sales:quotations:delete_team",
            "sales:invoices:create", "sales:invoices:view_team", "sales:invoices:edit_team",
            "contacts:customers:create", "contacts:customers:view_team", "contacts:customers:edit_team",
        ],
    },
    sales_person: {
        id: 'sales_person',
        name: 'Sales Person',
        permissions: [
            "sales:quotations:create", "sales:quotations:view", "sales:quotations:edit",
            "sales:invoices:create", "sales:invoices:view",
            "contacts:customers:create", "contacts:customers:view",
        ],
    }
};


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  login: (email: string, pass: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// In a real app, you would fetch the user from an authentication service.
// For demonstration, we'll mock a logged-in user.
const MOCKED_ADMIN_USER: User = {
    id: 1,
    name: 'مدير النظام',
    email: 'admin@enjaz.app',
    role: ROLES.admin,
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const isAuthenticated = !!user;

  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    // Admin role bypasses the check and always has permission.
    if (user.role.id === 'admin') {
      return true;
    }
    // Check for an exact match or if the user has a more privileged version of the permission.
    // e.g., if checking for 'sales:invoices:view', and user has 'sales:invoices:view_all', it should return true.
    return user.role.permissions.some(p => p.startsWith(permission));
  };

  const login = async (email: string, pass: string): Promise<boolean> => {
    // Mock API call
    return new Promise(resolve => {
        setTimeout(() => {
            if (email === 'admin@enjaz.app' && pass === 'password') {
                setUser(MOCKED_ADMIN_USER);
                resolve(true);
            } else {
                resolve(false);
            }
        }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };


  const value = {
    user,
    isAuthenticated,
    hasPermission,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
