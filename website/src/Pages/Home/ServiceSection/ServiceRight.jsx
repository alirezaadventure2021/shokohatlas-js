import { FaChevronRight } from "react-icons/fa6";
import styles from "../../../style";

import { motion } from "motion/react";
import { fadeIn } from "../../../Components/Motion/Variant";
import row from "../../../../public/image/rows.png";
import {Link} from "react-router-dom";
import {localizedPath} from "../../../Data/data.js";
const ServiceRight = ({ t, direction,services }) => {
  return (
    <div className="lg:w-[65%] sm:w-full">
      <div className="flex flex-col ">
        {services.map((item, index) => (
          <motion.div
            initial="hidden"
            whileInView="show"
            variants={fadeIn(direction, `0.${index}`, 250)}
            viewport={{ once: true, amount: 0 }}
            key={index}
          >
            <Link
                to={localizedPath(`/services/${item.slug}`)}
                className=" pt-4 pb-2 border-b-[2px] border-primary/40 text-[16px] cursor-pointer flex flex-row justify-between px-2 items-center  hover:opacity-70 transition-all duration-500">
              <p className={`${styles.paragraph} `}>
                  {item.name}
              </p>
              <img
                src={row}
                alt=""
                className="h-[18px] rtl:rotate-0 rotate-180"
              />
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default ServiceRight;
