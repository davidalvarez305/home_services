import { Form, Formik } from "formik";
import { ChangeEvent, useContext, useState } from "react";
import { BUCKET_URL, USER_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import Image from "next/image";
import FormInput from "../../../components/FormInput";
import image from "next/image";
import useFetch from "../../../hooks/useFetch";
import { useToast } from "@chakra-ui/react";

export default function UserSettingsForm() {
  const ctx = useContext(UserContext);
  const [image, setImage] = useState<File>();
  const { isLoading, makeRequest, error } = useFetch();
  const USER_IMAGE = `${BUCKET_URL}/profile-pictures/${ctx?.user.profile_picture}`;
  const toast = useToast();
  
  const inputClass =
    "block border placeholder-gray-400 px-3 py-2 leading-6 w-full rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

    function handleUpload(event: ChangeEvent<HTMLInputElement>) {
      if (event.target.files) {
        setImage(event.target.files[0]);
      }
    }
  
    function handleSubmit() {
      if (image) {
        const fd = new FormData();
  
        fd.append("image", image, image?.name);
  
        makeRequest(
          {
            url: USER_ROUTE + "/change-picture",
            method: "PUT",
            data: fd,
          },
          (res) => {
            ctx?.SetUser(res.data.data);
          }
        );
      } else {
        toast({
          title: "Missing image!",
          description: "You haven't selected an image.",
          status: "warning",
          duration: 3000,
          isClosable: true,
        });
      }
    }

  const formFields = [
    {
      className: inputClass,
      type: "text",
      id: "username",
      name: "username",
      placeholder: "john.doe",
      label: "Username",
    },
    {
      className: inputClass,
      type: "text",
      id: "name",
      name: "name",
      placeholder: "John Doe",
      label: "Name",
    },
    {
      className: inputClass,
      type: "email",
      id: "email",
      name: "email",
      placeholder: "john.doe@example.com",
      label: "Email",
    },
    {
      className: inputClass,
      type: "text",
      id: "title",
      name: "title",
      placeholder: "Product Manager",
      label: "Title",
    },
    {
      className: inputClass,
      type: "text",
      id: "company",
      name: "company",
      placeholder: "@company",
      label: "Company",
    },
  ];

  return (
    <Formik
      initialValues={ctx!.user}
      onSubmit={(values) => console.log(values)}
    >
      <Form className="space-y-6">
        <div className="space-y-1">
          <label className="font-medium">Photo</label>
          <div className="sm:flex sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-300">
              <svg
                className="hi-solid hi-user inline-block w-8 h-8"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
            <label className="block">
              <span className="sr-only">Upload photo</span>
              <input
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                id="image"
                onChange={handleUpload}
                type="file"
                accept="image/*"
              />
            </label>
          </div>
        </div>
        {formFields.map((field) => (
          <FormInput key={field.id} {...field} />
        ))}
        <button
          type="submit"
          className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
        >
          Update Profile
        </button>
      </Form>
    </Formik>
  );
}
