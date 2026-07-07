import React, {useEffect, useState} from "react";
import Direction from "../../../Components/Direction";

import {useNavigate, useParams} from "react-router-dom";
import axiosClient from "../../../axios-client.jsx";
import i18n from "../../../i18n.jsx";
import {Helmet} from "react-helmet-async";
import HelmetComponent from "../../../Components/helmetComponent.jsx";

const SingleService = () => {

  let { slug } = useParams();
  const [service, setService] = useState(null);
  const navigate= useNavigate();
  const apiKey = import.meta.env.VITE_API_BASE_URL;

  useEffect(() => {
    axiosClient
        .get(`/getService/${slug}?lang=${i18n.language}`)
        .then(({ data }) => {
          setService(data);
        })
        .catch((err) => {
          console.error(err);
        });
  }, [slug, i18n.language]);

  useEffect(() => {
    if (!service) return;

    const currentLang = i18n.language;
    const currentSlug = slug;

    const translatedSlug = service.slug_all?.[currentLang];

    if (translatedSlug && translatedSlug !== currentSlug) {
      navigate(`/${currentLang}/services/${translatedSlug}`, { replace: true });
    }
  }, [i18n.language]);

  return (
    <div>
      {service && (
          <div>
           <HelmetComponent page={service} url="services"/>
            <Direction
                link={ service?.title}
                header={service?.title}
            />
            <div>
              <div className=" w-full  md:h-[300px] lg:h-[400px]">
                <img src={apiKey+service.photo} alt="" className="h-full w-full object-cover" />
              </div>
              <div className="singlePage max-w-[1200px] mx-auto px-4 mt-[10px] bg-white rounded-xl py-0 pb-5 md:py-10 " dangerouslySetInnerHTML={{__html: service.article}} />
            </div>
          </div>
      )}
    </div>
  );
};

export default SingleService;
