import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import Loader from "../components/layout/Loader";

const SellerProtectedRoute = ({ children }) => {
  const { isLoading, isSeller } = useSelector((state) => state.seller);
  if (isLoading) {
    return(
      <Loader/>
    )
  }

  if(isLoading===false){
      if (!isSeller) {
      return <Navigate to="/shop-login "replace />;
    }

    return children;
  }
};

export default SellerProtectedRoute;