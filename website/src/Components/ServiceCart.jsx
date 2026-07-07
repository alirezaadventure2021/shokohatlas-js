
import row from "/image/rows.png";
import {Link} from "react-router-dom";
import {localizedPath} from "../Data/data.js";
import {useTranslation} from "react-i18next";

const ServiceCart = ({service , index}) => {
  const {t} = useTranslation();
  const apiKey = import.meta.env.VITE_API_BASE_URL;
  return (
    <li
        key={index}
        className=" bg-gradient-to-r from-white to-secondry rounded-xl p-[4px] cursor-pointer shadow-sms hover:scale-100 md:hover:scale-105 transition-all duration-300">
      <Link
          to={localizedPath(`/services/${service?.slug}`)}
          className=" h-full w-full bg-white rounded-xl flex flex-col md:flex-row gap-3 px-4 py-6">
        {/* Image Section */}
        <div className="w-full md:w-[50%] h-full overflow-hidden rounded-2xl shadow-sm">
          <img
            src={apiKey + service?.photo}
            alt="Steam Boiler Installation"
            className="w-full h-full object-cover rounded-2xl hover:scale-105 transition-transform duration-300"
          />
        </div>

        {/* Content Section */}
        <div className="w-full md:w-[70%]  flex flex-col justify-between gap-6">
          <div className="space-y-3">
            <h2 className="text-lg  text-gray-900 leading-snug">
              {service?.name}
            </h2>
            <p className="text-dimBlack/60 text-xs leading-relaxed line-clamp-3">
              {service?.description}
            </p>
          </div>

          <div className="self-end md:self-end">
            <div
              className="inline-flex items-center gap-2 text-secondry hover:no-underline md:hover:underline text-sm font-medium transition-colors"
            >
              {t('ServicesPage.more')}
              <img
                src={row}
                alt=""
                className="rtl:rotate-0 rotate-180 h-[20px]"
              />
            </div>
          </div>
        </div>
      </Link>
    </li>
  );
};

export default ServiceCart;
