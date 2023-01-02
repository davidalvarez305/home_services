import { Box } from "@chakra-ui/react";
import { useFormikContext } from "formik";
import React, { useEffect, useState } from "react";
import { LOCATION_ROUTE } from "../constants";
import useFetch from "../hooks/useFetch";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { removeOptionAtIndex } from "../utils/removeOptionAtIndex";
import { SelectedComponent } from "./SelectedComponent";
import { Location, State } from "../types/general";
import Modal from "./Modal";
import SimpleSelect from "./SimpleSelect";
import Button from "./Button";

interface MultiSelectProps {
  options: string[];
}

const MultiSelect: React.FC<MultiSelectProps> = ({ options }) => {
  const [selectOptions, setSelectOptions] = useState<string[]>(options);
  const [selectedValues, setSelectedValues] = useState<string[]>([]);
  const { setFieldValue } = useFormikContext();

  return (
    <div className="flex flex-col justify-start items-center overflow-scroll h-[500px]">
      <SimpleSelect
        value={""}
        name={"location-select"}
        onChange={(e) => {
          const newOptions = removeOptionAtIndex(selectOptions, e.target.value);
          setSelectOptions(newOptions);
          const newValues = [...selectedValues, e.target.value];
          setSelectedValues(newValues);
          setFieldValue("locations", newValues);
        }}
      >
        <option value=""></option>
        {selectOptions.map((option) => (
          <option value={option} key={option}>
            {capitalizeFirstLetter(option)}
          </option>
        ))}
      </SimpleSelect>

      <div>
        {selectedValues.map((value) => (
          <React.Fragment key={value}>
            <SelectedComponent
              selected={value}
              onClick={() => {
                // Remove the deleted option from the selected values ('the list')
                const newSelectedValues = removeOptionAtIndex(
                  selectedValues,
                  value
                );
                setSelectedValues(newSelectedValues);

                // Append the deleted value to the available selectable options
                setSelectOptions((prev) => [...prev, value]);

                // Set it to Formik
                setFieldValue("locations", newSelectedValues);
              }}
            />
          </React.Fragment>
        ))}
      </div>
      <div className="my-2">
        <Button>Save</Button>
      </div>
    </div>
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
      <div className="h-200">
        <Modal
          modalTitle={"Select A State"}
          isOpen={selectMultipleModal}
          setIsOpen={() => setSelectMultipleModal(false)}
        >
          <SimpleSelect
            onChange={(e) => {
              setSelectedState(Number(e.target.value));
            }}
          >
            <option value=""></option>
            {states.map((state) => (
              <option value={state.id} key={state.id}>
                {state.state}
              </option>
            ))}
          </SimpleSelect>
        </Modal>
      </div>
    );
  }

  return (
    <>
      {locations.length > 0 && (
        <Modal
          modalTitle={"Select Locations..."}
          isOpen={selectMultipleModal}
          setIsOpen={() => setSelectMultipleModal(false)}
        >
          <MultiSelect options={locations.map((location) => location.city)} />
        </Modal>
      )}
    </>
  );
};

export default SelectMultipleModal;
