import React, { useEffect, useState } from "react";
import Direction from "../../Components/Direction";
import styles from "../../style";
import ProductCart from "../../Components/ProductCart";
import DashedHeader from "../../Components/DashedHeader";
import { useTranslation } from "react-i18next";
import axiosClient from "../../axios-client";
import i18n from "../../i18n";


const Products = () => {
  const { t } = useTranslation();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosClient
      .get(`/headerProducts?lang=${i18n.language}`)
      .then(({ data }) => setProducts(data))
      .catch(console.error);
  }, [i18n.language]);
  return (
    <div>
      <Direction link={t('ProductsPage.title')} header={t('ProductsPage.title')} />
      <section className={`max-w-[1200px] mx-auto px-4 `}>
        <div className="flex flex-col items-start  text-[15px] mt-[50px] bg-white px-4 py-10 rounded-xl text-black/60 sm:text-center md:text-start">
          <p className="text-sm">
            <span className="font-bold text-lg text-black/70">
              {t('ProductsPage.shokoh')}
            </span>{" "}
            {t('ProductsPage.paragraph1')}
          </p>
          <br></br>
          <p className="text-sm ">
            {t('ProductsPage.paragraph2')}
          </p>
        </div>
        <div className="w-full bg-gradient-to-r from-grey via-black/30 to-grey h-[2px] mt-[30px]" />

        {/* <DashedHeader title={"Products"} /> */}
        <div className={`w-full md:w-[900px] mx-auto grid md:grid-cols-3 sm:grid-cols-2 items-center gap-2 sm:gap-x-2 md:gap-x-6 mt-[0px] py-6`}>
          {products.map((item, index) => (
            <div key={index} className='h-full'>
              <ProductCart product={item} />
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Products;
