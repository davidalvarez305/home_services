import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const LeadsDetail: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="LeadsDetail">
      <div>LeadsDetail</div>
    </PrimaryLayout>
  );
};
export default LeadsDetail;
