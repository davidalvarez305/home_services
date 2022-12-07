import React, { useContext, useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { UserContext } from "../../../context/UserContext";
import useFetch from "../../../hooks/useFetch";
import { COMPANY_ROUTE } from "../../../constants";
import { CompanyLead } from "../../../types/general";
import LeadsTable from "../../../components/LeadsTable";
import styles from "./LeadsList.module.css";

const LeadsList: React.FC = () => {
  const ctx = useContext(UserContext);
  useLoginRequired();
  const { makeRequest, isLoading, error } = useFetch();
  const [companyLeads, setCompanyLeads] = useState<CompanyLead[]>([]);

  useEffect(() => {
    if (ctx?.user.company_id) {
      const qs = new URLSearchParams({
        offset: "0",
        limit: "5",
      });

      makeRequest(
        { url: `${COMPANY_ROUTE}/${ctx?.user.company_id}/leads/?` + qs },
        (res) => {
          setCompanyLeads(res.data.data);
        }
      );
    }
  }, [makeRequest, ctx?.user.company_id]);

  return (
    <PrimaryLayout screenName="Leads List">
      <div className={styles['main-container']}>
      {companyLeads.length > 0 && <LeadsTable companyLeads={companyLeads} />}
      </div>
    </PrimaryLayout>
  );
};
export default LeadsList;
