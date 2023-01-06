import React, { useContext, useEffect, useState } from "react";
import InvoicesTable from "../../components/InvoicesTable";
import PrimaryLayout from "../../components/Layout";
import { COMPANY_ROUTE } from "../../constants";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import useLoginRequired from "../../hooks/useLoginRequired";
import { Invoice } from "../../types/general";

export default function CompanyInvoices() {
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(UserContext);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  useLoginRequired();

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url: `${COMPANY_ROUTE}/${ctx.user.company_id}/invoice`,
        },
        (res) => {
          setInvoices(res.data.data);
        }
      );
    }
  }, [ctx?.user.company_id, makeRequest]);

  return (
    <PrimaryLayout>
      <InvoicesTable invoices={invoices} />
    </PrimaryLayout>
  );
}
