import React from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, FreeMode } from 'swiper/modules';
import 'swiper/css';

const techLogos = [
  { src: 'https://upload.wikimedia.org/wikipedia/commons/a/a7/React-icon.svg', alt: 'React' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/6/6a/JavaScript-logo.png', alt: 'JavaScript' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/d/d5/Tailwind_CSS_Logo.svg', alt: 'Tailwind CSS' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/e/ee/.NET_Core_Logo.svg', alt: '.NET' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/4/4f/Csharp_Logo.png', alt: 'C#' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/4/4c/Typescript_logo_2020.svg', alt: 'TypeScript' },
  { src: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg', alt: 'GitHub' },
];

const marqueeLogos = [...techLogos, ...techLogos, ...techLogos];

const TechMarquee = () => (
  <section className="marquee-section second pb-120">
    <Swiper
      modules={[Autoplay, FreeMode]}
      spaceBetween={32}
      slidesPerView={5}
      loop={true}
      freeMode={true}
      speed={5000}
      autoplay={{
        delay: 0,
        disableOnInteraction: false,
        pauseOnMouseEnter: false,
      }}
      allowTouchMove={false}
      style={{ padding: '16px 0' }}
    >
      {marqueeLogos.map((logo, idx) => (
        <SwiperSlide key={idx}>
          <div style={{
            minWidth: 100,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <img src={logo.src} alt={logo.alt} style={{ height: 48, width: 'auto' }} />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  </section>
);

export default TechMarquee;