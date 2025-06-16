import React from 'react';
import '../../assets/styles/pages/_section.scss';

const ScheduleSection = () => (
    <section className="schedule-section position-relative s1-bg-color pt-120 pb-120">
        <div className="abs-area pe-none">
            <div className="item position-absolute shape-animation-2 d-none d-lg-block end-0 top-0 m-n20">
                <img src="assets/images/shape/schedule-shape-1.webp" className="me-n15 mt-n8" alt="icon" />
            </div>
            <div className="item item-2 position-absolute shape-animation-2 d-none d-lg-block start-0 bottom-0 m-n20">
                <img src="assets/images/shape/schedule-shape-2.webp" alt="icon" />
            </div>
        </div>
        <div className="container">
            <div className="row gy-6 gy-md-0 mb-8 mb-md-15 justify-content-center text-center">
                <div className="col-md-8 col-lg-8 col-xl-7">
                    <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                        <span className="p7-color fw-semibold">SCHEDULE</span>
                        <h2 className="fs-two">Unlock the Day&apos;s Schedule</h2>
                    </div>
                </div>
            </div>
            <div className="row gy-6 singleTab second">
                <div className="col-lg-3 col-xl-2">
                    <ul className="tabLinks d-center justify-content-start flex-wrap gap-1">
                        <li className="nav-links transition active">
                            <button className="tablink pb-1 d-grid gap-1 px-2 px-md-5 py-3 py-md-4 text-start">
                                <span className="fs-eight fw-semibold n2-color">01: SATURDAY</span>
                                <span className="fs-eight n3-color">January 06, 2026</span>
                            </button>
                        </li>
                        <li className="nav-links transition">
                            <button className="tablink pb-1 d-grid gap-1 px-2 px-md-5 py-3 py-md-4 text-start">
                                <span className="fs-eight fw-semibold n2-color">02: SUNDAY</span>
                                <span className="fs-eight n3-color">January 07, 2026</span>
                            </button>
                        </li>
                        <li className="nav-links transition">
                            <button className="tablink pb-1 d-grid gap-1 px-2 px-md-5 py-3 py-md-4 text-start">
                                <span className="fs-eight fw-semibold n2-color">03: MONDAY</span>
                                <span className="fs-eight n3-color">January 11, 2026</span>
                            </button>
                        </li>
                        <li className="nav-links transition">
                            <button className="tablink pb-1 d-grid gap-1 px-2 px-md-5 py-3 py-md-4 text-start">
                                <span className="fs-eight fw-semibold n2-color">04: TUESDAY</span>
                                <span className="fs-eight n3-color">January 12, 2026</span>
                            </button>
                        </li>
                        <li className="nav-links transition">
                            <button className="tablink pb-1 d-grid gap-1 px-2 px-md-5 py-3 py-md-4 text-start">
                                <span className="fs-eight fw-semibold n2-color">05: WEDNESDAY</span>
                                <span className="fs-eight n3-color">January 13, 2026</span>
                            </button>
                        </li>
                        <li className="nav-links transition">
                            <button className="tablink pb-1 d-grid gap-1 px-2 px-md-5 py-3 py-md-4 text-start">
                                <span className="fs-eight fw-semibold n2-color">06: THURSDAY</span>
                                <span className="fs-eight n3-color">January 14, 2026</span>
                            </button>
                        </li>
                        <li className="nav-links transition">
                            <button className="tablink pb-1 d-grid gap-1 px-2 px-md-5 py-3 py-md-4 text-start">
                                <span className="fs-eight fw-semibold n2-color">07: FRIDAY</span>
                                <span className="fs-eight n3-color">January 15, 2026</span>
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="col-lg-9 col-xl-10">
                    <div className="tabContents">
                        {/* Tab content goes here. For brevity, only the first tab is shown. Repeat as needed. */}
                        <div className="tabItem d-grid gap-6 gap-md-6 active">
                            {/* Example schedule item */}
                            <div className="row gy-4 gy-md-0 single-item align-items-center n1-bg-color py-2 py-md-3 px-4 px-md-6">
                                <div className="col-md-3 col-lg-3 col-xl-4">
                                    <div className="time-area d-flex flex-column gap-1 align-items-start h-100">
                                        <span className="n2-color fw-bold fs-eight">2:30 PM - 3:00 PM</span>
                                        <p className="n3-color">Room 150</p>
                                    </div>
                                </div>
                                <div className="col-md-6 col-xl-5 mid-area d-grid gap-1">
                                    <span className="n2-color fw-bold fs-eight">AI Ethics: Navigating the Challenges</span>
                                    <p className="n3-color">A discussion on the ethical considerations surrounding artificial intelligence.</p>
                                </div>
                                <div className="col-md-3 col-xl-3 btn-area d-center justify-content-start justify-content-md-end">
                                    <a href="event-single.html" className="box-style box-second second-alt alt-two transition d-center py-2 py-md-3 px-4 px-md-6">
                                        <span className="fs-eight fw-semibold">Join the Discussion</span>
                                    </a>
                                </div>
                            </div>
                            {/* ...repeat for each schedule item... */}
                        </div>
                        {/* ...repeat for each tabItem... */}
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default ScheduleSection;