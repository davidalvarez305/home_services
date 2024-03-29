import { Form, Formik } from "formik";
import { ChangeEvent, useContext, useState } from "react";
import { BUCKET_URL, USER_ROUTE } from "../../../constants";
import { UserContext } from "../../../context/UserContext";
import Image from "next/image";
import FormInput from "../../../components/FormInput";
import useFetch from "../../../hooks/useFetch";
import ProfileIcon from "../../../assets/ProfileIcon";
import { User } from "../../../types/general";
import Button from "../../../components/Button";

export default function UserSettingsForm() {
  const ctx = useContext(UserContext);
  const [image, setImage] = useState<File>();
  const { isLoading, makeRequest, error } = useFetch();
  const USER_IMAGE = `${BUCKET_URL}/profile-pictures/${ctx?.user.profile_picture}`;
  const hasProfileImg = ctx!.user.profile_picture.length > 0;

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
    }
  }

  function handleUpdateUser(values: User) {
    makeRequest(
      {
        url: USER_ROUTE,
        method: "PUT",
        data: values,
      },
      (res) => {
        ctx?.SetUser(res.data.data);
      }
    );
  }

  const inputClass =
    "block border placeholder-gray-400 px-3 py-2 leading-6 w-full rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50";

  const formFields = [
    {
      className: inputClass,
      type: "text",
      name: "username",
      placeholder: "john.doe",
      label: "Username",
    },
    {
      className:
        "block border placeholder-gray-400 px-3 py-2 leading-6 w-1/2 rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50",
      type: "text",
      name: "first_name",
      placeholder: "John",
      label: "First Name",
    },
    {
      className:
        "block border placeholder-gray-400 px-3 py-2 leading-6 w-1/2 rounded border-gray-200 focus:border-blue-500 focus:ring focus:ring-blue-500 focus:ring-opacity-50",
      type: "text",
      name: "last_name",
      placeholder: "Doe",
      label: "Last Name",
    },
    {
      className: inputClass,
      type: "email",
      name: "email",
      placeholder: "john.doe@example.com",
      label: "Email",
    },
    {
      className: inputClass,
      type: "text",
      name: "job_title",
      placeholder: "Product Manager",
      label: "Job Title",
    },
  ];

  return (
    <Formik initialValues={ctx!.user} onSubmit={handleUpdateUser}>
      <Form className="space-y-6">
        <div className="space-y-1">
          <label className="font-medium">Photo</label>
          <div className="sm:flex sm:items-center sm:space-x-4 space-y-4 sm:space-y-0">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-300">
              {hasProfileImg ? (
                <Image
                  className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 text-gray-300"
                  src={USER_IMAGE}
                  alt={"profile image"}
                  width={250}
                  height={250}
                />
              ) : (
                <ProfileIcon />
              )}
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
            {image && (
              <label className="block">
                <Button
                  disabled={isLoading}
                  className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
                  onClick={() => handleSubmit()}
                >
                  Upload
                </Button>
              </label>
            )}
          </div>
        </div>
        {formFields.map((field) => (
          <FormInput key={field.name} {...field} />
        ))}
        <Button
          disabled={isLoading}
          type="submit"
          className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-blue-700 bg-blue-700 text-white hover:text-white hover:bg-blue-800 hover:border-blue-800 focus:ring focus:ring-blue-500 focus:ring-opacity-50 active:bg-blue-700 active:border-blue-700"
        >
          Update Profile
        </Button>
      </Form>
    </Formik>
  );
}
