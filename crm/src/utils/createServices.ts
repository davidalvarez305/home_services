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
        // Split zip codes by comma && push them to the array one by one
        const zip_codes = area.zip_codes.split(",");
        if (zip_codes.length > 0) {
          zip_codes.forEach((zip_code) => {
            zipCodes.push(zip_code);
          });
        }
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
