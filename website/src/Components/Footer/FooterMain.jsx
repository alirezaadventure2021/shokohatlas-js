import React from "react";
import FooterTop from "./FooterTop";
import FooterBottom from "./FooterBottom";
import { useTranslation } from "react-i18next";

const FooterMain = ({products, services}) => {
  const { t } = useTranslation();
  return (
    <section className="w-full bg-cyan/30 mt-[10px] md:mt-[100px] bg-main-gradient px-8 pt-20 py-4 rounded-none md:rounded-t-3xl ">
      <div className="max-w-[1200px] mx-auto flex flex-col items-center justify-center ">
        <FooterTop t={t} products={products} services={services}/>

        <FooterBottom t={t} />
      </div>
    </section>
  );
};

export default FooterMain;
