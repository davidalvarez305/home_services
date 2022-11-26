import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLeadAuth from "../../../hooks/useLeadAuth";

const Dashboard: React.FC = () => {
  useLeadAuth();

  return (
    <PrimaryLayout screenName="Dashboard">
      <div>Dashboard</div>
    </PrimaryLayout>
  );
};
export default Dashboard;
