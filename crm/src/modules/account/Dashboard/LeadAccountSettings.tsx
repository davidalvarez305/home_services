import { useToast } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useContext } from "react";
import UserProfileIcon from "../../../assets/UserProfileIcon";
import Button from "../../../components/Button";
import FormInput from "../../../components/FormInput";
import LargeFormSection from "../../../components/LargeFormSection";
import RequestErrorMessage from "../../../components/RequestErrorMessage";
import { LEAD_ROUTE } from "../../../constants";
import { LeadContext } from "../../../context/LeadContext";
import useFetch from "../../../hooks/useFetch";
import { LeadDetails } from "../../../types/general";

interface Props {
  lead: LeadDetails;
}

export default function LeadAccountSettings({ lead }: Props) {
  const { makeRequest, isLoading, error } = useFetch();
  const ctx = useContext(LeadContext);
  const toast = useToast();

  function handleSubmit(values: LeadDetails) {

    // In this case, service has to be set to service_id because that's what the server expects.

    makeRequest(
      {
        url: `${LEAD_ROUTE}/${ctx?.lead?.id}`,
        method: "PUT",
        data: {
          ...values,
          service: values.service_id,
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

  const inputClassName =
    "block border border-gray-200 rounded px-3 py-2 leading-6 w-full focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

  return (
    <div className="md:flex md:space-x-5">
      <LargeFormSection
        icon={<UserProfileIcon />}
        iconHeader={"User Profile"}
        paragraphText={
          "Your account’s vital info. Only your username and photo will be publicly visible."
        }
      />
      <div className="flex flex-col rounded shadow-sm bg-white overflow-hidden md:w-2/3">
        <div className="p-5 lg:p-6 grow w-full">
          <Formik
            initialValues={lead}
            onSubmit={handleSubmit}
          >
            <Form>
              <div className="space-y-6">
                <div className="space-y-6 sm:space-y-0 sm:flex sm:space-x-3">
                  <div className="space-y-1 grow">
                    <FormInput
                      className={inputClassName}
                      name={"first_name"}
                      label={"First Name"}
                      type={"text"}
                    />
                  </div>
                  <div className="space-y-1 grow">
                    <FormInput
                      className={inputClassName}
                      name={"last_name"}
                      label={"Last Name"}
                      type={"text"}
                    />
                  </div>
                </div>
                <div className="space-y-6 sm:space-y-0 sm:flex sm:space-x-3">
                  <div className="space-y-1 grow">
                    <FormInput
                      name={"email"}
                      label={"Email"}
                      type={"email"}
                      className={inputClassName}
                    />
                  </div>
                  <div className="space-y-1 grow">
                    <FormInput
                      className={inputClassName}
                      name={"phone_number"}
                      label={"Phone Number"}
                      type={"tel"}
                    />
                  </div>
                </div>
                <Button type="submit" disabled={isLoading}>
                  Update Profile
                </Button>
              </div>
            </Form>
          </Formik>
        </div>
        <RequestErrorMessage {...error} />
      </div>
    </div>
  );
}
