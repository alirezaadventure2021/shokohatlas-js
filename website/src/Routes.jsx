import { createBrowserRouter } from "react-router-dom";
import DefaultLayout from "./Components/DefaultLayout";
import Home from "./Pages/Home/Home";
import AboutMain from "./Pages/Home/AboutSection/About";
import Services from "./Pages/Services/Services";
import Products from "./Pages/Products/Products";
import i18n from "./i18n";
import { redirect } from "react-router-dom";
import SingleProduct from "./Pages/Products/SingleProduct/SingleProduct";
import ServiceCart from "./Components/ServiceCart";
import SingleService from "./Pages/Services/SingleService/SingleService";
import Blogs from "./Pages/Blogs/BlogsPageMain";
import BlogsPageMain from "./Pages/Blogs/BlogsPageMain";
import ContactPageMain from "./Pages/Contact/ContactPageMain";
import { path } from "motion/react-client";
import AboutPageMain from "./Pages/About/AboutPageMain";
import { Children } from "react";
import SingleBlog from "./Pages/Blogs/singleBlog/singleBlog.jsx";

const LocalizedRoute = (lang = 0) => {
  const prefix = lang ? `/${lang}` : "";

  return {
    path: prefix || "/",
    element: <DefaultLayout />,
    children: [
      { path: "", element: <Home /> },
      { path: "product", element: <Products /> },
      { path: "services", element: <Services /> },
      { path: "products", element: <Products /> },
      { path: "products/:slug", element: <SingleProduct /> },
      { path: "services/:slug", element: <SingleService /> },
      { path: "blogs/:slug", element: <SingleBlog /> },

      // { path: "products/1", element: <SingleProduct /> },
      // { path: "services/1", element: <SingleService /> },
      { path: "blogs", element: <BlogsPageMain /> },
      { path: "contact-us", element: <ContactPageMain /> },
      { path: "about-us", element: <AboutPageMain /> },
    ],
  };
};

const Routes = createBrowserRouter([
  LocalizedRoute(""),
  LocalizedRoute("en"),
  LocalizedRoute("fa"),
  LocalizedRoute("ru"),
]);

export default Routes;
