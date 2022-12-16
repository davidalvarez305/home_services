import { useCallback, useState } from "react";
import { LEAD_ROUTE } from "../constants";
import { LeadDetails } from "../types/general";
import useFetch from "./useFetch";

export default function useAuth() {
  const { makeRequest } = useFetch();
  const [lead, setLead] = useState<LeadDetails>();

  const SetLead = useCallback((lead: LeadDetails) => {
    setLead(lead);
  }, []);

  function Logout() {
    makeRequest(
      {
        url: `${LEAD_ROUTE + "/logout"}`,
        method: "POST",
      },
      (_) => {
        setLead(undefined);
      }
    );
  }

  return { SetLead, Logout, lead };
}
