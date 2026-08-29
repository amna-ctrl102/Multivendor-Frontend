import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHero from "../../components/Shop/Layout/DashboardHero";

const ShopDashboardPage = () => {
  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="w-[70px] 800px:w-[260px] shrink-0">
          <DashboardSideBar active={1} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0">
          <DashboardHero />
        </div>
      </div>
    </div>
  );
};

export default ShopDashboardPage;