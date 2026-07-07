import { forwardRef } from "react";
import { GrClose } from "react-icons/gr";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { submenuVariants } from "../Motion/Variant";
const LangSubMenu = forwardRef(
  ({ langs, setLangMenuOpen, languageChanger }, ref) => {
    const { t } = useTranslation();
    return (
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={submenuVariants(0.3, 0.2)}
        className="overflow-hidden sm:hidden lg:block absolute left-0 w-full  z-20 "
        ref={ref}
      >
        <div className="bg-secondry/30 backdrop-blur-lg text-white">
          <div className="  py-6  bg-secondry">
            <div className=" max-w-[1200px] mx-auto px-4 text-2xl flex justify-between">
              <div className="flex gap-2 items-center">
                {t("SelectLanguage")}
              </div>
              <div
                className="border-[1px] border-white text-white cursor-pointer p-2 rounded-full"
                onClick={() => setLangMenuOpen(false)}
              >
                <GrClose size={18} />
              </div>
            </div>
          </div>

          <div className="  pt-8 pb-12  px-4 ">
            <ul className="max-w-[1200px] mx-auto grid grid-cols-4 gap-6 ">
              {langs.map((item, index) => (
                <div
                  key={index}
                  className="flex items-center text-center  gap-1 text-gray-700 hover:text-blue-500 py-2 px-3 "
                >
                  <a
                    className="cursor-pointer hover:underline flex gap-1 items-center"
                    onClick={() => languageChanger(item.code)}
                  >
                    <div className={`h-8 w-8 rounded-full overflow-hidden  `}>
                      <img
                        src={item.flag}
                        alt=""
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <p className="">{item.name}</p>
                  </a>
                </div>
              ))}
            </ul>
          </div>
        </div>
      </motion.div>
    );
  }
);

export default LangSubMenu;
