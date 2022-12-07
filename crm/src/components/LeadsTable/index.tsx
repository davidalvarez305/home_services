import React, { useState } from "react";
import { IconButton, Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { CompanyLead } from "../../types/general";
import { COMPANY_LEADS_HEADERS } from "../../utils/companyLeadsHeaders";
import { FaPhone } from "react-icons/fa";
import { BiImages } from "react-icons/bi";
import CarouselModal from "../CarouselModal";
import Image from "next/image";

interface Props {
  companyLeads: CompanyLead[];
}

function RenderImages({ photos }: CompanyLead) {
  const [renderModal, setRenderModal] = useState(false);

  if (renderModal) {
    return (
      <CarouselModal
        onClose={() => {
          setRenderModal(false);
        }}
        isOpen={renderModal}
      >
        {photos.split(",").map((photo) => (
          <React.Fragment key={photo}>
            <Image
              id={photo}
              src={`https://home-services-app.s3.amazonaws.com/lead-photos/${photo}`}
              alt={photo}
              width={400}
              height={400}
            />
          </React.Fragment>
        ))}
      </CarouselModal>
    );
  }

  return (
    <Td>
      <IconButton
        onClick={() => setRenderModal(true)}
        icon={<BiImages />}
        aria-label={"photos"}
      />
    </Td>
  );
}

function renderDate({ created_at }: CompanyLead) {
  const t = new Date(0);
  return <Td>{new Date(t.setUTCSeconds(created_at)).toLocaleDateString()}</Td>;
}

function renderPhoneIcon({ phone_number }: CompanyLead) {
  return (
    <Td>
      <a href={"tel:" + phone_number}>
        <IconButton
          variant={"ghost"}
          colorScheme={"green"}
          icon={<FaPhone />}
          aria-label="phone"
        />
      </a>
    </Td>
  );
}

const tableStyles = {
  table: {
    borderRadius: "8px",
    border: "1px solid",
    borderColor: "var(--cfdbd5outline-onlight2)",
    borderCollapse: "collapse",
  },
  table_row: {
    margin: "5px",
    maxHeight: "40px",
    borderRadius: "8px",
    border: "1px solid",
    borderColor: "var(--cfdbd5outline-onlight2)",
  },
  td: {
    maxWidth: "150px",
  },
  th: {
    letterSpacing: "2px",
  },
};

const LeadsTable: React.FC<Props> = ({ companyLeads }) => {
  return (
    <Table sx={{ ...tableStyles["table"] }}>
      <Thead>
        <Tr sx={{ ...tableStyles["table_row"] }}>
          {COMPANY_LEADS_HEADERS.map((header, index) => (
            <Td sx={{ ...tableStyles["td"] }} key={index}>
              {header}
            </Td>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {companyLeads.map((lead) => (
          <Tr sx={{ ...tableStyles["table_row"] }} key={lead.id}>
            {COMPANY_LEADS_HEADERS.map((header) => {
              switch (header) {
                case "created_at":
                  return renderDate(lead);
                case "phone_number":
                  return renderPhoneIcon(lead);
                /* case "photos":
                  return RenderImages(lead); */
                case "budget":
                  return (
                    <Td sx={{ ...tableStyles["td"] }}>{`$${
                      lead[header as keyof CompanyLead]
                    }`}</Td>
                  );
                default:
                  return (
                    <React.Fragment key={lead[header as keyof CompanyLead]}>
                      <Td sx={{ ...tableStyles["td"] }}>
                        {lead[header as keyof CompanyLead]}
                      </Td>
                    </React.Fragment>
                  );
              }
            })}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
export default LeadsTable;
