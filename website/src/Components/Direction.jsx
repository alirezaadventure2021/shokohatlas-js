import React from "react";
import { FaChevronRight } from "react-icons/fa6";
import styles from "../style";
import { useTranslation } from "react-i18next";
import homeIcon from "../../public/image/homeicon.png";
import { IoIosHome } from "react-icons/io";
import { MdOutlineHome } from "react-icons/md";
import {Link} from "react-router-dom";
import {localizedPath} from "../Data/data.js";

const Direction = ({ link, header }) => {
  const { t } = useTranslation();
  return (
    <div className="w-full ">
      <div className={`max-w-[1200px] mx-auto mt-[10px] px-4 `}>
        <ul className="flex flex-row gap-2 items-center text-center">
          <Link to={localizedPath('/')} className="flex flex-row text-dimBlack/60  items-center sm:text-[9px] md:text-[12px] gap-1 ">
            {/* <img src={homeIcon} alt="" className="h-[17px] mb-1" /> */}
               <MdOutlineHome className="text-primary cursor-pointer mb-1 size-4 md:size-7" />
               <FaChevronRight className="rtl:rotate-180 text-primary size-2 md:size-3" />
           </Link>

            <li
              className="flex flex-row text-dimBlack/40 items-center justify-center  sm:text-[9px] md:text-[11px] gap-1"

            >
              <a >{link}</a>
            </li>

        </ul>
        <h1 className="sm:text-sm md:text-xl lg:text-2xl  mt-2 md:mt-8 text-black/90">
          {header}
        </h1>
      </div>
      <div className="h-[2px] max-w-[1200px] mx-auto bg-primary mt-[10px]" />
    </div>
  );
};

export default Direction;
