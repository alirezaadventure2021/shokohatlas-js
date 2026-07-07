import { FaArrowRight } from "react-icons/fa";
import { useTranslation } from "react-i18next";
import row from "../../public/image/rows.png";
import {Link} from "react-router-dom";
import {localizedPath} from "../Data/data.js";

const BlogCard = ({ blog }) => {
  const { t } = useTranslation();
  const apiKey = import.meta.env.VITE_API_BASE_URL;

  return (
    <div
      tabIndex={0}
      className="h-auto relative w-auto aspect-[3/5] rounded-3xl
                 shadow-lg shadow-black/10
                 hover:shadow-none md:hover:shadow-xl hover:scale-100 md:hover:scale-[1.03] transition-transform duration-300
                 cursor-pointer group outline-none focus-visible:ring-4 focus-visible:ring-primary/50
                  bg-gradient-to-t from-white to-secondry
                  overflow-hidden
                  p-[2px] md:p-[4px]
                 "
      aria-label={blog.title}
    >
      {/* Image */}
    <Link
        to={localizedPath(`/blogs/${blog.slug}`)}
        className="h-full w-full">
      <div className="h-[40%] overflow-hidden rounded-t-3xl relative">
        <img
            src={apiKey +blog.photo}
            alt={blog.title}
            className="w-full h-full object-cover transition-transform duration-500  hover:scale-100 md:group-hover:scale-105"
            loading="lazy"
            decoding="async"
        />
      </div>

      {/* Content */}
      <div
          className=" sm:p-2 rounded-b-3xl  md:p-4 flex flex-col justify-between h-[60%]"
          style={{
            backgroundImage: `url(${apiKey + blog.card_bg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
      >
        <div className="text-white">
          {/* Date */}
          <p className="md:text-sm sm:text-[8px] mb-1 ">{blog.published_date}</p>

          {/* Title */}
          <h2
              className="sm:text-md md:text-lg  font-semibold
                          md:group-hover:text-primary transition-colors line-clamp-2 mb-2 leading-snug"
          >
            {blog.title}
          </h2>

          {/* Excerpt */}
          <p className=" sm:text-[10px] md:text-sm text-gray-700 dark:text-gray-300 line-clamp-3 leading-relaxed">
            {blog.description}
          </p>
        </div>

        {/* Read More */}
        <div
            className="
              md:text-sm sm:text-[10px]
              mt-4  font-semibold text-white
              relative cursor-pointer select-none
              self-end flex flex-row gap-2 items-center
            "
        >
          {t("Blogs.readMore")}
          <img
              src={row}
              alt=""
              className="sm:h-2 md:h-5 ltr:rotate-180 rtl:rotate-0"
          />
          {/* <FaArrowRight className="ml-1 rtl:rotate-180 transition-transform duration-300 rtl:group-hover:-translate-x-1 group-hover:translate-x-1 " /> */}
        </div>
      </div>
    </Link>
    </div>
  );
};

export default BlogCard;
