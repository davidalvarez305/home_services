import { CompanyLead } from "../types/general";

function sortCompare(a: any, b: any) {
  return String(a).localeCompare(String(b));
}

export default function sortCompanyLeads(
  dir: boolean,
  header: string,
  companyLeads: CompanyLead[]
) {
  let sorted: CompanyLead[] = [];
  if (dir) {
    switch (header) {
      case "name":
        sorted = companyLeads.sort((a, b) =>
          sortCompare(a.first_name, b.first_name)
        );
        break;
      case "budget":
        sorted = companyLeads.sort((a, b) => sortCompare(a.budget, b.budget));
        break;
      case "location":
        sorted = companyLeads.sort((a, b) =>
          sortCompare(a.zip_code, b.zip_code)
        );
        break;
      case "phone":
        sorted = companyLeads.sort((a, b) =>
          sortCompare(a.phone_number, b.phone_number)
        );
        break;
      case "created_at":
        sorted = companyLeads.sort((a, b) =>
          sortCompare(a.created_at, b.created_at)
        );
        break;
      case "service":
        sorted = companyLeads.sort((a, b) => sortCompare(a.service, b.service));
        break;
      case "photos":
        sorted = companyLeads.sort((a, b) => {
          // The reason to do it like this is because all photos are UUID of equal length.
          // Therefore because the length will be consistent to the amount of photos
          // We can use string length as a proxy for figuring out how many photos a user has.
          return sortCompare(a.photos.length, b.photos.length);
        });
        break;
    }
  } else {
    switch (header) {
      case "name":
        sorted = companyLeads.sort((a, b) =>
          sortCompare(b.first_name, a.first_name)
        );
        break;
      case "budget":
        sorted = companyLeads.sort((a, b) => sortCompare(b.budget, a.budget));
        break;
      case "location":
        sorted = companyLeads.sort((a, b) =>
          sortCompare(b.zip_code, a.zip_code)
        );
        break;
      case "phone":
        sorted = companyLeads.sort((a, b) =>
          sortCompare(b.phone_number, a.phone_number)
        );
        break;
      case "created_at":
        sorted = companyLeads.sort((a, b) =>
          sortCompare(b.created_at, a.created_at)
        );
        break;
      case "service":
        sorted = companyLeads.sort((a, b) => sortCompare(b.service, a.service));
        break;
      case "photos":
        sorted = companyLeads.sort((a, b) =>
          sortCompare(b.photos.length, a.photos.length)
        );
        break;
    }
  }

  console.log("sorted: ", sorted);
  return sorted;
}
