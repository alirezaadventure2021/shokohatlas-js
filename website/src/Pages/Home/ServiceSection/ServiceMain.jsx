import React, { useEffect, useState } from "react";
import ServiceLeft from "./ServiceLeft";
import ServiceRight from "./ServiceRight";
import SectionHeder from "../../../Components/SectionHeader";
import Button from "../../../Components/Button";
import { useTranslation } from "react-i18next";
import i18next from "i18next";
import axiosClient from "../../../axios-client.jsx";
import i18n from "../../../i18n.jsx";

const ServiceMain = () => {
  const [directionr, setDirectionr] = useState("");
  const [directionl, setDirectionl] = useState("");
  const [ services, setServices]= useState([]);

    useEffect(() => {
        axiosClient
            .get(`/headerServices?lang=${i18n.language}`)
            .then(({ data }) => setServices(data))
            .catch(console.error);
    }, [i18n.language]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const dir = document.getElementById("root")?.getAttribute("dir") || "ltr";
      if (dir) {
        setDirectionr(dir === "ltr" ? "left" : "right");
        setDirectionl(dir === "ltr" ? "right" : "left");

      }
    }, [i18next.language]); // run after initial render

    return () => clearTimeout(timeout);
  }, []);
  const { t } = useTranslation();
  return (
    <div className="mt-[20px] md:mt-[100px] max-w-[1200px] mx-auto px-4 flex flex-col items-center gap-6 overflow-hidden pb-4">
      <SectionHeder text={t("Index.Services.Title")} />
      <div className="flex lg:flex-row sm:flex-col sm:items-center lg:items-start justify-between w-full gap-10">
        {directionl !== "" && (
          <>
            <ServiceLeft t={t} direction={directionl} />
            <ServiceRight t={t} direction={directionr} services={services}/>
          </>
        )}
      </div>
      <Button text={t("Index.Services.Button")} link='/services'/>
    </div>
  );
};

export default ServiceMain;
