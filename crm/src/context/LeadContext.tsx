import React, { createContext, ReactNode } from "react";
import useLeadAuth from "../hooks/useLeadAuth";
import { LeadDetails } from "../types/general";

interface ContextValue {
  SetLead: (user: LeadDetails) => void;
  Logout: () => void;
  lead: LeadDetails | undefined;
}

export const LeadContext = createContext<ContextValue | null>(null);

interface ProviderProps {
  children: ReactNode;
}

const LeadProvider: React.FC<ProviderProps> = ({ children }) => {
  const { SetLead, Logout, lead } = useLeadAuth();
  return (
    <LeadContext.Provider value={{ SetLead, Logout, lead }}>
      {children}
    </LeadContext.Provider>
  );
};

export default LeadProvider;
