import React, { useEffect, useState } from "react";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { createTheme, ThemeProvider } from "@mui/material";
import { useField, useFormikContext } from "formik";

const theme = createTheme();

interface Props {
  name: string;
  label: string;
  defaultDate: Date;
}

export default function DateTimePicker({ name, label, defaultDate }: Props) {
  const [field] = useField(name);
  const { setFieldValue } = useFormikContext();
  const [value, setValue] = useState<Date | null>(defaultDate);

  const handleChange = (newValue: Date | null) => {
    setValue(newValue);
  };

  useEffect(() => {
    setFieldValue(name, value?.getTime());
  }, [value, name, setFieldValue]);

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack spacing={3}>
          <DesktopDatePicker
            label={label}
            inputFormat="MM/DD/YYYY"
            value={value}
            onChange={handleChange}
            renderInput={(params) => (
              <TextField id={field.name} {...params} {...field} />
            )}
          />
        </Stack>
      </LocalizationProvider>
    </ThemeProvider>
  );
}
