import React, { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";

const ServiceSection = ({ topics, loadingTopics }) => {
    const prevRef = useRef(null);
    const nextRef = useRef(null);

    return (
        <section className="service-section s1-bg-color pt-120 pb-120">
            <div className="container">
                <div className="row gy-6 gy-md-0 mb-8 mb-md-15 justify-content-between align-items-end">
                    <div className="col-md-8 col-lg-8 col-xl-7">
                        <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                            <span className="p7-color fw-semibold">TOPICS</span>
                            <h2 className="fs-two">Conference Topics</h2>
                        </div>
                    </div>
                    <div className="col-md-4 col-lg-4 col-xl-5">
                        <div className="btn-area d-center justify-content-start justify-content-md-end">
                            <a
                                href="#"
                                className="box-style box-second first-alt alt-two d-center gap-2 py-2 py-md-3 px-3 px-md-4 px-lg-6"
                            >
                                <span className="fs-seven">More Topics</span>
                            </a>
                        </div>
                    </div>
                </div>

                {loadingTopics ? (
                    <div
                        className="d-flex justify-content-center align-items-center"
                        style={{ minHeight: 120 }}
                    >
                        <div className="spinner"></div>
                    </div>
                ) : topics && topics.length > 0 ? (
                    <>
                        <Swiper
                            modules={[Navigation]}
                            className="service-carousel"
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
                                <SwiperSlide key={topic.topicId} className="transition">
                                    <div className="single-item transition d-grid gap-2 gap-md-3 n1-bg-color py-8 py-md-15 px-3 px-md-10 text-center">
                                        <h5 className="n2-color transition fw-bold mt-2">
                                            {topic.topicName}
                                        </h5>
                                    </div>
                                </SwiperSlide>
                            ))}
                        </Swiper>
                        <div className="slider-btn w-100 gap-2 gap-md-3 d-center mt-6 mt-md-10 position-relative">
                            <button
                                ref={prevRef}
                                type="button"
                                aria-label="Previous slide"
                                className="ara-prev box-shadow-p1 position-relative transition rounded-circle box-area box-one box-style box-second second-alt alt-three d-center slide-button"
                            >
                                <span className="fs-five d-center">
                                    <i className="ph ph-arrow-left"></i>
                                </span>
                            </button>
                            <button
                                ref={nextRef}
                                type="button"
                                aria-label="Next slide"
                                className="ara-next box-shadow-p1 position-relative transition rounded-circle box-area box-one box-style box-second second-alt alt-three d-center slide-button"
                            >
                                <span className="fs-five d-center">
                                    <i className="ph ph-arrow-right"></i>
                                </span>
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="text-center mt-4">
                        <p>No topics available for this conference.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default ServiceSection;
