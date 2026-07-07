import ru from "../assets/image/regions/ru.svg";
import en from "../assets/image/regions/us.svg";
import da from "../assets/image/regions/af.svg";



import BlogImg from "../assets/image/Blogs/blog1.png";
import BlogBg1 from "../assets/image/Blogs/1000.jpg";
import BlogBg2 from "../assets/image/Blogs/1001.jpg";
import BlogBg3 from "../assets/image/Blogs/1002.jpg";
import BlogBg4 from "../assets/image/Blogs/1003.jpg";
import BlogBg5 from "../assets/image/Blogs/1004.jpg";
import BlogBg7 from "../assets/image/Blogs/1005.jpg";

import Blog1 from "../assets/image/Blogs/blog1.png";
import Blog2 from "../assets/image/Blogs/blog2.png";


import heroPc0 from "../assets/image/slider/hero-0.jpg";
import heroPc1 from "../assets/image/slider/hero1.jpg";
import heroPc2 from "../assets/image/slider/hero2.jpg";

import heroSp0 from "../assets/image/slider/heroSp0.jpg";
import heroSp1 from "../assets/image/slider/heroSp1.jpg";
import heroSp2 from "../assets/image/slider/heroSp2.jpg";

import thumbnail0 from "../assets/image/slider/thumbnail0.jpg";
import thumbnail1 from "../assets/image/slider/thumbnail1.jpg";
import thumbnail2 from "../assets/image/slider/thumbnail2.jpg";

import i18n from "../i18n.jsx";


export const localizedPath = (path) => {
  const lang = i18n.language;
  if (!path.startsWith("/")) path = "/" + path;
  return `/${lang}${path}`;
};
export const Languages = [
  { code: "en", prefix: "En", name: "English", flag: en },
  { code: "fa", prefix: "Da", name: "دری", flag: da },
  { code: "ru", prefix: "Ru", name: "Русский", flag: ru },
];




export const Services = [
  {
    name: "Steam",
    href: "#",
  },
  {
    name: "Hetting",
    href: "#",
  },
  {
    name: "Smoke",
    href: "#",
  },
  {
    name: "Water",
    href: "#",
  },
];

export const navLinks = [
  {
    name: "Products",
    hasSubLinks: true,
    href: "/products",
  },
  {
    name: "Services",
    hasSubLinks: true,
    href: "/services",
  },
  {
    name: "Blogs",
    href: "/blogs",
    hasSubLinks: false,
  },
  {
    name: "Contact",
    href: "/contact-us",
    hasSubLinks: false,
  },
  {
    name: "About Us",
    href: "/about-us",
    hasSubLinks: false,
  },
];




export const Blogs = [
  {
    name: "Comparing",
    link: "#",
    img: Blog1,
    bgImg: BlogBg1,
    date: "20-03-2025",
  },
  {
    name: "Boiler",
    link: "#",
    img: Blog2,
    bgImg: BlogBg2,
    date: "20-03-2025",
  },
  {
    name: "Comparing",
    link: "#",
    img: BlogImg,
    bgImg: BlogBg3,
    date: "20-03-2025",
  },
  {
    name: "Boiler",
    link: "#",
    img: BlogImg,
    bgImg: BlogBg4,
    date: "20-03-2025",
  },
  {
    name: "Discover",
    link: "#",
    img: BlogImg,
    bgImg: BlogBg5,
    date: "20-03-2025",
  },
  {
    name: "Boiler",
    link: "#",
    img: BlogImg,
    bgImg: BlogBg4,
    date: "20-03-2025",
  },
  {
    name: "Discover",
    link: "#",
    img: BlogImg,
    bgImg: BlogBg5,
    date: "20-03-2025",
  },
  {
    name: "Boiler",
    link: "#",
    img: BlogImg,
    bgImg: BlogBg4,
    date: "20-03-2025",
  },
  {
    name: "Discover",
    link: "#",
    img: BlogImg,
    bgImg: BlogBg7,
    date: "20-03-2025",
  },
];

export const homeCarousel = [
  {
    title: "Title1",
    description: "Description1",
    imgDesktop: heroPc0,
    imgMobile: heroSp0,
    thumbnail: thumbnail0,
    button: "Button1",
    href: "/services",
  },
  {
    title: "Title2",
    description: "Description2",
    imgDesktop: heroPc1,
    imgMobile: heroSp1,
    thumbnail: thumbnail1,
    button: false,
    link: "#",
  },
  {
    title: "Title3",
    description: "Description3",
    imgDesktop: heroPc2,
    imgMobile: heroSp2,
    thumbnail: thumbnail2,
    button: false,
    link: "#",
  },
];


