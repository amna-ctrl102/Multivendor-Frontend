import styles from "../../styles/styles";
import { Country, State } from "country-state-city";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { server } from "../../server";
import axios from "axios";

const Checkout = () => {
  const { user } = useSelector((state) => state.user);
  const { cart } = useSelector((state) => state.cart);

  const [country, setCountry] = useState("");
  const [city, setCity] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [zipCode, setZipCode] = useState("");
  const [userInfo, setUserInfo] = useState(false);

  const [couponCode, setCouponCode] = useState("");
  const [couponCodeData, setCouponCodeData] = useState({});
  const [discountPrice, setDiscountPrice] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const paymentSubmit = () => {
    if (address1 === "" || zipCode === null || country === "" || city === "") {
      toast.error("Please choose your delivery address!");
    } else {
      const shippingAddress = {
        country,
        city,
        address1,
        address2,
        zipCode,
      };

      const orderData = {
        cart,
        user,
        totalPrice,
        subTotalPrice,
        shipping,
        discountPrice,
        shippingAddress,
      };
      localStorage.setItem("latestOrder", JSON.stringify(orderData));
      navigate("/payment");
    }
  };

  const subTotalPrice = cart.reduce((acc, item) => {
    return item.discountPrice
      ? acc + item.qty * item.discountPrice
      : acc + item.qty * item.originalPrice;
  }, 0);

  const shipping = subTotalPrice * 0.1;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const name = couponCode.trim();
    if (!name) {
      toast.error("Please enter a coupon code");
      return;
    }

    try {
      const res = await axios.get(
        `${server}/coupoun/get-coupoun-value/${encodeURIComponent(name)}`,
        {
          withCredentials: true,
        },
      );

      const coupon = res.data?.couponCode;
      if (!coupon) {
        toast.error("Coupon code doesn't exits");
        setCouponCode("");
        return;
      }

      const shopId = coupon?.shop?._id;
      const couponCodeValue = Number(coupon?.value || 0);

      if (!shopId) {
        toast.error("Coupon code is invalid");
        setCouponCode("");
        return;
      }

      const validItems = cart?.filter((item) => item.shopId === shopId) || [];
      if (validItems.length === 0) {
        toast.error("Coupon code is not valid for this shop");
        setCouponCode("");
        return;
      }

      const eligiblePrice = validItems.reduce(
        (acc, item) =>
          item.discountPrice
            ? acc + item.qty * item.discountPrice
            : acc + item.qty * item.originalPrice,
        0,
      );

      const newDiscount = (eligiblePrice * couponCodeValue) / 100;
      const nextCouponData = {
        ...couponCodeData,
        [shopId]: { ...coupon, amount: newDiscount },
      };

      const nextDiscountPrice = Object.values(nextCouponData).reduce(
        (sum, item) => sum + Number(item.amount || 0),
        0,
      );

      setCouponCodeData(nextCouponData);
      setDiscountPrice(nextDiscountPrice);
      setCouponCode("");
    } catch (error) {
      console.log(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  const discountPercentage = Number(discountPrice || 0);
  const totalPrice =
    discountPercentage > 0
      ? (subTotalPrice + shipping - discountPercentage).toFixed(2)
      : (subTotalPrice + shipping).toFixed(2);

  return (
    <div className="w-full flex flex-col items-center py-5 sm:py-7 md:py-8">
      <div className="w-full px-3 sm:px-5 md:px-8 lg:px-10 max-w-[1400px] block 800px:flex gap-6 lg:gap-8">
        <div className="w-full 800px:w-[65%] lg:w-[68%]">
          <ShippingInfo
            user={user}
            country={country}
            setCountry={setCountry}
            city={city}
            setCity={setCity}
            address1={address1}
            setAddress1={setAddress1}
            address2={address2}
            setAddress2={setAddress2}
            zipCode={zipCode}
            setZipCode={setZipCode}
            userInfo={userInfo}
            setUserInfo={setUserInfo}
          />
        </div>

        <div className="w-full 800px:w-[35%] lg:w-[32%] mt-5 800px:mt-0">
          <CartData
            cart={cart}
            couponCode={couponCode}
            setCouponCode={setCouponCode}
            couponCodeData={couponCodeData}
            setCouponCodeData={setCouponCodeData}
            discountPrice={discountPrice}
            setDiscountPrice={setDiscountPrice}
            subTotalPrice={subTotalPrice}
            shipping={shipping}
            handleSubmit={handleSubmit}
            discountPercentage={discountPercentage}
            totalPrice={totalPrice}
          />
        </div>
      </div>

      <div
        className="w-full flex justify-center mt-6 sm:mt-8 mb-6 px-3 sm:px-5"
        onClick={paymentSubmit}
      >
        <button
          className="
          w-full
          max-w-[320px]
          h-11
          sm:h-12
          flex
          items-center
          justify-center
          bg-black
          hover:bg-gray-800
          transition
          text-white
          rounded-lg
          uppercase
          font-semibold
          text-sm
          sm:text-base
          shadow-lg
          disabled:opacity-80
        "
          type="submit"
        >
          Go to payment
        </button>
      </div>
    </div>
  );
};

const ShippingInfo = ({
  user,
  country,
  setCountry,
  city,
  setCity,
  address1,
  setAddress1,
  address2,
  setAddress2,
  zipCode,
  setZipCode,
  userInfo,
  setUserInfo,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-4 sm:p-5 md:p-6 pb-6 sm:pb-8">
      <h5 className="text-[17px] sm:text-[18px] font-[500]">
        Shipping Address
      </h5>

      <div className="h-4 sm:h-5" />

      <form>
        <div className="w-full flex flex-col 800px:flex-row gap-3 sm:gap-4 pb-3">
          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2 text-sm sm:text-base">Full Name</label>

            <input
              type="text"
              required
              value={user && user.name}
              readOnly
              className={`${styles.input} !w-full !p-3`}
            />
          </div>

          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2 text-sm sm:text-base">
              Email Address
            </label>

            <input
              type="email"
              required
              value={user && user.email}
              readOnly
              className={`${styles.input} !w-full !p-3`}
            />
          </div>
        </div>

        <div className="w-full flex flex-col 800px:flex-row gap-3 sm:gap-4 pb-3">
          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2 text-sm sm:text-base">
              Phone Number
            </label>

            <input
              type="number"
              required
              value={user && user.phoneNumber}
              readOnly
              className={`${styles.input} !w-full !p-3`}
            />
          </div>

          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2 text-sm sm:text-base">Zip Code</label>

            <input
              type="number"
              required
              value={zipCode}
              onChange={(e) => setZipCode(e.target.value)}
              className={`${styles.input} !w-full !p-3`}
            />
          </div>
        </div>

        <div className="w-full flex flex-col 800px:flex-row gap-3 sm:gap-4 pb-3">
          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2 text-sm sm:text-base">Country</label>

            <select
              className="w-full border p-3 rounded-[5px]"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your country
              </option>

              {Country &&
                Country.getAllCountries().map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>

          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2 text-sm sm:text-base">City</label>

            <select
              className="w-full border p-3 rounded-[5px]"
              value={city}
              onChange={(e) => setCity(e.target.value)}
            >
              <option className="block pb-2" value="">
                Choose your City
              </option>

              {State &&
                State.getStatesOfCountry(country).map((item) => (
                  <option key={item.isoCode} value={item.isoCode}>
                    {item.name}
                  </option>
                ))}
            </select>
          </div>
        </div>

        <div className="w-full flex flex-col 800px:flex-row gap-3 sm:gap-4 pb-3">
          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2 text-sm sm:text-base">Address1</label>

            <input
              type="text"
              required
              value={address1}
              onChange={(e) => setAddress1(e.target.value)}
              className={`${styles.input} !w-full !p-3`}
            />
          </div>

          <div className="w-full 800px:w-[50%]">
            <label className="block pb-2 text-sm sm:text-base">Address2</label>

            <input
              type="text"
              value={address2}
              onChange={(e) => setAddress2(e.target.value)}
              className={`${styles.input} !w-full !p-3`}
            />
          </div>
        </div>
      </form>

      <h5
        className="text-[16px] sm:text-[18px] cursor-pointer inline-block mt-2"
        onClick={() => setUserInfo(!userInfo)}
      >
        Choose from saved address
      </h5>

      {userInfo && (
        <div className="w-full mt-2">
          {user &&
            user.addresses.map((item, index) => (
              <div
                key={index}
                className="w-full flex items-center mt-2 p-2 sm:p-3 rounded-md bg-[#faf7f9]"
              >
                <input
                  type="checkbox"
                  className="mr-3 flex-shrink-0"
                  onClick={() =>
                    setAddress1(item.address1) ||
                    setAddress2(item.address2) ||
                    setCountry(item.country) ||
                    setCity(item.city) ||
                    setZipCode(item.zipCode)
                  }
                />

                <h2 className="text-sm sm:text-base">{item.addressType}</h2>
              </div>
            ))}
        </div>
      )}
    </div>
  );
};

const CartData = ({
  cart,
  couponCode,
  setCouponCode,
  couponCodeData,
  setCouponCodeData,
  discountPrice,
  setDiscountPrice,
  subTotalPrice,
  shipping,
  handleSubmit,
  discountPercentage,
  totalPrice,
}) => {
  return (
    <div className="w-full bg-white rounded-md p-4 sm:p-5 md:p-6 pb-6 sm:pb-8">
      <div className="flex justify-between items-center gap-3">
        <h3 className="text-[14px] sm:text-[16px] font-[400] text-[#000000a4]">
          subtotal:
        </h3>

        <h5 className="text-[16px] sm:text-[18px] font-[600]">
          ${subTotalPrice}
        </h5>
      </div>

      <div className="h-4 sm:h-5" />

      <div className="flex justify-between items-center gap-3">
        <h3 className="text-[14px] sm:text-[16px] font-[400] text-[#000000a4]">
          shipping:
        </h3>

        <h5 className="text-[16px] sm:text-[18px] font-[600]">${shipping}</h5>
      </div>

      <div className="h-4 sm:h-5" />

      <div className="flex justify-between items-center gap-3 border-b pb-3">
        <h3 className="text-[14px] sm:text-[16px] font-[400] text-[#000000a4]">
          Discount:
        </h3>

        <h5 className="text-[16px] sm:text-[18px] font-[600]">
          - {discountPercentage ? "$" + discountPercentage.toString() : null}
        </h5>
      </div>

      <h5 className="text-[17px] sm:text-[18px] font-[600] text-end pt-3">
        ${totalPrice}
      </h5>

      <div className="h-4 sm:h-5" />

      <form onSubmit={handleSubmit}>
        <input
          type="text"
          className={`${styles.input} !w-full !p-3 pl-2`}
          placeholder="Coupon code"
          value={couponCode}
          onChange={(e) => setCouponCode(e.target.value)}
        />

        <input
          className="
          w-full
          h-[40px]
          border
          border-[#a30563]
          text-center
          text-[#a30563]
          rounded-[3px]
          mt-5
          sm:mt-8
          cursor-pointer
        "
          value="Apply code"
          type="submit"
        />
      </form>
    </div>
  );
};

export default Checkout;
