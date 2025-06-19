import React from 'react';
import '../../assets/styles/pages/_section.scss';

// Import images
import teamImg1 from '../../assets/images/team-img-1.webp';
import teamImg2 from '../../assets/images/team-img-2.webp';
import teamImg3 from '../../assets/images/team-img-3.webp';
import teamImg4 from '../../assets/images/team-img-4.webp';
import teamImg5 from '../../assets/images/team-img-5.webp';
import teamImg6 from '../../assets/images/team-img-6.webp';
import teamImg7 from '../../assets/images/team-img-7.webp';
import teamImg8 from '../../assets/images/team-img-8.webp';
import teamImg9 from '../../assets/images/team-img-9.webp';

const speakers = [
    {
        name: 'Lila Thompson',
        role: 'Director of Sales',
        img: teamImg1,
        socials: [
            { href: 'https://www.facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
            { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
            { href: 'https://www.instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
            { href: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', label: 'YouTube' },
        ],
    },
    {
        name: 'John Smith',
        role: 'Chief Marketing Officer',
        img: teamImg2,
        socials: [
            { href: 'https://www.facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
            { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
            { href: 'https://www.instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
            { href: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', label: 'YouTube' },
        ],
    },
    {
        name: 'Emily Walker',
        role: 'Head of Product Design',
        img: teamImg3,
        socials: [
            { href: 'https://www.facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
            { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
            { href: 'https://www.instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
            { href: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', label: 'YouTube' },
        ],
    },
    {
        name: 'Michael Green',
        role: 'VP of Engineering',
        img: teamImg4,
        socials: [
            { href: 'https://www.facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
            { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
            { href: 'https://www.instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
            { href: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', label: 'YouTube' },
        ],
    },
    {
        name: 'Sophia Miller',
        role: 'Chief Financial Officer',
        img: teamImg5,
        socials: [
            { href: 'https://www.facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
            { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
            { href: 'https://www.instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
            { href: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', label: 'YouTube' },
        ],
    },
    {
        name: 'David Brown',
        role: 'Head of Operations',
        img: teamImg6,
        socials: [
            { href: 'https://www.facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
            { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
            { href: 'https://www.instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
            { href: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', label: 'YouTube' },
        ],
    },
    {
        name: 'Olivia Johnson',
        role: 'VP of Marketing',
        img: teamImg7,
        socials: [
            { href: 'https://www.facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
            { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
            { href: 'https://www.instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
            { href: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', label: 'YouTube' },
        ],
    },
    {
        name: 'Ethan Lewis',
        role: 'Chief Technology Officer',
        img: teamImg8,
        socials: [
            { href: 'https://www.facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
            { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
            { href: 'https://www.instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
            { href: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', label: 'YouTube' },
        ],
    },
    {
        name: 'Ava Scott',
        role: 'Chief Executive Officer',
        img: teamImg9,
        socials: [
            { href: 'https://www.facebook.com', icon: 'fab fa-facebook-f', label: 'Facebook' },
            { href: 'https://twitter.com', icon: 'fab fa-twitter', label: 'Twitter' },
            { href: 'https://www.instagram.com', icon: 'fab fa-instagram', label: 'Instagram' },
            { href: 'https://www.youtube.com', icon: 'fa-brands fa-youtube', label: 'YouTube' },
        ],
    },
];

const TeamSection = () => (
    <section className="team-section s1-bg-color position-relative pt-120 pb-120">
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
                {speakers.map((speaker, idx) => (
                    <div className="col-8 col-sm-6 col-lg-4" key={idx}>
                        <div className="single-area d-grid gap-3 gap-xl-4 position-relative">
                            <div className="image-area overflow-hidden d-center position-relative">
                                <img src={speaker.img} className="w-100 pe-none" alt="image" />
                                <span className="box-style box-second second-alt tag-area m-4 m-md-6 transition rounded-pill n1-bg-color d-center gap-2 py-1 py-md-2 px-3 px-md-4 position-absolute bottom-0 end-0">
                                    <span className="d-center fs-four n1-color">
                                        <i className="ph ph-microphone"></i>
                                    </span>
                                    <span className="fs-seven">Speaker</span>
                                </span>
                                <div className="hover-item d-center flex-column transition-sec cus-border border b-fifth position-absolute z-1">
                                    <ul className="d-center hover-active m-3 m-md-4 gap-1 gap-md-1 social-area transition">
                                        {speaker.socials.map((social, sidx) => (
                                            <li key={sidx}>
                                                <a href={social.href} aria-label={social.label} className="d-center rounded-circle single-item n1-bg-color transition">
                                                    <span className="d-center fs-seven p6-color transition">
                                                        <i className={social.icon}></i>
                                                    </span>
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                    <span className="box-style box-second second-alt m-4 m-md-6 transition rounded-pill n1-bg-color d-center gap-2 py-1 py-md-2 px-3 px-md-4 pe-none">
                                        <span className="d-center fs-four n1-color">
                                            <i className="ph ph-microphone"></i>
                                        </span>
                                        <span className="fs-seven">Speaker</span>
                                    </span>
                                </div>
                            </div>
                            <div className="text-area">
                                <a href="speakers-single.html">
                                    <h5 className="mb-2 n2-color">{speaker.name}</h5>
                                </a>
                                <span className="n3-color fw-bold fs-nine">{speaker.role}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

export default TeamSection;