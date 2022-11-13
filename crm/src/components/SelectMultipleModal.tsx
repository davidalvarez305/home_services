import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
  Box,
  FormControl,
  FormLabel,
} from "@chakra-ui/react";
import { Form, Formik, useFormikContext } from "formik";
import React, { useRef, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { capitalizeFirstLetter } from "../utils/toTitleCase";
import { removeOptionAtIndex } from "../utils/removeOptionAtIndex";
import { SelectType } from "./MultiFormSelect";
import { SelectedComponent } from "./SelectedComponent";

interface MultiSelectProps {
  options: SelectType[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options }) => {
  const emptyValue: SelectType = { value: "", label: "" };
  const [selectOptions, setSelectOptions] = useState<SelectType[]>(options);
  const [selectedValues, setSelectedValues] = useState<
    SingleValue<{
      value: string | number;
      label: string;
    }>[]
  >([]);
  const { setFieldValue } = useFormikContext();

  return (
    <Box
      sx={{
        ml: 2,
        display: "flex",
        justifyContent: "flex-start",
        alignItems: "center",
        flexDirection: "column",
        height: 500,
      }}
    >
      <Box
        sx={{
          ml: 2,
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          flexDirection: "column",
          width: 250,
          height: 150,
        }}
      >
        <FormControl>
          <FormLabel
            sx={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            htmlFor={"locations"}
          >
            {"Select Locations"}
          </FormLabel>
          <ReactSelect
            value={emptyValue}
            onChange={(e) => {
              const newOptions = removeOptionAtIndex(options, {
                value: e!.value,
                label: e!.label,
              });
              setSelectOptions(newOptions);
              setSelectedValues((prev) => [...prev, e]);
              setFieldValue("locations", selectedValues);
            }}
            options={selectOptions.map((op) => {
              return {
                value: op.value,
                label: capitalizeFirstLetter(op.label),
              };
            })}
          />
        </FormControl>
      </Box>
      <Box>
        {selectedValues.map((value) => (
          <React.Fragment key={value?.value}>
            <SelectedComponent
              selected={value}
              onClick={() => {
                // Remove the deleted option from the selected values ('the list')
                const newSelectedValues = removeOptionAtIndex(
                  selectedValues as any,
                  {
                    value: value!.value,
                    label: value!.label,
                  }
                );
                setSelectedValues(newSelectedValues);

                // Append the deleted value to the available selectable options
                setSelectOptions((prev) => {
                  return [
                    ...prev,
                    { value: value!.value, label: value!.label },
                  ];
                });

                // Set it to Formik
                setFieldValue("locations", newSelectedValues);
              }}
            />
          </React.Fragment>
        ))}
      </Box>
    </Box>
  );
};

interface Props {
  handleSubmit: (values: { locations: SelectType[] }) => void;
  setSelectMultipleModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectMultipleModal: boolean;
  options: SelectType[];
}

const SelectMultipleModal: React.FC<Props> = ({
  handleSubmit,
  setSelectMultipleModal,
  selectMultipleModal,
  options,
}) => {
  const finalRef: React.RefObject<any> = useRef(null);
  return (
    <Formik initialValues={{ locations: options }} onSubmit={handleSubmit}>
      {({ values, submitForm }) => (
        <Form>
          <Modal
            size="3xl"
            finalFocusRef={finalRef}
            isOpen={selectMultipleModal}
            onClose={() => setSelectMultipleModal(false)}
          >
            <ModalOverlay />
            <ModalContent>
              <ModalHeader>{`Adding Locations...`}</ModalHeader>
              <ModalCloseButton />
              <ModalBody>
                <MultiSelect options={values.locations} />
              </ModalBody>
              <ModalFooter>
                <Button
                  colorScheme="blue"
                  mr={3}
                  type="submit"
                  onClick={submitForm}
                >
                  Submit
                </Button>
                <Button
                  colorScheme="red"
                  mr={3}
                  onClick={() => setSelectMultipleModal(false)}
                >
                  Close
                </Button>
              </ModalFooter>
            </ModalContent>
          </Modal>
        </Form>
      )}
    </Formik>
  );
};

export default SelectMultipleModal;
