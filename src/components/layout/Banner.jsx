import React from 'react';
import '../../assets/styles/pages/_section.scss';

// Import images
import userImg9 from '../../assets/images/user-img-9.webp';
import userImg10 from '../../assets/images/user-img-10.webp';
import userImg11 from '../../assets/images/user-img-11.webp';
import userImg12 from '../../assets/images/user-img-12.webp';
import userImg13 from '../../assets/images/user-img-13.webp';
import userImg14 from '../../assets/images/user-img-14.webp';
import bannerImg1 from '../../assets/images/banner-index-2-1.webp';
import bannerImg2 from '../../assets/images/banner-index-2-2.webp';
import bannerImg3 from '../../assets/images/banner-index-2-3.webp';

const userImgs = [userImg9, userImg10, userImg11, userImg12, userImg13, userImg14];

const Banner = () => (
    <section className="banner-section n2-bg-color index-two position-relative">
        <div className="container-fluid px-0 banner-carousel-second position-relative">
            <div className="swiper-wrapper pt-8 pt-md-20">
                {/* Slide 1 */}
                <div className="swiper-slide">
                    <div className="slide-single position-relative d-grid align-items-center">
                        <div className="abs-area backdrop-filter position-absolute z-1 bottom-0 end-0 m-2 m-lg-6 m-xl-15 p-3 p-md-9 cus-border border b-second n1-2nd-bg-color">
                            <ul className="d-center justify-content-end mb-2 ms-2">
                                {userImgs.map((img, idx) => (
                                    <li key={idx} className="rounded-circle ms-n2 box-area box-three">
                                        <img
                                            className="cus-border border border-2 b-sixth rounded-circle"
                                            src={img}
                                            alt="User"
                                        />
                                    </li>
                                ))}
                            </ul>
                            <p className="n1-color fs-eight text-center">3500+ satisfied people</p>
                        </div>
                        <div className="banner-img pe-none position-absolute start-0 end-0 z-0">
                            <img src={bannerImg1} className="max-un" alt="image" />
                        </div>
                        <div className="content-area row justify-content-center z-1">
                            <div className="col-md-10 text-center d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                                <p className="n1-color fw-bold fs-eight text-uppercase">Bringing Events to Life</p>
                                <h2 className="display-one fw-bolder n1-color text-uppercase mb-2">Vivid Moments</h2>
                                <p className="n1-color fw-medium fs-seven max-ch m-auto">
                                    Join us to create unforgettable events where ideas inspire, connections grow, and memories shine bright
                                </p>
                                <div className="btn-area mt-4 mt-md-8 d-center flex-wrap gap-3 gap-md-4 mt-4">
                                    <a href="event-list.html" className="box-style box-second second-alt alt-two transition d-center py-2 py-md-3 px-3 px-md-6">
                                        <span className="fs-seven fw-semibold">VIEW EVENTS</span>
                                    </a>
                                    <a href="ticket.html" className="box-style box-second first-alt alt-two d-center gap-2 py-2 py-md-3 px-3 px-md-6">
                                        <span className="fs-seven fw-semibold">BUY TICKETS</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Slide 2 */}
                <div className="swiper-slide">
                    <div className="slide-single position-relative d-grid align-items-center">
                        <div className="abs-area backdrop-filter position-absolute z-1 bottom-0 end-0 m-2 m-lg-6 m-xl-15 p-3 p-md-9 cus-border border b-second n1-2nd-bg-color">
                            <ul className="d-center justify-content-end mb-2 ms-2">
                                {userImgs.map((img, idx) => (
                                    <li key={idx} className="rounded-circle ms-n2 box-area box-three">
                                        <img
                                            className="cus-border border border-2 b-sixth rounded-circle"
                                            src={img}
                                            alt="User"
                                        />
                                    </li>
                                ))}
                            </ul>
                            <p className="n1-color fs-eight text-center">3500+ satisfied people</p>
                        </div>
                        <div className="banner-img pe-none position-absolute start-0 end-0 z-0">
                            <img src={bannerImg2} className="max-un" alt="image" />
                        </div>
                        <div className="content-area row justify-content-center z-1">
                            <div className="col-md-10 text-center d-grid gap-3 gap-md-4 reveal-single reveal-text text-two">
                                <p className="n1-color fw-bold fs-eight text-uppercase">Crafting Memories</p>
                                <h2 className="display-one fw-bolder n1-color text-uppercase mb-2">Timeless Events</h2>
                                <p className="n1-color fw-medium fs-seven max-ch m-auto">
                                    Join us to curate events that inspire, bring people together, and create timeless experiences
                                </p>
                                <div className="btn-area mt-4 mt-md-8 d-center flex-wrap gap-3 gap-md-4 mt-4">
                                    <a href="event-list.html" className="box-style box-second second-alt alt-two transition d-center py-2 py-md-3 px-3 px-md-6">
                                        <span className="fs-seven fw-semibold">DISCOVER EVENTS</span>
                                    </a>
                                    <a href="ticket.html" className="box-style box-second first-alt alt-two d-center gap-2 py-2 py-md-3 px-3 px-md-6">
                                        <span className="fs-seven fw-semibold">BOOK TICKETS</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Slide 3 */}
                <div className="swiper-slide">
                    <div className="slide-single position-relative d-grid align-items-center">
                        <div className="abs-area backdrop-filter position-absolute z-1 bottom-0 end-0 m-2 m-lg-6 m-xl-15 p-3 p-md-9 cus-border border b-second n1-2nd-bg-color">
                            <ul className="d-center justify-content-end mb-2 ms-2">
                                {userImgs.map((img, idx) => (
                                    <li key={idx} className="rounded-circle ms-n2 box-area box-three">
                                        <img
                                            className="cus-border border border-2 b-sixth rounded-circle"
                                            src={img}
                                            alt="User"
                                        />
                                    </li>
                                ))}
                            </ul>
                            <p className="n1-color fs-eight text-center">3500+ satisfied people</p>
                        </div>
                        <div className="banner-img pe-none position-absolute start-0 end-0 z-0">
                            <img src={bannerImg3} className="max-un" alt="image" />
                        </div>
                        <div className="content-area row justify-content-center z-1">
                            <div className="col-md-10 text-center d-grid gap-3 gap-md-4 reveal-single reveal-text text-three">
                                <p className="n1-color fw-bold fs-eight text-uppercase">Shaping Visions</p>
                                <h2 className="display-one fw-bolder n1-color text-uppercase mb-2">Epic Events</h2>
                                <p className="n1-color fw-medium fs-seven max-ch m-auto">
                                    Come together with us to create stunning events that inspire and leave a lasting impact
                                </p>
                                <div className="btn-area mt-4 mt-md-8 d-center flex-wrap gap-3 gap-md-4 mt-4">
                                    <a href="event-list.html" className="box-style box-second second-alt alt-two transition d-center py-2 py-md-3 px-3 px-md-6">
                                        <span className="fs-seven fw-semibold">EXPLORE EVENTS</span>
                                    </a>
                                    <a href="ticket.html" className="box-style box-second first-alt alt-two d-center gap-2 py-2 py-md-3 px-3 px-md-6">
                                        <span className="fs-seven fw-semibold">PURCHASE TICKETS</span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Slider Buttons */}
            <div className="slider-btn w-100 d-center d-none d-sm-flex justify-content-start gap-2 gap-md-3 position-absolute z-1 bottom-0 start-0 m-20">
                <button type="button" aria-label="Previous slide" className="ara-prev position-relative d-center slide-button">
                    <span className="fs-three d-center n1-color">
                        <i className="ph ph-caret-left"></i>
                    </span>
                </button>
                <button type="button" aria-label="Next slide" className="ara-next position-relative d-center slide-button">
                    <span className="fs-three d-center n1-color">
                        <i className="ph ph-caret-right"></i>
                    </span>
                </button>
            </div>
        </div>
    </section>
);

export default Banner;