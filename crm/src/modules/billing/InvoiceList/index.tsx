import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const InvoiceList: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Invoices">
      <div>Invoices</div>
    </PrimaryLayout>
  );
};
export default InvoiceList;
