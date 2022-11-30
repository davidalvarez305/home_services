import {
  FormControl,
  FormLabel,
  Box,
  FormErrorMessage,
} from "@chakra-ui/react";
import { useEffect, useMemo, useState } from "react";
import ReactSelect from "react-select";
import { capitalizeFirstLetter } from "../utils/capitalizeFirstLetter";
import { useField, useFormikContext } from "formik";

type SelectType = { value: string | number; label: string };

type Props = {
  options: SelectType[];
  name: string;
};

const FormSelect: React.FC<Props> = ({ options, name }) => {
  const { setFieldValue } = useFormikContext();

  const [field, meta] = useField(name);

  const [selectedValue, setSelectedValue] = useState<null | SelectType>(null);

  useEffect(() => {
    if (options.length === 1) {
      setSelectedValue(options[0]);
    }
  }, [options]);

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
          htmlFor={field.name}
        >
          {capitalizeFirstLetter(name)}
        </FormLabel>
        <ReactSelect
          name={field.name}
          id={field.name}
          value={selectedValue}
          onChange={(e) => {
            setSelectedValue(e);
            setFieldValue(field.name, e?.value);
          }}
          options={options.map((op) => {
            return {
              value: op.value,
              label: capitalizeFirstLetter(op.label),
            };
          })}
        />
        {meta.error && meta.touched && (
          <FormErrorMessage>{meta.error}</FormErrorMessage>
        )}
      </FormControl>
    </Box>
  );
};

export default FormSelect;
