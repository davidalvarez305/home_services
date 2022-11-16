import { SelectType } from "../components/MultiFormSelect";
import { CompanyServiceLocations, Location } from "../types/general";

export const createServices = (
  values: {
    service: number;
    locations: SelectType[];
    service_areas: Location[];
  },
  company_id: number
): CompanyServiceLocations[] => {
  var final: CompanyServiceLocations[] = [];
  var zipCodes: number[] = [];

  values.service_areas.forEach((area) => {
    values.locations.forEach((location) => {
      if (area.city_id === location.value) {
        zipCodes.push(area.id);
      }
    });
  });

  zipCodes.forEach((zipCode) => {
    let serviceArea = {
      service_id: values.service,
      company_id: company_id,
      zip_code_id: zipCode,
    };

    final.push(serviceArea);
  });

  return final;
};
