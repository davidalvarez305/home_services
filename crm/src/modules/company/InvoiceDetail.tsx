import { useRouter } from "next/router";
import { useContext, useEffect, useState } from "react";
import PrintIcon from "../../assets/PrintIcon";
import InvoiceDescription from "../../components/InvoiceDescription";
import { COMPANY_ROUTE } from "../../constants";
import { UserContext } from "../../context/UserContext";
import useFetch from "../../hooks/useFetch";
import { Invoice } from "../../types/general";

export default function InvoiceDetail() {
  const ctx = useContext(UserContext);
  const [invoice, setInvoice] = useState<Invoice>();
  const { makeRequest, error, isLoading } = useFetch();
  const router = useRouter();

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url: `${COMPANY_ROUTE}/1/invoice/${router.query.invoice}`,
        },
        (res) => {
          setInvoice(res.data.data);
        }
      );
    }
  }, [ctx?.user.company_id, makeRequest, router.query.invoice]);

  if (!invoice) {
    return (
      <div className="h-screen w-full bg-gray-100 flex flex-col justify-center items-center">
        <div className="flex flex-col w-full rounded shadow-sm bg-white overflow-hidden xl:max-w-4xl mx-auto print:shadow-none">
          <div className="p-5 lg:p-6 grow w-full print:p-0">
            <div className="lg:w-10/12 mx-auto print:w-full">
              <p className="text-sm text-gray-500 text-center py-10">
                Invoice not found.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-100">
      {/* Invoice */}
      <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden xl:max-w-4xl mx-auto print:shadow-none">
        <div className="p-5 lg:p-6 grow w-full print:p-0">
          <div className="lg:w-10/12 mx-auto print:w-full">
            {/* Invoice Header */}
            <div className="flex justify-between items-center py-10 border-b border-gray-100 print:pt-0">
              <h3 className="font-semibold">{invoice.payment_status.status}</h3>
              <div className="print:hidden">
                <button
                  type="button"
                  className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-gray-200 bg-gray-200 text-gray-700 hover:text-gray-700 hover:bg-gray-300 hover:border-gray-300 focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:bg-gray-200 active:border-gray-200"
                >
                  <PrintIcon />
                  <span>Print</span>
                </button>
              </div>
            </div>
            {/* END Invoice Header */}

            {/* Invoice Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 py-10 print:grid-cols-2">
              {/* Company Info */}
              <div>
                <div className="text-lg font-semibold mb-1">FindAPro.gg</div>
                <address className="text-sm text-gray-500">
                  Street Address 1234
                  <br />
                  Hialeah, Florida
                  <br />
                  33015
                  <br />
                  david@southfloridaathleticclub.com
                </address>
              </div>
              {/* END Company Info */}

              {/* Client Info */}
              <div className="md:text-right print:text-right">
                <div className="text-lg font-semibold mb-1">
                  {invoice.company.name}
                </div>
                <address className="text-sm text-gray-500">
                  {invoice.company.address.street_address_line_1}
                  <br />
                  {`${invoice.company.address.city.city}, ${invoice.company.address.state.state}`}
                  <br />
                  {invoice.company.address.zip_code}
                  <br />
                  {ctx?.user.email}
                </address>
              </div>
              {/* END Client Info */}
            </div>
            {/* END Invoice Info */}

            {/* Responsive Table Container */}
            <div className="border border-gray-100 rounded overflow-x-auto min-w-full bg-white">
              {/* Bordered Table */}
              <table className="min-w-full text-sm align-middle whitespace-nowrap">
                {/* Table Header */}
                <thead>
                  <tr className="border-b border-gray-100">
                    <th className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-left">
                      Product
                    </th>
                    <th className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center">
                      Qnt
                    </th>
                    <th className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-right">
                      Price Agreement
                    </th>
                  </tr>
                </thead>
                {/* END Table Header */}

                {/* Table Body */}
                <tbody>
                  <tr className="border-b border-gray-100">
                    <td className="p-3">
                      <p className="font-semibold mb-1">Leads Generated</p>
                      <InvoiceDescription dueDate={invoice.invoice_due_date} />
                    </td>
                    <td className="p-3 text-center">
                      <div className="text-sm rounded text-blue-700 bg-blue-200 font-semibold inline-flex px-2 py-1 leading-4">
                        {invoice.leads.length}
                      </div>
                    </td>
                    <td className="p-3 text-right">{`$${invoice.company.price_agreement}`}</td>
                  </tr>
                  <tr>
                    <td
                      colSpan={2}
                      className="p-3 font-bold uppercase text-right bg-gray-50"
                    >
                      Total Due
                    </td>
                    <td className="p-3 font-semibold text-right bg-gray-50">
                      ${invoice.company.price_agreement * invoice.leads.length}
                    </td>
                  </tr>
                </tbody>
                {/* END Table Body */}
              </table>
              {/* END Bordered Table */}
            </div>
            {/* END Responsive Table Container */}

            {/* Footer */}
            <p className="text-sm text-gray-500 text-center py-10">
              Thank you for doing business with us.
            </p>
            {/* END Footer */}
          </div>
        </div>
      </div>
      {/* END Invoice */}
    </div>
  );
}
