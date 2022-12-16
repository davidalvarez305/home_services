import { Form, Formik } from "formik";
import BlueLockIcon from "../../assets/BlueLockIcon";
import CustomSelect from "../../components/CustomSelect";
import FormInput from "../../components/FormInput";
import FormSelect from "../../components/FormSelect";
import LargeFormSection from "../../components/LargeFormSection";
import { Lead } from "../../types/general";

interface Props {
  lead: Lead;
}

export default function LeadInformationSettings({ lead }: Props) {
  function handleSubmit(values: Lead) {
    console.log(values);
  }

  const inputClass =
    "block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

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
          <Formik initialValues={lead} onSubmit={handleSubmit}>
            <Form>
              <div className="space-y-6">
                <FormInput
                  className={inputClass}
                  name={"street_address_line1"}
                  label={"Street Address Line 1"}
                  type={"text"}
                />
                <FormInput
                  className={inputClass}
                  name={"street_address_line2"}
                  label={"Street Address Line 2"}
                  type={"text"}
                />
                <FormInput
                  className={inputClass}
                  name={"street_address_line3"}
                  label={"Street Address Line 3"}
                  type={"text"}
                />
                <div className="space-y-6 sm:space-y-0 sm:flex sm:space-x-3">
                  <div className="space-y-1 sm:w-1/3">
                    <FormInput
                      className={inputClass}
                      name={"zip_code"}
                      label={"Zip Code"}
                      type={"text"}
                    />
                  </div>
                  <div className="space-y-1 sm:w-1/3">
                    <CustomSelect name={'service_id'} label={'Service'}>
                        <option value={1}>Vue.js</option>
                        <option value={2}>React.js</option>
                    </CustomSelect>
                  </div>
                </div>
                <button
                  type="submit"
                  className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
                >
                  Save Changes
                </button>
              </div>
            </Form>
          </Formik>
        </div>
      </div>
    </div>
  );
}
