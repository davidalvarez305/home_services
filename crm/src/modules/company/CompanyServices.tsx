import React, { useCallback, useContext, useEffect, useState } from "react";
import PrimaryLayout from "../../components/Layout";
import useLoginRequired from "../../hooks/useLoginRequired";
import { Form, Formik } from "formik";
import Button from "../../components/Button";
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
import { createServices } from "../../utils/createServices";
import RequestErrorMessage from "../../components/RequestErrorMessage";
import { v4 as uuidv4 } from "uuid";
import CustomSelect from "../../components/FormSelect";
import { SelectedComponent } from "../../components/SelectedComponent";

export default function CompanyServices() {
  useLoginRequired();
  const ctx = useContext(UserContext);
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
    locations: string[];
    service_areas: ZipCode[];
  }) {
    makeRequest(
      {
        url: COMPANY_ROUTE + `/${ctx?.user.company_id}/service`,
        method: "POST",
        data: createServices(values, ctx!.user.company_id),
      },
      (res) => {
        adjustData(res.data.data);
        setMultipleSelectModal(false);
      }
    );
  }

  if (toggleZipCodes) {
    return (
      <PrimaryLayout>
        <div className="min-w-full flex flex-col">
          <table className="min-w-full text-sm align-middle whitespace-nowrap">
            <thead>
              <tr>
                {["City", "Zip Code"].map((header) => (
                  <th
                    className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center text-black"
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
                  <td className="p-3 text-center text-black">{location.city}</td>
                  <td className="p-3 text-center text-black">
                    <div>
                      <SelectedComponent
                        selected={location.zip_code}
                        onClick={() => handleDeleteLocation(location)}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex justify-center items-center">
            <Button onClick={() => setToggleZipCodes(false)}>Return</Button>
          </div>
        </div>
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
                <td className="p-3 text-center text-black">{service}</td>
                <td className="p-3 text-center text-black">
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
                    Edit
                  </Button>
                  <Button
                    onClick={() => handleMultipleDeleteLocation(service)}
                    disabled={isLoading}
                    type="button"
                    className="inline-flex justify-center items-center space-x-2 rounded border font-semibold focus:outline-none mx-2 px-3 py-2 leading-5 border-red-700 bg-red-700 text-white hover:text-white hover:bg-red-800 hover:border-red-800 focus:ring focus:ring-red-500 focus:ring-opacity-50 active:bg-red-700 active:border-red-700"
                  >
                    Delete
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <Formik
          initialValues={{ service: 0, locations: [], service_areas: [] }}
          onSubmit={(values) => {
            handleSubmit(values);
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
}
