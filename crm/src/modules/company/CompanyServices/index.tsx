import React, { useCallback, useContext, useEffect, useState } from "react";
import PrimaryLayout from "../../../components/Layout";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/table";
import DeleteButton from "../../../components/DeleteIconButton";
import styles from "./CompanyServices.module.css";
import FormSelect from "../../../components/FormSelect";
import { Form, Formik } from "formik";
import Button from "../../../components/Button";
import { Button as ChakraButton, useToast } from "@chakra-ui/react";
import SelectMultipleModal from "../../../components/SelectMultipleModal";
import useFetch from "../../../hooks/useFetch";
import { COMPANY_ROUTE, SERVICE_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import {
  CompanyServicesByArea,
  Service,
  Location,
  CompanyServiceLocations,
  ZipCode,
} from "../../../types/general";
import { SelectType } from "../../../components/MultiFormSelect";
import { createServices } from "../../../utils/createServices";
import RequestErrorMessage from "../../../components/RequestErrorMessage";

const CompanyServices: React.FC = () => {
  useLoginRequired();
  const ctx = useContext(UserContext);
  const toast = useToast();
  const [toggleZipCodes, setToggleZipCodes] = useState(false);
  const [filteredAreas, setFilteredAreas] = useState<CompanyServicesByArea[]>(
    []
  );
  const [filterService, setFilterService] = useState("");
  const [multipleSelectModal, setMultipleSelectModal] = useState(false);
  const { makeRequest, isLoading, error } = useFetch();
  const [serviceAreas, setServiceAreas] = useState<CompanyServicesByArea[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [uniqueCompanyServices, setUniqueCompanyServices] = useState<string[]>(
    []
  );

  function adjustData(serviceAreas: CompanyServicesByArea[]) {
    const unique = [
      ...new Set(serviceAreas.map((location) => location.service)),
    ] as string[];
    setUniqueCompanyServices(unique);
    setServiceAreas(serviceAreas);
  }

  const fetchServices = useCallback(() => {
    makeRequest(
      {
        url: SERVICE_ROUTE,
      },
      (res) => {
        setServices(res.data.data);
      }
    );
  }, [makeRequest]);

  useEffect(() => {
    if (ctx?.user.company_id) {
      makeRequest(
        {
          url: COMPANY_ROUTE + `/${ctx?.user.company_id}/service`,
        },
        (res) => {
          adjustData(res.data.data);
        }
      );
    }

    // Fetch all services
    fetchServices();
  }, [makeRequest, ctx?.user.company_id, fetchServices]);

  function handleDeleteLocation(location: CompanyServicesByArea) {
    makeRequest(
      {
        url: COMPANY_ROUTE + `/${ctx?.user.company_id}/location`,
        method: "DELETE",
        data: [
          {
            id: location.id,
            service_id: location.service_id,
            company_id: ctx?.user.company_id,
            zip_code: location.zip_code,
          },
        ],
      },
      (res) => {
        adjustData(res.data.data);
        setToggleZipCodes(false);

        // This updates the filtered locations by using the state in the "clicked" service.
        if (filterService.length > 0) {
          setFilteredAreas(() => {
            const data: CompanyServicesByArea[] = res.data.data;
            const service = data.filter(
              (each) => each.service === filterService
            );
            return service;
          });
        }
      }
    );
  }
  function handleMultipleDeleteLocation(service: string) {
    const locations = serviceAreas.filter((serviceArea) => serviceArea.service === service);

    const { company_id } = ctx!.user;
    const payload: CompanyServiceLocations[] = locations.map(
      ({ id, service_id, zip_code }) => {
        // Build payload
        return { id, company_id, service_id, zip_code };
      }
    );

    makeRequest(
      {
        url: COMPANY_ROUTE + `/${ctx?.user.company_id}/location`,
        method: "DELETE",
        data: payload,
      },
      (res) => {
        adjustData(res.data.data);
        setToggleZipCodes(false);

        // This updates the filtered locations by using the state in the "clicked" service.
        if (filterService.length > 0) {
          setFilteredAreas(() => {
            const data: CompanyServicesByArea[] = res.data.data;
            const service = data.filter(
              (each) => each.service === filterService
            );
            return service;
          });
        }
      }
    );
  }

  function handleSubmit(values: {
    service: number;
    locations: SelectType[];
    service_areas: ZipCode[];
  }) {
    makeRequest(
      {
        url: COMPANY_ROUTE + `/${ctx?.user.company_id}/service`,
        method: "POST",
        data: createServices(values, ctx!.user.company_id),
      },
      (res) => {
        setServiceAreas(res.data.data);
        setMultipleSelectModal(false);
        toast({
          title: "Success!",
          description: "Services have been added to the chosen locations.",
          status: "success",
          isClosable: true,
          duration: 5000,
          variant: "left-accent",
        });
      }
    );
  }

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
                    <DeleteButton
                      aria-label={"remove"}
                      onClick={() => handleDeleteLocation(location)}
                    />
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
            {uniqueCompanyServices.map((service, index) => (
              <Tr key={index}>
                <Td>{service}</Td>
                <Td>
                  <div className={styles["zip-code-container"]}>
                    <ChakraButton
                      onClick={() => {
                        setFilterService(service);
                        setFilteredAreas(() => {
                          const services = serviceAreas.filter(
                            (each) => each.service === service
                          );
                          return services;
                        });
                        setToggleZipCodes((prev) => !prev);
                      }}
                      variant={"outline"}
                      colorScheme={"teal"}
                    >
                      See
                    </ChakraButton>
                    <DeleteButton
                      aria-label={"remove"}
                      onClick={() => handleMultipleDeleteLocation(service)}
                      isLoading={isLoading}
                    />
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Formik
          initialValues={{ service: 0, locations: [], service_areas: [] }}
          onSubmit={(values) => {
            handleSubmit(values);
          }}
        >
          {({ values }) => (
            <Form>
              <div className={styles["add-service"]}>
                <FormSelect
                  name={"service"}
                  options={services.map((service) => {
                    return { value: service.id, label: service.service };
                  })}
                />
                <RequestErrorMessage {...error} />
                <Button
                  onClick={() => {
                    if (!values.service) return;
                    setMultipleSelectModal(true);
                  }}
                  className={"Dark"}
                >
                  Add
                </Button>
              </div>
              {multipleSelectModal && (
                <SelectMultipleModal
                  selectMultipleModal={multipleSelectModal}
                  setSelectMultipleModal={setMultipleSelectModal}
                />
              )}
            </Form>
          )}
        </Formik>
      </div>
    </PrimaryLayout>
  );
};
export default CompanyServices;
