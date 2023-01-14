import useLoginRequired from "../hooks/useLoginRequired";
import PrimaryLayout from "../components/Layout";
import { useContext, useState, useEffect } from "react";
import { COMPANY_ROUTE } from "../constants";
import { UserContext } from "../context/UserContext";
import useFetch from "../hooks/useFetch";
import { Lead } from "../types/general";
import LeadsCard from "../components/LeadsCard";

const SEVEN_DAYS_AGO =
  new Date(new Date().setDate(new Date().getDate() - 7)).getTime() / 1000;

export default function Home() {
  const ctx = useContext(UserContext);
  useLoginRequired();
  const { makeRequest, isLoading, error } = useFetch();
  const [leads, setLeads] = useState<Lead[]>([]);

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url:
            `${COMPANY_ROUTE}/${ctx?.user.company_id}/leads/` +
            Math.floor(SEVEN_DAYS_AGO),
        },
        (res) => {
          setLeads(res.data.data);
        }
      );
    }
  }, [makeRequest, ctx?.user.company_id]);

  return (
    <PrimaryLayout>
      <LeadsCard leads={leads.length} />
    </PrimaryLayout>
  );
}
