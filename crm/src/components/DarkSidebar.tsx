import { Fragment, useState } from "react";
import Clipboard from "../assets/Clipboard";
import FourSquares from "../assets/FourSquares";
import Home from "../assets/Home";
import LightPlusIcon from "../assets/LightPlusIcon";
import Lock from "../assets/Lock";
import { SettingsIcon } from "../assets/SettingsIcon";
import SinglePerson from "../assets/SinglePerson";
import StackedPeople from "../assets/StackedPeople";

export default function DarkSidebarFullContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);

  const TopNavLinks = [
    {
      heading: "Manage",
      icon: <FourSquares />,
    },
    {
      heading: "Tasks",
      icon: <Clipboard />,
    },
    {
      heading: "Clients",
      icon: <StackedPeople />,
    },
    {
      heading: "Add New",
      icon: <LightPlusIcon />,
    },
  ];

  return (
    <>
      {/* Page Sidebar */}
      <nav
        id="page-sidebar"
        aria-label="Main Sidebar Navigation"
        className={`flex flex-col fixed top-0 left-0 bottom-0 w-full lg:w-64 h-full bg-gray-800 text-gray-200 z-50 transform transition-transform duration-500 ease-out ${
          desktopSidebarOpen ? "lg:translate-x-0" : "lg:-translate-x-full"
        } ${mobileSidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        {/* Sidebar Header */}
        <div className="h-16 bg-gray-600 bg-opacity-25 flex-none flex items-center justify-between lg:justify-center px-4 w-full">
          {/* Brand */}
          <a
            href="#"
            className="inline-flex items-center space-x-2 font-bold text-lg tracking-wide text-white hover:opacity-75"
          >
            <svg
              className="hi-solid hi-cube-transparent inline-block w-5 h-5 text-blue-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M9.504 1.132a1 1 0 01.992 0l1.75 1a1 1 0 11-.992 1.736L10 3.152l-1.254.716a1 1 0 11-.992-1.736l1.75-1zM5.618 4.504a1 1 0 01-.372 1.364L5.016 6l.23.132a1 1 0 11-.992 1.736L4 7.723V8a1 1 0 01-2 0V6a.996.996 0 01.52-.878l1.734-.99a1 1 0 011.364.372zm8.764 0a1 1 0 011.364-.372l1.733.99A1.002 1.002 0 0118 6v2a1 1 0 11-2 0v-.277l-.254.145a1 1 0 11-.992-1.736l.23-.132-.23-.132a1 1 0 01-.372-1.364zm-7 4a1 1 0 011.364-.372L10 8.848l1.254-.716a1 1 0 11.992 1.736L11 10.58V12a1 1 0 11-2 0v-1.42l-1.246-.712a1 1 0 01-.372-1.364zM3 11a1 1 0 011 1v1.42l1.246.712a1 1 0 11-.992 1.736l-1.75-1A1 1 0 012 14v-2a1 1 0 011-1zm14 0a1 1 0 011 1v2a1 1 0 01-.504.868l-1.75 1a1 1 0 11-.992-1.736L16 13.42V12a1 1 0 011-1zm-9.618 5.504a1 1 0 011.364-.372l.254.145V16a1 1 0 112 0v.277l.254-.145a1 1 0 11.992 1.736l-1.735.992a.995.995 0 01-1.022 0l-1.735-.992a1 1 0 01-.372-1.364z"
                clipRule="evenodd"
              />
            </svg>
            <span>FindAPro.gg</span>
          </a>
          {/* END Brand */}

          {/* Close Sidebar on Mobile */}
          <div className="lg:hidden">
            <button
              type="button"
              className="inline-flex justify-center items-center space-x-2 border font-semibold focus:outline-none px-3 py-2 leading-5 text-sm rounded border-transparent text-white opacity-75 hover:opacity-100 focus:ring focus:ring-gray-500 focus:ring-opacity-25 active:opacity-75"
              onClick={() => setMobileSidebarOpen(false)}
            >
              <svg
                className="hi-solid hi-x inline-block w-4 h-4 -mx-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          {/* END Close Sidebar on Mobile */}
        </div>
        {/* END Sidebar Header */}

        {/* Sidebar Navigation */}
        <div className="overflow-y-auto">
          <div className="p-4 w-full">
            <nav className="space-y-1">
              <a
                href="#"
                className="flex items-center space-x-3 px-3 font-medium rounded text-gray-50 bg-gray-700 bg-opacity-60"
              >
                <span className="flex-none flex items-center opacity-50">
                  <Home />
                </span>
                <span className="py-2 grow">Dashboard</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium leading-4 bg-opacity-10 text-gray-100 bg-gray-400">
                  3
                </span>
              </a>
              <div className="px-3 pt-5 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                Projects
              </div>

              {TopNavLinks.map((link) => (
                <a
                  key={link.heading}
                  href="#"
                  className="flex items-center space-x-3 px-3 font-medium rounded text-gray-300 hover:text-gray-100 hover:bg-gray-700 hover:bg-opacity-60 active:bg-gray-700 active:bg-opacity-40"
                >
                  <span className="flex-none flex items-center opacity-50">
                    {link.icon}
                  </span>
                  <span className="py-2 grow">{link.heading}</span>
                  <span className="px-2 py-1 rounded-full text-xs font-medium leading-4 bg-opacity-10 text-gray-100 bg-gray-400">
                    99+
                  </span>
                </a>
              ))}

              <div className="px-3 pt-5 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                Account
              </div>
              <a
                href="/profile-settings"
                className="flex items-center space-x-3 px-3 font-medium rounded text-gray-300 hover:text-gray-100 hover:bg-gray-700 hover:bg-opacity-60 active:bg-gray-700 active:bg-opacity-40"
              >
                <span className="flex-none flex items-center opacity-50">
                  <SinglePerson />
                </span>
                <span className="py-2 grow">Profile</span>
              </a>
              <a
                href="#"
                className="flex items-center space-x-3 px-3 font-medium rounded text-gray-300 hover:text-gray-100 hover:bg-gray-700 hover:bg-opacity-60 active:bg-gray-700 active:bg-opacity-40"
              >
                <span className="flex-none flex items-center opacity-50">
                  <SettingsIcon />
                </span>
                <span className="py-2 grow">Settings</span>
              </a>
              <button className="flex items-center space-x-3 px-3 font-medium rounded text-gray-300 hover:text-gray-100 hover:bg-gray-700 hover:bg-opacity-60 active:bg-gray-700 active:bg-opacity-40">
                <span className="flex-none flex items-center opacity-50">
                  <Lock />
                </span>
                <span className="py-2 grow">Log out</span>
              </button>
            </nav>
          </div>
        </div>
        {/* END Sidebar Navigation */}
      </nav>
      {/* Page Sidebar */}
    </>
  );
}
