import React from 'react';
import favLogo from "../../assets/images/fav-2.png";
import logoText from "../../assets/images/logo-text.png";
import "../../assets/css/style.min.css";

const Header = () => {
    return (
        <header className="header-section index-two n1-bg-color py-4 px-2 px-md-6">
            <div className="container-fluid">
                <div className="main-navbar px-0 px-xl-8">
                    <nav className="navbar-custom">
                        <div className="d-flex align-items-center justify-content-between">
                            <a href="index.html" className="nav-brand d-flex align-items-center gap-2 d-lg-none">
                                <img src="assets/images/fav-2.png" alt="logo" />
                                <img src="assets/images/logo-text.png" alt="logo" />
                            </a>
                            <div className="d-flex gap-6">
                                <button className="navbar-toggle-btn d-block d-lg-none" type="button">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                </button>
                            </div>
                        </div>
                        <div className="navbar-toggle-item">
                            <div className="d-flex gap-5 flex-column flex-lg-row align-items-start align-items-lg-center justify-content-between mt-5 mt-lg-0">
                                <a href="index.html" className="navbar-brand logo d-none d-lg-flex d-xl-flex d-lg-flex gap-2 align-items-center">
                                    <img src="assets/images/fav-2.png" alt="logo" />
                                    <img src="assets/images/logo-text.png" className="d-none d-md-none d-xl-flex" alt="logo" />
                                </a>
                                <ul className="custom-nav third d-lg-flex d-grid gap-3 gap-lg-4">
                                    <li className="menu-item position-relative">
                                        <button className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical" data-splitting>
                                            Home
                                        </button>
                                        <ul className="sub-menu n1-bg-color p-lg-5">
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Business Forum</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-2.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Multi Event</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-3.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Creative Conference</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-4.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Online Conference</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-5.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Online Ticket</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-6.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Gaming & Comics</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-7.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Fashion Event</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-8.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Food Festival</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-9.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Education Conference</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-10.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Music Conference</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-11.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Concert Event</a>
                                            </li>
                                            <li className="menu-link py-1 py-lg-2">
                                                <a href="index-12.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Art Event</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="menu-item position-relative">
                                        <button className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical" data-splitting>
                                            Pages
                                        </button>
                                        <ul className="sub-menu n1-bg-color p-lg-5">
                                            <li className="menu-link py-1">
                                                <a href="about-us.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>About</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="we-offer.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>we offer</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="speakers.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>speakers</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="speakers-single.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>speakers single</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="faqs.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>faqs</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="pricing.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>pricing</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="gallery.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>gallery</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="testimonial.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>testimonial</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="privacy-policy.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Privacy Policy</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="terms-conditions.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Terms Conditions</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="sign-in.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Sign In</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="sign-up.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Sign Up</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="menu-item position-relative">
                                        <button className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical" data-splitting>
                                            Blog
                                        </button>
                                        <ul className="sub-menu n1-bg-color p-lg-5">
                                            <li className="menu-link py-1">
                                                <a href="blog.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Blog - Standard</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="blog-2.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Blog - List</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="blog-3.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Blog - Grid</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="blog-single.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Blog Single Without Sidebar</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="blog-single-2.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Blog Single With Sidebar</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="menu-item position-relative">
                                        <button className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical" data-splitting>
                                            Shop
                                        </button>
                                        <ul className="sub-menu n1-bg-color p-lg-5">
                                            <li className="menu-link py-1">
                                                <a href="shop.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Shop</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="shop-single.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Product Details</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="cart.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>cart</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="checkout.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>checkout</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="wishlist.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>wishlist</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="menu-item position-relative">
                                        <button className="position-relative pe-5 z-1 slide-third text-uppercase slide-vertical" data-splitting>
                                            Event
                                        </button>
                                        <ul className="sub-menu n1-bg-color p-lg-5">
                                            <li className="menu-link py-1">
                                                <a href="event-list.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>event list</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="event-single.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Event Single</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="sponsor.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>sponsor</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="ticket.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>ticket</a>
                                            </li>
                                            <li className="menu-link py-1">
                                                <a href="ticket-single.html" className="n2-color slide-third text-uppercase slide-horizontal" data-splitting>Ticket Single</a>
                                            </li>
                                        </ul>
                                    </li>
                                    <li className="menu-link">
                                        <a href="contact.html" className="n2-color slide-third text-uppercase slide-vertical" data-splitting>Contact</a>
                                    </li>
                                </ul>
                                <div className="right-area sidebar-items position-relative d-flex gap-3 gap-md-5 align-items-center">
                                    <div className="single-item target-item">
                                        <div className="cmn-head position-relative d-center">
                                            <button type="button" aria-label="Shopping Button" className="box-area box-style box-third seventh-alt d-center rounded-circle position-relative">
                                                <span className="d-center fs-four n2-color">
                                                    <i className="ph ph-bag"></i>
                                                </span>
                                            </button>
                                            <span className="box-area box-two p7-bg-color n1-color fs-ten d-center rounded-circle position-absolute mb-n5 mb-n5 ms-5">2</span>
                                        </div>
                                        <div className="nav-items-wrapper d-flex flex-column p-4 p-sm-7 justify-content-between position-fixed top-0 end-0 bottom-0 w-100 n2-bg-color">
                                            <button className="position-absolute close-btn">
                                                <span className="d-center fs-four p2-color">
                                                    <i className="ph ph-x"></i>
                                                </span>
                                            </button>
                                            <div className="nav-items d-grid gap-2">
                                                <h4 className="mb-4 n1-color">Your shopper</h4>
                                                <div className="single-box p-2">
                                                    <div className="d-flex gap-2 justify-content-between align-items-center">
                                                        <div className="content-box d-flex gap-4">
                                                            <div className="icon-box d-inline-flex d-center">
                                                                <img src="assets/images/shop-img-2.webp" alt="Image" />
                                                            </div>
                                                            <div className="info-box">
                                                                <a href="shop-details.html">
                                                                    <h6 className="my-1 n1-color">Dad Baseball Cap</h6>
                                                                </a>
                                                                <span className="n1-color">$150.00</span>
                                                                <div className="quantity-area">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="qtySelector py-1 d-inline-flex align-items-center">
                                                                            <span className="decreaseQty d-center n1-color">
                                                                                <i className="fas fa-minus"></i>
                                                                            </span>
                                                                            <input type="text" aria-label="quantity value" className="qtyValue text-center m-0 mx-3 p-0" value="4" />
                                                                            <span className="increaseQty d-center n1-color">
                                                                                <i className="fas fa-plus"></i>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button type="button" className="end-area remove">
                                                            <span className="d-center fs-six p2-color">
                                                                <i className="ph ph-trash"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                                <div className="single-box p-2">
                                                    <div className="d-flex gap-2 justify-content-between align-items-center">
                                                        <div className="content-box d-flex gap-4">
                                                            <div className="icon-box d-inline-flex d-center">
                                                                <img src="assets/images/shop-img-1.webp" alt="Image" />
                                                            </div>
                                                            <div className="info-box">
                                                                <a href="shop-details.html">
                                                                    <h6 className="my-1 n1-color">Golden Watch</h6>
                                                                </a>
                                                                <span className="n1-color">$150.00</span>
                                                                <div className="quantity-area">
                                                                    <div className="d-flex align-items-center">
                                                                        <div className="qtySelector py-1 d-inline-flex align-items-center">
                                                                            <span className="decreaseQty d-center n1-color">
                                                                                <i className="fas fa-minus"></i>
                                                                            </span>
                                                                            <input type="text" aria-label="quantity value" className="qtyValue text-center m-0 mx-3 p-0" value="2" />
                                                                            <span className="increaseQty d-center n1-color">
                                                                                <i className="fas fa-plus"></i>
                                                                            </span>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <button type="button" className="end-area remove">
                                                            <span className="d-center fs-six p2-color">
                                                                <i className="ph ph-trash"></i>
                                                            </span>
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="footer-area d-grid gap-3 gap-md-5">
                                                <div className="d-flex justify-content-between">
                                                    <span className="n1-color">Products: 2 items</span>
                                                    <span className="n1-color">Sub Total: $677</span>
                                                </div>
                                                <div className="d-center">
                                                    <a href="cart.html" className="box-style box-second first-alt d-center gap-2 py-2 py-md-3 px-3 px-md-6 px-lg-7">
                                                        <span>Add To Cart</span>
                                                    </a>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="single-item target-item">
                                        <div className="cmn-head">
                                            <button type="button" aria-label="Shopping Button" className="box-area box-style box-third seventh-alt d-center rounded-circle position-relative">
                                                <span className="d-center fs-four n2-color">
                                                    <i className="ph ph-magnifying-glass"></i>
                                                </span>
                                            </button>
                                        </div>
                                        <div className="nav-items-wrapper d-flex flex-column p-4 p-sm-7 justify-content-between position-fixed top-0 end-0 bottom-0 w-100 n2-bg-color">
                                            <button className="position-absolute close-btn">
                                                <span className="d-center fs-four n1-color">
                                                    <i className="ph ph-x"></i>
                                                </span>
                                            </button>
                                            <div className="nav-items">
                                                <h4 className="mb-7 n1-color">Enter Your Text</h4>
                                                <form action="#">
                                                    <div className="footer-form">
                                                        <div className="input-area transition p6-bg-color p-1 p-md-2 d-center justify-content-between gap-4">
                                                            <div className="w-100 d-center gap-2 justify-content-start ps-3 ps-md-4 py-2">
                                                                <div className="d-center n1-color fs-five">
                                                                    <i className="ph ph-envelope-simple"></i>
                                                                </div>
                                                                <input type="text" placeholder="Email address" className="w-100 n1-color" />
                                                            </div>
                                                            <button className="form-btn box-style box-second second-alt box-area box-four transition n1-bg-color d-center cus-border border b-fifth">
                                                                <span className="d-center p2-color fs-four">
                                                                    <i className="ph ph-arrow-up-right"></i>
                                                                </span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                </form>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="single-item d-none d-lg-block">
                                        <a href="sign-in.html" className="box-style box-second first-alt alt-two d-center gap-2 py-2 py-md-3 px-3 px-md-6 px-xl-9">
                                            <span className="fs-seven">Join Forum</span>
                                        </a>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </nav>
                </div>
            </div>
        </header>
    );
};

export default Header;
