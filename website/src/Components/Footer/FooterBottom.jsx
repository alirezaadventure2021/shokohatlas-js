import React from "react";
import {Link} from "react-router-dom";
import { MdOutlineMailOutline } from "react-icons/md";
const FooterBottom = ({ t }) => {
    const isMobile = window.innerWidth <= 786 ;
  return (
    <div className=" w-full flex flex-col md:flex-row gap-2 justify-between border-t-[1px] border-dimBlack/10 px-4 py-3  text-center">
      <p className={` ${isMobile ? 'order-2' : 'order-1'} text-center text-[13px] text-dimBlack/30`}>
        {t("Footer.Copyright")}
      </p>

        <a href='mailto:info@shokohatals.co' className={`${isMobile ? 'order-1' : 'order-2'}  flex  gap-2 items-center justify-center  text-[15px] text-dimBlack/60`}>
            <MdOutlineMailOutline className='mb-0 rtl:mb-1 order-1 rtl:order-2' />
            <p className='order-2 rtl:order-1'>info@shokohatals.co</p>
        </a>
    </div>
  );
};

export default FooterBottom;
