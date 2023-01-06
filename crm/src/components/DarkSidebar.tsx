import Link from "next/link";
import { useState } from "react";
import Clipboard from "../assets/Clipboard";
import FourSquares from "../assets/FourSquares";
import Home from "../assets/Home";
import LightPlusIcon from "../assets/LightPlusIcon";
import Lock from "../assets/Lock";
import Logo from "../assets/Logo";
import { SettingsIcon } from "../assets/SettingsIcon";
import SinglePerson from "../assets/SinglePerson";
import StackedPeople from "../assets/StackedPeople";
import useAuth from "../hooks/useAuth";

export default function DarkSidebarFullContent() {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  const { Logout } = useAuth();

  function handleLogout() {
    Logout();
  }

  const topNavLinks = [
    {
      heading: "Services",
      icon: <FourSquares />,
      href: "company-services",
    },
    {
      heading: "Settings",
      icon: <Clipboard />,
      href: "company-settings",
    },
    {
      heading: "Leads",
      icon: <StackedPeople />,
      href: "leads",
    },
    {
      heading: "Invoices",
      icon: <LightPlusIcon />,
      href: "company-invoices",
    },
  ];

  const subNavLinks = [
    {
      heading: "Profile",
      icon: <SinglePerson />,
      href: "/",
    },
    {
      heading: "Account",
      icon: <SettingsIcon />,
      href: "profile-settings",
    },
    {
      heading: "Logout",
      icon: <Lock />,
      href: "",
      onClick: handleLogout,
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
          <Link
            href="/"
            className="inline-flex items-center space-x-2 font-bold text-lg tracking-wide text-white hover:opacity-75"
          >
            <Logo />
            <span>FindAPro.gg</span>
          </Link>
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
              <Link
                href="/"
                className="flex items-center space-x-3 px-3 font-medium rounded text-gray-50 bg-gray-700 bg-opacity-60"
              >
                <span className="flex-none flex items-center opacity-50">
                  <Home />
                </span>
                <span className="py-2 grow">Dashboard</span>
                <span className="px-2 py-1 rounded-full text-xs font-medium leading-4 bg-opacity-10 text-gray-100 bg-gray-400">
                  3
                </span>
              </Link>
              <div className="px-3 pt-5 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                Projects
              </div>

              {topNavLinks.map((link) => (
                <Link
                  key={link.heading}
                  href={link.href}
                  className="flex items-center space-x-3 px-3 font-medium rounded text-gray-300 hover:text-gray-100 hover:bg-gray-700 hover:bg-opacity-60 active:bg-gray-700 active:bg-opacity-40"
                >
                  <span className="flex-none flex items-center opacity-50">
                    {link.icon}
                  </span>
                  <span className="py-2 grow">{link.heading}</span>
                </Link>
              ))}

              <div className="px-3 pt-5 pb-2 text-xs font-medium uppercase tracking-wider text-gray-400">
                Account
              </div>
              {subNavLinks.map((link) => (
                <Link
                  key={link.heading}
                  href={link.href}
                  className="flex items-center space-x-3 px-3 font-medium rounded text-gray-300 hover:text-gray-100 hover:bg-gray-700 hover:bg-opacity-60 active:bg-gray-700 active:bg-opacity-40"
                  onClick={link.onClick}
                >
                  <span className="flex-none flex items-center opacity-50">
                    {link.icon}
                  </span>
                  <span className="py-2 grow">{link.heading}</span>
                </Link>
              ))}
            </nav>
          </div>
        </div>
        {/* END Sidebar Navigation */}
      </nav>
      {/* Page Sidebar */}
    </>
  );
}
