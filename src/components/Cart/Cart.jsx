import { useState } from "react";
import { RxCross1 } from "react-icons/rx";
import styles from "../../styles/styles";
import { IoBagHandleOutline } from "react-icons/io5";
import { HiPlus, HiOutlineMinus } from "react-icons/hi";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { backend_url } from "../../server";
import { addToCart, removeFromCart } from "../../redux/actions/cart";
import { toast } from "react-toastify";

const Cart = ({ setOpenCart }) => {
  const { cart } = useSelector((state) => state.cart);
  const dispatch = useDispatch();

  const removeFromCartHandler = (data) => {
    dispatch(removeFromCart(data));
  };

  const totalPrice = cart.reduce((acc, item) => {
    return item.discountPrice
      ? acc + item.qty * item.discountPrice
      : acc + item.qty * item.originalPrice;
  }, 0);

  const quantityChangeHandler = (data) => {
    dispatch(addToCart(data));
  };

  return (
    <div className="fixed top-0 left-0 w-full bg-[#0000004b] h-screen z-[100]">

      {/* Cart Side Panel */}
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

        {cart && cart.length === 0 ? (

          /* EMPTY CART */
          <div className="flex flex-col h-full">

            <div className="flex items-center justify-between p-4">

              {/* Item Length */}
              <div className={`${styles.normalFlex}`}>
                <IoBagHandleOutline size={25} />

                <h5 className="pl-2 text-[20px] font-[500]">
                  {cart.length} items
                </h5>
              </div>

              {/* Close */}
              <RxCross1
                size={25}
                className="cursor-pointer"
                onClick={() => setOpenCart(false)}
              />

            </div>

            <div className="flex-1 flex items-center justify-center">
              <h5 className="text-lg font-medium">
                Cart is empty!
              </h5>
            </div>

          </div>

        ) : (

          /* CART ITEMS */
          <>
            <div className="flex flex-col flex-1 overflow-hidden">

              {/* Cart Header */}
              <div className="flex items-center justify-between p-4">

                {/* Item Length */}
                <div className={`${styles.normalFlex}`}>
                  <IoBagHandleOutline size={25} />

                  <h5 className="pl-2 text-[20px] font-[500]">
                    {cart.length} items
                  </h5>
                </div>

                {/* Close */}
                <RxCross1
                  size={25}
                  className="cursor-pointer"
                  onClick={() => setOpenCart(false)}
                />

              </div>

              <br />

              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto hide-scrollbar border-t">

                {cart &&
                  cart.map((i, index) => (
                    <CartSingle
                      key={index}
                      data={i}
                      quantityChangeHandler={quantityChangeHandler}
                      removeFromCartHandler={removeFromCartHandler}
                    />
                  ))}

              </div>
            </div>

            {/* CHECKOUT */}
            <div className="px-5 mb-3 mt-3">

              <Link to="/checkout">

                <div
                  className="
                    h-[45px]
                    flex
                    items-center
                    justify-center
                    w-full
                    bg-[#e44343]
                    rounded-[5px]
                    px-2
                  "
                >
                  <h1 className="
                    text-[#fff]
                    text-[16px]
                    sm:text-[18px]
                    font-[600]
                    text-center
                  ">
                    Checkout Now (USD ${totalPrice})
                  </h1>
                </div>

              </Link>

            </div>
          </>
        )}
      </div>
    </div>
  );
};


/* Cart Single Item */

const CartSingle = ({
  data,
  quantityChangeHandler,
  removeFromCartHandler,
}) => {

  const [value, setValue] = useState(data.qty);

  const totalPrice = data.discountPrice
    ? data.discountPrice * value
    : data.originalPrice * value;

  /* Increment */
  const increment = (data) => {
    const nextValue = value + 1;

    if (data.stock < nextValue) {
      toast.error("product stock limited!");
    } else {
      setValue(nextValue);

      const updateCartData = {
        ...data,
        qty: nextValue,
      };

      quantityChangeHandler(updateCartData);
    }
  };

  /* Decrement */
  const decrement = (data) => {
    const nextValue = value === 1 ? 1 : value - 1;

    setValue(nextValue);

    const updateCartData = {
      ...data,
      qty: nextValue,
    };

    quantityChangeHandler(updateCartData);
  };

  return (
    <div className="border-b p-2">

      <div className="w-full h-min flex items-center">

        {/* QUANTITY */}
        <div className="flex flex-col items-center flex-shrink-0">

          {/* Plus */}
          <div
            className={`
              bg-[#e44343]
              border
              border-[#e4434373]
              rounded-full
              w-[23px]
              h-[23px]
              ${styles.normalFlex}
              justify-center
              cursor-pointer
              mb-1
            `}
            onClick={() => increment(data)}
          >
            <HiPlus size={18} color="#fff" />
          </div>

          {/* Quantity */}
          <span className="w-8 text-center">
            {value}
          </span>

          {/* Minus */}
          <div
            className="
              bg-[#a7abb14f]
              rounded-full
              w-[23px]
              h-[23px]
              flex
              items-center
              justify-center
              cursor-pointer
              mt-1
            "
            onClick={() => decrement(data)}
          >
            <HiOutlineMinus
              size={18}
              color="#7d879c"
            />
          </div>

        </div>


        {/* PRODUCT IMAGE */}
        <img
          src={`${backend_url}${data?.images && data?.images[0]}`}
          alt="CartImage"
          className="
            w-[65px]
            h-[65px]
            sm:w-[75px]
            sm:h-[75px]
            mx-3
            sm:m-5
            object-cover
            flex-shrink-0
          "
        />


        {/* PRODUCT INFO */}
        <div className="pl-[5px] min-w-0 flex-1">

          <h1 className="
            text-[14px]
            sm:text-[15px]
            truncate
          ">
            {data.name}
          </h1>

          <h4 className="
            font-[400]
            text-[12px]
            sm:text-[13px]
            text-[#00000082]
            whitespace-nowrap
          ">
            $
            {data.discountPrice
              ? data.discountPrice
              : data.originalPrice}{" "}
            x {value}
          </h4>

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


        {/* REMOVE */}
        <RxCross1
          size={18}
          className="
            cursor-pointer
            ml-2
            sm:ml-8
            mr-1
            flex-shrink-0
          "
          onClick={() => removeFromCartHandler(data)}
        />

      </div>
    </div>
  );
};

export default Cart;