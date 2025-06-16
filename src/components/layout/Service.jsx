import React from 'react';
import '../../assets/styles/pages/_section.scss';

// Import images
import serviceIcon1 from '../../assets/images/icon/service-icon-1.png';
import serviceIcon2 from '../../assets/images/icon/service-icon-2.png';
import serviceIcon3 from '../../assets/images/icon/service-icon-3.png';
import serviceIcon4 from '../../assets/images/icon/service-icon-4.png';
import serviceIcon5 from '../../assets/images/icon/service-icon-5.png';
import serviceIcon6 from '../../assets/images/icon/service-icon-6.png';

const services = [
    {
        icon: serviceIcon1,
        title: 'Expert-Led Training Sessions',
        desc: 'Enhance your skills with guidance from industry professionals who bring years.',
    },
    {
        icon: serviceIcon2,
        title: 'Personalized Support',
        desc: 'Get one-on-one assistance tailored to your specific needs, ensuring a seamless.',
    },
    {
        icon: serviceIcon3,
        title: 'Workshops & Events',
        desc: 'Join interactive workshops and community events designed to inspire, educate.',
    },
    {
        icon: serviceIcon4,
        title: 'Forums & Webinars',
        desc: 'Engage with experts and peers in our interactive forums and informative ',
    },
    {
        icon: serviceIcon5,
        title: 'Online Conference',
        desc: 'Explore thought-provoking sessions, network with global professionals, ',
    },
    {
        icon: serviceIcon6,
        title: 'Networking Events',
        desc: 'Connect, collaborate, and grow with industry leaders at our exclusive networking.',
    },
];

const ServiceSection = () => (
    <section className="service-section s1-bg-color pt-120 pb-120">
        <div className="container">
            <div className="row gy-6 gy-md-0 mb-8 mb-md-15 justify-content-between align-items-end">
                <div className="col-md-8 col-lg-8 col-xl-7">
                    <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                        <span className="p7-color fw-semibold">SERVICES</span>
                        <h2 className="fs-two">Custom Event Solutions</h2>
                    </div>
                </div>
                <div className="col-md-4 col-lg-4 col-xl-5">
                    <div className="btn-area d-center justify-content-start justify-content-md-end">
                        <a href="event-list.html" className="box-style box-second first-alt alt-two d-center gap-2 py-2 py-md-3 px-3 px-md-4 px-lg-6">
                            <span className="fs-seven">More Services</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="swiper service-carousel">
                <div className="swiper-wrapper">
                    {services.map((service, idx) => (
                        <div className="swiper-slide transition" key={idx}>
                            <div className="single-item transition d-grid gap-2 gap-md-3 n1-bg-color py-8 py-md-15 px-3 px-md-10">
                                <div className="icon-area transition d-center box-area box-five n1-bg-color">
                                    <img src={service.icon} className="max-un" alt="shape" />
                                </div>
                                <h5 className="n2-color transition fw-bold mt-2">{service.title}</h5>
                                <p className="n3-color transition">{service.desc}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            <div className="slider-btn w-100 gap-2 gap-md-3 d-center mt-6 mt-md-10 position-relative">
                <button type="button" aria-label="Previous slide" className="ara-prev box-shadow-p1 position-relative transition rounded-circle box-area box-one box-style box-second second-alt alt-three d-center slide-button">
                    <span className="fs-five d-center">
                        <i className="ph ph-arrow-left"></i>
                    </span>
                </button>
                <button type="button" aria-label="Next slide" className="ara-next box-shadow-p1 position-relative transition rounded-circle box-area box-one box-style box-second second-alt alt-three d-center slide-button">
                    <span className="fs-five d-center">
                        <i className="ph ph-arrow-right"></i>
                    </span>
                </button>
            </div>
        </div>
    </section>
);

export default ServiceSection;