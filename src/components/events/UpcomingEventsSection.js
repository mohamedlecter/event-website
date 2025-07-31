import React from "react";
import Slider from "react-slick";
import EventCard from "./EventCard";
import {FiChevronLeft, FiChevronRight} from "react-icons/fi";

const Arrow = ({ className, style, onClick, icon }) => (
  <button
    className={className + " !flex !items-center !justify-center !bg-white !shadow-xl !rounded-full !w-12 !h-12 !z-20 hover:!bg-yellow-400 transition-all duration-300 border-2 border-yellow-400"}
    style={{ ...style, display: "flex", top: "45%", [icon === "left" ? "left" : "right"]: "-40px" }}
    onClick={onClick}
    aria-label={icon === "left" ? "Previous" : "Next"}
  >
    {icon === "left" ? (
      <FiChevronLeft size={24} style={{ color: '#FBBF24' }} />
    ) : (
      <FiChevronRight size={24} style={{ color: '#FBBF24' }} />
    )}
  </button>
);

const UpcomingEventsSection = ({ events = [] }) => {
  const settings = {
    dots: false,
    infinite: events.length > 3,
    speed: 800,
    slidesToShow: Math.min(3, events.length),
    slidesToScroll: 1,
    centerMode: true,
    centerPadding: "40px",
    nextArrow: <Arrow icon="right" />,
    prevArrow: <Arrow icon="left" />,
    autoplay: true,
    autoplaySpeed: 5000,
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: Math.min(2, events.length),
          centerPadding: "30px",
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 1,
          centerPadding: "20px",
        },
      },
    ],
  };

  return (
    <section className="py-16 px-4 md:px-8" style={{ background: '#C6D6D8C2' }}>
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 flex justify-between items-center gap-8">
          <div className="flex-1">
            <h2 className="text-xl md:text-4xl font-bold text-gray-900 mb-4">Upcoming Events</h2>
            <div className="flex items-center gap-4">
              <div className="h-1 w-10 bg-yellow-400 rounded-full" />
              <div className="h-1 w-8 bg-yellow-400 rounded-full" />
              <div className="h-1 w-10 bg-yellow-400 rounded-full" />
            </div>
          </div>
          <a 
            href="/events" 
            className="text-yellow-600 hover:text-yellow-800 font-medium transition-colors duration-300 flex items-center gap-1 whitespace-nowrap"
          >
            Browse All Events
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </a>
        </div>
        {events.length === 0 ? (
          <div className="text-center text-gray-500 py-12 text-lg">No upcoming events found.</div>
        ) : (
          <Slider {...settings} className="gap-8">
            {events.map((event) => (
              <div key={event._id} className="px-3 flex justify-center">
                <div className="rounded-2xl overflow-hidden h-full w-full max-w-sm shadow-lg bg-white relative group hover:scale-105 hover:shadow-2xl transition-all duration-300">
                  <div className="absolute bottom-0 left-0 right-0 h-1/3 bg-gradient-to-t from-black/70 to-transparent z-10 pointer-events-none rounded-b-2xl" />
                  <EventCard event={event} />
                </div>
              </div>
            ))}
          </Slider>
        )}
      </div>
    </section>
  );
};

export default UpcomingEventsSection; 