import React from "react";
import PrimaryLayout from "../../../components/Layout";
import useLoginRequired from "../../../hooks/useLoginRequired";

const BillingSettings: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Billing Settings">
      <div>Billing Settings</div>
    </PrimaryLayout>
  );
};
export default BillingSettings;
