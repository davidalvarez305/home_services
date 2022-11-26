import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const Dashboard: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Dashboard">
      <div>Dashboard</div>
    </PrimaryLayout>
  );
};
export default Dashboard;
