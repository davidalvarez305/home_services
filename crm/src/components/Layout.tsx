import DarkSidebar from "./DarkSidebar";
import Navigation from "./Navigation";
import Footer from "./Footer";
import { useState } from "react";

interface Props {
  children: React.ReactNode;
}

export default function Layout({ children }: Props) {
  const [desktopSidebarOpen, setDesktopSidebarOpen] = useState(true);
  return (
    <>
      <div
        id="page-container"
        className={`flex flex-col mx-auto w-full min-h-screen bg-gray-100 ${
          desktopSidebarOpen ? "lg:pl-64" : ""
        }`}
      >
        <DarkSidebar />
        <Navigation
          desktopSidebarOpen={desktopSidebarOpen}
          setDesktopSidebarOpen={setDesktopSidebarOpen}
        />
        <main
          id="page-content"
          className="flex flex-auto flex-col max-w-full pt-16"
        >
          <div className="max-w-10xl mx-auto p-4 lg:p-8 w-full">
            <div className="flex items-center justify-center rounded-xl bg-gray-50 border-2 border-dashed border-gray-200 text-gray-400 py-8">
              {children}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </>
  );
}
