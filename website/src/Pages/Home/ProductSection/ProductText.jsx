import SectionHeader from "../../../Components/SectionHeader";
import styles from "../../../style";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { fadeIn } from "../../../Components/Motion/Variant";
const ProductText = () => {
  const { t } = useTranslation();
  return (
    <motion.div
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0 }}
      variants={fadeIn("down", 0.4, 100)}
      className="w-full flex flex-col items-center gap-5"
    >
      <div>
        <SectionHeader text={t("Index.Products.Title")} />
      </div>
      <div className="sm:w-full md:w-[70%] mx-auto  text-center  items-center flex flex-col gap-8 ">
        <p className="text-md md:text-md text-black/60 rtl:text-black rtl:font-dari_text">
          {t("Index.Products.Text")}
        </p>
      </div>
    </motion.div>
  );
};

export default ProductText;
