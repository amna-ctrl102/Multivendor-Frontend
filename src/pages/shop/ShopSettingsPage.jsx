import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import ShopSetting from "../../components/Shop/ShopSetting";

const ShopSettingsPage = () => {
  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="w-[70px] 800px:w-[260px] shrink-0">
          <DashboardSideBar active={11} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <ShopSetting />
        </div>
      </div>
    </div>
  );
};

export default ShopSettingsPage;
