import ProductMain from "./ProductSection/ProductMain";
import ServiceMain from "./ServiceSection/ServiceMain";
import BlogMain from "./BlogSection/BlogMain";
import About from "./AboutSection/About";
import CarouselMain from "./CarouselSection/CarouselMain";
import {Helmet} from "react-helmet-async";
import React from "react";
import i18n from "../../i18n";
import { useTranslation } from "react-i18next";
const Home = () => {
    const {t} = useTranslation()
    return(
        <div className="w-full">

    
            <Helmet>
                <script type="application/ld+json">
                    {JSON.stringify({
                        "@context": "https://schema.org",
                        "@type": "Organization",
                        name: "Shokoh Atlas",
                        url: "https://shokohatlas.co",
                        logo: "https://shokohatlas.co/image/logo2.svg",
                        sameAs: [
                            "https://www.facebook.com/share/1AFnU8Ncos/?mibextid=wwXIfr",
                        ]
                    })}
                </script>
                <title>{t("metaHome.title")}</title>
                <meta name="description" content={t("metaHome.description")} />
                <link rel="canonical" href={`https://shokohatlas.co/${i18n.language}`} />

                <link rel="alternate" href="https://shokohatlas.co/en" />
                <link rel="alternate" href="https://shokohatlas.co/ru" />
                <link rel="alternate" href="https://shokohatlas.co/fa" />
                <link rel="alternate" hrefLang="x-default" href="https://shokohatlas.co/" />
            </Helmet>
            <CarouselMain />
            <ProductMain />
            <ServiceMain />
            <BlogMain />
            <About />
        </div>
    )
  
};

export default Home;
