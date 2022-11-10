import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const RateCompany: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="RateCompany">
      <div>RateCompany</div>
    </PrimaryLayout>
  );
};
export default RateCompany;
