import {useFormikContext } from "formik";
import React from "react";
import useRememberMe from "../hooks/useRememberMe";

export default function Checkbox() {
  const { values } = useFormikContext<{ email: string, password: string }>();
  const { rememberEmail } = useRememberMe();

  const handleChange: React.ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.checked) {
      rememberEmail(values.email);
    } else {
      rememberEmail('');
    }
  }

  return (
    <label className="flex items-center">
      <input
        onChange={handleChange}
        type="checkbox"
        id="remember_me"
        name="remember_me"
        className="border border-gray-200 rounded h-4 w-4 text-blue-500 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50"
      />
      <span className="ml-2">Remember me</span>
    </label>
  );
}
