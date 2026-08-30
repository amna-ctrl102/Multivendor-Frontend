import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { BsCartPlus } from "react-icons/bs";
import { AiOutlineHeart } from "react-icons/ai";
import { useDispatch, useSelector } from "react-redux";
import { removeFromWishlist } from "../../redux/actions/wishlist";
import { addToCart } from "../../redux/actions/cart";

const Wishlist = ({ setWishList }) => {
  const { wishlist } = useSelector((state) => state.wishlist);
  const dispatch = useDispatch();

  const removeFromWishlistHandler = (data) => {
    dispatch(removeFromWishlist(data));
  };

  const addToCartHandler = (data) => {
    const newData = { ...data, qty: 1 };

    dispatch(addToCart(newData));
    dispatch(removeFromWishlist(newData));
    setWishList(false);
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-[100]">

      {/* Wishlist Side Panel */}
      <div
        className="
          fixed
          top-0
          right-0
          h-screen
          w-[90%]
          sm:w-[80%]
          600px:w-[60%]
          800px:w-[25%]
          bg-white
          flex
          flex-col
          shadow-sm
        "
      >

        {wishlist && wishlist.length === 0 ? (

          /* EMPTY WISHLIST */
          <div className="flex flex-col h-full">

            <div className="flex items-center justify-between p-4">

              {/* Item Length */}
              <div className={`${styles.normalFlex}`}>
                <AiOutlineHeart size={25} />

                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist.length} items
                </h5>
              </div>

              {/* Close */}
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setWishList(false)}
              />
            </div>

            <div className="flex-1 flex items-center justify-center">
              <h5 className="text-lg font-medium">
                wishlist is empty!
              </h5>
            </div>

          </div>

        ) : (

          /* WISHLIST ITEMS */
          <div className="flex flex-col flex-1 overflow-hidden">

            {/* Header */}
            <div className="flex items-center justify-between p-4">

              {/* Item Length */}
              <div className={`${styles.normalFlex}`}>
                <AiOutlineHeart size={25} />

                <h5 className="pl-2 text-[20px] font-[500]">
                  {wishlist.length} items
                </h5>
              </div>

              {/* Close */}
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setWishList(false)}
              />

            </div>

            <br />

            {/* Wishlist Items */}
            <div className="flex-1 overflow-y-auto hide-scrollbar border-t">

              {wishlist &&
                wishlist.map((i, index) => (
                  <CartSingle
                    key={index}
                    data={i}
                    removeFromWishlistHandler={
                      removeFromWishlistHandler
                    }
                    addToCartHandler={addToCartHandler}
                  />
                ))}

            </div>

          </div>
        )}
      </div>
    </div>
  );
};


/* Wishlist Single Item */

const CartSingle = ({
  data,
  removeFromWishlistHandler,
  addToCartHandler,
}) => {

  const totalPrice =
    data.discountPrice != null
      ? data.discountPrice
      : data.originalPrice;

  return (
    <div className="border-b p-4">

      <div className="w-full flex items-center">

        {/* Remove */}
        <RxCross1
          className="cursor-pointer flex-shrink-0"
          onClick={() => removeFromWishlistHandler(data)}
        />

        {/* Product Image */}
        <img
          src={data?.images && data?.images[0]}
          alt="WishlistImage"
          className="
            w-[65px]
            h-[65px]
            sm:w-[75px]
            sm:h-[75px]
            ml-3
            object-cover
            flex-shrink-0
          "
        />

        {/* Product Info */}
        <div className="ml-3 min-w-0 flex-1">

          <h1 className="
            text-[14px]
            sm:text-[15px]
            truncate
          ">
            {data.name}
          </h1>

          <h4 className="
            font-[600]
            text-[14px]
            sm:text-[15px]
            pt-[3px]
            text-[#d02222]
            font-Roboto
            whitespace-nowrap
          ">
            USD ${totalPrice}
          </h4>

        </div>

        {/* Add To Cart */}
        <div className="ml-3 sm:ml-8 flex-shrink-0">

          <h4>
            <BsCartPlus
              size={20}
              className="cursor-pointer"
              title="Add to cart"
              onClick={() => addToCartHandler(data)}
            />
          </h4>

        </div>

      </div>

    </div>
  );
};

export default Wishlist;