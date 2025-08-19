import React from "react";

// Import images
import bannerImg1 from "../../assets/images/banner-index-2-1.webp";

const Banner = ({ conference }) => (
  <section className="banner-section n2-bg-color index-two position-relative">
    <div className="container-fluid px-0 banner-carousel-second position-relative">
      <div className="swiper-wrapper pt-8 pt-md-20">
        {/* Slide 1 */}
        <div className="swiper-slide">
          <div className="slide-single position-relative d-grid align-items-center">
            {/* Nút đăng ký thay cho userImgs và 3500+ */}
            <div className="abs-area backdrop-filter position-absolute z-1 bottom-0 end-0 m-2 m-lg-6 m-xl-15 p-3 p-md-9"></div>
            <div className="banner-img pe-none position-absolute start-0 end-0 z-0">
              <img
                src={conference?.bannerUrl || bannerImg1}
                className="max-un"
                alt="banner"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default Banner;
