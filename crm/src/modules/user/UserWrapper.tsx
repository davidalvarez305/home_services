import React from "react";
import Logo from "../../assets/Logo";

interface Props {
  children: React.ReactNode;
}

export default function UserWrapper({ children }: Props) {
  return (
    <div
      id="page-container"
      className="flex flex-col mx-auto w-full min-h-screen bg-gray-100"
    >
      <main id="page-content" className="flex flex-auto flex-col max-w-full">
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden max-w-10xl mx-auto p-4 lg:p-8 w-full">
          <div className="pattern-dots-md text-gray-300 absolute top-0 right-0 w-32 h-32 lg:w-48 lg:h-48 transform translate-x-16 translate-y-16" />
          <div className="pattern-dots-md text-gray-300 absolute bottom-0 left-0 w-32 h-32 lg:w-48 lg:h-48 transform -translate-x-16 -translate-y-16" />

          <div className="py-6 lg:py-0 w-full md:w-8/12 lg:w-6/12 xl:w-4/12 relative">
            <div className="mb-8 text-center">
              <h1 className="text-4xl font-bold inline-flex items-center mb-1 space-x-3">
                <Logo />
                <span>FindAPro.gg</span>
              </h1>
            </div>

            {children}
            <div className="text-sm text-gray-500 text-center mt-6">
              <a
                className="font-medium text-blue-600 hover:text-blue-400"
                href="https://findapro.gg"
              >
                FindAPro.gg
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
