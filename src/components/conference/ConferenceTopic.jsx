import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ServiceSection = ({ topics, loadingTopics }) => {
  const prevRef = useRef(null);
  const nextRef = useRef(null);

  return (
    <section className="bg-slate-100 py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div>
            <span className="text-indigo-600 font-semibold">TOPICS</span>
            <h2 className="text-3xl font-bold mt-2">Conference Topics</h2>
          </div>
          <div>
            <a
              href="#"
              className="inline-flex items-center gap-2 bg-indigo-500 text-white text-sm font-medium py-2 px-4 rounded hover:bg-indigo-600 transition"
            >
              More Topics
            </a>
          </div>
        </div>

        {/* Loading */}
        {loadingTopics ? (
          <div className="flex justify-center items-center min-h-[120px]">
            <div className="w-8 h-8 border-4 border-indigo-300 border-t-indigo-600 rounded-full animate-spin"></div>
          </div>
        ) : topics && topics.length > 0 ? (
          <>
            <Swiper
              modules={[Navigation]}
              className="pb-10"
              spaceBetween={30}
              slidesPerView={3}
              loop={true}
              navigation={{
                prevEl: prevRef.current,
                nextEl: nextRef.current,
              }}
              onInit={(swiper) => {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
                swiper.navigation.init();
                swiper.navigation.update();
              }}
              breakpoints={{
                320: { slidesPerView: 1 },
                768: { slidesPerView: 2 },
                1200: { slidesPerView: 3 },
              }}
            >
              {topics.map((topic) => (
                <SwiperSlide key={topic.topicId}>
                  <div className="bg-white rounded-lg shadow p-6 text-center hover:shadow-lg transition">
                    <h5 className="text-lg font-bold text-gray-800">
                      {topic.topicName}
                    </h5>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Navigation Buttons */}
            <div className="flex justify-center gap-4 mt-4">
              <button
                ref={prevRef}
                aria-label="Previous slide"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition"
              >
                <i className="ph ph-arrow-left text-lg"></i>
              </button>
              <button
                ref={nextRef}
                aria-label="Next slide"
                className="w-10 h-10 flex items-center justify-center rounded-full bg-indigo-500 text-white hover:bg-indigo-600 transition"
              >
                <i className="ph ph-arrow-right text-lg"></i>
              </button>
            </div>
          </>
        ) : (
          <div className="text-center mt-4">
            <p className="text-gray-500">No topics available for this conference.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default ServiceSection;
