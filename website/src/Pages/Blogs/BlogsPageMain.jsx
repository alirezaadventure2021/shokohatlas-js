import React, {useEffect, useState} from "react";

import BlogCard from "../../Components/BlogCart";
import Direction from "../../Components/Direction";
import { BiArrowBack } from "react-icons/bi";
import {useTranslation} from "react-i18next";
import axiosClient from "../../axios-client.jsx";
import i18n from "../../i18n.jsx";

const BlogsPageMain = () => {
  const{t}= useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const cardPerPage = 8;

  const [blogs, setblogs] = useState([]);




  useEffect(() => {
    axiosClient
        .get(`/getAllBlogs?lang=${i18n.language}`)
        .then(({ data }) => setblogs(data))
        .catch(console.error);
  }, [i18n.language]);

  const totalPages = Math.ceil(blogs.length / cardPerPage);
  const startIndex = (currentPage - 1) * cardPerPage;
  const currentCards = blogs.slice(startIndex, startIndex + cardPerPage);
  const handlePageChange = (page) => setCurrentPage(page);
  const handlePrev = () => setCurrentPage((prev) => Math.max(prev - 1, 1));
  const handleNext = () =>
    setCurrentPage((prev) => Math.max(prev + 1, totalPages));

  return (
    <div>
      <Direction link={t('Blogs.title')} header={t('Blogs.title')} />

      {blogs &&
          <div className="max-w-[1200px] mx-auto mt-[50px] px-4">
            <ul className="grid sm:grid-cols-2 md:grid-cols-4 gap-4">
              {currentCards.map((item, index) => (
                  <li key={index}>
                    <BlogCard blog={item} />
                  </li>
              ))}
            </ul>

            {/* Pagination Controls */}
            <div className="flex justify-center items-center gap-2 mt-10 text-sm">
              <button
                  onClick={handlePrev}
                  disabled={currentPage === 1}
                  className="px-2 py-2 rounded-full bg-black/10 hover:bg-black/30 disabled:opacity-50"
              >
                <BiArrowBack className="rtl:rotate-180" size={18} />
              </button>

              {Array.from({ length: totalPages }, (_, i) => (
                  <button
                      key={i + 1}
                      onClick={() => handlePageChange(i + 1)}
                      className={`px-3 py-1 rounded-full text-center flex   ${
                          currentPage === i + 1
                              ? "border border-primary  "
                              : "bg-black/10 hover:bg-black/30"
                      }`}
                  >
                    {i + 1}
                  </button>
              ))}

              <button
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="px-2 py-2 rounded-full bg-black/10 hover:bg-black/30 disabled:opacity-50"
              >
                <BiArrowBack className="rotate-180 rtl:rotate-0" size={18} />
              </button>
            </div>
          </div>}
    </div>
  );
};

export default BlogsPageMain;
