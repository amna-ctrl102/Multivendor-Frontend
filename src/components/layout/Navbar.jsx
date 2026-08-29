import styles from "../../styles/styles";
import { navItems } from "../../static/data";
import { Link } from "react-router-dom";

const Navbar = ({ active }) => {
  return (
    <div className={`block 800px:${styles.normalFlex}`}>
      {navItems &&
        navItems.map((i, index) => (
          <div className="flex" key={i.url || index}>
            <Link
              to={i.url}
              className={`${active === index + 1 ? "text-black" : "text-[#a30563] 800px:text-[#fff]"} font-[500] px-5 800px:px-6 cursor-pointer pb-[30px] 800px:pb-0`}
            >
              {i.title}
            </Link>
          </div>
        ))}
    </div>
  );
};

export default Navbar;
