import React, {  useEffect, useRef, useState } from "react";
import { FaChevronDown } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import { localizedPath} from "../../Data/data";
import { AnimatePresence, motion } from "motion/react";
import { submenuVariants } from "../Motion/Variant";
import SubmenuSm from "./SubmenuSm";
import {Link} from "react-router-dom";

const HeaderSm = ({
  navLinks,
  openMenuIndex,
  Lang,
  isMenuOpen,
  setMenuOpen,
  setOpenMenuIndex,
  languageChanger,
  currentLang,
    products,
    services
}) => {
  const { t } = useTranslation();

  const menuRef = useRef(null);
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [isLangMenuOpen, setLangMenuOpen] = useState(false);

  const langButtonRef = useRef();
  const langMenuRef = useRef();
  const linkButtonRef = useRef();
  const subMenuRef = useRef();

  const toggleSubMenu = (index) => {
    const isOpenning = openMenuIndex !== index;
    setOpenMenuIndex(isOpenning ? index : null);
    setSubMenuOpen(isOpenning);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target) &&
        langButtonRef.current &&
        !langButtonRef.current.contains(e.target)
      ) {
        setLangMenuOpen(false);
      }
      if (
        subMenuRef.current &&
        !subMenuRef.current.contains(e.target) &&
        linkButtonRef.current &&
        !linkButtonRef.current.contains(e.target)
      ) {
        setSubMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMenuOpen]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={submenuVariants(0.3, 0.4)}
      className=" absolute bottom-0 top-[85px] w-full 
         h-full max-h-screen z-20  overflow-y-scroll "
      ref={menuRef}
    >
      <div className=" bg-secondry/80 backdrop-blur-sm text-white/90 h-full sm:block lg:hidden">
        <div className="flex flex-col">
          {navLinks.map((item, index) =>
            item.hasSubLinks ? (
              <div key={index}>
                <div
                  className={`py-4 px-3 flex justify-between items-center cursor-pointer border-b border-white/30
                     `}
                  onClick={() => toggleSubMenu(index)}
                  ref={linkButtonRef}
                >
                  <div> {t("NavLinks." + item.name)}</div>
                  <FaChevronDown
                    size={15}
                    className={`${
                      isSubMenuOpen && openMenuIndex == index
                        ? "rotate-180 "
                        : "rotate-0 "
                    } transition-all duration-500`}
                  />
                </div>
                <AnimatePresence mode="wait">
                  {isSubMenuOpen && openMenuIndex === index && (
                    <SubmenuSm link={item} t={t} ref={subMenuRef} products={products} services={services} isMenuOpen={isMenuOpen} isSubMenuOpen={isSubMenuOpen}/>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                  to={localizedPath(item.href)}
                  onClick={()=>isMenuOpen(false)}
                  key={index}
                  className={`bg-cyan px-3 py-4 cursor-pointer 
                    border-b border-white/30`}
              >
                {t("NavLinks." + item.name)}
              </Link>
            )
          )}

          <div>
            <div
              className=" flex   px-3 py-4 cursor-pointer justify-between"
              onClick={() => setLangMenuOpen((prev) => !prev)}
              ref={langButtonRef}
            >
              <div className="flex gap-2 items-center ">
                <div className={`h-6 w-6 rounded-full overflow-hidden  `}>
                  <img
                    src={currentLang?.flag}
                    alt=""
                    className="h-full w-full object-cover"
                  />
                </div>
                <p>{currentLang?.prefix}</p>
              </div>

              <div className="flex items-center gap-1" ref={langButtonRef}>
                <FaChevronDown
                  size={15}
                  className={` ${
                    isLangMenuOpen ? "rotate-180" : "rotate-0"
                  } transition-all duration-500`}
                />
              </div>
            </div>

            <div>
              <AnimatePresence mode="wait">
                {isLangMenuOpen && (
                  <motion.div
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    variants={submenuVariants(0.2, 0.2)}
                    className="overflow-hidden"
                    ref={langMenuRef}
                  >
                    <ul className="h-full bottom-0 py-3 px-6 bg-cyan/30 backdrop-blur-lg border-t border-white/30 bg-secondry/80 ">
                      {Lang.map((item, index) => (
                        <li
                          className="py-2 text-gray-600 flex gap-2 items-center hover:underline "
                          key={index}
                          onClick={() => languageChanger(item.code)}
                        >
                          <div
                            className={`h-6 w-6 rounded-full overflow-hidden  `}
                          >
                            <img
                              src={item.flag}
                              alt=""
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <a href="#">{item.name}</a>
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HeaderSm;
