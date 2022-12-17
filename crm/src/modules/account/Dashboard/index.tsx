import React, { useContext } from "react";
import useAccountRequired from "../../../hooks/useAccountRequired";
import useFetch from "../../../hooks/useFetch";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import Layout from "../../../components/Layout";
import UserAccountSettings from "./UserAccountSettings";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import LeadInformationSettings from "./LeadInformationSettings";
import UploadPhotos from "./UploadPhotos";

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
          <UploadPhotos />
        </div>
      )}
      <RequestErrorMessage {...error} />
    </Layout>
  );
};
export default Dashboard;
