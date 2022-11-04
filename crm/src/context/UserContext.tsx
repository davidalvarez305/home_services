import React, { createContext, ReactNode } from "react";
import useAuth from "../hooks/useAuth";
import { User } from "../types/general";

interface ContextValue {
  SetUser: (user: User) => void;
  Logout: () => void;
  user: User;
}

export const UserContext = createContext<ContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
}

const UserProvider: React.FC<ProviderProps> = ({ children }) => {
  const { SetUser, Logout, user } = useAuth();
  return (
    <UserContext.Provider value={{ SetUser, Logout, user }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserProvider;
