import React, { useContext, useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { UserContext } from "../../../context/UserContext";
import useFetch from "../../../hooks/useFetch";
import { COMPANY_ROUTE } from "../../../constants";
import { CompanyLead } from "../../../types/general";
import LeadsTable from "../../../components/LeadsTable";
import styles from "./LeadsList.module.css";
import Button from "../../../components/Button";

const LeadsList: React.FC = () => {
  const ctx = useContext(UserContext);
  useLoginRequired();
  const { makeRequest, isLoading, error } = useFetch();
  const [companyLeads, setCompanyLeads] = useState<CompanyLead[]>([]);
  const [offsetLimits, setOffsetLimits] = useState({
    offset: 0,
    limit: 8,
  });

  useEffect(() => {
    if (ctx?.user.company_id) {
      const qs = new URLSearchParams({
        offset: String(offsetLimits.offset),
        limit: String(offsetLimits.limit),
      });

      makeRequest(
        { url: `${COMPANY_ROUTE}/${ctx?.user.company_id}/leads/?` + qs },
        (res) => {
          setCompanyLeads((prev) => [...prev, ...res.data.data]);
        }
      );
    }
  }, [makeRequest, ctx?.user.company_id, offsetLimits]);

  function handleLoadMore() {
    setOffsetLimits((prev) => {
      return {
        offset: (prev.offset += prev.limit),
        limit: 8,
      };
    });
  }

  return (
    <PrimaryLayout screenName="Leads List">
      <div className={styles["main-container"]}>
        <div className={styles["table-button"]}>
          <LeadsTable companyLeads={companyLeads} />
          <Button
            className="Dark"
            isLoading={isLoading}
            onClick={() => handleLoadMore()}
          >
            Load More
          </Button>
        </div>
      </div>
    </PrimaryLayout>
  );
};
export default LeadsList;
