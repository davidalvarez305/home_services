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
  FormErrorMessage,
  FormLabel,
} from "@chakra-ui/react";
import { Form, Formik, useField, useFormikContext } from "formik";
import React, { useRef, useState } from "react";
import ReactSelect, {
  OptionsOrGroups,
  GroupBase,
  MultiValue,
} from "react-select";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { SelectType } from "./MultiFormSelect";

interface MultiSelectModalProps {
  options: SelectType[];
}

const MultiSelectModal: React.FC<MultiSelectModalProps> = ({ options }) => {
  const [selectedValues, setSelectedValues] = useState<
    MultiValue<{
      value: string | number;
      label: string;
    }>
  >([]);

  console.log("selectedValues: ", selectedValues);

  return (
    <Box
      sx={{
        ml: 2,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        width: 250,
      }}
    >
      <FormControl>
        <FormLabel
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
          htmlFor={"select-locations"}
        >
          {"Select Locations"}
        </FormLabel>
        <ReactSelect
          id={"select-locations"}
          onChange={(e) => {
            setSelectedValues(e);
          }}
          options={options.map((op) => {
            return {
              value: op.value,
              label: capitalizeFirstLetter(op.label),
            };
          })}
          isMulti={true}
        />
      </FormControl>
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
                <MultiSelectModal options={values.locations} />
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
