import { useState } from "react";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import styles from "../../styles/styles";
import { Link,useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { server } from "../../server";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [visible, setVisible] = useState(false);
  const [loading, setLoading]= useState(false);

  const navigate=useNavigate();

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setLoading(true);
    try{
        const res = await axios.post(
            `${server}/user/login-user`,
                { email, password },
                { withCredentials: true }
            );
            if (res.data && res.data.success) {
                toast.success("Login Success!");
                navigate("/");
                window.location.reload();
            } else {
                toast.error(res.data?.message || "Login failed");
            }
    }catch(error){
        toast.error(error.response?.data?.message || error.message || "Something went wrong");
    }finally{
        setLoading(false);
    }

  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-bold text-[#a30563]">
          Login to your account
        </h2>
        <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
            <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                    <label
                    htmlFor="email"
                    className="block text-sm font-medium text-black"
                    >
                    Email address
                    </label>
                    <div className="mt-1">
                    <input
                        type="email"
                        name="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-md placeholder-gray-400 focus:outline-none focus:ring-[#a30563] focus:border-[#a30563] sm:text-sm"
                    />
                    </div>
                </div>
                <div>
                    <label
                    htmlFor="password"
                    className="block text-sm font-medium text-black"
                    >
                    Password
                    </label>
                    <div className="mt-1 relative">
                    <input
                        type={visible ? "text" : "password"}
                        name="password"
                        autoComplete="current-password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-md placeholder-gray-400 focus:outline-none focus:ring-[#a30563] focus:border-[#a30563] sm:text-sm"
                    />
                    {visible ? (
                        <AiOutlineEye
                        className="absolute right-2 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setVisible(false)}
                        />
                    ) : (
                        <AiOutlineEyeInvisible
                        className="absolute right-2 top-2 cursor-pointer"
                        size={25}
                        onClick={() => setVisible(true)}
                        />
                    )}
                    </div>
                </div>
                <div className={`${styles.normalFlex} justify-between`}>
                    <div className={`${styles.normalFlex}`}>
                    <input
                        type="checkbox"
                        name="remember-me"
                        id="remember-me"
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500 border border-gray-300 rounded"
                    />
                    <label htmlFor="remember-me" className="ml-2 block text-sm text-black">
                        Remember me
                    </label>
                    </div>
                    <div className="text-sm">
                        <a href="/forgot-password" className="font-medium text-[#a30563] hover:text-[#85004f] transition">
                            Forgot your password?
                        </a>
                    </div>
                </div>
                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full h-[40px] flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 transition"
                    >
                        {loading?"Loading...":"Submit"}
                    </button>
                </div>
                <div className={`${styles.normalFlex} w-full`}>
                    <h4>Not have any account?</h4>
                    <Link to="/sign-up" className="text-[#a30563] pl-2">
                        Sign Up
                    </Link>
                </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
