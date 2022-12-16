import React, { useContext, useEffect, useState } from "react";
import useAccountRequired from "../../../hooks/useAccountRequired";
import useFetch from "../../../hooks/useFetch";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import { LeadDetails } from "../../../types/general";
import Layout from "../../../components/Layout";
import UserAccountSettings from "../UserAccountSettings";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LeadInformationSettings from "../LeadInformationSettings";

const Dashboard: React.FC = () => {
  const [leadDetails, setLeadDetails] = useState<LeadDetails>();
  const ctx = useContext(LeadContext);
  const { makeRequest, error } = useFetch();
  useAccountRequired();

  function handleLogout() {
    ctx?.Logout();
  }

  useEffect(() => {
    if (ctx?.lead.id) {
      makeRequest(
        {
          url: `${LEAD_ROUTE}/${ctx?.lead.id}`,
        },
        (res) => {
          setLeadDetails(res.data.data);
        }
      );
    }
  }, [makeRequest, ctx?.lead.id]);

  function handleDeleteLead() {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead.id}`,
        method: "DELETE",
      },
      (_) => {
        handleLogout();
      }
    );
  }

  return (
    <Layout>
      {leadDetails && (
        <div className="space-y-8">
          <UserAccountSettings lead={leadDetails} />
          <LeadInformationSettings lead={leadDetails} />
        </div>
      )}
      <RequestErrorMessage {...error} />
    </Layout>
  );
};
export default Dashboard;
