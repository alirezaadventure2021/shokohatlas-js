import React, { forwardRef } from "react";
import { FaChevronRight } from "react-icons/fa";
import { TbTriangleFilled } from "react-icons/tb";
import { GrClose } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { motion } from "framer-motion";
import {localizedPath} from "../../Data/data";
import { submenuVariants } from "../Motion/Variant";

import { Link } from "react-router-dom";
const HeaderSubMenu = forwardRef(
  ({ currentLink, linkIndex, setSubMenuOpen , products,services }, ref) => {
    const { t } = useTranslation();

    var current = currentLink.name === "Services" ? services : products;



    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={submenuVariants(0.4, 0.2)}
        className="sm:hidden lg:block absolute left-0 top-[92px] w-full text-white z-20 overflow-hidden"
        ref={ref}
      >
        <div className="w-full bg-secondry/50 backdrop-blur-lg">
          {/* Header */}
          <div className="py-6 bg-secondry">
            <div className="max-w-[1200px] mx-auto px-4 text-2xl flex justify-between">
              <div className="flex flex-row gap-2 items-center text-center">
                <Link to={localizedPath(currentLink.href)}  className="cursor-pointer hover:underline">
                  {t("NavLinks." + currentLink.name)}
                </Link>
                <FaChevronRight size={18} className="mt-1 rtl:-mt-1 rtl:rotate-180" />
              </div>
              <div
                className="border-[1px] border-white text-white cursor-pointer p-2 rounded-full"
                onClick={() => setSubMenuOpen(false)}
              >
                <GrClose size={18} />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="pt-8 pb-12">
            <ul className="max-w-[1200px] mx-auto flex flex-wrap justify-between">
              {current.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center text-center gap-1 text-gray-700 hover:text-blue-500 py-2 px-3"
                >
                  <TbTriangleFilled
                    size={10}
                    className="text-primary rotate-90 rtl:-rotate-90 rtl:mt-0"
                  />
                  <Link
                    className="cursor-pointer hover:underline w-fit"
                    to={currentLink.name === 'Products' ? localizedPath(`/products/${item.slug}`) : localizedPath(`/services/${item.slug}`)}
                    onClick={()=>setSubMenuOpen(false)}
                  >
                    {item.name}
                  </Link>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }
);

export default HeaderSubMenu;
