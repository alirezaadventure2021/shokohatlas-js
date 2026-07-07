import React from "react";

const LanguageImg = ({ langImg, size }) => {
  return (
    <div
      className={`h-${size} w-${size} rounded-full bg-orange-gradient  p-[1.5px]`}
    >
      <img src={langImg} alt="" className="" />
    </div>
  );
};

export default LanguageImg;
