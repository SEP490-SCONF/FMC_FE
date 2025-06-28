import React, { useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useNavigate } from "react-router-dom";

import about1 from '../../assets/images/about-us-img-1.webp';
// import { getConferenceById, getConferences } from '../../service/ConferenceService';

const ConferenceSlider = ({ title, conferences, onConferenceClick }) => {
    const navigate = useNavigate();
    const now = new Date();
    const filtered = conferences.filter(
        (conf) =>
            (!conf.status || conf.status === true) &&
            (!conf.endDate || new Date(conf.endDate) >= now)
    );

    return (
        <section className="mb-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold">{title}</h4>
                </div>

                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={20}
                    slidesPerView={3}
                    navigation
                    pagination={{ clickable: true }}
                    breakpoints={{
                        0: { slidesPerView: 1.2 },
                        576: { slidesPerView: 2.2 },
                        768: { slidesPerView: 3 },
                        1200: { slidesPerView: 4 },
                    }}
                >
                    {filtered.map((conf) => (
                        <SwiperSlide key={conf.title.replace(/\s/g, '')}>
                            <div
                                className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    if (onConferenceClick) onConferenceClick(conf.conferenceId);
                                    navigate(`/conference/${conf.conferenceId}`);
                                }}
                            >
                                <img
                                    src={conf.bannerUrl || about1}
                                    alt={conf.title}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body py-3 px-2 text-center">
                                    <h6 className="card-title text-truncate">{conf.title}</h6>
                                    <p className="card-text text-truncate">{conf.description}</p>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

const HomeBody = ({ conferences, loading }) => {
    if (loading) return <div className="text-center py-5">Đang tải dữ liệu...</div>;
    console.log("conferences:", conferences, "loading:", loading);
    return (
        <div className="bg-white py-5">
            <ConferenceSlider
                title="Conferences"
                conferences={conferences}
            />
        </div>
    );
};

const HomeScreen = ({ conferences, loading }) => (
    <HomeBody conferences={conferences} loading={loading} />
);

export default HomeScreen;
