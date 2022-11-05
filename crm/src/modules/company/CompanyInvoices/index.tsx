import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const CompanyInvoices: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Company Invoices">
      <div>company invoices</div>
    </PrimaryLayout>
  );
};
export default CompanyInvoices;
