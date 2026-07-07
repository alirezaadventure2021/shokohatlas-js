import styles from "../style";

const SectionHeder = ({ text }) => (
  <h2
    className={`text-2xl text-black/80 md:text-3xl md:text-black text-center items-center flex flex-col justify-center`}
  >
    {text}
    <div className="w-[110%] bg-primary h-[2px]"></div>
  </h2>
);

export default SectionHeder;
