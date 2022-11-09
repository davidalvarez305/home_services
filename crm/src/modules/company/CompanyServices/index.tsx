import React, { useRef, useState } from "react";
import PrimaryLayout from "../../../layout/Primary";
import useLoginRequired from "../../../hooks/useLoginRequired";
import { Table, Tbody, Td, Thead, Tr } from "@chakra-ui/table";
import DeleteButton from "../../../components/DeleteIconButton";
import styles from "./CompanyServices.module.css";
import FormSelect from "../../../components/FormSelect";
import { Form, Formik } from "formik";
import Button from "../../../components/Button";
import { Button as ChakraButton } from "@chakra-ui/react";
import SelectMultipleModal from "../../../components/SelectMultipleModal";

const CompanyServices: React.FC = () => {
  const [toggleZipCodes, setToggleZipCodes] = useState(false);
  const [filteredLocations, setFilteredLocations] = useState<any[]>([""]);
  const [multipleSelectModal, setMultipleSelectModal] = useState(false);
  const ref = useRef(null);
  const [data, setData] = useState<any[]>([
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
  ]);

  useLoginRequired();

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
      <div className={styles["main-container"]}>
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
                  <ChakraButton
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
                  </ChakraButton>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
        <Formik
          initialValues={{ service: "" }}
          onSubmit={() => {
            console.log("submitted");
          }}
        >
          {({ values }) => (
            <Form>
              <div className={styles["add-service"]}>
                <FormSelect
                  name={"service"}
                  options={[
                    { value: 1, label: "Roofing" },
                    { value: 2, label: "Floor Installation" },
                  ]}
                />
                <Button
                  onClick={() => {
                    if (values.service.length === 0) return;
                    setMultipleSelectModal(true);
                  }}
                  className={"Dark"}
                >
                  Add
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
      {multipleSelectModal && (
        <SelectMultipleModal
          selectMultipleModal={multipleSelectModal}
          setSelectMultipleModal={setMultipleSelectModal}
          handleSubmit={(values) => console.log("submit: ", values)}
          options={[
            { value: 10, label: "Hialeah" },
            { value: 20, label: "Miami" },
          ]}
        />
      )}
    </PrimaryLayout>
  );
};
export default CompanyServices;
