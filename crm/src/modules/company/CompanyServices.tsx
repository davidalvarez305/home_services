import React, { useCallback, useContext, useEffect, useState } from "react";
import PrimaryLayout from "../../components/Layout";
import useLoginRequired from "../../hooks/useLoginRequired";
import DeleteButton from "../../components/DeleteIconButton";
import { Form, Formik } from "formik";
import Button from "../../components/Button";
import { useToast } from "@chakra-ui/react";
import SelectMultipleModal from "../../components/SelectMultipleModal";
import useFetch from "../../hooks/useFetch";
import { COMPANY_ROUTE, SERVICE_ROUTE } from "../../constants";
import { UserContext } from "../../context/UserContext";
import {
  CompanyServicesByArea,
  Service,
  CompanyServiceLocations,
  ZipCode,
} from "../../types/general";
import { SelectType } from "../../components/MultiFormSelect";
import { createServices } from "../../utils/createServices";
import RequestErrorMessage from "../../components/RequestErrorMessage";
import { v4 as uuidv4 } from "uuid";
import CustomSelect from "../../components/CustomSelect";

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
    const locations = serviceAreas.filter(
      (serviceArea) => serviceArea.service === service
    );

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
      <PrimaryLayout>
        <table className="min-w-full text-sm align-middle whitespace-nowrap">
          <thead>
            <tr>
              {["City", "Zip Code"].map((header) => (
                <th
                  className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center"
                  key={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredAreas.map((location, index) => (
              <tr
                className={index % 2 !== 0 ? "bg-gray-50" : undefined}
                key={uuidv4()}
              >
                <td className="p-3 text-center">{location.city}</td>
                <td className="p-3 text-center">
                  <div>
                    <div>{location.zip_code}</div>
                    <DeleteButton
                      aria-label={"remove"}
                      onClick={() => handleDeleteLocation(location)}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </PrimaryLayout>
    );
  }

  return (
    <PrimaryLayout>
      <div className="flex flex-col justify-center items-center min-w-full text-sm align-middle whitespace-nowrap">
        <table className="min-w-full text-sm align-middle whitespace-nowrap">
          <thead>
            <tr>
              {["Service", "Locations"].map((header) => (
                <th
                  className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center"
                  key={header}
                >
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {uniqueCompanyServices.map((service, index) => (
              <tr
                className={index % 2 !== 0 ? "bg-gray-50" : undefined}
                key={uuidv4()}
              >
                <td className="p-3 text-center">{service}</td>
                <td className="p-3 text-center">
                  <div>
                    <Button
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
                    >
                      See
                    </Button>
                    <DeleteButton
                      aria-label={"remove"}
                      onClick={() => handleMultipleDeleteLocation(service)}
                      isLoading={isLoading}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Formik
          initialValues={{ service: 0, locations: [], service_areas: [] }}
          onSubmit={(values) => {
            console.log('v: ', values);
            // handleSubmit(values);
          }}
        >
          {({ values }) => (
            <Form>
              <div className="flex flex-col justify-center items-center my-4 gap-4">
                <CustomSelect name={"service"}>
                  <option value=""></option>
                  {services.map(({ id, service }) => (
                    <option value={id} key={id}>
                      {service}
                    </option>
                  ))}
                </CustomSelect>
                <RequestErrorMessage {...error} />
                <Button
                  onClick={() => {
                    if (!values.service) return;
                    setMultipleSelectModal(true);
                  }}
                  type={"button"}
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
