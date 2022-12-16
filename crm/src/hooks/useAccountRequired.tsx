import axios from "axios";
import { useCallback, useContext, useEffect } from "react";
import { useRouter } from "next/router";
import { LEAD_ROUTE } from "../constants";
import { LeadContext } from "../context/LeadContext";

export default function useAccountRequired() {
  const router = useRouter();
  const ctx = useContext(LeadContext);

  const fetchData = useCallback(() => {
    axios
      .get(LEAD_ROUTE, {
        withCredentials: true,
      })
      .then((res) => {
        ctx?.SetLead(res.data.data);
      })
      .catch((_) => {
        router.push("/account/login");
      });
  }, [ctx, router]);

  useEffect(() => {
    if (!ctx?.lead.id) {
      fetchData();
    }
  }, [fetchData, ctx?.lead.id]);
}
