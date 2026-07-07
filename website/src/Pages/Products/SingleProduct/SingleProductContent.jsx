const SingleProductContent = ({ product }) => {
  return (
    <div className="singlePage mt-[40px] w-full bg-white px-4 py-10 rounded-xl">
      {product.article && (
        <div dangerouslySetInnerHTML={{ __html: product.article }} />
      )}
    </div>
  );
};

export default SingleProductContent;
