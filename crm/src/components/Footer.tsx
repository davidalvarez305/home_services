import React from "react";

const Footer: React.FC = () => {
  const CURRENT_YEAR = new Date().getFullYear();

  return (
    <footer id="page-footer" className="flex flex-none items-center bg-white">
    <div className="text-center flex flex-col md:text-left md:flex-row md:justify-between text-sm max-w-10xl mx-auto px-4 lg:px-8 w-full">
      <div className="pt-4 pb-1 md:pb-4">
        <a href="https://findapro.gg" className="font-medium text-blue-600 hover:text-blue-400">FindAPro.gg</a> ©
      </div>
      <div className="pb-4 pt-1 md:pt-4 inline-flex items-center justify-center">
        <span>Copyright by <a href="https://findapro.gg" className="font-medium text-blue-600 hover:text-blue-400">{CURRENT_YEAR + " All Rights Reserved"}</a></span>
      </div>
    </div>
  </footer>
  )
};

export default Footer;
