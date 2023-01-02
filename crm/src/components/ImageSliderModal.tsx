import { Dispatch, Fragment, SetStateAction, useEffect, useMemo } from "react";
import { Dialog, Transition } from "@headlessui/react";
import Slider from "react-slick";
import Head from "next/head";
import SmallCloseIcon from "../assets/SmallCloseIcon";

type Props = {
  children: React.ReactNode;
  setIsOpen: Dispatch<SetStateAction<boolean>>;
  isOpen: boolean;
};

export default function CustomModal({ children, setIsOpen, isOpen }: Props) {
  const settings = {
    dots: true,
    infinite: true,
    speed: 300,
    slidesToShow: 1,
    adaptiveHeight: true,
  };

  function closeModal() {
    setIsOpen(false);
  }

  /* function handleNext() {
    var next = document.querySelector(".slick-arrow.slick-next");
    if (next instanceof HTMLElement) {
      next.click();
    }
  } */

  return (
    <div>
      <Head>
        <link
          rel="stylesheet"
          type="text/css"
          charSet="UTF-8"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick.min.css"
        />
        <link
          rel="stylesheet"
          type="text/css"
          href="https://cdnjs.cloudflare.com/ajax/libs/slick-carousel/1.6.0/slick-theme.min.css"
        />
      </Head>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-90" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-gray-900 bg-opacity-75" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto p-4 lg:p-8">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 scale-125"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-100"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-125"
            >
              <Dialog.Panel className="flex flex-col rounded shadow-sm bg-white overflow-hidden w-full max-w-md mx-auto">
                <div className="py-4 px-5 lg:px-6 w-full bg-gray-50 flex justify-between items-center">
                  <Dialog.Title as="h3" className="font-medium">
                    User Photos
                  </Dialog.Title>

                  <div className="-my-4">
                    <button
                      type="button"
                      className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-2 py-1 leading-5 text-sm rounded border-transparent text-gray-600 hover:text-gray-400 focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:text-gray-600"
                      onClick={closeModal}
                    >
                      <SmallCloseIcon />
                    </button>
                  </div>
                </div>
                <div className="p-5 lg:p-6 grow w-full">
                  <Slider {...settings}>{children}</Slider>
                </div>
                <div className="px-5 lg:px-6 w-full text-right space-x-2" />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
}
