import React from "react";

const About = () => {
    return (
        <>
            {/* Preloader */}
            <div id="preloader">
                <div id="loader"></div>
            </div>

            {/* Scroll To Top */}
            <div className="scroll-wrapper z-2 d-flex justify-content-center p-2 rounded-pill position-fixed">
                <button
                    className="scrollToTop p7-bg-color d-center flex-column rounded-circle"
                    aria-label="scroll Bar Button"
                >
                    <span className="d-center n1-color fs-five">
                        <i className="ph ph-caret-double-up"></i>
                    </span>
                    <span className="n1-color">TOP</span>
                </button>
            </div>

            {/* Mouse Cursor */}
            <div className="mouse-follower">
                <span className="cursor-outline"></span>
                <span className="cursor-dot"></span>
            </div>

            {/* Banner Section */}
            <section className="banner-section inner-banner position-relative pt-12 pt-md-12 pt-xl-20">
                <div className="container position-relative cus-z1 py-20 py-md-20 py-xl-20">
                    <div className="row">
                        <div className="col-xxl-12 cus-z1 text-center">
                            <div className="section-area">
                                <h2 className="fs-two mb-3 mb-md-5">About Us</h2>
                            </div>
                            <div className="breadcrumb-area">
                                <nav aria-label="breadcrumb">
                                    <ol className="breadcrumb second position-relative m-0 d-center flex-wrap gap-2 gap-md-5">
                                        <li className="breadcrumb-item d-center fs-seven">
                                            <a href="/" className="fw-normal">Home</a>
                                        </li>
                                        <li className="breadcrumb-item d-center fs-seven">
                                            <span className="fw-normal">Pages</span>
                                        </li>
                                        <li
                                            className="breadcrumb-item d-center fs-seven p6-color active"
                                            aria-current="page"
                                        >
                                            <span className="p6-color">About Us</span>
                                        </li>
                                    </ol>
                                </nav>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* About Us Start */}
            <section className="about-us second s1-bg-color position-relative pt-120 pb-120">
                <div className="abs-area pe-none">
                    <div className="item position-absolute shape-animation-2 d-none d-lg-block end-0 top-0 pt-12 m-n10">
                        <img src="assets/images/shape/about-shape-21.webp" alt="icon" />
                    </div>
                </div>
                <div className="container position-relative">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-6">
                            <div className="section-area mb-8 mb-md-15 d-grid gap-3 gap-md-4 reveal-single reveal-text text-three">
                                <span className="p6-color fw-semibold">BUSINESS FORUM</span>
                                <h2 className="fs-two">Connecting Businesses, Inspiring Growth</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row gy-10 gy-md-0 justify-content-between">
                        <div className="col-md-6 pe-0 pe-lg-20 order-1 order-lg-0">
                            <div className="image-area circle-text-bg d-center position-relative">
                                <div className="reveal-single reveal-object object-one">
                                    <img
                                        src="assets/images/about-us-img-1.webp"
                                        className="w-100 mt-6 mt-lg-20 ms-4 ms-lg-20 circle-img"
                                        alt="image"
                                    />
                                </div>
                                <div className="circle-text position-absolute ms-0 ms-lg-n10 top-0 start-0 first n1-bg-color d-center z-1">
                                    <div className="text">
                                        <p className="fs-ten text-uppercase n2-color fw-mid">
                                            Year Experience * Year Experience * Year Experience *
                                        </p>
                                    </div>
                                    <div className="img-area p6-bg-color d-center position-relative rounded-circle cus-border border">
                                        <span className="display-five n1-color position-absolute">25+</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 ps-3 ps-lg-20 overflow-hidden">
                            <div className="d-grid gap-3 gap-md-4 pb-120">
                                <p className="n3-color">
                                    Welcome to Success Together, the ultimate hub for business professionals, entrepreneurs, and
                                    thought leaders to connect, collaborate, and grow. Our platform is designed.
                                </p>
                                <p className="n3-color">
                                    <span className="fw-bold">Our Mission:</span> To empower businesses and individuals by creating a
                                    collaborative space for innovation and growth.
                                </p>
                            </div>
                            <div className="reveal-single reveal-overlay first-item">
                                <img src="assets/images/about-us-img-2.webp" className="w-100" alt="img" />
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* About Us End */}
            {/* Counter Section Start */}
            <section className="counter-section position-relative pt-120 pb-120">
                <div className="abs-area pe-none">
                    <div className="item position-absolute d-none d-lg-block start-0 bottom-0 pt-12 m-10">
                        <img src="assets/images/shape/about-shape-22.webp" alt="icon" />
                    </div>
                </div>
                <div className="container">
                    <div className="row gy-6 gy-md-0 mb-8 mb-md-15 justify-content-between align-items-center">
                        <div className="col-md-7 col-lg-8 col-xl-6">
                            <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                                <span className="p6-color fw-semibold">WHY SHOULD ATTEND</span>
                                <h2 className="fs-two">Why Should Attend Our Event</h2>
                            </div>
                        </div>
                        <div className="col-md-5 col-lg-4 col-xl-4">
                            <p className="fs-eight n3-color">
                                Gain insights, network with leaders, and explore opportunities to elevate your professional journey
                            </p>
                        </div>
                    </div>
                    <div className="row gy-9 gy-xxl-0 counter-area">
                        <div className="col-md-6 col-xxl-3">
                            <div className="single-item d-grid gap-2 gap-md-4 text-center">
                                <div className="box-area mb-3 mb-md-4">
                                    <img src="assets/images/icon/counter-icon-1.webp" alt="img" />
                                </div>
                                <div className="d-center gap-2 text-center">
                                    <div className="counters d-flex align-items-center">
                                        <span className="odometer fs-four fw-semibold p6-color" data-odometer-final="99">
                                            0
                                        </span>
                                        <span className="symbol fs-four fw-semibold p6-color">+</span>
                                    </div>
                                    <span className="fs-four fw-semibold n2-color">Events Hosted</span>
                                </div>
                                <p className="n2-color">Bringing professionals together for impactful discussions.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-xxl-3">
                            <div className="single-item d-grid gap-2 gap-md-4 text-center">
                                <div className="box-area mb-3 mb-md-4">
                                    <img src="assets/images/icon/counter-icon-2.webp" alt="img" />
                                </div>
                                <div className="d-center gap-2 text-center">
                                    <div className="counters d-flex align-items-center">
                                        <span className="odometer fs-four fw-semibold p6-color" data-odometer-final="25">
                                            0
                                        </span>
                                        <span className="symbol fs-four fw-semibold p6-color">k+</span>
                                    </div>
                                    <span className="fs-four fw-semibold n2-color">Visitors</span>
                                </div>
                                <p className="n2-color">Engaging a growing community of business enthusiasts worldwide.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-xxl-3">
                            <div className="single-item d-grid gap-2 gap-md-4 text-center">
                                <div className="box-area mb-3 mb-md-4">
                                    <img src="assets/images/icon/counter-icon-3.webp" alt="img" />
                                </div>
                                <div className="d-center gap-2 text-center">
                                    <div className="counters d-flex align-items-center">
                                        <span className="odometer fs-four fw-semibold p6-color" data-odometer-final="12">
                                            0
                                        </span>
                                        <span className="symbol fs-four fw-semibold p6-color">+</span>
                                    </div>
                                    <span className="fs-four fw-semibold n2-color">Year Experience</span>
                                </div>
                                <p className="n2-color">Building a legacy of collaboration and success.</p>
                            </div>
                        </div>
                        <div className="col-md-6 col-xxl-3">
                            <div className="single-item d-grid gap-2 gap-md-4 text-center">
                                <div className="box-area mb-3 mb-md-4">
                                    <img src="assets/images/icon/counter-icon-4.webp" alt="img" />
                                </div>
                                <div className="d-center gap-2 text-center">
                                    <div className="counters d-flex align-items-center">
                                        <span className="odometer fs-four fw-semibold p6-color" data-odometer-final="60">
                                            0
                                        </span>
                                        <span className="symbol fs-four fw-semibold p6-color">+</span>
                                    </div>
                                    <span className="fs-four fw-semibold n2-color">Projects Done</span>
                                </div>
                                <p className="n2-color">Bringing professionals together for impactful discussions.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Counter Section End */}
            {/* Schedule Section Start */}
            <section className="schedule-section position-relative s1-bg-color pt-120 pb-120">
                <div className="abs-area pe-none">
                    <div className="item item-2 position-absolute shape-animation-2 d-none d-lg-block end-0 bottom-0 mb-10">
                        <img src="assets/images/shape/schedule-shape-14.webp" alt="icon" />
                    </div>
                </div>
                <div className="container">
                    <div className="row gy-6 gy-md-0 mb-8 mb-md-15 justify-content-center text-center">
                        <div className="col-md-8 col-lg-8 col-xl-7">
                            <div className="section-area d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                                <span className="p6-color fw-semibold">SCHEDULE</span>
                                <h2 className="fs-two">Unlock the Day's Schedule</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row gy-6 singleTab third">
                        {/* Day 1 */}
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
                                {/* Add more days here */}
                            </ul>
                        </div>
                        {/* Schedule Item */}
                        <div className="col-lg-9 col-xl-10">
                            <div className="tabContents">
                                <div className="tabItem d-grid gap-6 gap-md-6 active">
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
                                            <a href="event-single.html" className="box-style box-second first-alt alt-three transition d-center py-2 py-md-3 px-4 px-md-6">
                                                <span className="fs-eight fw-semibold">Join the Discussion</span>
                                            </a>
                                        </div>
                                    </div>
                                    {/* Add more schedule items here */}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Video Section Start */}
            <section className="video-section pb-120">
                <div className="container-fluid px-0">
                    <div
                        className="img-area d-center position-relative pt-120 pb-120"
                        data-bg="./assets/images/video-bg-1.webp"
                    >
                        <div className="py-20 my-10 my-md-20">
                            <div className="video-bg-thumb d-center position-absolute">
                                <a
                                    href="https://www.youtube.com/watch?v=BHACKCNDMW8"
                                    className="popup-video btn-popup-animation transition position-absolute z-1 d-center rounded-circle"
                                >
                                    <span className="d-center fs-four p6-color z-1">
                                        <i className="fa-solid fa-play"></i>
                                    </span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
            {/* Video Section End */}
            {/* Sponsor Section Start */}
            <section className="sponsor-section pb-120">
                <div className="container position-relative">
                    <div className="row justify-content-start header-area position-absolute top-0 start-0 w-100">
                        <div className="col-lg-9 col-xxl-5">
                            <div className="section-area mb-6 mb-md-10 d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                                <span className="p6-color fw-semibold">SPONSOR</span>
                                <h2 className="fs-two">2025 digital summit Sponsors.</h2>
                                <p className="n3-color">
                                    Discover the visionary brands and organizations that power the 2025 Digital Summit. Their support
                                    makes this event extraordinary
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="bottom-area mb-7 mb-md-12 d-center justify-content-start justify-content-xxl-end gap-3 gap-md-4">
                        <a
                            href="sponsor.html"
                            className="box-style box-second first-alt d-center gap-2 py-2 py-md-3 px-3 px-md-6"
                        >
                            <span className="fs-seven">Become Sponsor</span>
                        </a>
                        <a
                            href="ticket.html"
                            className="box-style box-second second-alt cus-border border b-fourth d-center gap-2 py-2 py-md-3 px-3 px-md-6"
                        >
                            <span className="fs-seven">Buy Ticket</span>
                        </a>
                    </div>
                    <div className="row-two d-center flex-wrap">
                        <div className="box-area box-twelve d-center cus-border border b-second opacity-0">
                            <img src="assets/images/brand-logo-1.webp" alt="icon" className="p-2 p-lg-8" />
                        </div>
                        <div className="box-area box-twelve d-center cus-border border b-second opacity-0">
                            <img src="assets/images/brand-logo-2.webp" alt="icon" className="p-2 p-lg-8" />
                        </div>
                        <div className="box-area box-twelve d-center cus-border border b-second opacity-0">
                            <img src="assets/images/brand-logo-3.webp" alt="icon" className="p-2 p-lg-8" />
                        </div>
                        {/* Add more logos here */}
                    </div>
                </div>
            </section>
            {/* Sponsor Section End */}
            {/* Team Start */}
            <section className="team-section s1-bg-color pt-120 pb-120">
                <div className="container">
                    <div className="row justify-content-center text-center">
                        <div className="col-lg-6">
                            <div className="section-area mb-8 mb-md-15 d-grid gap-3 gap-md-4 reveal-single reveal-text text-three">
                                <span className="p6-color fw-semibold">TEAM</span>
                                <h2 className="fs-two">Our Speakers</h2>
                            </div>
                        </div>
                    </div>
                    <div className="row cus-row gy-7 gy-xl-8 justify-content-center justify-content-sm-start">
                        <div className="col-8 col-sm-6 col-lg-4">
                            <div className="single-item d-grid gap-3 gap-xl-4 position-relative">
                                <div className="image-area d-center position-relative">
                                    <img src="assets/images/team-img-1.webp" className="w-100 pe-none" alt="image" />
                                    <ul className="d-center hover-active d-grid justify-content-start position-absolute top-0 end-0 m-3 m-md-4 gap-1 gap-md-1 social-area transition">
                                        <li>
                                            <a
                                                href="https://www.facebook.com"
                                                aria-label="Facebook"
                                                className="d-center rounded-circle single-item transition"
                                            >
                                                <span className="d-center fs-six n1-color">
                                                    <i className="fab fa-facebook-f"></i>
                                                </span>
                                            </a>
                                        </li>
                                        {/* Add more social links here */}
                                    </ul>
                                    <span className="box-style box-second second-alt m-4 m-md-6 transition rounded-pill n1-bg-color d-center gap-2 py-1 py-md-2 px-3 px-md-4 position-absolute bottom-0 end-0">
                                        <span className="d-center fs-four n1-color">
                                            <i className="ph ph-microphone"></i>
                                        </span>
                                        <span className="fs-seven">Speaker</span>
                                    </span>
                                </div>
                                <div className="text-area">
                                    <a href="speakers-single.html">
                                        <h5 className="mb-2 n2-color">Lila Thompson</h5>
                                    </a>
                                    <span className="n3-color fw-bold fs-nine">Director of Sales</span>
                                </div>
                            </div>
                        </div>
                        {/* Add more team members here */}
                    </div>
                </div>
            </section>
            {/* Team End */}
            {/* Marquee Section Start */}
            <section className="marquee-section s1-bg-color pb-120">
                <div className="swiper carousel-infinity">
                    <div className="swiper-wrapper">
                        <div className="swiper-slide d-center mx-4 mx-md-7">
                            <div className="item-area d-center gap-8 gap-md-15 reveal-single reveal-text text-three">
                                <span className="img-area">
                                    <img src="assets/images/icon/marque-icon-1.webp" className="max-un" alt="icon" />
                                </span>
                                <span className="n2-color display-one text-uppercase text-nowrap">Keynote Speakers</span>
                            </div>
                        </div>
                        {/* Add more slides here */}
                    </div>
                </div>
            </section>
            {/* Marquee Section End */}
        </>
    );
};
export default About;