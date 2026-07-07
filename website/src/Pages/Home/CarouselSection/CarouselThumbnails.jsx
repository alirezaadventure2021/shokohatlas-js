import React from "react";

const CarouselThumbnails = ({
  carouselData,
  currentIndex,
  setCurrentIndex,
}) => {
  return (
    <div className="absolute right-0  sm:bottom-20 ss:bottom-10 z-[15] w-full md:bottom-[-40px] md:pr-[30px] xl:pr-0 ">
      <ul className="flex justify-center md:justify-end max-w-[1200px] mx-auto px-4 ">
        {carouselData.map((item, index) => (
          <li
            key={index}
            className="md:w-[104px] md:h-[62px] lg:w-[129px] lg:h-[77px] mr-2  "
          >
            <a
              className={` cursor-pointer flex relative w-[15px] h-[15px] mx-[10px] rounded-lg overflow-hidden md:border-[2px] border-white  md:w-full bg-white/30 md:h-auto   transition-all duration-500 ${
                currentIndex === index
                  ? "shadow-lg shadow-black/20 sm:bg-white "
                  : ""
              }`}
              onClick={() => setCurrentIndex(index)}
            >
              <img
                src={item.thumbnail}
                alt={`Thumbnail ${index + 1}`}
                className="hidden md:block rounded-lg"
              />
              <span
                className={`absolute bottom-0 left-0 w-full h-[3.5px] hidden md:block overflow-hidden rounded-lg`}
              >
                <span
                  className={`block h-full bg-primary ${
                    currentIndex === index ? "thumbnails-progress" : "w-0"
                  }`}
                />
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CarouselThumbnails;
