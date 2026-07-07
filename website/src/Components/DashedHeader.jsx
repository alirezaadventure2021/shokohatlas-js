import React from "react";

const DashedHeader = ({ title }) => {
  return (
    <div className="flex flex-row items-center justify-center text-center mt-4">
      <div className="flex-[1] border-t-[2px] border-dashed border-primary" />
      <h2 className="px-4 text-[24px] font-special"> {title} </h2>
      <div className="flex-[1] border-t-[2px] border-dashed border-primary" />
    </div>
  );
};

export default DashedHeader;
