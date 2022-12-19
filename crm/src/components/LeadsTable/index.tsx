import React, { useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { CompanyLead } from "../../types/general";
import { COMPANY_LEADS_HEADERS } from "../../utils/companyLeadsHeaders";
import { FaPhone } from "react-icons/fa";
import { BiImages } from "react-icons/bi";
import CustomModal from "../CustomModal";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";

interface Props {
  companyLeads: CompanyLead[];
}

function RenderImages({ photos }: CompanyLead) {
  const [renderModal, setRenderModal] = useState(false);

  if (renderModal) {
    return (
      <CustomModal setIsOpen={setRenderModal} isOpen={renderModal}>
        {photos.split(",").map((photo) => (
          <div className={"cursor-grab"} key={photo}>
            <Image
              id={photo}
              src={`https://home-services-app.s3.amazonaws.com/lead-photos/${photo}`}
              alt={photo}
              width={400}
              height={400}
            />
          </div>
        ))}
      </CustomModal>
    );
  }

  return (
    <td key={uuidv4()}>
      <IconButton
        onClick={() => setRenderModal(true)}
        icon={<BiImages />}
        aria-label={"photos"}
      />
    </td>
  );
}

function renderDate({ created_at }: CompanyLead) {
  const t = new Date(0);
  return (
    <td key={uuidv4()}>
      {new Date(t.setUTCSeconds(created_at)).toLocaleDateString()}
    </td>
  );
}

function renderPhoneIcon({ phone_number }: CompanyLead) {
  return (
    <td key={uuidv4()}>
      <a href={"tel:" + phone_number}>
        <IconButton
          variant={"ghost"}
          colorScheme={"green"}
          icon={<FaPhone />}
          aria-label="phone"
        />
      </a>
    </td>
  );
}

const LeadsTable: React.FC<Props> = ({ companyLeads }) => {
  return (
    <div className="border border-gray-200 rounded overflow-x-auto min-w-full bg-white">
      <table className="min-w-full text-sm align-middle whitespace-nowrap">
        <thead>
          <tr>
            {COMPANY_LEADS_HEADERS.map((header) => (
              <th
                key={uuidv4()}
                className="p-3 text-gray-700 bg-gray-100 font-semibold text-sm tracking-wider uppercase text-center"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {companyLeads.map((lead) => (
            <tr key={uuidv4()}>
              {COMPANY_LEADS_HEADERS.map((header) => {
                switch (header) {
                  case "name":
                    return (
                      <td key={uuidv4()} className="p-3">
                        <p className="font-medium">
                          {`${lead.first_name} ${lead.last_name}`}
                        </p>
                      </td>
                    );
                  case "created_at":
                    return renderDate(lead);
                  case "phone":
                    return renderPhoneIcon(lead);
                  case "photos":
                    if (lead.photos.split(",").length > 1) {
                      return RenderImages(lead);
                    } else {
                      return (
                        <td key={uuidv4()} className="p-3">
                          <p className="font-medium">No Images</p>
                        </td>
                      );
                    }
                  case "budget":
                    return (
                      <td key={uuidv4()} className="p-3">
                        <p className="font-medium">
                          {`$${lead[header as keyof CompanyLead]}`}
                        </p>
                      </td>
                    );
                  case "location":
                    return (
                      <td key={uuidv4()} className="p-3">
                        <p className="font-medium">{`${lead.city}, ${lead.state}`}</p>
                        <p className="text-gray-500">{lead.zip_code}</p>
                      </td>
                    );
                  default:
                    return (
                      <td key={uuidv4()} className="p-3">
                        <p className="font-medium">
                          {lead[header as keyof CompanyLead]}
                        </p>
                      </td>
                    );
                }
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default LeadsTable;
