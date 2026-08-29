import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import AllOrders from "../../components/Shop/Layout/AllOrders";

const ShopAllOrdersPage = () => {
  return (
    <div className="min-h-screen">
          <DashboardHeader />
    
          <div className="flex w-full">
            {/* Sidebar */}
            <aside className="w-[70px] 800px:w-[260px] shrink-0">
              <DashboardSideBar active={2} />
            </aside>
    
            {/* Main Content */}
            <div className="flex-1 min-w-0 overflow-hidden">
              <AllOrders />
            </div>
          </div>
        </div>
  );
};

export default ShopAllOrdersPage;
