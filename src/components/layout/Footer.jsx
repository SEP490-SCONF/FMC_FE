import React from "react";
import '@fortawesome/fontawesome-free/css/all.min.css';

// Import images
import footerShape4 from "../../assets/images/shape/footer-shape-4.webp";
import footerShape3 from "../../assets/images/shape/footer-shape-3.webp";
import footerShape2 from "../../assets/images/shape/footer-shape-2.webp";
import favLogo from "../../assets/images/fav-2.png";
import logoText2 from "../../assets/images/logo-text-2.png";


const Footer = () => {
    return (
        <footer className="footer-section n2-bg-color position-relative">
            <div className="abs-area footer-illus pe-none">
                <div className="item item-one position-absolute shape-animation-2 start-0 top-0">
                    <img src={footerShape4} alt="icon" />
                </div>
                <div className="item position-absolute start-0 top-0">
                    <img src={footerShape3} alt="icon" />
                </div>
                <div className="item position-absolute end-0 bottom-0">
                    <img src={footerShape2} alt="icon" />
                </div>
            </div>
            <div className="cus-border border-bottom b-third">
                <div className="container">
                    <div className="row gy-7 gy-lg-0 align-items-center justify-content-between py-14 py-lg-0">
                        <div className="col-sm-6 col-lg-2">
                            <a href="index.html" className="nav-brand d-flex justify-content-start gap-2">
                                <span className="d-center">
                                    <img src={favLogo} alt="fav" />
                                </span>
                                <span className="d-center">
                                    <img src={logoText2} className="logo" alt="logo" />
                                </span>
                            </a>
                        </div>
                        <div className="col-sm-6 col-lg-3">
                            <ul className="d-center justify-content-start justify-content-sm-center gap-2 gap-md-3 social-area second">
                                <li>
                                    <a href="https://www.facebook.com" aria-label="Facebook" className="d-center n1-2nd-bg-color rounded-circle transition">
                                        <span className="d-center fs-seven n1-color">
                                            <i className="fab fa-facebook-f"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://twitter.com" aria-label="Twitter" className="d-center n1-2nd-bg-color rounded-circle transition">
                                        <span className="d-center fs-seven n1-color">
                                            <i className="fab fa-twitter"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.instagram.com" aria-label="Instagram" className="d-center n1-2nd-bg-color rounded-circle transition">
                                        <span className="d-center fs-seven n1-color">
                                            <i className="fab fa-instagram"></i>
                                        </span>
                                    </a>
                                </li>
                                <li>
                                    <a href="https://www.dribbble.com" aria-label="dribbble" className="d-center n1-2nd-bg-color rounded-circle transition">
                                        <span className="d-center fs-seven n1-color">
                                            <i className="fa-brands fa-dribbble"></i>
                                        </span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                        <div className="col-lg-5 py-0 py-lg-20">
                            <div className="title-area">
                                <h2 className="display-five n1-color fw-bold">Leading the Way with Expert Forums</h2>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container">
                <div className="row cus-row gy-9 gy-xxl-0 my-4 my-md-8 my-xxl-15">
                    <div className="col-6 col-md-4 col-lg-2 footer-links d-flex justify-content-start order-1 order-md-0">
                        <div className="single-box">
                            <h5 className="mb-4 mb-md-6 n1-color">Pages</h5>
                            <ul className="d-grid gap-3 gap-md-4 overflow-hidden">
                                <li><a href="index-4.html" className="d-center justify-content-start transition n1-color position-relative">Home</a></li>
                                <li><a href="about-us.html" className="d-center justify-content-start transition n1-color position-relative">About</a></li>
                                <li><a href="blog.html" className="d-center justify-content-start transition n1-color position-relative">Blog</a></li>
                                <li><a href="event-list.html" className="d-center justify-content-start transition n1-color position-relative">Event</a></li>
                                <li><a href="shop.html" className="d-center justify-content-start transition n1-color position-relative">Shop</a></li>
                                <li><a href="contact.html" className="d-center justify-content-start transition n1-color position-relative">Contact</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-6 col-md-4 col-lg-2 footer-links d-flex justify-content-start order-1 order-md-0">
                        <div className="single-box">
                            <h5 className="mb-4 mb-md-6 n1-color">Resources</h5>
                            <ul className="d-grid gap-3 gap-md-4 overflow-hidden">
                                <li><a href="faqs.html" className="d-center justify-content-start transition n1-color position-relative">Faqs</a></li>
                                <li><a href="terms-conditions.html" className="d-center justify-content-start transition n1-color position-relative">Terms Cond.</a></li>
                                <li><a href="privacy-policy.html" className="d-center justify-content-start transition n1-color position-relative">Privacy Policy</a></li>
                                <li><a href="sponsor.html" className="d-center justify-content-start transition n1-color position-relative">Sponsor</a></li>
                                <li><a href="faqs.html" className="d-center justify-content-start transition n1-color position-relative">Faqs</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-8 col-sm-7 col-md-4 col-lg-4">
                        <div className="single-box address">
                            <h5 className="mb-4 mb-md-6 n1-color">Address</h5>
                            <ul className="d-grid gap-3 gap-md-4">
                                <li className="d-flex align-items-center gap-3">
                                    <span className="box-area d-center rounded-circle n1-2nd-bg-color n1-color fs-six box-area box-three">
                                        <i className="ph ph-envelope-open"></i>
                                    </span>
                                    <span className="n1-color">Null</span>
                                </li>
                                <li className="d-flex align-items-center gap-3">
                                    <span className="box-area d-center rounded-circle n1-2nd-bg-color n1-color fs-six box-area box-three">
                                        <i className="ph ph-map-pin"></i>
                                    </span>
                                    <span className="n1-color">Khu đô thị FPT City, Ngũ Hành Sơn, Đà Nẵng 550000, Việt Nam</span>
                                </li>
                                <li className="d-flex align-items-center gap-3">
                                    <span className="box-area d-center rounded-circle n1-2nd-bg-color n1-color fs-six box-area box-three">
                                        <i className="ph ph-phone-call"></i>
                                    </span>
                                    <a href="tel:+1-212-9876543" className="n1-color">02367300999</a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div className="col-md-12 col-lg-4 order-1 order-md-0">
                        <div className="single-box form-area">
                            <h5 className="mb-3 mb-md-4 n1-color">Newsletter</h5>
                            <p className="n1-color">Stay informed with EvenDo by subscribing to our newsletter.</p>
                            <form className="mt-4 mt-md-6" action="#">
                                <div className="input-area transition p7-bg-color p-1 p-md-2 d-center gap-4 justify-content-between gap-4">
                                    <div className="w-100 d-center gap-2 justify-content-start ps-3 ps-md-4 py-2">
                                        <div className="d-center n1-color fs-five">
                                            <i className="ph ph-envelope-simple"></i>
                                        </div>
                                        <input type="text" placeholder="Email address" className="w-100 n1-color" />
                                    </div>
                                    <button className="form-btn box-style box-second second-alt alt-two box-area box-four transition d-center cus-border border b-fifth">
                                        <span className="d-center p2-color fs-four">
                                            <i className="ph ph-arrow-up-right"></i>
                                        </span>
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
            <div className="cus-border border-top b-third">
                <div className="container">
                    <div className="row py-4 py-md-6">
                        <div className="col-lg-12">
                            <div className="copyright text-center">
                                <p className="n1-color">© <span className="currentYear n1-color"></span> Your Business Forum. All Rights Reserved</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;