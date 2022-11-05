import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const CompanyUsers: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Company Users">
      <div>company users</div>
    </PrimaryLayout>
  );
};
export default CompanyUsers;
