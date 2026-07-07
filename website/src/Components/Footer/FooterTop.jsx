import "../../index.css";
import {localizedPath, navLinks} from "../../Data/data";
import {Link} from "react-router-dom";

const FooterTop = ({ t , products,services }) => {

  return (
    <div className="flex md:flex-row sm:flex-col w-full items-start ">
      <div className="flex-[1] sm:mb-8 md:mb-0">
        <div
          className=" flex flex-col rtl:md:mr-0 md:mr-10 rtl:md:ml-10 mr-0 sm:mb-10 md:mb-4  
                          sm:justify-center sm:text-center sm:items-center md:text-start md:items-start gap-4"
        >
          <div className="flex flex-row items-end">
            <div className="flex- flex-col">
              <h2 className="text-3xl font-bold text-primary">{t("Logo")}</h2>
              <p className="text-black/30 text-xs ">{t("LogoSub")}</p>
            </div>
          </div>
          <div>
            <p className="text-[14px] font-bold ">{t("Footer.Info")}</p>
            <div className="w-full h-[3px] md:bg-gradient-to-r rtl:md:bg-gradient-to-l md:from-secondry md:to-0 my-1 sm:bg-gradient-to-r sm:from-white sm:via-secondry sm:to-white" />
            <p className="text-[13px] mt-2 text-dimBlack">
              {t("Footer.FooterVision")}
            </p>
          </div>
          <div className="flex flex-row w-full gap-6 items-center sm:justify-center md:justify-start">
            <h4 className="text-[16px] font-bold leading-[27px]  flex felx-row gap-2 text-black/80">
              {t("Footer.FooterItem.Contact")}
            </h4>
            <p className="text-[20px] rtl:text-[26px] text-primary font-bold">
              <span className="text-black/50 order-1">{t('Footer.Phone.code')}</span>
              &nbsp;
              <span className="order-2 mrl-0 mr-2 rtl:ml-2 rtl:mr-0">{t('Footer.Phone.number')}</span>
            </p>
          </div>
        </div>

      </div>
      <div className="flex-[1.5] flex flex-row  flex-wrap justify-between gap-y-4">
        <div className="flex flex-col  min-w-[150px] ">
          <h4 className="text-[18px] leading-[27px] text-primary">
            {t('Footer.FooterItem.Quick Links')}
          </h4>
          <ul className="list-none mt-4">
            {navLinks.map((itm, ind) => (
                <li
                    key={ind}
                    className="leading-[24px] cursor-pointer text-dimBlack text-sm hover:text-secondry hover:underline transition-colors duration-500"
                >
                  <Link to={localizedPath(itm.href)}>
                    {t('NavLinks.'+itm.name)}
                  </Link>
                </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col  min-w-[150px] ">
          <h4 className="text-[18px] leading-[27px] text-primary">
            {t('NavLinks.Products')}
          </h4>
          <ul className="list-none mt-4">
            {products.map((itm, ind) => (
              <li
                key={ind}
                className="leading-[24px] cursor-pointer text-dimBlack text-sm hover:text-secondry hover:underline transition-colors duration-500"
              >
                <Link to={localizedPath('/products/'+itm.slug)}>
                  {itm.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="flex flex-col  min-w-[150px] ">
          <h4 className="text-[18px] leading-[27px] text-primary">
            {t('NavLinks.Services')}
          </h4>
          <ul className="list-none mt-4">
            {services.map((itm, ind) => (
                <li
                    key={ind}
                    className="leading-[24px] cursor-pointer text-dimBlack text-sm hover:text-secondry hover:underline transition-colors duration-500"
                >
                  <Link to={localizedPath(`/services/${itm.slug}`)}>
                    {itm.name}
                  </Link>
                </li>
            ))}
          </ul>
        </div>

      </div>
    </div>
  );
};

export default FooterTop;
