import { useToast } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useContext, useEffect, useState } from "react";
import BlueLockIcon from "../../assets/BlueLockIcon";
import Button from "../../components/Button";
import CustomSelect from "../../components/CustomSelect";
import FormInput from "../../components/FormInput";
import LargeFormSection from "../../components/LargeFormSection";
import RequestErrorMessage from "../../components/RequestErrorMessage";
import { LEAD_ROUTE, SERVICE_ROUTE } from "../../constants";
import { LeadContext } from "../../context/LeadContext";
import useFetch from "../../hooks/useFetch";
import { Lead, LeadDetails, Service } from "../../types/general";

interface Props {
  lead: LeadDetails;
}

export default function LeadInformationSettings({ lead }: Props) {
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(LeadContext);
  const toast = useToast();
  const [services, setServices] = useState<Service[]>([]);
  const [defaultService, setDefaultService] = useState<Service>({
    id: 0,
    service: "",
  });

  useEffect(() => {
    makeRequest({ url: SERVICE_ROUTE }, (res) => {
      setServices(res.data.data);

      for (let i = 0; i < res.data.data.length; i++) {
        const service = res.data.data[i] as Service;
        if (service.id === lead.service_id) {
          setDefaultService(service);
          break;
        }
      }
    });
  }, [makeRequest, lead.service_id]);

  function handleSubmit(values: LeadDetails) {
    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead.id}`,
        method: "PUT",
        data: {
            ...values,
            service_id: parseInt(String(values.service_id))
        },
      },
      (res) => {
        ctx?.SetLead(res.data.data);

        toast({
          title: "Success!",
          description: "Account settings have been updated.",
          status: "success",
          duration: 3000,
          isClosable: true,
        });
      }
    );
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
            {({ setFieldValue }) => (
              <Form>
                <div className="space-y-6">
                  <FormInput
                    className={inputClass}
                    name={"street_address_line_1"}
                    label={"Street Address Line 1"}
                    type={"text"}
                  />
                  <FormInput
                    className={inputClass}
                    name={"street_address_line_2"}
                    label={"Street Address Line 2"}
                    type={"text"}
                  />
                  <FormInput
                    className={inputClass}
                    name={"street_address_line_3"}
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
                      <CustomSelect
                        defaultValue={defaultService.id}
                        name={"service_id"}
                        label={"Service"}
                      >
                        {services.map((service) => (
                          <option key={service.id} value={service.id}>
                            {service.service}
                          </option>
                        ))}
                      </CustomSelect>
                    </div>
                  </div>
                  <Button type="submit" disabled={isLoading}>
                    Save Changes
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
        <RequestErrorMessage {...error} />
      </div>
    </div>
  );
}
