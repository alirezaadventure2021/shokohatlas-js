import {Helmet} from "react-helmet-async";
import i18n from "../i18n.jsx";
import React from "react";

const HelmetComponent = ({page , url, })=>{
  return(
      <Helmet>
          <script type="application/ld+json">
              {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": url,
                  name: page.meta_title,
                  description: page.meta_description,
                  image: [url === 'services' ? page.card_image : page.photo],
                  sku: page.id,
                  brand: {
                      "@type": "Organization",
                      name: "Shokoh Atlas"
                  },
                  offers: {
                      "@type": "Offer",
                      url: window.location.href,
                      priceCurrency: "AFG", // or IRR if you use Rial
                      availability: "https://schema.org/InStock"
                  }
              })}
          </script>

          <title>{page.meta_title}</title>
          <meta name="description" content={page.meta_description} />
          <meta property="og:title" content={page.meta_title} />
          <meta property="og:description" content={page.meta_description} />
          <meta property="og:url" content={window.location.href} />
          <meta property="og:image" content={url === 'services' ? page.card_image : page.photo} />
          <link rel="canonical" href={`https://shokohatlas.co/${i18n.language}/${url}/${page?.slug}`} />

          <link
              rel="alternate"
              hrefLang="en"
              href={`https://shokohatlas.co/en/${url}/${page.slug_all?.en}`}
          />
          <link
              rel="alternate"
              hrefLang="fa"
              href={`https://shokohatlas.co/fa/${url}/${page.slug_all?.fa}`}
          />
          <link
              rel="alternate"
              hrefLang="ru"
              href={`https://shokohatlas.co/ru/${url}/${page.slug_all?.ru}`}
          />
          <link rel="alternate" hrefLang="x-default" href={`https://shokohatlas.co/fa/${url}/${page.slug_all?.fa}`} />
      </Helmet>
  )
}
export default HelmetComponent;