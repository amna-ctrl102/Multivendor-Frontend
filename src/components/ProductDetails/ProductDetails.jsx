import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from "../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import { getAllEventsShop } from "../../redux/actions/event";
import { backend_url, server } from "../../server";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../redux/actions/wishlist";
import { addToCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";
import Ratings from "../Ratings/Ratings";
import axios from "axios";

const ProductDetails = ({ data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.user);
  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);
  const [select, setSelect] = useState(0);
  const navigate = useNavigate();

  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);
  const dispatch = useDispatch();

  useEffect(() => {
    const shopId = data?.shop?._id;
    if (shopId) {
      dispatch(getAllProductsShop(shopId));
      dispatch(getAllEventsShop(shopId));
    }
  }, [dispatch, data]);

  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  const IncrementCount = () => {
    setCount(count + 1);
  };

  const handleSubmitMessage = async () => {
    if (isAuthenticated) {
      const userId = user._id;
      const sellerId = data?.shop?._id;
      const groupTitle = [userId, sellerId].sort().join("-");

      try {
        const res = await axios.post(
          `${server}/conversation/create-new-conversation`,
          {
            groupTitle,
            userId,
            sellerId,
          },
          { withCredentials: true },
        );
        console.log(res);
        navigate(`/inbox`);

      } catch (error) {
        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong",
        );
      }
    } else {
      toast.error("Please login to create a conversation");
    }
  };

  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);
    if (isItemExists) {
      toast.error("Item is already in cart!");
    } else {
      if (data.stock < count) {
        toast.error("product stock limited!");
      } else {
        const cartData = { ...data, qty: count };
        dispatch(addToCart(cartData));
        toast.success("Item added to cart successfully!");
      }
    }
  };

  useEffect(() => {
    if (data && wishlist && wishlist.find((i) => i?._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

  const removeFromWishlistHandler = (data) => {
    setClick(!click);
    dispatch(removeFromWishlist(data));
  };

  const addToWishlistHandler = (data) => {
    setClick(!click);
    dispatch(addToWishlist(data));
  };

  const totalReviewsLength = [...(products || []), ...(events || [])].reduce(
    (total, item) => total + (item?.reviews?.length || 0),
    0,
  );

  // product-level rating should come from the current product, not from all products of the shop
  const averageRatings = Number(data?.ratings || 0);

  return (
    <>
      <div className="bg-white w-[95%] max-w-[1400px] shadow-md rounded-xl sm:mt-8 mb-8 mx-auto p-4 800px:p-6 mt-20">
        {data && (
          <div className="w-full">
            <div className="w-full flex flex-col 800px:flex-row gap-8">
              {/* Left Side */}
              <div className="w-full 800px:w-[40%]">
                <div className="w-full border border-[#a30563] rounded-lg p-3 mt-3">
                  <img
                    src={`${backend_url}${data && data.images[select]}`}
                    alt="Product"
                    className="w-full h-[250px] sm:h-[300px] 800px:h-[330px] object-contain"
                  />
                </div>

                <div className="flex gap-3 mt-6 overflow-x-auto pb-2">
                  {data &&
                    data.images.map((item, index) => (
                      <div
                        key={index}
                        onClick={() => setSelect(index)}
                        className={`cursor-pointer border-2 rounded-lg flex-shrink-0 ${
                          select === index
                            ? "border-[#a30563]"
                            : "border-gray-300"
                        }`}
                      >
                        <img
                          src={`${backend_url}${item}`}
                          alt=""
                          className="w-[80px] h-[80px] 800px:w-[80px] 800px:h-[80px] object-contain rounded-lg"
                        />
                      </div>
                    ))}
                </div>
              </div>

              {/* Right Side */}
              <div className="w-full 800px:w-[60%] pt-2">
                <h1
                  className={`${styles.productTitle} text-[26px] leading-tight`}
                >
                  {data.name}
                </h1>

                {/* Description */}
                <p className="text-gray-600 mt-3 leading-7">
                  {data.description}
                </p>

                {/* Price */}
                <div className="flex mt-4">
                  <h4 className="text-2xl font-bold text-[#333] font-Roboto">
                    {data.discountPrice}$
                  </h4>
                  <h3 className={`${styles.price}`}>
                    {data.originalPrice ? data.originalPrice + " $" : null}
                  </h3>
                </div>
                <div className="flex items-center mt-4 justify-between pr-3">
                  <div className="flex items-center mt-3 border border-gray-200">
                    <button
                      className="w-12 h-12 bg-[#a30563] text-white text-2xl font-bold rounded-l-md px-4 py-2 shadow-lg hover:bg-[#85004f] transition"
                      onClick={decrementCount}
                    >
                      -
                    </button>
                    <span className="w-12 h-12 flex items-center justify-center bg-gray-50 text-gray-800 font-medium text-lg">
                      {count}
                    </span>
                    <button
                      className="w-12 h-12 bg-[#a30563] text-white text-2xl font-bold rounded-r-md px-4 py-2 shadow-lg hover:bg-[#85004f] transition"
                      onClick={IncrementCount}
                    >
                      +
                    </button>
                  </div>
                  <div className="mt-3">
                    {click ? (
                      <AiFillHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => removeFromWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Remove from wishList"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={30}
                        className="cursor-pointer"
                        onClick={() => addToWishlistHandler(data)}
                        color={click ? "red" : "#333"}
                        title="Add to wishList"
                      />
                    )}
                  </div>
                </div>
                <div
                  className={`bg-black hover:bg-gray-800 transition w-full mt-8 rounded-lg h-11 flex items-center justify-center p-7 shadow-lg`}
                  onClick={() => addToCartHandler(data._id)}
                >
                  <span className="text-white font-semibold flex items-center justify-center gap-1">
                    Add to cart <AiOutlineShoppingCart size={20} />
                  </span>
                </div>
                <div className="bg-gray-50 border border-gray-200 rounded-lg mt-8 p-4 flex flex-col 800px:flex-row 800px:items-center justify-between gap-4">
                  {/* Left Side */}
                  <Link to={`/shop/preview/${data?.shop._id}`}>
                    <div className="flex items-center">
                      <img
                        src={`${backend_url}${data?.shop?.avatar}`}
                        alt="ShopLogo"
                        className="w-[60px] h-[60px] rounded-full mr-3 border-2 border-[#a30563]"
                      />

                      <div>
                        <h3 className="text-[#a30563] font-semibold text-[18px] font-Roboto">
                          {data.shop.name}
                        </h3>

                        <h5 className="text-[15px]">
                          ({Number(averageRatings || 0).toFixed(1)}/5) Ratings
                        </h5>
                      </div>
                    </div>
                  </Link>

                  {/* Right Side */}
                  <div
                    className={`${styles.button} shadow-md bg-[#a30563] transition hover:bg-[#85004f] rounded-lg h-11 px-5 flex items-center justify-center w-full 800px:w-auto`}
                    onClick={handleSubmitMessage}
                  >
                    <span className="text-white flex items-center gap-1">
                      Send Message
                      <AiOutlineMessage />
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {data && (
        <ProductDetailsInfo
          data={data}
          products={products}
          totalReviewsLength={totalReviewsLength}
          averageRatings={averageRatings}
        />
      )}
    </>
  );
};

const ProductDetailsInfo = ({
  data,
  products,
  totalReviewsLength,
  averageRatings,
}) => {
  const [active, setActive] = useState(1);
  const reviews = data?.reviews || [];
  return (
    <div className="bg-white w-[95%] max-w-[1400px] shadow-md rounded-xl mt-8 mb-8 mx-auto p-4 800px:p-6">
      <div className="w-full flex flex-wrap 800px:flex-nowrap justify-between border-b">
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px] mt-2 mb-5"
            onClick={() => setActive(1)}
          >
            Product Deatils
          </h5>
          {active === 1 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px] mt-2 mb-5"
            onClick={() => setActive(2)}
          >
            Product Reviews
          </h5>
          {active === 2 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>
        <div className="relative">
          <h5
            className="text-[#000] text-[18px] px-1 leading-5 font-[600] cursor-pointer 800px:text-[20px] mt-2 mb-5"
            onClick={() => setActive(3)}
          >
            Seller Information
          </h5>
          {active === 3 ? (
            <div className={`${styles.active_indicator}`}></div>
          ) : null}
        </div>
      </div>
      {active === 1 ? (
        <>
          <p className="py-2 text-[18px] leading-8 pb-10 whitespace-pre-line">
            {data.description}
          </p>
        </>
      ) : null}
      {active === 2 ? (
        <div className="w-full min-h-[40vh] flex flex-col items-center py-3 overflow-y-auto">
          {reviews &&
            reviews.map((item, index) => (
              <div className="w-full flex my-2">
                <img
                  src={`${backend_url}${item.user.avatar}`}
                  alt=""
                  className="w-[50px] h-[50px] rounded-full object-cover"
                />
                <div className="pl-2 ">
                  <div className="w-full flex items-center">
                    <h1 className="font-[500] mr-3">{item.user.name}</h1>
                    <Ratings ratings={item?.rating} />
                  </div>
                  <p>{item.comment}</p>
                </div>
              </div>
            ))}

          <div className="w-full justify-center min-h-[40vh] flex items-center">
            {reviews.length === 0 && <h5>No Reviews have for this product!</h5>}
          </div>
        </div>
      ) : null}
      {active === 3 && (
        <div className="w-full flex flex-col 800px:flex-row gap-8 p-5 mt-8">
          {/* Left Section */}
          <div className="w-full 800px:w-[50%]">
            <Link to={`/shop/preview/${data?.shop._id}`}>
              <div className="flex items-center">
                <img
                  src={`${backend_url}${data.shop?.avatar}`}
                  className="w-[60px] h-[60px] rounded-full border-2 border-[#a30563]"
                  alt="ShopLogo"
                />

                <div className="pl-3">
                  <h3 className="text-[#a30563] font-semibold text-[18px] font-Roboto">
                    {data.shop.name}
                  </h3>

                  <h5 className="text-[15px]">
                    ({Number(averageRatings || 0).toFixed(1)}/5) Ratings
                  </h5>
                </div>
              </div>
            </Link>

            <p className="pt-4 text-gray-600 leading-7">
              {data.shop.description ? data.shop.description : ""}
            </p>
          </div>

          {/* Right Section */}
          <div className="w-full 800px:w-[40%] ml-auto bg-gray-100 border border-gray-200 rounded-lg p-6">
            <h5 className="font-semibold">
              Joined on:{" "}
              <span className="font-normal">
                {data.shop?.createdAt?.slice(0, 10)}
              </span>
            </h5>

            <h5 className="font-semibold mt-4">
              Total Products:{" "}
              <span className="font-normal">{products && products.length}</span>
            </h5>

            <h5 className="font-semibold mt-4">
              Total Reviews:{" "}
              <span className="font-normal">{totalReviewsLength}</span>
            </h5>

            <Link to="/">
              <div className="bg-black hover:bg-gray-800 transition w-full 800px:w-full mt-8 rounded-lg h-11 flex items-center justify-center p-5">
                <h4 className="text-white">Visit Shop</h4>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
