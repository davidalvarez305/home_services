import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const CompanyLeads: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Company Leads">
      <div>company leads</div>
    </PrimaryLayout>
  );
};
export default CompanyLeads;
