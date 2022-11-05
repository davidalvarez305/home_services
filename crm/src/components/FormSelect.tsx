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

type SelectType = { value: string; label: string };

type Props = {
  options: string[];
  name: string;
};

const FormSelect: React.FC<Props> = ({ options, name }) => {
  let initialProps = useMemo(
    () =>
      Object.create({
        value: "",
        label: "",
      }),
    []
  );
  const { setFieldValue, values } = useFormikContext();

  const [field, meta] = useField(name);

  const [selectedValue, setSelectedValue] = useState<null | SelectType>(
    initialProps
  );

  useEffect(() => {
    if ((values as any).word === "") {
      setSelectedValue(initialProps);
    }
  }, [values, initialProps]);

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
              value: op,
              label: capitalizeFirstLetter(op),
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