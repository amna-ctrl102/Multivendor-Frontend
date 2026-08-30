import { BsFillBagFill } from "react-icons/bs";
import {
  FaMapMarkerAlt,
  FaCreditCard,
  FaCheckCircle,
  FaCalendarAlt,
  FaBoxOpen,
} from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import styles from "../../styles/styles";
import { server } from "../../server";
import { getAllOrdersOfUser } from "../../redux/actions/order";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";
import { RxCross1 } from "react-icons/rx";
import axios from "axios";
import { toast } from "react-toastify";

const UserOrderDetails = () => {
  const { orders } = useSelector((state) => state.order);
  const { user, isAuthenticated } = useSelector((state) => state.user);

  const [open, setOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(0);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (user?._id) {
      dispatch(getAllOrdersOfUser(user._id));
    }
  }, [dispatch, user?._id]);

  const data = orders && orders.find((item) => item._id === id);

  const paymentStatus = data?.paymentInfo?.status || "Not Paid";

  const reviewHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.put(
        `${server}/product/create-new-review`,
        {
          user,
          rating,
          comment,
          productId: selectedItem?._id,
          orderId: id,
        },
        { withCredentials: true },
      );

      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
      setRating(0);
      setComment("");
      setOpen(false);
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const refundHandler = async () => {
    try {
      const res = await axios.put(
        `${server}/order/order-refund/${id}`,
        {
          status: "Processing refund",
        },
        {
          withCredentials: true,
        },
      );

      toast.success(res.data.message);
      dispatch(getAllOrdersOfUser(user._id));
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const handleSubmitMessage = async (event) => {
    event.preventDefault();

    if (isAuthenticated && user?._id) {
      const userId = user._id;
      const sellerId = data?.cart?.[0]?.shop?._id || data?.cart?.[0]?.shopId;

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

  return (
    <div className={`py-6 min-h-screen ${styles.section}`}>
      {/* ================= HEADER ================= */}
      <div className="pt-12 sm:pt-0">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3 min-w-0">
            {/* Icon */}
            <div className="w-11 h-11 sm:w-12 sm:h-12 flex-shrink-0 rounded-full bg-[#fce7f3] flex items-center justify-center">
              <BsFillBagFill size={22} color="#a30563" />
            </div>

            {/* Heading + Description */}
            <div className="min-w-0">
              <h1 className="text-[22px] sm:text-[24px] md:text-[28px] font-[700] text-[#222] leading-tight">
                Order Details
              </h1>

              <p className="mt-1 text-[13px] sm:text-[14px] text-gray-500 leading-5">
                View complete information about this order
              </p>
            </div>
          </div>

          {/* SEND MESSAGE BUTTON */}
          <button
            type="button"
            className="w-full sm:w-auto"
            onClick={handleSubmitMessage}
          >
            <div
              className={`
          ${styles.button}
          !w-full
          sm:!w-[170px]
          !h-[44px]
          !rounded-lg
          !bg-[#a30563]
          hover:!bg-[#85004f]
          px-5
          text-white
          font-[600]
          text-[15px]
          sm:text-[16px]
          flex
          items-center
          justify-center
          transition
        `}
            >
              Send Message
            </div>
          </button>
        </div>
      </div>

      <br />

      {/* ================= ORDER INFO ================= */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 mt-5 p-5 md:p-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {/* Order ID */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FaBoxOpen className="text-gray-600" />
            </div>

            <div>
              <p className="text-[13px] text-gray-500">Order ID</p>

              <p className="text-[16px] font-[600] text-[#222]">
                #{data?._id?.slice(0, 8)}
              </p>
            </div>
          </div>

          {/* Placed On */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-gray-100 flex items-center justify-center">
              <FaCalendarAlt className="text-gray-600" />
            </div>

            <div>
              <p className="text-[13px] text-gray-500">Placed On</p>

              <p className="text-[16px] font-[600] text-[#222]">
                {data?.createdAt?.slice(0, 10)}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ================= ORDER ITEMS HEADING ================= */}
      <div className="flex items-center gap-2 mb-5 mt-10">
        <FaBoxOpen className="text-[#a30563]" size={20} />

        <h2 className="text-[20px] font-[700] text-[#222]">Order Items</h2>
      </div>

      {/* ================= ORDER ITEMS ================= */}
      <div className="w-full bg-white rounded-xl shadow-sm border border-gray-100 mt-5 p-5 md:p-6">
        <div className="space-y-4">
          {data &&
            data?.cart.map((item, index) => (
              <div
                key={index}
                className="w-full flex flex-col sm:flex-row sm:items-center gap-4 p-4 rounded-xl bg-[#fafafa] border border-gray-100 hover:shadow-sm transition"
              >
                {/* Product Image */}
                <div className="w-[80px] h-[80px] rounded-lg overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                  <img
                    src={item?.images[0]}
                    alt={item?.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Product Details */}
                <div className="flex-1 min-w-0">
                  <h5 className="text-[17px] md:text-[19px] font-[600] text-[#222] truncate">
                    {item.name}
                  </h5>

                  <p className="text-[15px] text-gray-500 mt-1">
                    US$
                    {item.discountPrice
                      ? item.discountPrice
                      : item.originalPrice}
                    <span className="mx-2">×</span>
                    {item.qty}
                  </p>
                </div>

                {/* Item Total */}
                <div className="text-left sm:text-right flex-shrink-0">
                  <p className="text-[13px] text-gray-500">Item Total</p>

                  <p className="text-[17px] font-[700] text-[#222]">
                    US$
                    {(item.discountPrice
                      ? item.discountPrice
                      : item.originalPrice) * item.qty}
                  </p>
                </div>

                {/* Write Review Button */}
                {data?.status === "Delivered" &&
                  (item.isReviewed ? null : (
                    <div
                      className={`${styles.button} !w-full sm:!w-[150px] !h-[42px] bg-[#a30563] hover:bg-[#85004f] !rounded-lg text-white font-[600] text-[15px] flex items-center justify-center cursor-pointer transition flex-shrink-0`}
                      onClick={() => {
                        setOpen(true);
                        setSelectedItem(item);
                      }}
                    >
                      Write a Review
                    </div>
                  ))}
              </div>
            ))}
        </div>

        {/* ================= REVIEW POPUP ================= */}
        {open && (
          <div className="fixed inset-0 z-[9999] bg-black/50 backdrop-blur-[2px] flex items-center justify-center p-4">
            <div className="w-full max-w-[600px] max-h-[90vh] overflow-y-auto bg-white rounded-2xl shadow-2xl">
              {/* Popup Header */}
              <div className="flex items-center justify-between px-5 md:px-6 py-4 border-b border-gray-100">
                <div>
                  <h2 className="text-[22px] md:text-[26px] font-[700] text-[#222]">
                    Give a Review
                  </h2>

                  <p className="text-[13px] md:text-[14px] text-gray-500 mt-1">
                    Share your experience with this product
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setOpen(false)}
                  className="w-9 h-9 rounded-full bg-gray-100 hover:bg-[#fff0f3] flex items-center justify-center transition cursor-pointer"
                >
                  <RxCross1 size={20} className="text-black" />
                </button>
              </div>

              {/* Popup Content */}
              <div className="p-5 md:p-6">
                {/* Product */}
                <div className="w-full flex items-center gap-4 p-4 rounded-xl bg-[#fafafa] border border-gray-100">
                  {/* Product Image */}
                  <div className="w-[75px] h-[75px] md:w-[85px] md:h-[85px] rounded-xl overflow-hidden bg-white border border-gray-200 flex-shrink-0">
                    <img
                      src={selectedItem?.images[0]}
                      alt={selectedItem?.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Product Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-[17px] md:text-[19px] font-[600] text-[#222] truncate">
                      {selectedItem?.name}
                    </h3>

                    <p className="text-[15px] md:text-[16px] text-gray-500 mt-1">
                      US$
                      {selectedItem?.discountPrice
                        ? selectedItem?.discountPrice
                        : selectedItem?.originalPrice}
                      <span className="mx-2">×</span>
                      {selectedItem?.qty}
                    </p>
                  </div>
                </div>

                {/* ================= RATING ================= */}
                <div className="mt-6">
                  <h5 className="text-[16px] md:text-[18px] font-[600] text-[#333]">
                    Give a Rating
                    <span className="text-red-500 ml-1">*</span>
                  </h5>

                  <div className="flex items-center gap-1 mt-3">
                    {[1, 2, 3, 4, 5].map((i) =>
                      rating >= i ? (
                        <AiFillStar
                          key={i}
                          size={30}
                          color="rgb(246,186,0)"
                          className="cursor-pointer hover:scale-110 transition"
                          onClick={() => setRating(i)}
                        />
                      ) : (
                        <AiOutlineStar
                          key={i}
                          size={30}
                          color="rgb(246,186,0)"
                          className="cursor-pointer hover:scale-110 transition"
                          onClick={() => setRating(i)}
                        />
                      ),
                    )}

                    {rating > 0 && (
                      <span className="ml-2 text-[14px] font-[600] text-gray-500">
                        {rating}/5
                      </span>
                    )}
                  </div>
                </div>

                {/* ================= COMMENT ================= */}
                <div className="mt-6">
                  <label className="block text-[16px] md:text-[18px] font-[600] text-[#333]">
                    Write a comment
                    <span className="ml-1 text-[14px] font-[400] text-gray-400">
                      (optional)
                    </span>
                  </label>

                  <textarea
                    name="comment"
                    rows="5"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="How was your product? Share your experience..."
                    className="mt-3 w-full border border-gray-200 rounded-xl p-3 md:p-4 text-[15px] text-[#333] bg-[#fafafa] outline-none resize-none focus:bg-white focus:border-[#a30563] focus:ring-1 focus:ring-[#a30563]/20 transition"
                  />
                </div>

                {/* ================= ACTIONS ================= */}
                <div className="flex flex-col-reverse sm:flex-row sm:justify-end gap-3 mt-6">
                  {/* Cancel */}
                  <button
                    type="button"
                    onClick={() => setOpen(false)}
                    className="w-full sm:w-[120px] h-[44px] rounded-lg border border-gray-200 bg-white text-gray-600 font-[600] text-[15px] hover:bg-gray-50 transition cursor-pointer"
                  >
                    Cancel
                  </button>

                  {/* Submit */}
                  <button
                    type="button"
                    disabled={rating === 0}
                    onClick={rating > 0 ? reviewHandler : null}
                    className={`w-full sm:w-[140px] h-[44px] rounded-lg text-white font-[600] text-[15px] transition ${
                      rating > 0
                        ? "bg-black hover:bg-gray-800 cursor-pointer"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Submit Review
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= TOTAL ================= */}
        <div className="border-t border-gray-200 mt-6 pt-5 flex justify-between items-center">
          <h3 className="text-[17px] md:text-[19px] font-[600] text-gray-600">
            Total Price
          </h3>

          <h3 className="text-[22px] md:text-[24px] font-[700] text-[#a30563]">
            US${data?.totalPrice}
          </h3>
        </div>
      </div>

      {/* ================= SHIPPING + PAYMENT ================= */}
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5 mt-10 items-stretch">
        {/* ================= SHIPPING ADDRESS ================= */}
        <div className="w-full flex flex-col">
          {/* Heading */}
          <div className="flex items-center gap-2 mb-5">
            <FaMapMarkerAlt className="text-[#a30563]" size={20} />

            <h2 className="text-[20px] font-[700] text-[#222]">
              Shipping Address
            </h2>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 flex-1">
            <div className="space-y-4">
              {/* Address */}
              <div>
                <p className="text-[13px] text-gray-500 mb-1">Address</p>

                <p className="text-[16px] font-[500] text-[#333]">
                  {data?.shippingAddress?.address1
                    ? data?.shippingAddress?.address1
                    : data?.shippingAddress?.address2}
                </p>
              </div>

              {/* Country */}
              <div>
                <p className="text-[13px] text-gray-500 mb-1">Country</p>

                <p className="text-[16px] font-[500] text-[#333]">
                  {data?.shippingAddress?.country}
                </p>
              </div>

              {/* City */}
              <div>
                <p className="text-[13px] text-gray-500 mb-1">City</p>

                <p className="text-[16px] font-[500] text-[#333]">
                  {data?.shippingAddress?.city}
                </p>
              </div>

              {/* Phone */}
              <div>
                <p className="text-[13px] text-gray-500 mb-1">Phone</p>

                <p className="text-[16px] font-[500] text-[#333]">
                  {data?.user?.phoneNumber}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* ================= PAYMENT INFORMATION ================= */}
        <div className="w-full flex flex-col">
          {/* Heading */}
          <div className="flex items-center gap-2 mb-5">
            <FaCreditCard className="text-blue-500" size={20} />

            <h2 className="text-[20px] font-[700] text-[#222]">
              Payment Information
            </h2>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 md:p-6 flex-1">
            <div className="space-y-5">
              {/* Payment Status */}
              <div>
                <p className="text-[13px] text-gray-500 mb-2">Payment Status</p>

                <span
                  className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-[14px] font-[600] ${
                    paymentStatus === "succeeded"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-600"
                  }`}
                >
                  <FaCheckCircle size={14} />
                  {paymentStatus}
                </span>
              </div>

              {/* Payment Method */}
              <div>
                <p className="text-[13px] text-gray-500">Payment Method</p>

                <p className="text-[16px] font-[600] text-[#333] mt-1">
                  {data?.paymentInfo?.type || "Not Available"}
                </p>
              </div>

              {/* Payment ID */}
              <div>
                <p className="text-[13px] text-gray-500">Payment ID</p>

                <p className="text-[14px] font-[500] text-[#555] mt-1 break-all">
                  {data?.paymentInfo?.id || "Not Available"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= REFUND BUTTON ================= */}
      {data && data.status === "Delivered" && (
        <div className="flex justify-center mt-10 mb-7" onClick={refundHandler}>
          <button
            className="w-full sm:w-[320px] h-12 flex items-center justify-center bg-[#a30563] text-white rounded-lg uppercase font-semibold hover:bg-[#85004f] hover:shadow-md transition disabled:opacity-80"
            type="submit"
          >
            Give a Refund
          </button>
        </div>
      )}

      {data && data.status !== "Delivered" && (
        <div>
          <br />
          <br />
        </div>
      )}
    </div>
  );
};

export default UserOrderDetails;
