import React, {useEffect, useState} from "react";
import BlogCart from "../../../Components/BlogCart";
import SectionHeder from "../../../Components/SectionHeader";

import { useTranslation } from "react-i18next";
import BlogCarousel from "./BlogCarousel";
import axiosClient from "../../../axios-client.jsx";
import i18n from "../../../i18n.jsx";

const BlogMain = () => {
  const { t } = useTranslation();
    const [blogs, setblogs] = useState([]);

    useEffect(() => {
        axiosClient
            .get(`/getAllBlogs?lang=${i18n.language}`)
            .then(({ data }) => setblogs(data))
            .catch(console.error);
    }, [i18n.language]);

  return (
    <div className="mt-[20px] md:mt-[100px] py-4 md:py-10 w-full bg-main-gradient">
      <div className="max-w-[1200px] w-full mx-auto px-4 flex flex-col items-center gap-6">
        <SectionHeder text={t("Index.BlogTitle")} />
          {blogs &&  <BlogCarousel blogs={blogs} />}
      </div>
    </div>
  );
};

export default BlogMain;
