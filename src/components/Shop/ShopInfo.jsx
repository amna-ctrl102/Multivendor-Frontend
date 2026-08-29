import { backend_url, server } from "../../server";
import styles from "../../styles/styles";
import { toast } from "react-toastify";
import axios from "axios";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import Loader from "../layout/Loader";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";

const ShopInfo = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);

  const [data, setData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));

    setIsLoading(true);

    const getShopInfo = async () => {
      try {
        const res = await axios.get(
          `${server}/shop/get-shop-info/${id}`,
          {
            withCredentials: true,
          }
        );

        setData(res.data.shop);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);

        toast.error(
          error.response?.data?.message ||
            error.message ||
            "Something went wrong"
        );
      }
    };

    getShopInfo();
  }, [id, dispatch]);

  const LogOutHandler = async () => {
    try {
      await axios.get(`${server}/shop/logout`, {
        withCredentials: true,
      });

      window.location.reload();
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const totalReviewsLength =
    products &&
    products.reduce(
      (acc, product) => acc + product.reviews.length,
      0
    );

  const totalRatings =
    products &&
    products.reduce(
      (acc, product) =>
        acc +
        product.reviews.reduce(
          (sum, review) => sum + review.rating,
          0
        ),
      0
    );

  const averageRating =
    totalRatings / totalReviewsLength || 0;

  return (
    <>
      {isLoading ? (
        <Loader />
      ) : (
        <div className="w-full py-5 sm:py-6">

          {/* ================= AVATAR ================= */}
          <div className="flex justify-center">
            <img
              src={`${backend_url}${data?.avatar}`}
              alt="sellerImage"
              className="
                w-[100px]
                h-[100px]
                sm:w-[120px]
                sm:h-[120px]
                lg:w-[130px]
                lg:h-[130px]
                object-cover
                rounded-full
                border-2
                border-[#077f9c]
                shadow-sm
              "
            />
          </div>

          {/* ================= SHOP NAME ================= */}
          <h3
            className="
              text-center
              mt-4
              text-[19px]
              sm:text-[21px]
              font-[600]
              text-[#222]
              px-3
              break-words
            "
          >
            {data.name}
          </h3>

          {/* ================= DESCRIPTION ================= */}
          <p
            className="
              text-center
              text-[13px]
              sm:text-[14px]
              leading-6
              text-[#666]
              px-5
              sm:px-6
              mt-2
              break-words
            "
          >
            {data?.description}
          </p>

          {/* ================= SHOP DETAILS ================= */}
          <div className="mt-5 sm:mt-6 border-t border-[#eee]">

            {/* Address */}
            <div className="px-4 sm:px-5 py-4 border-b border-[#eee]">
              <h5 className="font-[600] text-[13px] sm:text-[14px] text-[#222]">
                Address
              </h5>

              <p
                className="
                  text-[13px]
                  sm:text-[14px]
                  text-[#777]
                  mt-1
                  break-words
                  leading-5
                "
              >
                {data.address}
              </p>
            </div>

            {/* Phone */}
            <div className="px-4 sm:px-5 py-4 border-b border-[#eee]">
              <h5 className="font-[600] text-[13px] sm:text-[14px] text-[#222]">
                Phone Number
              </h5>

              <p className="text-[13px] sm:text-[14px] text-[#777] mt-1 break-words">
                {data.phoneNumber}
              </p>
            </div>

            {/* Products */}
            <div className="px-4 sm:px-5 py-4 border-b border-[#eee]">
              <h5 className="font-[600] text-[13px] sm:text-[14px] text-[#222]">
                Total Products
              </h5>

              <p className="text-[13px] sm:text-[14px] text-[#777] mt-1">
                {products?.length || 0}
              </p>
            </div>

            {/* Ratings */}
            <div className="px-4 sm:px-5 py-4 border-b border-[#eee]">
              <h5 className="font-[600] text-[13px] sm:text-[14px] text-[#222]">
                Shop Ratings
              </h5>

              <p className="text-[13px] sm:text-[14px] text-[#777] mt-1">
                {averageRating.toFixed(1)}/5
              </p>
            </div>

            {/* Joined */}
            <div className="px-4 sm:px-5 py-4">
              <h5 className="font-[600] text-[13px] sm:text-[14px] text-[#222]">
                Joined on
              </h5>

              <p className="text-[13px] sm:text-[14px] text-[#777] mt-1">
                {data?.createdAt?.slice(0, 10)}
              </p>
            </div>
          </div>

          {/* ================= ACTIONS ================= */}
          {isOwner && (
            <div className="px-4 sm:px-5 pt-2 pb-4 sm:pb-5 space-y-3">

              {/* Edit Shop */}
              <Link
                to="/settings"
                className="block w-full"
              >
                <div
                  className={`
                    ${styles.button}
                    !bg-[#077f9c]
                    hover:!bg-[#066f88]
                    transition
                    !w-full
                    !h-[42px]
                    rounded-md
                  `}
                >
                  <span className="text-white text-[14px] sm:text-[15px]">
                    Edit Shop
                  </span>
                </div>
              </Link>

              {/* Logout */}
              <div
                className={`
                  ${styles.button}
                  !bg-[#077f9c]
                  hover:!bg-[#066f88]
                  transition
                  !w-full
                  !h-[42px]
                  rounded-md
                  cursor-pointer
                `}
                onClick={LogOutHandler}
              >
                <span className="text-white text-[14px] sm:text-[15px]">
                  Log Out
                </span>
              </div>

            </div>
          )}
        </div>
      )}
    </>
  );
};

export default ShopInfo;