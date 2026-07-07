import HeaderLogo from "./HeaderLogo";
import HeaderButtons from "./HeaderButtons";
import { AnimatePresence } from "motion/react";
import { useEffect, useRef, useState } from "react";
import HeaderLinks from "./HeaderLinks";
import HeaderSubMenu from "./HeaderSubMenu";
import HeaderSm from "./HeaderSm";
import { Languages, navLinks } from "../../Data/data";
import LangSubMenu from "./LangSubMenu";
import { useNavigate, Link, useLocation } from "react-router-dom";
import i18n from "../../i18n";

const HeaderMain = ({products, services}) => {

  const location = useLocation();
  const Navigate = useNavigate();

  const [openMenuIndex, setOpenMenuIndex] = useState(null);
  const [isSubMenuOpen, setSubMenuOpen] = useState(false);
  const [isMenuopen, setMenuOpen] = useState(false);
  const [linkIndex, setLinkIndex] = useState(null);
  const [isLangMenuOpen, setLangMenuOpen] = useState(false);

  const navLinkRef = useRef([]);
  const SubMenuRef = useRef(null);
  const langMenuRef = useRef(null);
  const langButtonRef = useRef(null);

  const currentLang = Languages.find((l) => l.code === i18n.language) || {
    prefix: "fa",
    flag: fa,
  };



  const languageChanger = (lang) => {
    const parts = location.pathname.split("/").filter(Boolean);
    const supported = ["en", "ru", "fa"];

    if (supported.includes(parts[0])) {
      parts[0] = lang;
    } else {
      parts.unshift(lang);
    }

    const newPath = "/" + parts.join("/");
    i18n.changeLanguage(lang);
    Navigate(newPath, { replace: true });
  };

  useEffect(() => {
    if (!isSubMenuOpen) {
      setOpenMenuIndex(null);
    }
    const handleClickOutside = (e) => {
      if (
        openMenuIndex !== null &&
        navLinkRef.current[openMenuIndex] &&
        !navLinkRef.current[openMenuIndex].contains(e.target) &&
        SubMenuRef.current &&
        !SubMenuRef.current.contains(e.target)
      ) {
        setOpenMenuIndex(null);
        setSubMenuOpen(false);
      }
      if (
        langMenuRef.current &&
        !langMenuRef.current.contains(e.target) &&
        langButtonRef.current &&
        !langButtonRef.current.contains(e.target)
      ) {
        setLangMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [linkIndex]);

  const toggleSubMenu = (index) => {
    const isOpenning = openMenuIndex !== index;
    setOpenMenuIndex(isOpenning ? index : null);
    setSubMenuOpen(isOpenning);
    setLinkIndex(index);
  };

  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", isMenuopen);

    // Optional: clean up when component unmounts
    return () => {
      document.body.classList.remove("overflow-hidden");
    };
  }, [isMenuopen]);

  return (
    <header className="">
      {/* Desktop Navbar */}
      <div className={`sm:hidden lg:block max-w-[1200px] mx-auto px-4`}>
        <div className="flex items-end w-full h-full justify-between z-50">
          <HeaderLogo />
          <HeaderLinks
            ref={navLinkRef}
            navLinks={navLinks}
            toggleSubMenu={toggleSubMenu}
            setSubMenuOpen={setSubMenuOpen}
            isSubMenuOpen={isSubMenuOpen}
            linkIndex={linkIndex}
          />

          <HeaderButtons
            currentLang={currentLang}
            ref={langButtonRef}
            setLangMenuOpen={setLangMenuOpen}
            isLangMenuOpen={isLangMenuOpen}
          />
        </div>
      </div>

      {/* Desktop Dropdown */}
      <AnimatePresence mode="wait">
        {isSubMenuOpen && (
          <HeaderSubMenu
            currentLink={navLinks[linkIndex]}
            setSubMenuOpen={setSubMenuOpen}
            linkIndex={linkIndex}
            ref={SubMenuRef}
            products={products}
            services={services}
          />
        )}
      </AnimatePresence>
      {/* Language Menu PC */}
      <AnimatePresence mode="wait">
        {isLangMenuOpen && (
          <LangSubMenu
            langs={Languages}
            ref={langMenuRef}
            setLangMenuOpen={setLangMenuOpen}
            languageChanger={languageChanger}
          />
        )}
      </AnimatePresence>

      {/* Mobile Top Bar */}
      <div className="lg:hidden flex justify-between items-end px-4 py-1">
        <HeaderLogo />
        <HeaderButtons setMenuOpen={setMenuOpen} isMenuopen={isMenuopen} />
      </div>
      {/* Mobile Menu  */}
      <AnimatePresence mode="wait">
        {isMenuopen && (
          <HeaderSm
              products={products}
              services={services}
            languageChanger={languageChanger}
            currentLang={currentLang}
            navLinks={navLinks}
            openMenuIndex={openMenuIndex}
            setOpenMenuIndex={setOpenMenuIndex}
            isLangMenuOpen={isLangMenuOpen}
            setLangMenuOpen={setLangMenuOpen}
            Lang={Languages}
            isMenuopen={isMenuopen}
            setMenuOpen={setMenuOpen}
          />
        )}
      </AnimatePresence>
      <div className="h-[1px] max-w-[1200px] mx-auto bg-gradient-to-r from-white via-primary to-white" />
    </header>
  );
};

export default HeaderMain;
