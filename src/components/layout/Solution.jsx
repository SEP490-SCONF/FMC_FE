import React from 'react';
import '../../assets/styles/pages/_section.scss';

// Import images
import solutionShape1 from '../../assets/images/shape/solution-shape-1.webp';
import solutionShape2 from '../../assets/images/shape/solution-shape-2.webp';
import solutionShape3 from '../../assets/images/shape/solution-shape-3.webp';
import solutionShape4 from '../../assets/images/shape/solution-shape-4.webp';
import solutionImg1 from '../../assets/images/solution-img-1.webp';
import solutionImg2 from '../../assets/images/solution-img-2.webp';

const SolutionSection = () => (
    <section className="solution-section n2-bg-color position-relative pt-120 pb-120">
        <div className="abs-area pe-none">
            <div className="item position-absolute d-none d-lg-block end-0 top-0">
                <img src={solutionShape1} alt="icon" />
            </div>
            <div className="item position-absolute shape-animation-2 d-none d-lg-block start-0 bottom-0 m-n20">
                <img src={solutionShape2} alt="icon" />
            </div>
            <div className="item position-absolute shape-animation-2 d-none d-lg-block end-0 top-0 me-n20">
                <img src={solutionShape3} className="me-n20" alt="icon" />
            </div>
        </div>
        <div className="container">
            <div className="row gy-8 gy-md-0 justify-content-between">
                <div className="col-md-6 pe-2 pe-xl-20">
                    <div className="section-area mb-8 mb-md-15 d-grid gap-3 gap-md-4 reveal-single reveal-text text-one position-relative">
                        <span className="n1-color fw-semibold">SOLUTION</span>
                        <h2 className="fs-two n1-color">The most anticipated multi event coming</h2>
                        <div className="abs-area pe-none position-absolute end-0 bottom-0 m-n10">
                            <img src={solutionShape4} className="max-un" alt="img" />
                        </div>
                    </div>
                    <div className="reveal-single reveal-overlay first-item alt-two">
                        <img src={solutionImg1} className="w-100" alt="img" />
                    </div>
                </div>
                <div className="col-md-6 ps-2 ps-lg-20 ps-xl-0 d-grid gap-6 gap-md-10 overflow-hidden">
                    <div className="reveal-single reveal-overlay second-item alt-two">
                        <img src={solutionImg2} className="w-100" alt="img" />
                    </div>
                    <div className="d-grid">
                        <p className="n1-color">
                            Our solutions provide seamless event planning, innovative technology, and expert support to ensure every gathering is a success, creating unforgettable experiences for both organizers and attendees.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </section>
);

export default SolutionSection;