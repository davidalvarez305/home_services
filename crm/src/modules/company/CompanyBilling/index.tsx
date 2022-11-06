import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const CompanyBilling: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="CompanyBilling">
      <div>CompanyBilling</div>
    </PrimaryLayout>
  );
};
export default CompanyBilling;
