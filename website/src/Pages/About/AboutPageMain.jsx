import React from "react";
import Direction from "../../Components/Direction";
import header from "/image/header.png";
import {useTranslation} from "react-i18next";
import {Helmet} from "react-helmet-async";
import i18n from "../../i18n";

const AboutPageMain = () => {
  const {t}=useTranslation();
  const services = t('AboutPage.services' ,{returnObjects: true} );

  return (
    <div>
      <Helmet>
        <title>{t("metaAbout.title")}</title>
        <meta name="description" content={t("metaAbout.description")} />
        <link rel="canonical" href={`https://shokohatlas.co/${i18n.language}/about-us`} />

        <link rel="alternate" href="https://shokohatlas.co/en/about-us" />
        <link rel="alternate" href="https://shokohatlas.co/ru/about-us" />
        <link rel="alternate" href="https://shokohatlas.co/fa/about-us" />
        <link rel="alternate" hrefLang="x-default" href="https://shokohatlas.co/fa/about-us" />
      </Helmet>
      <Direction link={t('AboutPage.title')} header={t('AboutPage.title')} />
      <div className="max-w-[1200px] mx-auto px-4x ">
        <div className="flex flex-row gap-2 justify-between w-full pt-4 md:pt-6 pb-4 items-center bg-white px-4 rounded-3xl mt-[20px]">
          <div className="text-center w-[50%] flex  flex-col  gap-2 md:gap-10">
            <h1 className=" px-2 py-2 md:py-7 bg-darkBlue text-white rounded-3xl text-[9px] md:text-xl">
              <span className="order-2 rtl:order-2 text-primary uppercase font-bold text-xs md:text-4xl">
                {t('AboutPage.shokoh')}
              </span>{" "}
              <span className="order-1 rtl:order-1">
                {t('AboutPage.industrial')}
              </span>
            </h1>

            <p className="text-darkBlue text-[9px] md:text-xl font-bold">
              {t('AboutPage.headerText')}
            </p>
          </div>
          <img src={header} alt="" className="w-[50%]" />
        </div>
        <div className="singlePage font-dari_text text-black/60  bg-white py-10 mt-[10px] rounded-3xl px-6 ">
          <div>
            <h3 className="font-bold text-lg text-black text-center mb-5">
              {t('AboutPage.heading')}
            </h3>
            <div   className="leading-7 text-[15px]">
              {t('AboutPage.intro')}<br/>
              {t('AboutPage.specialties')}
              <ul className="list-disc px-8">
                {Object.entries(services).map(([key, value], index) => (
                    <li key={index} className="text-black/70">
                      {value}
                    </li>
                ))}

              </ul>
              {t('AboutPage.approach')}
            </div>
          </div>
          <div>
            <h2 className="font-bold text-lg text-black  my-5">{t('AboutPage.visionTitle')}</h2>
            <p className="leading-7 text-[15px]">
              {t('AboutPage.vision')}
            </p>
          </div>
          <div>
            <h3 className="font-bold text-lg text-black my-5">{t('AboutPage.missionTitle')}</h3>
            <p className="leading-7 text-[15px]">
              {t('AboutPage.mission')}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPageMain;
