import Header from "../components/layout/Header";
import EventCard from "../components/Events/EventCard";
import { useSelector } from "react-redux";

const EventsPage = () => {
  const { allEvents, isLoading } = useSelector((state) => state.events);
  return (
    <>
      {!isLoading && (
        <div>
          <Header activeHeading={4} />
          <div className={`mt-20 800px:mt-8`}>
            <div className="flex flex-col gap-7">
              {allEvents &&
                allEvents.map((event, index) => (
                  <EventCard active={true} data={event} key={index} />
                ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default EventsPage;
