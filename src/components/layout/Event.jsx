import React from 'react';
import '../../assets/styles/pages/_section.scss';

// Import images
import eventIcon1 from '../../assets/images/icon/event-icon-1.webp';
import eventIcon2 from '../../assets/images/icon/event-icon-2.webp';
import eventIcon3 from '../../assets/images/icon/event-icon-3.webp';
import eventShape1 from '../../assets/images/shape/event-shape-1.webp';
import eventShape2 from '../../assets/images/shape/event-shape-2.webp';
import eventImg1 from '../../assets/images/event-img-1.webp';

const perfectionList = [
    {
        icon: eventIcon1,
        title: 'Event Planning & Coordination',
        desc: 'Seamless organization for events of all sizes.',
    },
    {
        icon: eventIcon2,
        title: 'Creative Event Design',
        desc: 'Unique concepts to make your event stand out.',
    },
    {
        icon: eventIcon3,
        title: 'Workshops & Forums',
        desc: 'Cutting-edge technology and on-time execution',
    },
];

const EventPerfection = () => (
    <section className="event-perfection position-relative pt-120 pb-120">
        <div className="abs-area pe-none">
            <div className="item position-absolute shape-animation d-none d-lg-block start-0 top-0 p-12">
                <img src={eventShape1} alt="icon" />
            </div>
            <div className="item position-absolute shape-animation-2 d-none d-lg-block end-0 bottom-0 mb-20 pb-20">
                <img src={eventShape2} alt="icon" />
            </div>
        </div>
        <div className="container">
            <div className="row gy-10 gy-md-0 justify-content-between align-items-center">
                <div className="col-md-6 order-1 order-lg-0">
                    <div className="reveal-single reveal-overlay first-item alt-two">
                        <img src={eventImg1} className="w-100" alt="img" />
                    </div>
                </div>
                <div className="col-md-6 ps-2 ps-xl-20">
                    <div className="section-area mb-6 mb-md-10 d-grid gap-3 gap-md-4 reveal-single reveal-text text-three">
                        <span className="p7-color fw-semibold">WHAT WE DO</span>
                        <h2 className="fs-two">Delivering Perfection in Every Event</h2>
                        <p className="n3-color">
                            From planning to execution, we ensure every event is crafted with precision, care, and excellence.
                        </p>
                    </div>
                    <ul className="content-area d-grid gap-4 gap-md-7">
                        {perfectionList.map((item, idx) => (
                            <li className="content-area d-center justify-content-start gap-3 gap-md-4" key={idx}>
                                <span className="d-center fs-five s1-bg-color box-area box-six rounded-circle">
                                    <img src={item.icon} alt="img" />
                                </span>
                                <div className="d-grid gap-1 gap-md-2">
                                    <h6 className="n2-color fw-semibold">{item.title}</h6>
                                    <span className="n3-color">{item.desc}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                    <div className="btn-area d-inline-flex mt-5 mt-md-10">
                        <a href="about-us.html" className="box-style box-second first-alt alt-two d-center gap-2 py-2 py-md-3 px-3 px-md-6 px-xl-9">
                            <span className="fs-seven">Learn More</span>
                        </a>
                    </div>
                </div>
            </div>
            <div className="row justify-content-center mt-8 mt-md-10">
                <div className="col-xl-10">
                    <div className="counter-area n1-bg-color position-relative z-1 cus-border border b-second py-6 py-md-11">
                        <div
                            className="countdown d-center gap-4 gap-sm-6 gap-md-10 gap-lg-20 align-items-center reveal-single reveal-text text-three"
                            data-date="31-12-2031"
                        >
                            <div className="d-inline-grid text-center gap-2 gap-md-3 reveal-single reveal-text text-two">
                                <span className="fs-six fw-medium">Days</span>
                                <span className="position-relative cus-border b-dashed border-bottom b-sixth"></span>
                                <span className="showDays fs-two fw-medium p7-color"></span>
                            </div>
                            <span className="fs-two fw-bold d-none d-sm-flex">:</span>
                            <div className="d-inline-grid text-center gap-2 gap-md-3 reveal-single reveal-text text-two">
                                <span className="fs-six fw-medium">Hours</span>
                                <span className="position-relative cus-border b-dashed border-bottom b-sixth"></span>
                                <span className="showHours fs-two fw-medium p7-color"></span>
                            </div>
                            <span className="fs-two fw-bold d-none d-sm-flex">:</span>
                            <div className="d-inline-grid text-center gap-2 gap-md-3 reveal-single reveal-text text-two">
                                <span className="fs-six fw-medium">Minutes</span>
                                <span className="position-relative cus-border b-dashed border-bottom b-sixth"></span>
                                <span className="showMinutes fs-two fw-medium p7-color"></span>
                            </div>
                            <span className="fs-two fw-bold d-none d-sm-flex">:</span>
                            <div className="d-inline-grid text-center gap-2 gap-md-3 reveal-single reveal-text text-two">
                                <span className="fs-six fw-medium">Seconds</span>
                                <span className="position-relative cus-border b-dashed border-bottom b-sixth"></span>
                                <span className="showSeconds fs-two fw-medium p7-color"></span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default EventPerfection;