import { useEffect, useState } from "react";
import SingleProductTop from "./SingleProductTop";
import Direction from "../../../Components/Direction";
import SingleProductContent from "./SingleProductContent";
import { useNavigate, useParams } from "react-router-dom";
import axiosClient from "../../../axios-client";
import i18n from "../../../i18n";
import HelmetComponent from "../../../Components/helmetComponent.jsx";

const SingleProduct = () => {
  let { slug } = useParams();
  const [product, setProduct] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axiosClient
      .get(`/getProduct/${slug}?lang=${i18n.language}`)
      .then(({ data }) => {
        setProduct(data);
      })
      .catch((err) => {
        console.error(err);
      });
  }, [slug, i18n.language]);

  useEffect(() => {
    if (!product) return;

    const currentLang = i18n.language;
    const currentSlug = slug;

    const translatedSlug = product.slug_all?.[currentLang];

    if (translatedSlug && translatedSlug !== currentSlug) {
      navigate(`/${currentLang}/products/${translatedSlug}`, { replace: true });
    }
  }, [i18n.language]);

  return (
    <div>
      {product && (
        <div>
          <HelmetComponent page={product} url="products" />
          <Direction link={product?.name} header={product.name} />
          <div className="max-w-[1200px] mx-auto mt-[20px]">
            <SingleProductTop {...product} />
            <SingleProductContent product={product} />
          </div>
        </div>
      )}
    </div>
  );
};

export default SingleProduct;
