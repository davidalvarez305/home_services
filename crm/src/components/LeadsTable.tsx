import React from "react";
import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/react";
import { CompanyLead } from "../types/general";
import { COMPANY_LEADS_HEADERS } from "../utils/companyLeadsHeaders";

interface Props {
  companyLeads: CompanyLead[];
}

const LeadsTable: React.FC<Props> = ({ companyLeads }) => {
  return (
    <Table>
      <Thead>
        <Tr>
          {COMPANY_LEADS_HEADERS.map((header, index) => (
            <Td key={index}>{header}</Td>
          ))}
        </Tr>
      </Thead>
      <Tbody>
        {companyLeads.map((lead) => (
          <Tr key={lead.id}>
            {COMPANY_LEADS_HEADERS.map((header) => (
              <Td key={lead[header as keyof CompanyLead]}>
                {lead[header as keyof CompanyLead]}
              </Td>
            ))}
          </Tr>
        ))}
      </Tbody>
    </Table>
  );
};
export default LeadsTable;
