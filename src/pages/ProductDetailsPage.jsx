import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import ProductDetails from "../components/ProductDetails/ProductDetails";
import SuggestedProduct from "../components/Products/SuggestedProduct";
import { useParams, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ProductDetailsPage = () => {
  const { allProducts } = useSelector((state) => state.products);
  const { allEvents } = useSelector((state) => state.events);
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [searchParam] = useSearchParams();
  const eventData = searchParam.get("isEvent");

  useEffect(() => {
    if (eventData !== null) {
      const data = allEvents && allEvents.find((i) => i._id === id);
      setData(data);
    } else {
      const data = allProducts && allProducts.find((i) => i._id === id);
      setData(data);
    }

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [id, allProducts, allEvents, eventData]);

  return (
    <div>
      <Header />
      <ProductDetails data={data} />
      {!eventData && <>{data && <SuggestedProduct data={data} />}</>}
      <Footer />
    </div>
  );
};

export default ProductDetailsPage;
