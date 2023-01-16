import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { Invoice } from "../types/general";
import TableDateComponent from "./TableDateComponent";
import { AiOutlineDownload } from "react-icons/ai";
import Button from "./Button";
import * as XLSX from "xlsx";
import InvoiceDetail from "../modules/company/InvoiceDetail";
import { GrDocumentPdf } from "react-icons/gr";
import InvoiceModal from "./InvoiceModal";

interface Props {
  invoices: Invoice[];
}

export default function InvoicesTable({ invoices }: Props) {
  const [openInvoiceModal, setOpenInvoiceModal] = useState(false);
  const [invoice, setInvoice] = useState<Invoice>();
  const INVOICE_TABLE_HEADERS = [
    "Invoice Amount",
    "Due Date",
    "Payment Status",
    "Qty. of Leads",
    "Download",
    "PDF",
  ];

  function handleDownloadFile(invoice: Invoice) {
    const leads = invoice.leads.map((lead) => {
      const {
        budget,
        created_at,
        address: { zip_code },
        service: { service },
      } = lead;
      return { budget, created_at, zip_code, service };
    });

    const results = XLSX.utils.json_to_sheet(leads);
    const path = `${invoice.invoice_id}.csv`;

    var blob = new File([XLSX.utils.sheet_to_csv(results)], path, {
      type: "text/csv",
    });
    var url = URL.createObjectURL(blob);

    var a = document.createElement("a");
    a.href = url;
    a.download = path;

    a.click();
  }

  return (
    <div className="border border-gray-200 rounded overflow-x-auto min-w-full bg-white">
      <table className="min-w-full text-sm align-middle whitespace-nowrap">
        <thead>
          <tr>
            {INVOICE_TABLE_HEADERS.map((header) => (
              <th
                key={header}
                className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center"
              >
                <div className="flex justify-center items-center gap-1">
                  {header}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {invoices.map((invoice, index) => (
            <tr
              className={index % 2 !== 0 ? "bg-gray-50" : ""}
              key={invoice.invoice_id}
            >
              <td key={uuidv4()} className="p-3 text-center">
                <p className="font-medium text-black">{invoice.invoice_amount}</p>
              </td>
              <TableDateComponent date={invoice.invoice_due_date} />
              <td key={uuidv4()} className="p-3 text-center">
                <p className="font-medium text-black">
                  {invoice.invoice_payment_status_id}
                </p>
              </td>
              <td key={uuidv4()} className="p-3 text-center">
                <p className="font-medium text-black">{`${invoice.leads.length} Leads`}</p>
              </td>
              <td key={uuidv4()} className="p-3 text-center">
                <Button
                  onClick={() => {
                    if (invoice.leads) {
                      handleDownloadFile(invoice);
                    }
                  }}
                >
                  <AiOutlineDownload />
                  <div
                    style={{ display: "none" }}
                    id={`${invoice.invoice_id}-json`}
                  ></div>
                </Button>
              </td>
              <td className="p-3 text-center">
                <button
                  type="button"
                  className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-gray-200 bg-gray-200 text-gray-700 hover:text-gray-700 hover:bg-gray-300 hover:border-gray-300 focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-gray-200 active:border-gray-200"
                  onClick={() => {
                    setInvoice(invoice);
                    setOpenInvoiceModal(true);
                  }}
                >
                  <GrDocumentPdf />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {openInvoiceModal && invoice && (
        <InvoiceModal isOpen={openInvoiceModal} setIsOpen={setOpenInvoiceModal}>
          <InvoiceDetail invoice={invoice} />
        </InvoiceModal>
      )}
    </div>
  );
}
