import useLoginRequired from "../hooks/useLoginRequired";
import PrimaryLayout from "../components/Layout";
import { useContext, useState, useEffect, useCallback } from "react";
import { COMPANY_ROUTE } from "../constants";
import { UserContext } from "../context/UserContext";
import useFetch from "../hooks/useFetch";
import LeadsCard from "../components/LeadsCard";
import LeadsTable from "../components/LeadsTable";
import transformLeads from "../utils/transformLeads";
import Button from "../components/Button";
import { useRouter } from "next/router";

const DAYS_SINCE_MONTH_START = Math.floor(
  new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime() /
    1000
);
const YESTERDAY = Math.floor(
  new Date(new Date().setDate(new Date().getDate() - 1)).getTime() / 1000
);
const SEVEN_DAYS_AGO = Math.floor(
  new Date(new Date().setDate(new Date().getDate() - 7)).getTime() / 1000
);

export default function Home() {
  const ctx = useContext(UserContext);
  const router = useRouter();
  useLoginRequired();
  const { makeRequest, isLoading, error } = useFetch();
  const [leads, setLeads] = useState<any>({
    YESTERDAY: [],
    DAYS_SINCE_MONTH_START: [],
    SEVEN_DAYS_AGO: [],
  });

  const fetchLeads = useCallback(
    (date: number, key: string) => {
      makeRequest(
        {
          url: `${COMPANY_ROUTE}/${ctx?.user.company_id}/leads/` + date,
        },
        (res) => {
          setLeads((prev: any) => {
            return {
              ...prev,
              [key]: res.data.data,
            };
          });
        }
      );
    },
    [makeRequest, ctx?.user.company_id]
  );

  useEffect(() => {
    if (ctx?.user.company_id) {
      // Fetch YESTERDAY
      fetchLeads(YESTERDAY, "YESTERDAY");

      // Fetch yesterday
      fetchLeads(SEVEN_DAYS_AGO, "SEVEN_DAYS_AGO");

      // Fetch yesterday
      fetchLeads(DAYS_SINCE_MONTH_START, "DAYS_SINCE_MONTH_START");
    }
  }, [makeRequest, ctx?.user.company_id, fetchLeads]);

  return (
    <PrimaryLayout>
      <div className="flex flex-col justify-center align-center gap-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-8">
          <LeadsCard
            leads={leads["YESTERDAY"].length}
            cardTitle={"Leads"}
            subText={"Yesterday"}
          />
          <LeadsCard
            leads={leads["SEVEN_DAYS_AGO"].length}
            cardTitle={"Leads"}
            subText={"Last 7 Days"}
          />
          <LeadsCard
            leads={leads["DAYS_SINCE_MONTH_START"].length * 4}
            cardTitle={"Amount Owed ($USD)"}
            subText={"This Month"}
          />
        </div>
        <div className="flex flex-col justify-center items-center m-2">
          {leads["SEVEN_DAYS_AGO"] && (
            <LeadsTable
              companyLeads={transformLeads(leads["SEVEN_DAYS_AGO"])}
            />
          )}
          <Button onClick={() => router.push("/leads")}>See More</Button>
        </div>
      </div>
    </PrimaryLayout>
  );
}
