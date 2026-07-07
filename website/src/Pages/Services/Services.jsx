import React, {useEffect, useState} from "react";
import Direction from "../../Components/Direction";

import serviceImg from "../../assets/image/services/service2.jpg";

import ServiceCart from "../../Components/ServiceCart";
import {useTranslation} from "react-i18next";
import axiosClient from "../../axios-client.jsx";
import i18n from "../../i18n.jsx";

const Services = () => {
    const [services, setServices] = useState([]);
    const {t}=useTranslation();

    useEffect(() => {
        axiosClient
            .get(`/headerServices?lang=${i18n.language}`)
            .then(({ data }) => setServices(data))
            .catch(console.error);
    }, [i18n.language]);
  return (
    <div>
      <Direction link={t('ServicesPage.title')} header={t('ServicesPage.title')} />
      <div className="w-full h-[250px]">
        <img src={serviceImg} className="h-full w-full object-cover" />
      </div>
      <section className={`max-w-[1200px] mx-auto px-4  rounded-xl mt-[30px]`}>
        {/* <h2 className={`${styles.heading2}`}>Services</h2> */}

        <p className="text-sm text-dimBlack/60">
            {t('ServicesPage.AboutIntro')}
        </p>

        {/* <DashedHeader title="Services" /> */}
        <div className=" gap-2">
          <ul className=" grid sm:grid-1 md:grid-cols-2 mt-[50px] w-[100%] gap-5 ">
              {services.map((service , index)=>(
                     <ServiceCart  service={service} index={index}/>
              ))}

          </ul>
        </div>
      </section>
    </div>
  );
};

export default Services;
