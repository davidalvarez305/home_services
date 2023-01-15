import { CompanyLead, Lead } from "../types/general";

export default function transformLeads(leads: Lead[]) {
    let companyLeads: CompanyLead[] = [];

    leads.forEach((lead) => {
        companyLeads.push({
            ...lead,
            city: lead.address.city.city,
            city_id: lead.address.city_id,
            state: lead.address.state.state,
            state_id: lead.address.state_id,
            country: lead.address.country.country,
            country_id: lead.address.country_id,
            street_address_line_1: lead.address.street_address_line_1,
            street_address_line_2: lead.address.street_address_line_2,
            street_address_line_3: lead.address.street_address_line_3,
            service: lead.service.service,
            zip_code: lead.address.zip_code,
            photos: lead.lead_photos.map((photo) => photo.image_url).join(",")
        })
    })

    return companyLeads;
}