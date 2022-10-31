import React, { createContext, ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import { User } from "../types/general";

interface ContextValue {
  Login: (user: User) => void;
  Logout: () => void;
  user: User;
}

export const UserContext = createContext<ContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  const { Login, Logout, user } = useAuth();
  return (
    <UserContext.Provider value={{ Login, Logout, user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
