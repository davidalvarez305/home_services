import React, { useContext, useEffect, useState } from "react";
import Layout from "../../components/Layout";
import useLoginRequired from "../../hooks/useLoginRequired";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import { COMPANY_ROUTE } from "../../constants";
import { CompanyLead } from "../../types/general";
import LeadsTable from "../../components/LeadsTable";
import Button from "../../components/Button";

const CompanyLeads: React.FC = () => {
  const ctx = useContext(UserContext);
  // useLoginRequired();
  const { makeRequest, isLoading, error } = useFetch();
  const [companyLeads, setCompanyLeads] = useState<CompanyLead[]>([]);
  const [offsetLimits, setOffsetLimits] = useState({
    offset: 0,
    limit: 8,
  });
  const [hasMore, setHasMore] = useState(false);

  useEffect(() => {
    if (ctx?.user.company_id) {
      const qs = new URLSearchParams({
        offset: String(offsetLimits.offset),
        limit: String(offsetLimits.limit),
      });

      makeRequest(
        { url: `${COMPANY_ROUTE}/${ctx?.user.company_id}/leads/?` + qs },
        (res) => {
          setHasMore(() => res.data.data.length === 8);
          setCompanyLeads((prev) => [...prev, ...res.data.data]);
        }
      );
    }
  }, [makeRequest, ctx?.user.company_id, offsetLimits]);

  function handleLoadMore() {
    setOffsetLimits((prev) => {
      return {
        offset: prev.offset + prev.limit,
        limit: 8,
      };
    });
  }

  return (
    <Layout>
      <div className="flex flex-col min-w-full justify-center items-center">
        <LeadsTable companyLeads={companyLeads} />
        {hasMore && (
          <div className="py-4">
            <Button disabled={isLoading} onClick={() => handleLoadMore()}>
              Load More
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};
export default CompanyLeads;
