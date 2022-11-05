import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const CompanyDetail: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Company Detail">
      <div>company detail</div>
    </PrimaryLayout>
  );
};
export default CompanyDetail;
