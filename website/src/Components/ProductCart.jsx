import { Link, Links } from "react-router-dom";
import arrow from "../../public/image/rows.png";
const ProductCard = ({ product }) => {
  const apiKey = import.meta.env.VITE_API_BASE_URL;

  return (
    <Link
      className=" flex h-full relative  w-auto rounded-2xl bg-gradient-to-t from-white to-secondry/70 p-[2px] md:p-[4px]
        shadow-blackShadow sm:hover:hover:scale-100 md:hover:scale-105 sm:hover:shadow-none md:hover:shadow-hoverShadow transition-all duration-300 
        "
      to={"/products/" + product.slug}
    >

      <div
        className="h-full w-full flex flex-col  items-center  rounded-2xl  cursor-pointer overflow-hidden"
        style={{ borderRadius: "1rem" }}
      >
        {/* Image */}
        <div className=" h-auto sm:w-[100%] md:w-[100%] bg-white">
          <img
            src={apiKey + product.photo}
            alt={product.name}
            className="h-full w-full  hover:scale-100 md:hover:scale-110 transition-all duration-500 "
          />
        </div>


        {/* Content */}
        <div className="flex  sm:flex-row md:flex-col items-center w-full justify-between sm:px-2 sm:py-2 md:p-5 text-black self-start opacity-80 translate-y-1 hover:opacity-100 hover:translate-y-0 md:hover:translate-y-0 transition-all duration-500">
          <h1 className="md:text-lg sm:text-[13px] ">{product.name}</h1>
          <img
            src={arrow}
            alt=""
            className="sm:block md:hidden h-[14px] rtl:rotate-0 rotate-180"
          />
          <div className="sm:hidden md:grid">
            <div
              className="text-black/60 text-[12.5px]  mt-1  line-clamp-3"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          </div>

          {/* <div className="sm:px-2 md:px-0 mt-4 flex items-center gap-2 text-primary font-medium sm:text-[9px] md:text-sm cursor-pointer">
            Learn more
            <FaChevronRight className="rtl:rotate-180 mt-0.5 sm:text-[10px ] mdtext-[15px]" />
          </div> */}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
