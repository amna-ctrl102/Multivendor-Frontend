import React from "react";
import CountDown from "./CountDown";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";
import { addToCart } from "../../redux/actions/cart";
import { useDispatch, useSelector } from "react-redux";

const EventCard = ({ active, data }) => {
  const dispatch = useDispatch();
  const { cart } = useSelector((state) => state.cart);
  if (!data) {
    return null;
  }

  const imageUrl = data.images?.[0]
    ? data.images[0]
    : "/default-event.png";

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item is already in cart!");
    } else {
      if (data.stock < 1) {
        toast.error("product stock limited!");
      } else {
        const cartData = { ...data, qty: 1 };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };
  return (
    <div
      className={`w-full bg-white rounded-lg overflow-hidden lg:flex p-4 gap-4 ${active ? "unset" : "mb-12"}`}
    >
      <div className="w-full lg:w-1/2 flex justify-center items-center">
        <img
          src={imageUrl}
          alt="EventImage"
          className="w-full max-w-[500px] h-[300px] lg:h-[400px] object-cover rounded-lg"
        />
      </div>
      <div className="w-full lg:w-[50%] flex flex-col justify-start p-4 sm:p-6 lg:p-8">
        <h2 className={`text-xl sm:text-2xl lg:text-3xl font-bold mb-3`}>
          {data.name}
        </h2>
        <p className="text-gray-600 text-sm sm:text-base mb-3">
          {data.description}
        </p>
        <div className="flex py-2 justify-between flex-wrap gap-3">
          <div className="flex items-center flex-wrap">
            {data.discountPrice ? (
              <h5 className="font-[500] text-[15px] 800px:text-[18px] text-red-600 pr-3 line-through">
                {data.originalPrice ?? 0} $
              </h5>
            ) : (
              ""
            )}
            <h5 className="font-bold text-[18px] 800px:text-[20px] text-black font-Roboto">
              {data.discountPrice ? data.discountPrice : data.originalPrice} $
            </h5>
          </div>
          <span className="pr-3 font-[400] text-[18px] text-[#a30563]">
            {data.sold_out ?? 0} sold
          </span>
        </div>
        <div className="mb-5 text-[15px] sm:text-xl">
          <CountDown data={data} />
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <Link
            to={`/product/${data._id}?isEvent=true`}
            className="w-full 800px:w-auto"
          >
            <button className="w-full 800px:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition">
              See Details
            </button>
          </Link>

          <button
            className="w-full 800px:w-auto px-8 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition"
            onClick={() => addToCartHandler(data._id)}
          >
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
};

export default EventCard;
