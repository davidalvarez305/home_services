import {
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Button,
  Modal,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import React, { useRef } from "react";
import MultiFormSelect, { SelectType } from "./MultiFormSelect";

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
                <MultiFormSelect
                  options={values.locations}
                  name={"locations"}
                />
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
