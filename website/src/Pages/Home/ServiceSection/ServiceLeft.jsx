import React from "react";
import img from "../../../assets/image/services/home-service.jpg";
import styles from "../../../style";
import { motion } from "motion/react";
import { fadeIn } from "../../../Components/Motion/Variant";
const ServiceLeft = ({ t, direction }) => {
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      variants={fadeIn(direction, 0.3, 100)}
      viewport={{ once: true, amount: 0 }}
      className="lg:w-[40%] sm:w-full flex flex-col gap-3"
    >
      <div className="h-[195x] w-full overflow-hidden flex items-center  rounded-lg">
        <img src={img} alt="" className="object-cover " />
      </div>
      <p className={`${styles.paragraph} text-[14px] rtl:font-dari_text`}>
        {t("Index.Services.Text")}
      </p>
      <div className="w-full h-[2px] bg-gradient-to-r from-grey via-black/20 via-80% to-grey" />
      {/* <p className="text-[15px] text-black/40">{t("Index.Services.Title")}</p> */}
    </motion.div>
  );
};

export default ServiceLeft;
