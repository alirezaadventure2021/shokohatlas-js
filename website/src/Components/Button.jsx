import * as motion from "motion/react-client";
import { buttonVariant } from "./Motion/Variant";
import {Link} from "react-router-dom";
import {localizedPath} from "../Data/data.js";
const Button = ({ text, link }) => {
  return (
    <motion.div
      variants={buttonVariant()}
      whileTap="tap"
      whileHover="hover"
      className=" py-2 px-6 border-[2px] border-orange rounded-2xl cursor-pointer text-white bg-orange text-bold font-special"
    >
      <Link to={localizedPath(link)}>
        {text}
      </Link>

    </motion.div>
  );
};

export default Button;
