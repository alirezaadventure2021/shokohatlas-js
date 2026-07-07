import { FaChevronDown } from "react-icons/fa";
import { forwardRef, useEffect } from "react";
import { HiOutlineMenuAlt2 } from "react-icons/hi";
import { IoClose } from "react-icons/io5";
import facebook from "../../../public/image/facebook1.png";
import whatsapp from "../../../public/image/whatsapp1.png";

const HeaderButtons = forwardRef(
  (
    { setMenuOpen, isMenuopen, setLangMenuOpen, isLangMenuOpen, currentLang },
    ref
  ) => {
    useEffect(() => {
      if (isMenuopen) {
        document.body.classList.add("body-no-scroll");
      } else {
        document.body.classList.remove("body-no-scroll");
      }

      // Cleanup function
      return () => {
        document.body.classList.remove("body-no-scroll");
      };
    }, [isMenuopen]);

    return (
      <div className="h-full flex flex-col  lg:gap-3 items-end md:gap-4 sm:gap-2  relative md:pb-1 sm:py-0">

        <div className="flex lg:gap-2  sm:gap-2 pb-0 md:pb-2">
          <a
              href='https://www.facebook.com/share/1AFnU8Ncos/?mibextid=wwXIfr'
              target='_blank'
              rel="noopener noreferrer"
              className="w-[25px] md:w-[30px] h-auto cursor-pointer  ">
            <img src={facebook} alt="" />
          </a>

          <a
              href='https://wa.me/+93791686859'
              target='_blank'
              rel="noopener noreferrer"
              className="w-[25px] md:w-[30px] h-auto cursor-pointer">
            <img src={whatsapp} alt="" />
          </a>
        </div>

        <div>
          <div className="flex flex-row text-sm sm:hidden lg:flex gap-2 justify-end items-end cursor-pointer">
            <div className=" rtl:order-2 order-1 flex gap-1 items-center ">
              <div
                  className={`rtl:order-2 h-6 w-6 rounded-full overflow-hidden  `}
              >
                <img
                    src={currentLang?.flag}
                    alt=""
                    className="h-full w-full object-cover"
                />
              </div>

              <div className="rtl:order-1 order-2 w-[2px] h-6 bg-primary "></div>
            </div>

            <div
                className="rtl:order-1 order-2 flex items-center gap-1 hover:text-orange transition-colors duration-500  "
                onClick={() => setLangMenuOpen((prev) => !prev)}
                ref={ref}
            >
              <p className=" rtl:order-2 order-1 font-body">
                {currentLang?.prefix}
              </p>
              <FaChevronDown
                  size={10}
                  className={`mt-1 rtl:order-1 order-2 ${
                      isLangMenuOpen ? "rotate-180" : "rotate-0"
                  } transition-all duration-500`}
              />
            </div>
          </div>
          <div
              className="sm:block lg:hidden text-3xl cursor-pointer font-bold  "
              onClick={() => {
                setMenuOpen((prev) => !prev);
              }}
          >
            {isMenuopen ? (
                <IoClose size={30} className="font-bold text-darkBlue" />
            ) : (
                <HiOutlineMenuAlt2 className="rotate-180  text-darkBlue" />
            )}
          </div>
        </div>
      </div>
    );
  }
);

export default HeaderButtons;
