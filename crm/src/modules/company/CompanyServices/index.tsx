import React, { useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/table";
import { Button } from "@chakra-ui/react";
import DeleteButton from "../../../components/DeleteIconButton";
import styles from "./CompanyServices.module.css";

const CompanyServices: React.FC = () => {
  const [toggleZipCodes, setToggleZipCodes] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([""]);
  useLoginRequired();

  const data = [
    {
      service: "Kitchen Remodeling",
      locations: [
        {
          dma: "Hialeah",
          zip_code: 33015,
        },
        {
          dma: "Hialeah",
          zip_code: 33012,
        },
      ],
    },
    {
      service: "Bathroom Remodeling",
      locations: [
        {
          dma: "Miami Lakes",
          zip_code: 33016,
        },
        {
          dma: "Miami Lakes",
          zip_code: 33014,
        },
      ],
    },
  ];

  if (toggleZipCodes) {
    return (
      <PrimaryLayout screenName="Company Services">
        <Table>
          <Thead>
            <Tr>
              {["DMA", "Zip Code"].map((header) => (
                <Td key={header}>{header}</Td>
              ))}
            </Tr>
          </Thead>
          <Tbody>
            {filteredLocations.map((location, index) => (
              <Tr key={index}>
                <Td>{location.dma}</Td>
                <Td>
                  <div className={styles["zip-code-container"]}>
                    <div>{location.zip_code}</div>
                    <DeleteButton minusButton={() => console.log("clicked")} />
                  </div>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </PrimaryLayout>
    );
  }

  return (
    <PrimaryLayout screenName="Company Services">
      <Table>
        <Thead>
          <Tr>
            {["Service", "Locations"].map((header) => (
              <Td key={header}>{header}</Td>
            ))}
          </Tr>
        </Thead>
        <Tbody>
          {data.map((row, index) => (
            <Tr key={index}>
              <Td>{row.service}</Td>
              <Td>
                <Button
                  onClick={() => {
                    setFilteredLocations(() => {
                      const service = data.filter(
                        (each) => each.service === row.service
                      )[0];
                      return service.locations;
                    });
                    setToggleZipCodes((prev) => !prev);
                  }}
                  variant={"outline"}
                  colorScheme={"teal"}
                >
                  See
                </Button>
              </Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </PrimaryLayout>
  );
};
export default CompanyServices;
