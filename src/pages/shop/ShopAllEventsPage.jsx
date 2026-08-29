import DashboardHeader from '../../components/Shop/Layout/DashboardHeader'
import DashboardSideBar from '../../components/Shop/Layout/DashboardSideBar'
import AllEvents from "../../components/Shop/Layout/AllEvents";

const ShopAllEventsPage = () => {
  return (
   <div className="min-h-screen">
              <DashboardHeader />
        
              <div className="flex w-full">
                {/* Sidebar */}
                <aside className="w-[70px] 800px:w-[260px] shrink-0">
                  <DashboardSideBar active={5} />
                </aside>
        
                {/* Main Content */}
                <div className="flex-1 min-w-0 overflow-hidden">
                  <AllEvents />
                </div>
              </div>
            </div>
  )
}

export default ShopAllEventsPage
