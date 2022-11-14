import React, { useCallback, useContext, useEffect, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/table";
import DeleteButton from "../../../components/DeleteIconButton";
import styles from "./CompanyServices.module.css";
import FormSelect from "../../../components/FormSelect";
import { Form, Formik } from "formik";
import Button from "../../../components/Button";
import { Button as ChakraButton } from "@chakra-ui/react";
import SelectMultipleModal from "../../../components/SelectMultipleModal";
import useFetch from "../../../hooks/useFetch";
import { COMPANY_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import { CompanyServicesByArea } from "../../../types/general";

const CompanyServices: React.FC = () => {
  useLoginRequired();
  const ctx = useContext(UserContext);
  const [toggleZipCodes, setToggleZipCodes] = useState(false);
  const [filteredAreas, setFilteredAreas] = useState<CompanyServicesByArea[]>(
    []
  );
  const [multipleSelectModal, setMultipleSelectModal] = useState(false);
  const { makeRequest, isLoading, error } = useFetch();
  const [services, setServices] = useState<CompanyServicesByArea[]>([]);

  const fetchServices = useCallback(() => {
    makeRequest({
      
    })
  }, [makeRequest])

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url: COMPANY_ROUTE + `/${ctx?.user.company_id}/service`,
        },
        (res) => {
          setServices(res.data.data);
        }
      );
    }
  }, [makeRequest, ctx?.user.company_id]);

  if (toggleZipCodes) {
    return (
      <PrimaryLayout screenName="Company Services">
        <Table>
          <Thead>
            <Tr>
              {["City", "Zip Code"].map((header) => (
                <Td key={header}>{header}</Td>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {filteredAreas.map((location, index) => (
              <Tr key={index}>
                <Td>{location.city}</Td>
                <Td>
                  <div className={styles["zip-code-container"]}>
                    <div>{location.zip_code}</div>
                    <DeleteButton aria-label={"remove"} />
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PrimaryLayout>
    );
  }

  return (
    <PrimaryLayout screenName="Company Services">
      <div className={styles["main-container"]}>
        <Table>
          <Thead>
            <Tr>
              {["Service", "Locations"].map((header) => (
                <Td key={header}>{header}</Td>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {services.map((row, index) => (
              <Tr key={index}>
                <Td>{row.service}</Td>
                <Td>
                  <ChakraButton
                    onClick={() => {
                      setFilteredAreas(() => {
                        const service = services.filter(
                          (each) => each.service === row.service
                        );
                        return service;
                      });
                      setToggleZipCodes((prev) => !prev);
                    }}
                    variant={"outline"}
                    colorScheme={"teal"}
                  >
                    See
                  </ChakraButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Formik
          initialValues={{ service: "" }}
          onSubmit={() => {
            console.log("submitted");
          }}
        >
          {({ values }) => (
            <Form>
              <div className={styles["add-service"]}>
                <FormSelect
                  name={"service"}
                  options={[
                    { value: 1, label: "Roofing" },
                    { value: 2, label: "Floor Installation" },
                  ]}
                />
                <Button
                  onClick={() => {
                    if (values.service.length === 0) return;
                    setMultipleSelectModal(true);
                  }}
                  className={"Dark"}
                >
                  Add
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {multipleSelectModal && (
        <SelectMultipleModal
          selectMultipleModal={multipleSelectModal}
          setSelectMultipleModal={setMultipleSelectModal}
          handleSubmit={(values) => console.log("submit: ", values)}
          options={[
            { value: 10, label: "Hialeah" },
            { value: 20, label: "Miami" },
          ]}
        />
      )}
    </PrimaryLayout>
  );
};
export default CompanyServices;
