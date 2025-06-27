import React from 'react';
import '../../assets/styles/pages/_section.scss';

const ScheduleSection = ({ conference }) => (
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
                                <span className="fs-eight fw-semibold n2-color">Start Date</span>
                                <span className="fs-eight n3-color">
                                    {conference
                                        ? new Date(conference.startDate).toLocaleString()
                                        : "--"}
                                </span>
                            </button>
                        </li>
                        <li className="nav-links transition active">
                            <button className="tablink pb-1 d-grid gap-1 px-2 px-md-5 py-3 py-md-4 text-start">
                                <span className="fs-eight fw-semibold n2-color">End Date</span>
                                <span className="fs-eight n3-color">
                                    {conference
                                        ? new Date(conference.endDate).toLocaleString()
                                        : "--"}
                                </span>
                            </button>
                        </li>
                    </ul>
                </div>
                <div className="col-lg-9 col-xl-10">
                    <div className="tabContents">
                        <div className="tabItem d-grid gap-6 gap-md-6 active">
                            {/* Bạn có thể bỏ phần hiển thị start/end date ở đây nếu không cần nữa */}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default ScheduleSection;