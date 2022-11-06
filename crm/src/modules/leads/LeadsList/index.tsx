import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const LeadsList: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Leads List">
      <div>Leads List</div>
    </PrimaryLayout>
  );
};
export default LeadsList;
