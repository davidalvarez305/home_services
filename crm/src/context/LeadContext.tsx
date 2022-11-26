import React, { createContext, ReactNode } from "react";
import useLeadAuth from "../hooks/useLeadAuth";
import { Lead } from "../types/general";

interface ContextValue {
  SetLead: (user: Lead) => void;
  Logout: () => void;
  lead: Lead;
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
