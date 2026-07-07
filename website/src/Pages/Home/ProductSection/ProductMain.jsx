import React, { useEffect, useState } from "react";
import ProductText from "./ProductText";
import ProductCart from "../../../Components/ProductCart";
import { motion } from "framer-motion";
import { fadeIn } from "../../../Components/Motion/Variant";
import axiosClient from "../../../axios-client";
import i18n from "../../../i18n";

const ProductMain = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axiosClient
      .get(`/headerProducts?lang=${i18n.language}`)
      .then(({ data }) => setProducts(data))
      .catch(console.error);
  }, [i18n.language]);
  return (
    <div className="max-w-[1200px] mx-auto flex flex-col md:mt-[100px] sm:mt-[40px]  px-4">
      <ProductText />

      <div
        className={`w-full md:w-[900px] mx-auto grid md:grid-cols-3 sm:grid-cols-2 items-center gap-2 sm:gap-x-2 md:gap-x-6 mt-[0px] py-6`}
      >
        {products.map((item, index) => (
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0 }}
            variants={fadeIn("left", `0.${index}`, 150)}
            key={index}
            className="h-full"
          >
            <ProductCart product={item} key={index} index={index} />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ProductMain;
