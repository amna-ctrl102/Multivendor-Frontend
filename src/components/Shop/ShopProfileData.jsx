import { useEffect, useState } from "react";
import ProductCard from "../Route/ProductCard/ProductCard";
import { Link, useParams } from "react-router-dom";
import styles from "../../styles/styles";
import { useDispatch, useSelector } from "react-redux";
import { getAllProductsShop } from "../../redux/actions/product";
import Ratings from "../Ratings/Ratings";
import { backend_url } from "../../server";
import { getAllEventsShop } from "../../redux/actions/event";

const ShopProfileData = ({ isOwner }) => {
  const { products } = useSelector((state) => state.products);
  const { events } = useSelector((state) => state.events);

  const [active, setActive] = useState(1);

  const { id } = useParams();
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getAllProductsShop(id));
    dispatch(getAllEventsShop(id));
  }, [id, dispatch]);

  const allReviews = [
    ...(products || []),
    ...(events || []),
  ]
    .map((product) => product.reviews || [])
    .flat();

  return (
    <div className="w-full">

      {/* ================= TOP NAVIGATION ================= */}
      <div
        className="
          w-full
          flex
          flex-col
          gap-4
          lg:flex-row
          lg:items-center
          lg:justify-between
        "
      >

        {/* ================= TABS ================= */}
        <div
          className="
            w-full
            flex
            flex-wrap
            items-center
            gap-x-5
            gap-y-3
            sm:gap-x-7
          "
        >

          {/* Shop Products */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setActive(1)}
          >
            <h5
              className={`
                font-[600]
                text-[16px]
                sm:text-[18px]
                md:text-[20px]
                whitespace-nowrap
                ${
                  active === 1
                    ? "text-[#077f9c]"
                    : "text-black"
                }
              `}
            >
              Shop Products
            </h5>
          </div>

          {/* Running Events */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setActive(2)}
          >
            <h5
              className={`
                font-[600]
                text-[16px]
                sm:text-[18px]
                md:text-[20px]
                whitespace-nowrap
                ${
                  active === 2
                    ? "text-[#077f9c]"
                    : "text-black"
                }
              `}
            >
              Running Events
            </h5>
          </div>

          {/* Reviews */}
          <div
            className="flex items-center cursor-pointer"
            onClick={() => setActive(3)}
          >
            <h5
              className={`
                font-[600]
                text-[16px]
                sm:text-[18px]
                md:text-[20px]
                whitespace-nowrap
                ${
                  active === 3
                    ? "text-[#077f9c]"
                    : "text-black"
                }
              `}
            >
              Shop Reviews
            </h5>
          </div>
        </div>

        {/* ================= DASHBOARD BUTTON ================= */}
        <div className="w-full lg:w-auto flex lg:justify-end">

          {isOwner ? (
            <Link
              to="/dashboard"
              className="w-full sm:w-auto"
            >
              <div
                className={`
                  ${styles.button}
                  !bg-[#077f9c]
                  hover:!bg-[#066f88]
                  transition
                  !w-full
                  sm:!w-[190px]
                  !h-[44px]
                  rounded-md
                `}
              >
                <span className="text-[#fff] text-[14px] sm:text-[15px]">
                  Go to Dashboard
                </span>
              </div>
            </Link>
          ) : (
            <Link
              to="/"
              className="w-full sm:w-auto"
            >
              <div
                className={`
                  ${styles.button}
                  !bg-[#077f9c]
                  hover:!bg-[#066f88]
                  transition
                  !w-full
                  sm:!w-[160px]
                  !h-[44px]
                  rounded-md
                `}
              >
                <span className="text-[#fff] text-[14px] sm:text-[15px]">
                  Back to Home
                </span>
              </div>
            </Link>
          )}

        </div>
      </div>

      {/* ================= PRODUCTS ================= */}
      {active === 1 && (
        <div
          className="
            grid
            grid-cols-1
            gap-[20px]
            mt-6
            sm:grid-cols-2
            sm:gap-[20px]
            md:grid-cols-2
            md:gap-[25px]
            lg:grid-cols-3
            lg:gap-[25px]
            xl:grid-cols-4
            xl:gap-[20px]
            mb-12
            border-0
          "
        >
          {products &&
            products.map((i, index) => (
              <ProductCard
                data={i}
                key={index}
              />
            ))}
        </div>
      )}

      {/* No Products */}
      {active === 1 &&
        products &&
        products.length === 0 && (
          <h5
            className="
              w-full
              text-center
              py-8
              text-[16px]
              sm:text-[18px]
            "
          >
            No product have for this shop
          </h5>
        )}

      {/* ================= EVENTS ================= */}
      {active === 2 && (
        <div
          className="
            grid
            grid-cols-1
            gap-[20px]
            mt-6
            sm:grid-cols-2
            sm:gap-[20px]
            md:grid-cols-2
            md:gap-[25px]
            lg:grid-cols-3
            lg:gap-[25px]
            xl:grid-cols-4
            xl:gap-[20px]
            mb-12
            border-0
          "
        >
          {events &&
            events.map((i, index) => (
              <ProductCard
                data={i}
                key={index}
                isEvent={true}
              />
            ))}
        </div>
      )}

      {/* ================= REVIEWS ================= */}
      {active === 3 && (
        <div className="w-full mt-6">

          {allReviews &&
            allReviews.map((item, index) => (
              <div
                key={index}
                className="
                  w-full
                  flex
                  items-start
                  gap-3
                  my-4
                  p-3
                  sm:p-4
                  rounded-lg
                  bg-white
                  border
                  border-gray-100
                "
              >

                {/* User Image */}
                <img
                  src={`${backend_url}${item?.user?.avatar}`}
                  className="
                    w-[45px]
                    h-[45px]
                    sm:w-[55px]
                    sm:h-[55px]
                    rounded-full
                    object-cover
                    flex-shrink-0
                  "
                  alt=""
                />

                {/* Review Content */}
                <div className="flex-1 min-w-0">

                  {/* Name + Rating */}
                  <div
                    className="
                      flex
                      flex-wrap
                      items-center
                      gap-x-2
                      gap-y-1
                    "
                  >
                    <h1 className="font-[600] text-[14px] sm:text-[16px] break-words">
                      {item?.user?.name}
                    </h1>

                    <Ratings ratings={item.rating} />
                  </div>

                  {/* Comment */}
                  <p
                    className="
                      font-[400]
                      text-[#000000a7]
                      text-[13px]
                      sm:text-[14px]
                      mt-1
                      break-words
                      leading-5
                    "
                  >
                    {item?.comment}
                  </p>

                  {/* Date */}
                  <p
                    className="
                      text-[#000000a7]
                      text-[12px]
                      sm:text-[14px]
                      mt-1
                    "
                  >
                    {"2days ago"}
                  </p>
                </div>
              </div>
            ))}

          {/* No Reviews */}
          {allReviews &&
            allReviews.length === 0 && (
              <h5
                className="
                  w-full
                  text-center
                  py-8
                  text-[16px]
                  sm:text-[18px]
                "
              >
                No Reviews have for this shop!
              </h5>
            )}
        </div>
      )}
    </div>
  );
};

export default ShopProfileData;