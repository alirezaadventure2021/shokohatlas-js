import React from "react";
import SectionHeder from "../../../Components/SectionHeader";
import styles from "../../../style";
import Button from "../../../Components/Button";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { fadeIn } from "../../../Components/Motion/Variant";
const AboutMain = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      variants={fadeIn("down", 0.2, 100)}
      viewport={{ once: true, amount: 0 }}
      className="flex flex-col mt-[20px] md:mt-[100px] gap-8 items-center max-w-[1000px] mx-auto text-center"
    >
      <SectionHeder text={t("Index.About.Title")} />

      <p className={`${styles.paragraph} rtl:font-dari_text px-4`}>
        {t("Index.About.Text")}
      </p>

      <Button text={t("Index.About.Button")} link='/about-us'/>
    </motion.div>
  );
};

export default AboutMain;
