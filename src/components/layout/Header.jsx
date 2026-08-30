import { useEffect, useState } from "react";
import ShopLogo from "../../Assests/ShopLogo.png";
import styles from "../../styles/styles";
import { Link } from "react-router-dom";
import { categoriesData } from "../../static/data";
import {
  AiOutlineHeart,
  AiOutlineSearch,
  AiOutlineShoppingCart,
} from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowForward } from "react-icons/io";
import { BiMenuAltLeft } from "react-icons/bi";
import { CgProfile } from "react-icons/cg";
import DropDown from "./DropDown";
import Navbar from "./Navbar";
import { useSelector } from "react-redux";
import Cart from "../Cart/Cart";
import Wishlist from "../Wishlist/Wishlist";
import { RxCross1 } from "react-icons/rx";

const Header = ({ activeHeading }) => {
  const { isAuthenticated, user } = useSelector((state) => state.user);
  const { isSeller } = useSelector((state) => state.seller);
  const { allProducts } = useSelector((state) => state.products);
  const { cart } = useSelector((state) => state.cart);
  const { wishlist } = useSelector((state) => state.wishlist);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchData, setSearchData] = useState(null);
  const [active, setActive] = useState(false);
  const [dropDown, setDropDown] = useState(false);
  const [openCart, setOpenCart] = useState(false);
  const [openWishList, setOpenWishList] = useState(false);
  const [open, setOpen] = useState(false);

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);

    const filteredProduct =
      allProducts &&
      allProducts.filter((product) => {
        return product.name.toLowerCase().includes(term.toLowerCase());
      });

    setSearchData(filteredProduct);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 70) {
        setActive(true);
      } else {
        setActive(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <>
      <div className={`${styles.section}`}>
        <div className="hidden 800px:h-[50px] 800px:my-[20px] 800px:flex items-center justify-between">
          <div>
            <Link to="/">
              <img
                src={ShopLogo}
                alt="Logoimage"
                className="w-[220px] h-auto object-contain"
              />
            </Link>
          </div>
          {/* Search box */}
          <div className="w-[50%] relative">
            <input
              type="text"
              placeholder="Search Product..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="h-[40px] w-full px-2 border-2 border-black rounded-md"
            />
            <AiOutlineSearch
              size={30}
              className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
            />
            {searchData && searchTerm !== "" && searchData.length > 0 ? (
              <div className="absolute min-h-[30vh] bg-slate-50 shadow-sm-2 z-[9] p-2">
                {searchData &&
                  searchData.map((i) => {
                    return (
                      <Link key={i._id} to={`/product/${i._id}`}>
                        <div className="w-full flex items-start py-2">
                          <img
                            src={i.images && i.images[0]}
                            alt="productImage"
                            className="w-[40px] h-[40px] mr-[10px]"
                          />
                          <h1>{i.name}</h1>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            ) : null}
          </div>
          <div
            className={`${styles.button} !rounded-lg hover:bg-gray-800 transition mt-5 shadow-md`}
          >
            {isSeller ? (
              <Link to="/dashboard">
                <h1 className="text-[#fff] flex items-center">
                  Go to Dashboard <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            ) : (
              <Link to="/shop-create">
                <h1 className="text-[#fff] flex items-center">
                  Become Seller <IoIosArrowForward className="ml-1" />
                </h1>
              </Link>
            )}
          </div>
        </div>
      </div>
      <div
        className={`${active === true ? "shadow-sm fixed top-0 left-0 z-10" : null} transition hidden 800px:flex items-center justify-between w-full bg-[#a30563] h-[70px]`}
      >
        <div
          className={`${styles.section} relative ${styles.normalFlex} justify-between`}
        >
          {/* categories */}
          <div onClick={() => setDropDown(!dropDown)}>
            <div className="relative h-[60px] mt-[10px] w-[270px] hidden 1000px:block">
              <BiMenuAltLeft size={30} className="absolute top-3 left-2" />
              <button
                className={`h-[100%] w-full flex justify-between items-center pl-10 bg-white font-sans text-lg font-[500] select-none rounded-t-md`}
              >
                All Categories
              </button>
              <IoIosArrowDown
                size={20}
                className="absolute right-2 top-4 cursor-pointer"
                onClick={() => setDropDown(!dropDown)}
              />
              {dropDown ? (
                <DropDown
                  categoriesData={categoriesData}
                  setDropDown={setDropDown}
                />
              ) : null}
            </div>
          </div>
          {/* NavItems */}
          <div className={`${styles.normalFlex}`}>
            <Navbar active={activeHeading} />
          </div>
          <div className={`${styles.normalFlex}`}>
            <div>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenWishList(true)}
              >
                <AiOutlineHeart size={30} color="rgb(255 255 255 /83%)" />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {wishlist && wishlist.length}
                </span>
              </div>
            </div>
            <div>
              <div
                className="relative cursor-pointer mr-[15px]"
                onClick={() => setOpenCart(true)}
              >
                <AiOutlineShoppingCart
                  size={30}
                  color="rgb(255 255 255 /83%)"
                />
                <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                  {cart && cart.length}
                </span>
              </div>
            </div>
            <div className={`${styles.normalFlex}`}>
              <div className="relative cursor-pointer mr-[15px]">
                {isAuthenticated && user?.avatar ? (
                  <Link to="/profile">
                    <img
                      src={user.avatar || ""}
                      alt="profileImage"
                      className="w-[35px] h-[35px] rounded-full object-cover"
                    />
                  </Link>
                ) : (
                  <Link to="/login">
                    <CgProfile size={30} color="rgb(255 255 255 /83%)" />
                  </Link>
                )}
              </div>
            </div>
            {/* Cart popup */}
            {openCart ? <Cart setOpenCart={setOpenCart} /> : null}

            {/* wishList popup */}
            {openWishList ? <Wishlist setWishList={setOpenWishList} /> : null}
          </div>
        </div>
      </div>

      {/* Mobile Header */}
      <div
        className={`fixed w-full h-[60px] bg-[#fff] z-50 top-0 left-0 shadow-sm 800px:hidden`}
      >
        <div className="w-full flex items-center justify-between py-3">
          <div>
            <BiMenuAltLeft
              size={38}
              className="ml-4"
              onClick={() => setOpen(true)}
            />
          </div>
          <div>
            <Link to="/">
              <img src={ShopLogo} alt="" className="cursor-pointer w-[120px]" />
            </Link>
          </div>
          <div className="flex gap-3">
            <div
              className="relative cursor-pointer"
              onClick={() => setOpenWishList(true)}
            >
              <AiOutlineHeart size={28} />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {wishlist && wishlist.length}
              </span>
            </div>
            <div
              className="relative cursor-pointer mr-[15px]"
              onClick={() => setOpenCart(true)}
            >
              <AiOutlineShoppingCart size={28} />
              <span className="absolute right-0 top-0 rounded-full bg-[#3bc177] w-4 h-4 p-0 m-0 text-white font-mono text-[12px] leading-tight text-center">
                {cart && cart.length}
              </span>
            </div>
          </div>
          {/* Cart Popup */}
          {openCart && <Cart setOpenCart={setOpenCart} />}

          {/* Wishlist Popup */}
          {openWishList && <Wishlist setWishList={setOpenWishList} />}
        </div>
      </div>

      {/* header sideBar */}
      {open && (
        <div className="fixed inset-0 z-[60] bg-[#0000005f] h-full w-full 800px:hidden">
          <div className="fixed left-0 top-0 z-[70] h-screen w-[80%] bg-[#fff] overflow-y-scroll">
            <div className="flex w-full items-center justify-end px-3 pt-5">
              <RxCross1
                size={22}
                className="cursor-pointer"
                onClick={() => setOpen(false)}
              />
            </div>

            <div className="my-8 w-[92%] m-auto h-[40px] relative ml-4">
              <input
                type="text"
                placeholder="Search Product..."
                value={searchTerm}
                onChange={handleSearchChange}
                className="h-[40px] w-full px-2 border-black border-[2px] rounded-md"
              />
              <AiOutlineSearch
                size={20}
                className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer"
              />
              {searchData && searchTerm !== "" && searchData.length > 0 ? (
                <div className="absolute w-full bg-white shadow-md rounded-md z-[10] left-0 p-3">
                  {searchData &&
                    searchData.map((i) => {
                      return (
                        <Link key={i._id} to={`/product/${i._id}`}>
                          <div className="w-full flex items-start py-2">
                            <img
                              src={i.images && i.images[0]}
                              alt="productImage"
                              className="w-[40px] h-[40px] mr-[10px]"
                            />
                            <h1>{i.name}</h1>
                          </div>
                        </Link>
                      );
                    })}
                </div>
              ) : null}
            </div>

            <Navbar active={activeHeading} />
            <div
              className={`h-[40px] w-[90%] rounded-lg bg-black flex items-center justify-center ml-4 hover:bg-gray-800 transition`}
            >
              {isSeller ? (
                <Link to="/dashboard">
                  <h1 className="text-[#fff] flex items-center justify-center">
                    Go to Dashboard <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              ) : (
                <Link to="/shop-create">
                  <h1 className="text-[#fff] flex items-center justify-center">
                    Become Seller <IoIosArrowForward className="ml-1" />
                  </h1>
                </Link>
              )}
            </div>
            <br />
            <br />
            <div className="flex w-full justify-center">
              {isAuthenticated && user?.avatar ? (
                <div>
                  <Link to="/profile">
                    <img
                      src={user.avatar || ""}
                      alt="profileImage"
                      className="w-[60px] h-[60px] rounded-full object-cover border-[2px] border-[#a30563]"
                    />
                  </Link>
                </div>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="text-[18px] pr-[5px] text-[#000000b7] font-semibold"
                  >
                    Login /
                  </Link>
                  <Link
                    to="/sign-up"
                    className="text-[18px] text-[#000000b7] font-semibold"
                  >
                    Sign UP
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
