import { MdOutlineTrackChanges } from "react-icons/md";
import {
  AiOutlineLogin,
  AiOutlineMessage,
} from "react-icons/ai";
import { HiOutlineReceiptRefund } from "react-icons/hi";
import { IoBagHandleOutline } from "react-icons/io5";
import { TbAddressBook } from "react-icons/tb";
import { RxPerson } from "react-icons/rx";
import { RiLockPasswordLine } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { server } from "../../server";

const ProfileSideBar = ({ active, setActive }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const LogoutHandler = async () => {
    try {
      const res = await axios.get(`${server}/user/logout`, {
        withCredentials: true,
      });
      dispatch({ type: "LogoutSuccess" });
      toast.success(res.data.message);
      navigate("/login", { replace: true });
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Something went wrong",
      );
    }
  };

  return (
    <div className="w-full bg-white shadow-md rounded-[10px] p-4 pt-8 mt-16 800px:mt-0">
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(1)}
      >
        <RxPerson size={20} color={active === 1 ? "#a30563" : ""} />
        <span
          className={`pl-3 font-Roboto text-[18px] ${active === 1 ? "text-[#a30563]" : ""} 800px:block hidden`}
        >
          Profile
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(2)}
      >
        <IoBagHandleOutline size={20} color={active === 2 ? "#a30563" : ""} />
        <span
          className={`pl-3 font-Roboto text-[18px] ${active === 2 ? "text-[#a30563]" : ""} 800px:block hidden`}
        >
          Orders
        </span>
      </div>
      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(3)}
      >
        <HiOutlineReceiptRefund size={20} color={active === 3 ? "#a30563" : ""} />
        <span
          className={`pl-3 font-Roboto text-[18px] ${active === 3 ? "text-[#a30563]" : ""} 800px:block hidden`}
        >
          Refunds
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => {
          setActive(4);
          navigate("/inbox");
        }}
      >
        <AiOutlineMessage size={20} color={active === 4 ? "#a30563" : ""} />
        <span
          className={`pl-3 font-Roboto text-[18px] ${active === 4 ? "text-[#a30563]" : ""} 800px:block hidden`}
        >
          Inbox
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(5)}
      >
        <MdOutlineTrackChanges size={20} color={active === 5 ? "#a30563" : ""} />
        <span
          className={`pl-3 font-Roboto text-[18px] ${active === 5 ? "text-[#a30563]" : ""} 800px:block hidden`}
        >
          Track Order
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => {
          setActive(6);
        }}
      >
        <RiLockPasswordLine size={20} color={active === 6 ? "#a30563" : ""} />
        <span
          className={`pl-3 font-Roboto text-[18px] ${active === 6 ? "text-[#a30563]" : ""} 800px:block hidden`}
        >
          Change Password
        </span>
      </div>

      <div
        className="flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(7)}
      >
        <TbAddressBook size={20} color={active === 7 ? "#a30563" : ""} />
        <span
          className={`pl-3 font-Roboto text-[18px] ${active === 7 ? "text-[#a30563]" : ""} 800px:block hidden`}
        >
          Address
        </span>
      </div>

      <div
        className="single_item flex items-center cursor-pointer w-full mb-8"
        onClick={() => setActive(8) || LogoutHandler()}
      >
        <AiOutlineLogin size={20} color={active === 8 ? "#a30563" : ""} />
        <span
          className={`pl-3 font-Roboto text-[18px] ${active === 8 ? "text-[#a30563]" : ""} 800px:block hidden`}
        >
          Log out
        </span>
      </div>
    </div>
  );
};

export default ProfileSideBar;
