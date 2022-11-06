import React from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";

const InvoiceDetail: React.FC = () => {
  useLoginRequired();

  return (
    <PrimaryLayout screenName="Invoice Detail">
      <div>Invoice Detail</div>
    </PrimaryLayout>
  );
};
export default InvoiceDetail;
