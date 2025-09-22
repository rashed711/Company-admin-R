

import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Role, Permission, ALL_PERMISSIONS } from '../types';
import { supabase } from '../services/supabaseClient';

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
            "contacts:suppliers:view_statement",
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
            "contacts:customers:create", "contacts:customers:view_team", "contacts:customers:edit_team", "contacts:customers:view_statement",
            "contacts:suppliers:create", "contacts:suppliers:view_team", "contacts:suppliers:edit_team", "contacts:suppliers:view_statement",
        ],
    },
    sales_person: {
        id: 'sales_person',
        name: 'Sales Person',
        permissions: [
            "sales:quotations:create", "sales:quotations:view", "sales:quotations:edit",
            "sales:invoices:create", "sales:invoices:view",
            "contacts:customers:create", "contacts:customers:view", "contacts:customers:view_statement",
            "contacts:suppliers:create", "contacts:suppliers:view", "contacts:suppliers:view_statement",
        ],
    }
};


interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  dbError: string | null;
  clearDbError: () => void;
  hasPermission: (permission: string) => boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  signUp: (email: string, password: string, fullName: string, roleId: string, managerId: string | null) => Promise<{ user?: User; error?: string }>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [dbError, setDbError] = useState<string | null>(null);
  
  const isAuthenticated = !!user;

  const clearDbError = () => setDbError(null);
  
  const fetchUserProfile = async (authUserId: string, authUserEmail: string | undefined): Promise<User | null> => {
      if (!authUserEmail) {
          console.error("Auth user email is missing.");
          return null;
      }
      
      const { data: profile, error } = await supabase
          .from('users')
          .select('id, full_name, role, manager_id')
          .eq('id', authUserId)
          .maybeSingle();

      if (error) {
          if (error.message.includes('infinite recursion')) {
              setDbError('RECURSION_ERROR');
          }
          console.error('Error fetching user profile:', error.message);
          await supabase.auth.signOut();
          return null;
      }

      if (!profile) {
          console.error(`User profile not found for auth user ID ${authUserId}. Signing out.`);
          await supabase.auth.signOut();
          return null;
      }

      const userRole = Object.values(ROLES).find(r => r.id === profile.role);
      if (!userRole) {
          console.error('Invalid role found for user:', profile.role);
          await supabase.auth.signOut();
          return null;
      }

      return {
          id: profile.id,
          name: profile.full_name,
          email: authUserEmail,
          role: userRole,
          manager_id: profile.manager_id,
      };
  };

  useEffect(() => {
    // A one-time function to check the initial session state on component mount.
    const checkInitialSession = async () => {
        try {
            // Get the current session. This doesn't trigger a listener, it's a direct async check.
            const { data: { session }, error } = await supabase.auth.getSession();

            if (error) {
                console.error("Error getting initial session:", error);
                setUser(null);
            } else if (session?.user) {
                // If a session exists, fetch the user's application-specific profile.
                const userProfile = await fetchUserProfile(session.user.id, session.user.email);
                setUser(userProfile);
            } else {
                // No session found.
                setUser(null);
            }
        } catch (e) {
            console.error("An unexpected error occurred during initial session check:", e);
            setUser(null);
        } finally {
            // This is the most important part: ensure the loading screen is hidden
            // once the initial check is complete, regardless of the outcome.
            setLoading(false);
        }
    };
    
    // Run the initial check.
    checkInitialSession();

    // Now, set up the listener for any *subsequent* auth state changes (e.g., login, logout).
    // This listener will not manage the initial `loading` state, preventing race conditions.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
            const userProfile = await fetchUserProfile(session.user.id, session.user.email);
            setUser(userProfile);
        } else {
            setUser(null);
        }
    });

    // Cleanup the subscription when the component unmounts.
    return () => {
        subscription.unsubscribe();
    };
  }, []);


  const hasPermission = (permission: string): boolean => {
    if (!user) return false;
    if (user.role.id === 'admin') {
      return true;
    }
    return user.role.permissions.some(p => p.startsWith(permission));
  };

  const login = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
        return { success: false, error: error.message };
    }
    // On success, the onAuthStateChange listener will automatically handle updating the user state.
    return { success: true };
  };
  
  const signUp = async (email: string, password: string, fullName: string, roleId: string, managerId: string | null): Promise<{ user?: User; error?: string }> => {
    const { data: { user: authUser }, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                full_name: fullName,
            }
        }
    });

    if (signUpError) {
        return { error: signUpError.message };
    }
    if (!authUser) {
        return { error: 'Signup failed to return a user.' };
    }

    const { error: updateError } = await supabase
        .from('users')
        .update({ role: roleId, manager_id: managerId })
        .eq('id', authUser.id);
    
    if (updateError) {
        return { error: `User account was created, but failed to set profile details: ${updateError.message}` };
    }

    const role = Object.values(ROLES).find(r => r.id === roleId);
    if (!role) {
        return { error: 'Internal error: An invalid role was specified.' };
    }

    const newUser: User = {
        id: authUser.id,
        name: fullName,
        email: authUser.email!,
        role,
        manager_id: managerId,
    };

    return { user: newUser };
  };


  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const value = {
    user,
    isAuthenticated,
    loading,
    dbError,
    clearDbError,
    hasPermission,
    login,
    logout,
    signUp,
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