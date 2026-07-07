import { forwardRef } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import i18n from "../../i18n";
import {localizedPath} from "../../Data/data.js";

const HeaderLinks = forwardRef(
  (
    { navLinks, setSubMenuOpen, isSubMenuOpen, linkIndex, toggleSubMenu },
    ref
  ) => {
    const { t } = useTranslation();
    return (
      <ul className=" flex-1 justify-center  flex gap-6 flex-end ">
        {navLinks.map((item, index) =>
          item.hasSubLinks ? (
            <li
              ref={(el) => (ref.current[index] = el)}
              key={index}
              className="group flex flex-col justify-between gap-2"
              onClick={() => {
                setSubMenuOpen((prev) => !prev);
                toggleSubMenu(index);
              }}
            >
              <div className="font-semibold rtl:font-normal rtl:text-[17px] text-[15px] flex flex-row gap-1 items-center  text-gray-700 cursor-pointer hover:text-orange transition-colors duration-500">
                {t("NavLinks." + item.name)}
                <FaChevronDown
                  className={`mt-1 ${
                    isSubMenuOpen && linkIndex === index
                      ? "rotate-180"
                      : "rotate-0"
                  } transition-all duration-500 rtl:mb-2`}
                  size={12}
                />
              </div>
              <div
                className={`w-0 h-[2px]  bg-orange mx-auto ${
                  isSubMenuOpen && linkIndex === index ? "w-full" : "w-0"
                } transition-all duration-500`}
              ></div>
            </li>
          ) : (
            <li key={index}>
              <Link
                  to={localizedPath(item.href)}

                  className="text-gray-700 hover:text-orange transition-colors duration-500 font-semibold rtl:font-normal rtl:text-[17px] text-[15px]"
              >
                {t("NavLinks." + item.name)}
              </Link>
            </li>
          )
        )}
      </ul>
    );
  }
);

export default HeaderLinks;
