import { Form } from "formik";
import CustomSelect from "../../components/CustomSelect";
import FormInput from "../../components/FormInput";

export default function CompanyForm() {
  const inputClassName =
    "block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";
  return (
    <Form>
      <div className="space-y-6">
        <div className="space-y-6 sm:space-y-0 sm:flex sm:space-x-3">
          <div className="space-y-1 grow">
            <FormInput
              className={inputClassName}
              label="Company Name"
              name="name"
              placeholder="Company, Inc"
            />
          </div>
          <div className="space-y-1 grow">
            <FormInput
              className={inputClassName}
              label="Company Logo"
              name="logo"
              placeholder="Logo URL"
              type="url"
            />
          </div>
          <div className="space-y-1 grow">
            <FormInput
              className={inputClassName}
              label="Street Address Line 1"
              name="street_address_line_1"
              placeholder="Address Line 1..."
            />
          </div>
          <div className="space-y-1 grow">
            <FormInput
              className={inputClassName}
              label="Street Address Line 2"
              name="street_address_line_2"
              placeholder="Address Line 2..."
            />
          </div>
          <div className="space-y-1 grow">
            <FormInput
              className={inputClassName}
              label="Street Address Line 3"
              name="street_address_line_3"
              placeholder="Address Line 3..."
            />
          </div>
        </div>
        <div>
          <CustomSelect name="zip_code" label={"Zip Code"}>
            {[
              { label: "", value: 0 },
              { label: "33015", value: 1 },
              { label: "33012", value: 2 },
            ].map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </CustomSelect>
          <CustomSelect name="city" label={"City"}>
            {[
              { label: "", value: 0 },
              { label: "miami", value: 1 },
              { label: "hialeah", value: 2 },
            ].map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </CustomSelect>
          <CustomSelect name="state" label={"State"}>
            {[
              { label: "", value: 0 },
              { label: "florida", value: 1 },
              { label: "georgia", value: 2 },
            ].map((option) => (
              <option key={option.label} value={option.value}>
                {option.label}
              </option>
            ))}
          </CustomSelect>
        </div>
      </div>
    </Form>
  );
}
