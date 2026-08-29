import HeroImage from "../../../Assests/HeroImage.png";
import styles from "../../../styles/styles";
import { Link } from "react-router-dom";

const Hero = () => {
  return (
    <div
      className={`
        relative
        min-h-[65vh]
        sm:min-h-[65vh]
        md:min-h-[70vh]
        800px:min-h-[80vh]
        w-full
        bg-no-repeat
        bg-cover
        bg-[position:65%_center]
        800px:bg-left
        flex
        items-center
      `}
      style={{ backgroundImage: `url(${HeroImage})` }}
    >
      {/* Hero Content */}
      <div
        className="
          w-full
          px-6
          sm:px-10
          md:px-12
          800px:ml-20
          800px:w-[60%]
          800px:px-0
        "
      >
        {/* Heading */}
        <h1
          className="
            leading-[1.2]
            text-[30px]
            sm:text-[38px]
            md:text-[45px]
            lg:text-[55px]
            800px:text-[60px]
            text-white
            font-[600]
            capitalize
            font-[Poppins]
          "
        >
          Best Collection For{" "}
          <br className="hidden sm:block" />
          Home Decoration
        </h1>

        {/* Description - Mobile par hidden */}
        <p
          className="
            hidden
            800px:block
            pt-5
            text-[16px]
            lg:text-[17px]
            max-w-[600px]
            font-[Poppins]
            font-[400]
            text-white
            leading-[1.6]
          "
        >
          Create a home you'll love with our carefully curated collection of
          furniture, lighting, and decorative accessories. Enjoy exceptional
          quality, modern designs, and affordable prices—all in one place.
        </p>

        {/* Shop Now Button */}
        <Link to="/products" className="inline-block">
          <div
            className={`
              ${styles.button}
              !rounded-lg
              !bg-[#a30563]
              mt-5
              sm:mt-6
              px-6
              sm:px-8
              py-2.5
              sm:py-3
            `}
          >
            <span
              className="
                text-white
                font-[Poppins]
                text-[15px]
                sm:text-[17px]
                lg:text-[20px]
              "
            >
              Shop Now
            </span>
          </div>
        </Link>
      </div>
    </div>
  );
};

export default Hero;