import React from "react";
import Direction from "../../Components/Direction";
import { LiaPhoneAltSolid } from "react-icons/lia";
import googleMap from "../../../public/image/googleMap.png";
import facebook from "../../../public/image/facebook.png";
import whatsapp from "../../../public/image/whatsapp.png";
import {useTranslation} from "react-i18next";
import {Link} from "react-router-dom";
import ContactForm from "./contactForm.jsx";
import {Helmet} from "react-helmet-async";
import i18n from "../../i18n.jsx";

const ContactPageMain = () => {
  const{t}=useTranslation();
  return (
    <div>
      <Helmet>
        <title>{t("metaContact.title")}</title>
        <meta name="description" content={t("metaContact.description")} />
        
        <link rel="canonical" href={`https://shokohatlas.co/${i18n.language}/contact-us`} />

        <link rel="alternate" href="https://shokohatlas.co/ru/contact-us" />
        <link rel="alternate" href="https://shokohatlas.co/en/contact-us" />
        <link rel="alternate" href="https://shokohatlas.co/fa/contact-us" />
        <link rel="alternate" hrefLang="x-default" href="https://shokohatlas.co/fa/contact-us" />


      </Helmet>
      <Direction link={t("ContactPage.title")} header={t("ContactPage.title")} />
      <div className="max-w-[1200px] mx-auto sm:mt-0 md:mt-[50px] px-4">
        <div className="flex sm:flex-col md:flex-row gap-10">
          <div className="sm:w-full md:w-[25%] bg-white flex flex-col py-8 px-5 rounded-xl gap-8">
            <div>
              <h2 className="text-lg font-semibold flex flex-row group h-full items-center gap-2">
                <div className="h-10 w-[2px] bg-primary" />
                {t("ContactPage.number")}
              </h2>
              <p>
                {t("ContactPage.numberText")}
              </p>
            </div>
            <div className="flex flex-col gap-5 mb-[40px]">
              <a
                  href="tel:+93787989681"
                  className="cursor-pointer relative flex flex-row py-5 px-7 gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-red to-primary text-white text-lg">
                <p className=''>0093787989681</p>
                <LiaPhoneAltSolid
                  className="text-black absolute self-center right-0  rtl:right-40 rtl:scale-x-[-1] opacity-70  "
                  size={70}
                />
              </a>
              <a
                  href="tel:+93791686859"
                  className="cursor-pointer relative flex flex-row py-5 px-7 gap-3 overflow-hidden rounded-2xl bg-gradient-to-r from-red to-primary text-white text-lg">
                0093791686859
                <LiaPhoneAltSolid
                    className="text-black absolute self-center right-0  rtl:right-40 rtl:scale-x-[-1] opacity-70  "
                    size={70}
                />
              </a>
            </div>
          </div>
          <div className="sm:w-full md:w-[50%] bg-white flex flex-col py-8 px-5 rounded-xl">
            <div className="mb-[20px]">
              <h2 className="text-lg font-semibold flex flex-row group h-full items-center gap-2">
                <div className="h-10 w-[2px] bg-primary" />
                {t("ContactPage.getInTouch")}
              </h2>
            </div>
            <p className="text-black text-sm mb-4 text-center">
              {t("ContactPage.getInTouchText")}
            </p>
            <ContactForm />
          </div>
          <div className="sm:w-full md:w-[25%] bg-white flex flex-col py-8 px-5 rounded-xl">
            <div className="mb-[20px]">
              <h2 className="text-lg font-semibold flex flex-row group h-full items-center gap-2">
                <div className="h-10 w-[2px] bg-primary" />
                {t("ContactPage.socialLink")}
              </h2>
            </div>
            <div className="flex flex-col gap-7  text-center">
              <p>{t("ContactPage.socialLinkText")}</p>
              <div className="flex flex-col gap-7">
                <a
                    href='https://wa.me/+93791686859'
                    target='_blank'
                    rel="noopener noreferrer"
                    className="cursor-pointer relativecursor-pointer relative flex flex-row px-7 py-4  rounded-2xl bg-gradient-to-r from-red to-primary text-white text-lg">
                  <div className=" bg-white rounded-full p-3 h-[65px] w-[65px] absolute right-12  rtl:right-36 -top-1 items-center justify-center content-center text-center">
                    <img
                      src={whatsapp}
                      alt="whatsapp"
                      className=" self-center"
                    />
                  </div>
                  <p className=''>{t("ContactPage.whatsapp")}</p>
                </a>

                <a
                    href='https://www.facebook.com/share/1AFnU8Ncos/?mibextid=wwXIfr'
                    target='_blank'
                    rel="noopener noreferrer"
                    className="cursor-pointer relativecursor-pointer relative flex flex-row px-7 py-4  rounded-2xl bg-gradient-to-r from-red to-primary text-white text-lg">
                  <div className="bg-white rounded-full p-3 h-[65px] w-[65px] absolute right-12  rtl:right-36 -top-1 items-center justify-center">
                    <img src={facebook} alt="whatsapp" className="" />
                  </div>
                  <p>{t("ContactPage.facebook")}</p>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div
            className="contact-map-section w-full mt-[30px] bg-white py-8 px-4 rounded-xl flex flex-col md:flex-row  sm:gap-10 ">
          <div>
            <div className="mb-[20px]">
              <h2 className="text-lg font-semibold flex flex-row group h-full items-center gap-2">
                <div className="h-10 w-[2px] bg-primary"/>
                {t("ContactPage.ourAddress")}
              </h2>
            </div>
            <div className="text-center items-center mt-[20px] flex flex-col gap-8 px-4">
              <div className="text-black/60 text-md">
                {t("ContactPage.ourAddressText")}
              </div>
              <div> {t("ContactPage.routingIn")}</div>

              <a
                  href='https://maps.app.goo.gl/6wp7JdPyX3YGMiiD7?g_st=iw'
                  target='_blank'
                  className="flex flex-col gap-1 cursor-pointer text-center items-center">
                <img src={googleMap} alt="" className="h-[80px] w-[60px]"/>
                <p className="text-sm text-black">{t("ContactPage.googleMap")}</p>
              </a>
            </div>
          </div>
          <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3287.5833069092723!2d69.0077383!3d34.5134468!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x38d3f900112f742f%3A0x8b7a1476a9a26b65!2z2LTYsdqp2Kog2KrZiNmE24zYr9uMINi02qnZiNmHINin2LfZhNiz!5e0!3m2!1sfa!2sca!4v1753894635246!5m2!1sfa!2sca"

              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen={true}
              loading="lazy"
              className="h-[400px] w-full md:w-[50%] rounded-xl"
          ></iframe>
        </div>
      </div>
    </div>
  );
};

export default ContactPageMain;
