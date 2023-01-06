import React, { useEffect, useState } from "react";
import { IconButton } from "@chakra-ui/react";
import { CompanyLead } from "../types/general";
import { COMPANY_LEADS_HEADERS } from "../utils/companyLeadsHeaders";
import { BiImages } from "react-icons/bi";
import CustomModal from "./ImageSliderModal";
import Image from "next/image";
import { v4 as uuidv4 } from "uuid";
import formatPhoneNumber from "../utils/formatPhoneNumber";
import ChevronUp from "../assets/ChevronUp";
import ChevronDown from "../assets/ChevronDown";
import sortCompanyLeads from "../utils/sortCompanyLeads";
import DateComponent from "./TableDateComponent";
import TableDateComponent from "./TableDateComponent";

interface Props {
  companyLeads: CompanyLead[];
}

interface RenderImagesProps {
  lead: CompanyLead;
  renderModal: boolean;
  setRenderModal: React.Dispatch<React.SetStateAction<boolean>>;
}

function RenderImages({
  lead,
  renderModal,
  setRenderModal,
}: RenderImagesProps) {
  const photos = lead.photos.split(",");

  if (photos.length < 2 && photos[0].length === 0) {
    return (
      <td key={uuidv4()} className="p-3">
        <p className="font-medium">No Images</p>
      </td>
    );
  }

  if (renderModal) {
    return (
      <CustomModal setIsOpen={setRenderModal} isOpen={renderModal}>
        {photos.map((photo) => (
          <td className={"cursor-grab"} key={photo}>
            <Image
              id={photo}
              src={`https://home-services-app.s3.amazonaws.com/lead-photos/${photo}`}
              alt={photo}
              width={400}
              height={400}
            />
          </td>
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

const LeadsTable: React.FC<Props> = ({ companyLeads }) => {
  const [renderModal, setRenderModal] = useState(false);
  const [sortedLeads, setSortedLeads] = useState<CompanyLead[]>([]);

  useEffect(() => {
    setSortedLeads(companyLeads);
  }, [companyLeads]);

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
                <div className="flex justify-center items-center gap-1">
                {header}
                <ChevronUp className="border-solid border border-gray-200 h-5 cursor-pointer" onClick={() => setSortedLeads([...sortCompanyLeads(true, header, companyLeads)])} />
                <ChevronDown className="border-solid border border-gray-200 h-5 cursor-pointer" onClick={() => setSortedLeads([...sortCompanyLeads(false, header, companyLeads)])} />
                </div>
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {sortedLeads.map((lead, index) => (
            <tr className={index % 2 !== 0 ? "bg-gray-50" : ""} key={uuidv4()}>
              <td key={uuidv4()} className="p-3">
                <p className="font-medium">
                  {`${lead.first_name} ${lead.last_name}`}
                </p>
              </td>
              <td key={uuidv4()} className="p-3">
                <p className="font-medium">
                  {formatPhoneNumber(lead.phone_number)}
                </p>
              </td>
              <td key={uuidv4()} className="p-3">
                <p className="font-medium">{`${lead.city}, ${lead.state}`}</p>
                <p className="text-gray-500">{lead.zip_code}</p>
              </td>
              <TableDateComponent date={lead.created_at} />
              <td key={uuidv4()} className="p-3">
                <p className="font-medium">{lead.service}</p>
              </td>
              <RenderImages
                lead={lead}
                renderModal={renderModal}
                setRenderModal={setRenderModal}
              />
              <td key={uuidv4()} className="p-3">
                <p className="font-medium">{`$${lead.budget}`}</p>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
export default LeadsTable;
