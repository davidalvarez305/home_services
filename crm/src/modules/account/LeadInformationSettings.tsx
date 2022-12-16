import BlueLockIcon from "../../assets/BlueLockIcon";
import LargeFormSection from "../../components/LargeFormSection";
import { Lead } from "../../types/general";

interface Props {
  lead: Lead;
}

export default function LeadInformationSettings({ lead }: Props) {
  return (
    <div className="md:flex md:space-x-5">
      <LargeFormSection
        icon={<BlueLockIcon />}
        iconHeader={"Billing Information"}
        paragraphText={
          "Your billing information is never shown to other users and only used for creating your invoices."
        }
      />

      <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
        <div className="p-5 lg:p-6 grow w-full">
          <form className="space-y-6">
            <div className="space-y-1">
              <label htmlFor="billing_address1" className="font-medium">
                Street Address 1
              </label>
              <input
                className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                type="text"
                id="billing_address1"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="billing_address2" className="font-medium">
                Street Address 2
              </label>
              <input
                className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                type="text"
                id="billing_address2"
              />
            </div>
            <div className="space-y-1">
              <label htmlFor="billing_address3" className="font-medium">
                Street Address 3
              </label>
              <input
                className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                type="text"
                id="billing_address3"
              />
            </div>
            <div className="space-y-6 sm:space-y-0 sm:flex sm:space-x-3">
              <div className="space-y-1 sm:w-1/3">
                <label htmlFor="billing_postal" className="font-medium">
                  Zip Code
                </label>
                <input
                  className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  type="text"
                  id="billing_postal"
                />
              </div>
              <div className="space-y-1 sm:w-1/3">
                <label htmlFor="billing_postal" className="font-medium">
                  Service
                </label>
                <input
                  className="block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
                  type="text"
                  id="billing_postal"
                />
              </div>
            </div>
            <button
              type="submit"
              className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
            >
              Save Changes
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
