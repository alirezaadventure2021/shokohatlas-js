import {useNavigate, useParams} from "react-router-dom";
import {useEffect, useState} from "react";
import axiosClient from "../../../axios-client.jsx";
import i18n from "../../../i18n.jsx";
import Direction from "../../../Components/Direction.jsx";
import BlogCard from "../../../Components/BlogCart.jsx";
import {useTranslation} from "react-i18next";
import HelmetComponent from "../../../Components/helmetComponent.jsx";

const SingleBlog=()=>{
    const {t}=useTranslation();
     let { slug } = useParams();
     const [blog, setBlog] = useState(null);
     const navigate= useNavigate();
    const apiKey = import.meta.env.VITE_API_BASE_URL;
    const [latestBlogs , setLatestBlogs] = useState([]);
    const isMobile = window.innerWidth <= 786;

    useEffect(()=>{
        axiosClient
            .get(`/getLatestBlogs?lang=${i18n.language}`)
            .then(({data})=>setLatestBlogs(data))
            .catch((err)=>console.log(err));
    }, [i18n.language]);

    useEffect(()=>{
         axiosClient
             .get(`/getBlog/${slug}?lang=${i18n.language}`)
             .then(({ data }) => {
                 setBlog(data);
             })
             .catch((err) => {
                 console.error(err);
             });
     }, [slug, i18n.language]);

     useEffect(() => {
         if (!blog) return;

         const currentLang = i18n.language;
         const currentSlug = slug;

         const translatedSlug = blog.slug_all?.[currentLang];

         if (translatedSlug && translatedSlug !== currentSlug) {
             navigate(`/${currentLang}/blogs/${translatedSlug}`, { replace: true });
         }
     }, [i18n.language]);
    return(
        <div>
            {blog &&
                <div>
                    <HelmetComponent page={blog} url="blogs"/>
                    <Direction link={blog.title} header={blog.title} />
                    <div className="max-w-[1200px] mx-auto mt-[10px] md:mt-[30px] flex flex-col md:flex-row gap-5 px-4 ">
                        <div className={`w-full md:w-[25%]  rtl:order-2
                                        ${isMobile ? 'order-2' : 'order-1'}
                         `}>
                            <div className="border-b-[3px] border-primary text-black text-center">
                                {t("Blogs.latest")}
                            </div>

                            <div className="grid sm:grid-cols-2  md:grid-cols-1 gap-2">
                                {latestBlogs.map((item , index)=>{
                                 return(
                                     <div key={index} className="mt-[20px]">
                                         <BlogCard blog={item}  />
                                     </div>
                                 )
                                })
                                }
                            </div>
                        </div>

                        <div className={`w-full md:w-[75%]  rtl:order-1
                                        ${isMobile ? 'order-1' : 'order-2'}
                           `}>
                            <div className="w-full" >
                                <img src={apiKey + blog.photo}/>
                            </div>
                            <div className="singlePage mt-5">
                                {blog.article && (
                                    <div dangerouslySetInnerHTML={{ __html: blog.article }} />
                                )}
                            </div>
                        </div>
                    </div>
                </div>

            }

        </div>
    );
 }

 export default SingleBlog;