import React, { forwardRef } from "react";
import { motion } from "motion/react";
import {localizedPath} from "../../Data/data";
import { TbTriangleFilled } from "react-icons/tb";
import { submenuVariants } from "../Motion/Variant";
import {Link} from "react-router-dom";

const SubmenuSm = forwardRef(({ link, products , services, isMenuOpen, isSubMenuOpen}, subMenuRef) => {
  const currentLink = link.name === "Services" ? services : products;

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={submenuVariants(0.2, 0.2)}
      className="overflow-hidden"
      ref={subMenuRef}
    >
      <div className="px-4 bg-secondry/80 ">
        <div className="flex flex-col">
          {currentLink.map((itm, idx) => (
            <Link
                to={link.name === 'Products' ? localizedPath(`/products/${itm.slug}`) : localizedPath(`/services/${itm.slug}`)}
                onClick={()=>{isMenuOpen(false)}}
                key={idx}
              className={`py-2 flex gap-1  items-center text-center hover:underline ${
                idx < currentLink.length - 1 ? "border-b-[1px]" : "border-none"
              } border-white/30`}
            >
              <TbTriangleFilled
                size={8}
                className="text-primary rotate-90 rtl:-rotate-90"
              />
              {itm.name}
            </Link>
          ))}
        </div>
      </div>
    </motion.div>
  );
});
export default SubmenuSm;
