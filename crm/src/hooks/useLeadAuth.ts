import { useCallback, useState } from "react";
import { LEAD_ROUTE } from "../constants";
import { Lead } from "../types/general";
import useFetch from "./useFetch";

export default function useAuth() {
  const { makeRequest } = useFetch();
  let leadProps = {
    id: 0,
    email: "",
    uuid: "",
    first_name: "",
    last_name: "",
    phone_number: "",
    created_at: 0,
    company_id: 0,
  };
  const [lead, setLead] = useState(leadProps);

  const SetLead = useCallback((lead: Lead) => {
    setLead(lead);
  }, []);

  function Logout() {
    makeRequest(
      {
        url: `${LEAD_ROUTE + "logout"}`,
        method: "POST",
      },
      (res) => {
        if (res.data.data === "Logged out!") {
            setLead(leadProps);
        }
      }
    );
  }

  return { SetLead, Logout, lead };
}
