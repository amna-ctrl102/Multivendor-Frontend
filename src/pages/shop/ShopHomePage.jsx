import styles from "../../styles/styles";
import ShopInfo from "../../components/Shop/ShopInfo.jsx";
import ShopProfileData from "../../components/Shop/ShopProfileData";

const ShopHomePage = () => {
  return (
    <div className={`${styles.section} bg-[#f5f5f5]`}>
      <div
        className="
          w-full
          flex
          flex-col
          gap-6
          py-6
          sm:py-8
          lg:flex-row
          lg:justify-between
          lg:items-start
          lg:gap-6
        "
      >
        {/* ================= SHOP INFO ================= */}
        <div
          className="
            w-full
            bg-white
            rounded-lg
            shadow-sm
            h-fit

            lg:w-[25%]
            lg:sticky
            lg:top-10
          "
        >
          <ShopInfo isOwner={true} />
        </div>

        {/* ================= SHOP PROFILE ================= */}
        <div
          className="
            w-full

            lg:w-[72%]
          "
        >
          <ShopProfileData isOwner={true} />
        </div>
      </div>
    </div>
  );
};

export default ShopHomePage;