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
  const ctx = useContext(LeadContext);
  const { makeRequest, error } = useFetch();
  useAccountRequired();

  function handleLogout() {
    ctx?.Logout();
  }

  function handleDeleteLead() {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead?.id}`,
        method: "DELETE",
      },
      (_) => {
        handleLogout();
      }
    );
  }

  return (
    <Layout>
      {ctx?.lead && (
        <div className="space-y-8">
          <UserAccountSettings lead={ctx.lead} />
          <LeadInformationSettings lead={ctx.lead} />
        </div>
      )}
      <RequestErrorMessage {...error} />
    </Layout>
  );
};
export default Dashboard;
