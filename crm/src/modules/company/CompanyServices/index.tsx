import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const CompanyServices: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Company Services">
      <div>company services</div>
    </PrimaryLayout>
  );
};
export default CompanyServices;
