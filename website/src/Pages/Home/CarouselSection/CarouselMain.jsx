// CarouselMain.js using Swiper
import { useTranslation } from "react-i18next";
import { useRef, useState, useEffect } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import i18next from "i18next";
import "swiper/css";
import "swiper/css/navigation";
import { FaArrowLeftLong, FaArrowRightLong } from "react-icons/fa6";
import CarouselThumbnails from "./CarouselThumbnails";
import { homeCarousel, localizedPath } from "../../../Data/data";
import { motion } from "motion/react";
import { buttonVariant } from "../../../Components/Motion/Variant";
import { Link } from "react-router-dom";
const CarouselMain = () => {
  const [showSwiper, setShowSwiper] = useState(true);
  const { t } = useTranslation();

  const swiperRef = useRef(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    // When language changes, briefly unmount Swiper
    setShowSwiper(false);
    const timeout = setTimeout(() => {
      setShowSwiper(true);
    }, 100); // or 50ms if 0 is too fast
    return () => clearTimeout(timeout);
  }, [i18next.language]);

  return (
    <div className="relative">
      {showSwiper && (
        <div
          onMouseEnter={() => swiperRef.current?.autoplay?.stop()}
          onMouseLeave={() => swiperRef.current?.autoplay?.start()}
        >
          <Swiper
            speed={1000}
            modules={[Navigation, Autoplay]}
            loop={true}
            navigation={{
              nextEl: ".custom-next",
              prevEl: ".custom-prev",
            }}
            autoplay={{ delay: 5000, disableOnInteraction: false }}
            onSwiper={(swiper) => (swiperRef.current = swiper)}
            onSlideChange={(swiper) => setCurrentIndex(swiper.realIndex)}
            className="max-w-[100vw]"
          >
            {homeCarousel.map((item, index) => (
              <SwiperSlide key={index}>
                <div className="relative w-full sm:h-[400px] md:[300px] lg:h-[400px]">
                  <picture>
                    <img
                      src={item.imgDesktop}
                      alt={`Slide ${index + 1}`}
                      className="sm:hidden md:block  w-full object-cover h-full  inset-0 z-0 rtl:scale-x-[-1]"
                    />
                    <img
                      src={item.imgMobile}
                      alt={`Slide ${index + 1}`}
                      className="md:hidden sm:block w-full  h-full  inset-0 z-0 rtl:scale-x-[-1]"
                    />
                  </picture>

                  <div className="absolute inset-0 z-20 flex top-10 justify-start px-4 max-w-[1200px] mx-auto">
                    <div className="text-white space-y-4 rtl:space-y-8">
                      <h2
                        className="max-w-xl mb-3 uppercase  md:first-letter:text-white rtl:tracking-normal tracking-[0.08621em] text-white md:text-white/70 text-[1.8125rem] leading-none  md:text-[2.5rem] md:tracking-[0.05em] lg:text-[2.8625rem] rtl:lg:text-[3.5625rem] lg:tracking-[0.07018em] rtl:lg:tracking-normal"
                        dangerouslySetInnerHTML={{
                          __html: t("Index.Carousel." + item.title),
                        }}
                      />
                      <p
                        className="max-w-xl mt-[2px]  tracking-[0.07692em] font-semibold text-[0.8125rem] leading-[1.2] text-white  md:mt-2 lg:mt-[1.4375rem] lg:text-[1.2rem] rtl:lg:text-[1.25rem] lg:tracking-[0.091em] rtl:tracking-[0] lg:font-['YekanBakh-Heavy']"
                        dangerouslySetInnerHTML={{
                          __html: t("Index.Carousel." + item.description),
                        }}
                      />
                      {item.button && (
                        <Link to={localizedPath(item.href)}>
                          <motion.div
                            variants={buttonVariant()}
                            whileTap="tap"
                            whileHover="hover"
                            target="_blank"
                            className="cursor-pointer inline-flex  mt-2 py-[0.71429em] px-[2.21429em] text-sm leading-[1.2] font-normal bg-primary text-white rounded-full border border-primary lg:mt-6 lg:py-[0.98571em] lg:px-[3em]"
                          >
                            {t("Index.Carousel." + item.button)}
                          </motion.div>
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            ))}

            {/* Navigation Arrows */}
            <ul className="absolute inset-x-0 z-[10] max-w-[1200px] mx-auto px-4 sm:hidden md:flex md:bottom-[1.75rem] lg:bottom-[2.375rem]">
              <li className="cursor-pointer custom-prev">
                <FaArrowLeftLong
                  className="text-white rtl:rotate-180"
                  size={20}
                />
              </li>
              <li className="cursor-pointer rtl:mr-2 rtl:ml-0 ml-2 custom-next">
                <FaArrowRightLong className="text-white text-[20px] rtl:rotate-180" />
              </li>
            </ul>
          </Swiper>
        </div>
      )}
      <CarouselThumbnails
        carouselData={homeCarousel}
        currentIndex={currentIndex}
        setCurrentIndex={(i) => {
          swiperRef.current?.slideToLoop(i);
          setCurrentIndex(i);
        }}
      />
    </div>
  );
};

export default CarouselMain;
