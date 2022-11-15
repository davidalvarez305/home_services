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
import React, { useCallback, useEffect, useRef, useState } from "react";
import ReactSelect, { SingleValue } from "react-select";
import { LOCATION_ROUTE } from "../constants";
import useFetch from "../hooks/useFetch";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { removeOptionAtIndex } from "../utils/removeOptionAtIndex";
import { SelectType } from "./MultiFormSelect";
import { SelectedComponent } from "./SelectedComponent";
import { City, Location, State } from "../types/general";

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
  const [selectedCity, setSelectedCity] = useState(0);
  const [states, setStates] = useState<State[]>([]);
  const [cities, setCities] = useState<City[]>([]);

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

    if (cities.length === 0 && selectedState) {
      makeRequest(
        {
          url: LOCATION_ROUTE + `/city/?stateId=${selectedState}`,
        },
        (res) => {
          setCities(res.data.data);
        }
      );
    }
  }, [makeRequest, states, selectedState, cities]);

  useEffect(() => {
    if (selectedState > 0 && selectedCity > 0) {
      makeRequest(
        {
          url:
            LOCATION_ROUTE +
            `/?stateId=${selectedState}&cityId=${selectedCity}`,
        },
        (res) => {
          setLocations(res.data.data);
        }
      );
    }
  }, [makeRequest, selectedState, selectedCity]);

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
                <FormLabel>Select A State</FormLabel>
                <ReactSelect
                  options={states.map(({ id, state }) => {
                    return { value: id, label: state };
                  })}
                  onChange={(selected) => {
                    setSelectedState(selected!.value);
                  }}
                />
              </Box>
              {cities.length > 0 && (
                <Box sx={{ width: 250 }}>
                  <FormLabel>Select A City</FormLabel>
                  <ReactSelect
                    options={cities.map(({ id, city }) => {
                      return { value: id, label: city };
                    })}
                    onChange={(selected) => {
                      setSelectedCity(selected!.value);
                    }}
                  />
                </Box>
              )}
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
        <Formik
          initialValues={{ locations }}
          onSubmit={(values) => console.log(values)}
        >
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
                    <MultiSelect
                      options={values.locations.map((location) => {
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
      )}
    </>
  );
};

export default SelectMultipleModal;
