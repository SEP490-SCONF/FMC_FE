import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

// Use local images for demo (adjust the import paths as needed)
import about1 from '../../assets/images/about-us-img-1.webp';
import about2 from '../../assets/images/about-us-img-2.webp';
import about3 from '../../assets/images/about-us-img-3.webp';
import about4 from '../../assets/images/about-us-img-4.webp';
import about5 from '../../assets/images/about-us-img-5.webp';
import about6 from '../../assets/images/about-us-img-6.webp';
import about7 from '../../assets/images/about-us-img-7.webp';

const conferences = [
    {
        id: 1,
        title: 'Hội thảo về AI',
        image: about1,
        status: 'Ongoing',
    },
    {
        id: 2,
        title: 'Hội thảo về Machine Learning',
        image: about1,
        status: 'Ongoing',
    },
    {
        id: 3,
        title: 'Hội thảo về Blockchain',
        image: about1,
        status: 'Ongoing',
    },
    {
        id: 4,
        title: 'Hội thảo về IoT',
        image: about1,
        status: 'Ongoing',
    },
    {
        id: 5,
        title: 'Hội thảo về UX/UI',
        image: about1,
        status: 'Ongoing',
    },
    {
        id: 6,
        title: 'Hội thảo về DevOps',
        image: about1,
        status: 'Finished',
    },
    {
        id: 7,
        title: 'Hội thảo về CyberSec',
        image: about1,
        status: 'Finished',
    },
];

const ConferenceSlider = ({ title, status }) => {
    const filtered = conferences.filter((conf) => conf.status === status);

    return (
        <section className="mb-5">
            <div className="container">
                <div className="d-flex justify-content-between align-items-center mb-3">
                    <h4 className="fw-bold">{title}</h4>
                    <div className="dropdown">
                        <button
                            className="btn btn-outline-secondary dropdown-toggle"
                            type="button"
                            data-bs-toggle="dropdown"
                            aria-expanded="false"
                        >
                            Topic
                        </button>
                        <ul className="dropdown-menu">
                            <li><a className="dropdown-item" href="#">Tất cả</a></li>
                            <li><a className="dropdown-item" href="#">AI</a></li>
                            <li><a className="dropdown-item" href="#">Blockchain</a></li>
                        </ul>
                    </div>
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
                        <SwiperSlide key={conf.id}>
                            <div className="card h-100 border-0 shadow-sm rounded-4 overflow-hidden">
                                <img
                                    src={conf.image}
                                    alt={conf.title}
                                    className="card-img-top"
                                    style={{ height: '200px', objectFit: 'cover' }}
                                />
                                <div className="card-body py-3 px-2 text-center">
                                    <h6 className="card-title text-truncate">{conf.title}</h6>
                                </div>
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>
        </section>
    );
};

const HomeBody = () => {
    return (
        <div className="bg-white py-5">
            <ConferenceSlider title="On-going Conferences" status="Ongoing" />
            <hr className="my-4" />
            <ConferenceSlider title="Finished Conferences" status="Finished" />
        </div>
    );
};

export default HomeBody;
