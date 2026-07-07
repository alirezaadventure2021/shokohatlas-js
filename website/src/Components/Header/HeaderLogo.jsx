import React from "react";
import logo from "../../assets/image/logo/logo2.svg";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Languages } from "../../Data/data";
import i18n from "../../i18n";

const HeaderLogo = () => {
  const currentLang = Languages.find((l) => l.code === i18n.language) || {
    code: "en",
  };
  const { t } = useTranslation();
  return (
    <Link
      to={`/${currentLang.code}`}
      className="flex gap-4 pt-2 pb-1 cursor-pointer "
      href="#"
    >
      <div className="lg:h-[80px] lg:w-[80px] sm:h-[65px] sm:w-[65px]">
        <img src={logo} alt="" />
      </div>
      <div className="flex flex-col items-start justify-end">
        <h2 className="uppercase text-primary  font-bold rtl:md:text-2xl md:text-xl sm:text-md">
          {t("Logo")}
        </h2>
        <p className="text-lightGrey/60 md:text-xs sm:text-[9px] ">
          {t("LogoSub")}
        </p>
      </div>
    </Link>
  );
};

export default HeaderLogo;
