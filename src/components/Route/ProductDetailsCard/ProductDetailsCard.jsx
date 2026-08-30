import { useEffect, useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../../styles/styles";
import {
  AiFillHeart,
  AiOutlineHeart,
  AiOutlineMessage,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { server } from "../../../server";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { addToCart } from "../../../redux/actions/cart";
import {
  addToWishlist,
  removeFromWishlist,
} from "../../../redux/actions/wishlist";

const ProductDetailsCard = ({ setOpen, data }) => {
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [count, setCount] = useState(1);
  const [click, setClick] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleMessageSubmit = async () => {
    if (isAuthenticated && user?._id) {
      const userId = user._id;
      const sellerId = data?.shop?._id;

      if (!sellerId) {
        toast.error("Seller information is not available");
        return;
      }

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
        navigate("/inbox");
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

  // Decrease quantity
  const decrementCount = () => {
    if (count > 1) {
      setCount(count - 1);
    }
  };

  // Increase quantity
  const IncrementCount = () => {
    if (count < data.stock) {
      setCount(count + 1);
    } else {
      toast.error("Product stock is limited!");
    }
  };

  // Add to cart
  const addToCartHandler = (id) => {
    const isItemExists = cart && cart.find((i) => i._id === id);

    if (isItemExists) {
      toast.error("Item is already in cart!");
    } else if (data.stock < count) {
      toast.error("Product stock is limited!");
    } else {
      const cartData = {
        ...data,
        qty: count,
      };

      dispatch(addToCart(cartData));
      toast.success("Item added to cart successfully!");
    }
  };

  // Wishlist check
  useEffect(() => {
    if (data && wishlist && wishlist.find((i) => i._id === data._id)) {
      setClick(true);
    } else {
      setClick(false);
    }
  }, [wishlist, data]);

  // Remove from wishlist
  const removeFromWishlistHandler = (product) => {
    setClick(false);
    dispatch(removeFromWishlist(product));
  };

  // Add to wishlist
  const addToWishlistHandler = (product) => {
    setClick(true);
    dispatch(addToWishlist(product));
  };

  return (
    <div>
      {data ? (
        <div className="fixed inset-0 z-40 flex items-start 800px:items-center justify-center bg-black/70 p-3 pt-20 800px:p-5">
          {/* Modal */}
          <div className="relative w-full max-w-[1000px] max-h-[90vh] overflow-y-auto hide-scrollbar rounded-xl bg-white shadow-2xl">
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="
                absolute
                right-3
                top-3
                z-50
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                bg-gray-100
                text-black
                shadow-md
              "
            >
              <RxCross1 size={20} />
            </button>

            {/* Main Content */}
            <div className="flex flex-col 800px:flex-row">
              {/* LEFT SIDE */}
              <div className="w-full p-5 sm:p-7 800px:w-1/2">
                {/* Product Image */}
                <div
                  className="
                  flex
                  min-h-[280px]
                  items-center
                  justify-center
                  rounded-xl
                  bg-[#f6f6f6]
                  p-4
                  sm:min-h-[400px]
                "
                >
                  <img
                    src={data.images?.[0]}
                    alt={data.name}
                    className="
                      max-h-[380px]
                      w-full
                      object-contain
                    "
                  />
                </div>

                {/* Shop Information */}
                <Link
                  to={`/shop/preview/${data.shop?._id}`}
                  className="
                    mt-5
                    flex
                    items-center
                    gap-3
                    rounded-lg
                    border
                    border-gray-100
                    p-3
                    transition
                    hover:bg-gray-50
                  "
                >
                  <img
                    src={data?.shop?.avatar}
                    alt="shopImage"
                    className="
                      h-[52px]
                      w-[52px]
                      rounded-full
                      border-2
                      border-[#a30563]
                      object-cover
                    "
                  />

                  <div>
                    <h3 className={`${styles.shop_name} !text-[#a30563] !mb-1`}>
                      {data?.shop?.name}
                    </h3>

                    <p className="text-sm">(4/5) Ratings</p>
                  </div>
                </Link>

                {/* Send Message + Sold */}
                <div className="mt-4 flex items-center justify-between gap-3">
                  {/* Send Message Button */}
                  <button
                    type="button"
                    onClick={handleMessageSubmit}
                    className="
                      flex
                      h-[48px]
                      w-full 800px:w-[220px]
                      items-center
                      justify-center
                      gap-2
                      rounded-lg
                      px-3
                      text-sm
                      font-medium
                      text-white
                      shadow-md
                      bg-[#a30563] transition hover:bg-[#85004f]
                      sm:text-base
                    "
                  >
                    Send Message
                    <AiOutlineMessage size={20} />
                  </button>

                  {/* Sold */}
                  <div>
                    <p
                      className="
                      whitespace-nowrap
                      text-sm
                      font-semibold
                      text-[#a30563]
                      sm:text-base
                    "
                    >
                      {data.sold_out || 0} Sold
                    </p>
                  </div>
                </div>
              </div>

              {/* RIGHT SIDE */}
              <div
                className="
                w-full
                p-5
                sm:p-7
                800px:w-1/2
              "
              >
                {/* Product Name */}
                <h1
                  className="
                  pr-10
                  text-[24px]
                  font-bold
                  leading-tight
                  text-[#222]
                  sm:text-[28px]
                "
                >
                  {data.name}
                </h1>

                {/* Description */}
                <p
                  className="
                  mt-4
                  text-[14px]
                  leading-6
                  text-gray-600
                  sm:text-[15px]
                "
                >
                  {data.description}
                </p>

                {/* Prices */}
                <div
                  className="
                  mt-6
                  flex
                  flex-wrap
                  items-center
                  gap-3
                "
                >
                  <h4
                    className="
                    text-[25px]
                    font-bold
                    text-black
                  "
                  >
                    ${data.discountPrice}
                  </h4>

                  {data.originalPrice && (
                    <h3
                      className="
                      text-[16px]
                      text-red-600
                      line-through
                    "
                    >
                      ${data.originalPrice}
                    </h3>
                  )}
                </div>

                {/* Quantity + Wishlist */}
                <div
                  className="
                  mt-7
                  flex
                  items-center
                  justify-between
                  gap-4
                "
                >
                  {/* Quantity */}
                  <div
                    className="
                    flex
                    overflow-hidden
                    rounded-lg
                    border
                    border-gray-200
                    shadow-sm
                  "
                  >
                    {/* Minus */}
                    <button
                      type="button"
                      onClick={decrementCount}
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        bg-[#a30563]
                        text-xl
                        font-bold
                        text-white
                        transition
                        hover:bg-[#85004f]
                      "
                    >
                      −
                    </button>

                    {/* Count */}
                    <span
                      className="
                      flex
                      h-11
                      w-12
                      items-center
                      justify-center
                      bg-gray-50
                      font-semibold
                      text-gray-800
                    "
                    >
                      {count}
                    </span>

                    {/* Plus */}
                    <button
                      type="button"
                      onClick={IncrementCount}
                      className="
                        flex
                        h-11
                        w-11
                        items-center
                        justify-center
                        bg-[#a30563]
                        text-xl
                        font-bold
                        text-white
                        transition
                        hover:bg-[#85004f]
                      "
                    >
                      +
                    </button>
                  </div>

                  {/* Wishlist */}
                  <button
                    type="button"
                    className="
                      flex
                      h-11
                      w-11
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-gray-200
                      transition
                      hover:bg-gray-50
                    "
                    onClick={() =>
                      click
                        ? removeFromWishlistHandler(data)
                        : addToWishlistHandler(data)
                    }
                  >
                    {click ? (
                      <AiFillHeart
                        size={27}
                        color="#ef4444"
                        title="Remove from wishlist"
                      />
                    ) : (
                      <AiOutlineHeart
                        size={27}
                        color="#333"
                        title="Add to wishlist"
                      />
                    )}
                  </button>
                </div>

                {/* Add to Cart */}
                <button
                  type="button"
                  onClick={() => addToCartHandler(data._id)}
                  className="
                    mt-7
                    flex
                    h-[52px]
                    w-full
                    items-center
                    justify-center
                    gap-3
                    rounded-lg
                    bg-black
                    text-[16px]
                    font-semibold
                    text-white
                    shadow-lg
                    hover:bg-gray-800 transition
                    sm:text-[17px]
                  "
                >
                  Add to Cart
                  <AiOutlineShoppingCart size={22} />
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export default ProductDetailsCard;
