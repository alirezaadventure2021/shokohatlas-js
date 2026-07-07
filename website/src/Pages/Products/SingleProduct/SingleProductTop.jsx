import React, { useEffect, useRef, useState } from "react";

import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Thumbs, FreeMode } from "swiper/modules";

import "swiper/css";
import "swiper/css/navigation";
import i18next from "i18next";

import { useTranslation } from "react-i18next";

export default function SingleProductTop(props) {
  const apiKey = import.meta.env.VITE_API_BASE_URL;
  const { t } = useTranslation();
  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [swiperInstance, setSwiperInstance] = useState(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [showSwiper, setShowSwiper] = useState(true);

  const [zoomPosition, setZoomPosition] = useState({ x: "50%", y: "50%" });
  const [isZooming, setIsZooming] = useState(false);
  const isMobile = window.innerWidth <=768;
  const handleMouseMove = (e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomPosition({ x: `${x}%`, y: `${y}%` });
  };

  const handleMouseEnter = () =>
  {if(!isMobile){ setIsZooming(true)};}
  const handleMouseLeave = () => {
    if(!isMobile){setIsZooming(false)}
  };

  useEffect(() => {
    // When language changes, briefly unmount Swiper
    setShowSwiper(false);
    const timeout = setTimeout(() => {
      setShowSwiper(true);
    }, 50); // or 50ms if 0 is too fast
    return () => clearTimeout(timeout);
  }, [i18next.language]);

  const parseProperties = (propertyString) => {
    if (!propertyString) return [];

    return propertyString
      .split(/\r?\n/)
      .map((line) => {
        const [key, ...rest] = line.split(":");
        return {
          key: key?.trim(),
          value: rest.join(":").trim(),
        };
      })
      .filter((item) => item.key && item.value);
  };
  const properties = parseProperties(props.properties);

  return (
    <div className=" w-full flex flex-col md:flex-row gap-8  py-10 border-b px-4">
      {/* Image Section */}
      {showSwiper && (
        <div className="sm:w-full md:w-[50%] group">
          {/* Main Swiper */}

          <Swiper
            onSwiper={setSwiperInstance}
            spaceBetween={10}
            navigation={true}
            onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
            thumbs={{
              swiper:
                thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null,
            }}
            modules={[Navigation, Thumbs, FreeMode]}
            className="album1 relative rounded-xl shadow-md overflow-hidden flex items-center justify-center "
            style={{
              "--swiper-navigation-color": "#000",
              "--swiper-pagination-color": "#000",
            }}
          >
            {props.images.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onMouseMove={handleMouseMove}
                  className="w-full aspect-[4/3] sm:aspect-[5/3] lg:aspect-[16/10] flex items-center justify-center bg-black/20 overflow-hidden relative rounded-xl"
                >
                  <img
                    src={apiKey + img.path}
                    alt={props?.name}
                    className={`h-full w-full object-cover transition-transform duration-300 ${
                      isZooming ? "scale-150" : "scale-100"
                    }`}
                    style={{
                      transformOrigin: `${zoomPosition.x} ${zoomPosition.y}`,
                    }}
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>

          {/* Thumbnail Swiper */}
          <Swiper
            onSwiper={setThumbsSwiper}
            spaceBetween={10}
            slidesPerView={3}
            freeMode={false}
            watchSlidesProgress={true}
            modules={[FreeMode, Navigation, Thumbs]}
            className="mt-2"
          >
            {props.images.map((img, index) => (
              <SwiperSlide key={index}>
                <div
                  className={`${
                    index === activeIndex
                      ? "opacity-50 shadow-lg"
                      : "opacity-100"
                  }  aspect-auto flex items-center justify-center bg-black/15  rounded-xl overflow-hidden transition-all duration-300`}
                >
                  <img
                    src={apiKey + img.path}
                    alt={props.name}
                    className="w-full h-full object-cover rounded"
                  />
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      )}

      {/* Product Description */}
      <div className="w-full md:w-[50%] px-4 py-10 bg-white rounded-xl overflow-hidden">
        <h2 className="font-bold text-lg md:text-2xl mb-2">{props.name}</h2>

        <h3 className="text-dimBlack/70 font-semibold text-sm md:text-lg mb-2 mt-4">
          {t("SingleProductPage.description")}
        </h3>
        <div className="flex gap-2 flex-wrap text-dimBlack/50  text-xs md:text-sm leading-5">
          {properties.map((item, index) => (
            <h3 key={index} className='text-white bg-black/50 px-2 py-1 md:px-4 md:py-2 rounded-xl'>
              {item.key}: {item.value}
            </h3>
          ))}
        </div>
      </div>
    </div>
  );
}
