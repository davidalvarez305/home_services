import { SelectType } from "../components/MultiFormSelect";
import { CompanyServiceLocations, ZipCode } from "../types/general";

export const createServices = (
  values: {
    service: number;
    locations: SelectType[];
    service_areas: ZipCode[];
  },
  company_id: number
): CompanyServiceLocations[] => {
  var final: CompanyServiceLocations[] = [];
  var zipCodes: string[] = [];

  values.service_areas.forEach((area) => {
    values.locations.forEach((location) => {
      if (area.city_id === location.value) {
        zipCodes.push(area.zip_code);
      }
    });
  });

  zipCodes.forEach((zipCode) => {
    let serviceArea = {
      service_id: values.service,
      company_id: company_id,
      zip_code: zipCode,
    };

    final.push(serviceArea);
  });

  return final;
};
