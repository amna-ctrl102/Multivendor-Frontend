import DashboardSideBar from "../../components/Shop/Layout/DashboardSideBar";
import DashboardHeader from "../../components/Shop/Layout/DashboardHeader";
import CreateEvents from "../../components/Shop/Layout/CreateEvents";

const ShopCreateEventsPage = () => {
  return (
    <div className="min-h-screen">
      <DashboardHeader />

      <div className="flex w-full">
        {/* Sidebar */}
        <aside className="w-[70px] 800px:w-[260px] shrink-0">
          <DashboardSideBar active={6} />
        </aside>

        {/* Main Content */}
        <div className="flex-1 min-w-0 overflow-hidden">
          <CreateEvents />
        </div>
      </div>
    </div>
  );
};

export default ShopCreateEventsPage;
