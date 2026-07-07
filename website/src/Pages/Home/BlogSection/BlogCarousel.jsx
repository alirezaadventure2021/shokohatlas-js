import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";

import { useEffect, useRef, useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import BlogCard from "../../../Components/BlogCart";
import i18next from "i18next";

const BlogCarousel = ({ blogs }) => {
  const swiperRef = useRef(null);
  const [showSwiper, setShowSwiper] = useState(true);

  useEffect(() => {
    // When language changes, briefly unmount Swiper
    setShowSwiper(false);
    const timeout = setTimeout(() => {
      setShowSwiper(true);
    }, 50); // or 50ms if 0 is too fast
    return () => clearTimeout(timeout);
  }, [i18next.language]);
  return (
    <div className="max-w-full h-full rounded-3xl py-6 px-3">
      {showSwiper && (
        <Swiper
          onSwiper={(swiper) => (swiperRef.current = swiper)}
          loop={true}
          pagination={{ clickable: true }}
          breakpoints={{
            350: {
              slidesPerView: 2,
              spaceBetween: 1,
            },
            768: {
              slidesPerView: 3,
              spaceBetween: 3,
            },
            1024: {
              slidesPerView: 4,
              spaceBetween: 4,
            },
          }}
        >
          {blogs.map((blog, index) => (
            <SwiperSlide
              key={index}
              className="px-[1px] md:px-3 py-1 md:py-6 h-full"
            >
              <BlogCard blog={blog} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
      {/* Custom Arrows */}
      <div className="flex justify-center gap-4 items-center mt-6">
        <button
          onClick={() => swiperRef.current?.slidePrev()}
          className="p-2 rounded-full bg-primary text-white "
        >
          <FaChevronLeft className="rtl:rotate-180" />
        </button>
        <button
          onClick={() => swiperRef.current?.slideNext()}
          className="p-2 rounded-full bg-primary text-white "
        >
          <FaChevronRight className="rtl:rotate-180" />
        </button>
      </div>
    </div>
  );
};

export default BlogCarousel;
