import { useContext } from "react";
import PrintIcon from "../../assets/PrintIcon";
import InvoiceDescription from "../../components/InvoiceDescription";
import { UserContext } from "../../context/UserContext";
import { Invoice } from "../../types/general";

interface Props {
  invoice: Invoice;
}

export default function InvoiceDetail({ invoice }:Props) {
  const ctx = useContext(UserContext);
  return (
    <div className="bg-gray-100">
      <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden xl:max-w-4xl mx-auto print:shadow-none">
        <div className="p-5 lg:p-6 grow w-full print:p-0">
          <div className="lg:w-10/12 mx-auto print:w-full">
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-8 py-10 print:grid-cols-2">
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
            </div>

            <div className="border border-gray-100 rounded overflow-x-auto min-w-full bg-white">
              <table className="min-w-full text-sm align-middle whitespace-nowrap">
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
              </table>
            </div>

            <p className="text-sm text-gray-500 text-center py-10">
              Thank you for doing business with us.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
