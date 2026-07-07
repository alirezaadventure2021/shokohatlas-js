import HeaderMain from "./Header/HeaderMain";
import FooterMain from "./Footer/FooterMain";
import { Outlet, useLocation } from "react-router-dom";
import "../index.css";
import i18n from "../i18n";
import {useEffect, useState} from "react";
import axiosClient from "../axios-client.jsx";

export default function DefaultLayout() {
  const location = useLocation();
  const [products, setProducts] = useState([]);
  const [services, setServices] = useState([]);
  useEffect(() => {
    axiosClient
        .get(`/headerProducts?lang=${i18n.language}`)
        .then(({ data }) => setProducts(data))
        .catch(console.error);

    axiosClient
        .get(`/headerServices?lang=${i18n.language}`)
        .then(({data})=>setServices(data))
        .catch(console.error);

  }, [i18n.language]);

  useEffect(() => {
    const lang = location.pathname.split("/")[1];
    const supported = ["en", "ru", "fa"];
    if (supported.includes(lang) && lang !== i18n.language) {
      i18n.changeLanguage(lang);
    }
  }, [location.pathname]);

  useEffect(() => {
    const dir = i18n.language === "fa" ? "rtl" : "ltr";
    document.getElementById("root").setAttribute("dir", dir);
    document.getElementById("html-root").setAttribute("lang" , i18n.language);
    document.documentElement.lang = i18n.language;
  }, [i18n.language]);


  return (
    <main className="font-body rtl:font-dari bg-bodyBg">
      <HeaderMain products={products} services={services}/>

      <Outlet />
      <FooterMain products={products} services={services}/>
    </main>
  );
}
