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
import React, { useEffect, useRef, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { LOCATION_ROUTE } from "../constants";
import useFetch from "../hooks/useFetch";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { removeOptionAtIndex } from "../utils/removeOptionAtIndex";
import { SelectType } from "./MultiFormSelect";
import { SelectedComponent } from "./SelectedComponent";
import { Location, State } from "../types/general";

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
            {"Search for a city..."}
          </FormLabel>
          <ReactSelect
            value={emptyValue}
            onChange={(e) => {
              const newOptions = removeOptionAtIndex(selectOptions, {
                value: e!.value,
                label: e!.label,
              });
              setSelectOptions(newOptions);
              const newValues = [...selectedValues, e];
              setSelectedValues(newValues);
              setFieldValue("locations", newValues);
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
  setSelectMultipleModal: React.Dispatch<React.SetStateAction<boolean>>;
  selectMultipleModal: boolean;
}

const SelectMultipleModal: React.FC<Props> = ({
  setSelectMultipleModal,
  selectMultipleModal,
}) => {
  const { makeRequest, isLoading, error } = useFetch();
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedState, setSelectedState] = useState(0);
  const [states, setStates] = useState<State[]>([]);
  const formikCtx = useFormikContext();
  const { setFieldValue } = formikCtx;

  const finalRef: React.RefObject<any> = useRef(null);

  // Fetch states && cities depending on selections
  useEffect(() => {
    if (states.length === 0) {
      makeRequest(
        {
          url: LOCATION_ROUTE + "/state",
        },
        (res) => {
          setStates(res.data.data);
        }
      );
    }
  }, [makeRequest, states, selectedState]);

  useEffect(() => {
    if (selectedState > 0) {
      makeRequest(
        {
          url: LOCATION_ROUTE + `/?stateId=${selectedState}`,
        },
        (res) => {
          setLocations(res.data.data);

          // Set locations to formik form when new locations are set
          setFieldValue("service_areas", res.data.data);
        }
      );
    }
  }, [makeRequest, selectedState, setFieldValue]);

  if (!selectedState) {
    return (
      <Modal
        size="3xl"
        finalFocusRef={finalRef}
        isOpen={selectMultipleModal}
        onClose={() => setSelectMultipleModal(false)}
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{`Select a location...`}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: 700,
                gap: 20,
              }}
            >
              <Box sx={{ width: 250 }}>
                <ReactSelect
                  options={states.map(({ id, state }) => {
                    return { value: id, label: state };
                  })}
                  onChange={(selected) => {
                    setSelectedState(selected!.value);
                  }}
                />
              </Box>
            </Box>
          </ModalBody>
          <ModalFooter>
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
    );
  }

  return (
    <>
      {locations.length > 0 && (
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
              <MultiSelect
                options={locations.map((location) => {
                  return {
                    value: location.city_id,
                    label: location.city,
                  };
                })}
              />
            </ModalBody>
            <ModalFooter>
              <Button
                colorScheme="blue"
                mr={3}
                type="submit"
                onClick={formikCtx.submitForm}
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
      )}
    </>
  );
};

export default SelectMultipleModal;
