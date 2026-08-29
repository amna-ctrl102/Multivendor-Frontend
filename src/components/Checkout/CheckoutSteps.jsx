import React from "react";
import styles from "../../styles/styles";

const CheckoutSteps = ({ active }) => {
  return (
    <div className="w-full flex justify-center px-3 sm:px-5 md:px-8">
      <div className="w-full max-w-[900px] flex items-center justify-center">

        {/* Shipping */}
        <div className="flex items-center min-w-0">
          <div className={`${styles.cart_button} !bg-[#a30563] !w-auto !px-3 sm:!px-5`}>
            <span className={`${styles.cart_button_text} text-[11px] sm:text-[13px] md:text-[14px]`}>
              1. Shipping
            </span>
          </div>

          <div
            className={`w-[18px] xs:w-[25px] sm:w-[50px] md:w-[70px] h-[3px] sm:h-[4px] ${
              active > 1 ? "bg-[#a30563]" : "bg-[#FDE1E6]"
            }`}
          ></div>
        </div>

        {/* Payment */}
        <div className="flex items-center min-w-0">
          <div
            className={`${
              active > 1
                ? `${styles.cart_button} !bg-[#a30563] !w-auto !px-3 sm:!px-5`
                : `${styles.cart_button} !bg-[#FDE1E6] !w-auto !px-3 sm:!px-5`
            }`}
          >
            <span
              className={`text-[11px] sm:text-[13px] md:text-[14px] ${
                active > 1
                  ? `${styles.cart_button_text}`
                  : `${styles.cart_button_text} !text-[#a30563]`
              }`}
            >
              2. Payment
            </span>
          </div>

          <div
            className={`w-[18px] xs:w-[25px] sm:w-[50px] md:w-[70px] h-[3px] sm:h-[4px] ${
              active > 2 ? "bg-[#a30563]" : "bg-[#FDE1E6]"
            }`}
          ></div>
        </div>

        {/* Success */}
        <div className="flex items-center min-w-0">
          <div
            className={`${
              active > 2
                ? `${styles.cart_button} !bg-[#a30563] !w-auto !px-3 sm:!px-5`
                : `${styles.cart_button} !bg-[#FDE1E6] !w-auto !px-3 sm:!px-5`
            }`}
          >
            <span
              className={`text-[11px] sm:text-[13px] md:text-[14px] ${
                active > 2
                  ? `${styles.cart_button_text}`
                  : `${styles.cart_button_text} !text-[#a30563]`
              }`}
            >
              3. Success
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default CheckoutSteps;