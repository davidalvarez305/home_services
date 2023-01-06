import React from "react";
import { v4 as uuidv4 } from "uuid";
import { Invoice } from "../types/general";
import TableDateComponent from "./TableDateComponent";

interface Props {
  invoices: Invoice[];
}
export default function InvoicesTable({ invoices }:Props) {
  console.log('invoices: ', invoices);
    const INVOICE_TABLE_HEADERS = ["Invoice Amount", "Due Date", "Payment Status", "Qty. of Leads"]
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
            <tr className={index % 2 !== 0 ? "bg-gray-50" : ""} key={invoice.invoice_id}>
              <td key={uuidv4()} className="p-3 text-center">
                <p className="font-medium">
                    {invoice.invoice_amount}
                </p>
              </td>
              <TableDateComponent date={invoice.invoice_due_date} />
              <td key={uuidv4()} className="p-3 text-center">
                <p className="font-medium">
                    {invoice.invoice_payment_status_id}
                </p>
              </td>
              <td key={uuidv4()} className="p-3 text-center">
                <p className="font-medium">
                    {`${invoice.leads.length} leads`}
                </p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
