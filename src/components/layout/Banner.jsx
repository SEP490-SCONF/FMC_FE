import React from 'react';
import '../../assets/styles/pages/_section.scss';

// Import images
import bannerImg1 from '../../assets/images/banner-index-2-1.webp';

const Banner = ({ conference }) => (
    <section className="banner-section n2-bg-color index-two position-relative">
        <div className="container-fluid px-0 banner-carousel-second position-relative">
            <div className="swiper-wrapper pt-8 pt-md-20">
                {/* Slide 1 */}
                <div className="swiper-slide">
                    <div className="slide-single position-relative d-grid align-items-center">
                        {/* Nút đăng ký thay cho userImgs và 3500+ */}
                        <div className="abs-area backdrop-filter position-absolute z-1 bottom-0 end-0 m-2 m-lg-6 m-xl-15 p-3 p-md-9">
                            <button
                                className="btn w-100"
                                style={{
                                    fontWeight: 300,
                                    fontSize: 18,
                                    backgroundColor: "#5B2EBC",
                                    color: "#fff",
                                    border: "none"
                                }}
                                onClick={() => window.open('https://your-registration-link.com', '_blank')}
                            >
                                Đăng ký tham gia hội thảo
                            </button>
                        </div>
                        <div className="banner-img pe-none position-absolute start-0 end-0 z-0">
                            <img
                                src={conference?.bannerUrl || bannerImg1}
                                className="max-un"
                                alt="banner"
                                style={{ width: "100%", height: "auto", objectFit: "cover" }}
                            />
                        </div>
                        <div className="content-area row justify-content-center z-1">
                            <div className="col-md-10 text-center d-grid gap-3 gap-md-4 reveal-single reveal-text text-one">
                                <p className="n1-color fw-bold fs-eight text-uppercase">Bringing Events to Life</p>
                                <h2 className="display-one fw-bolder n1-color text-uppercase mb-2">Vivid Moments</h2>
                                <p className="n1-color fw-medium fs-seven max-ch m-auto ">
                                    Join us to create unforgettable events where ideas inspire, connections grow, and memories shine bright
                                </p>
                                <div className="btn-area mt-4 mt-md-8 d-center flex-wrap gap-3 gap-md-4 mt-4">
                                    <a href="event-list.html" className="box-style box-second second-alt alt-two transition d-center py-2 py-md-3 px-3 px-md-6">
                                        <span className="fs-seven fw-semibold"></span>
                                    </a>
                                    <a href="ticket.html" className="box-style box-second first-alt alt-two d-center gap-2 py-2 py-md-3 px-3 px-md-6">
                                        <span className="fs-seven fw-semibold"></span>
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            {/* Đã bỏ slider-btn */}
        </div>
    </section>
);

export default Banner;