import React from 'react';
import '../../assets/styles/pages/_section.scss';

const CommitteeBanner = () => (
  <section className="banner-section inner-banner position-relative pt-12 pt-md-12 pt-xl-20">
    <div className="container position-relative cus-z1 py-20 py-md-20 py-xl-20">
      <div className="row">
        <div className="col-xxl-12 cus-z1 text-center">
          <div className="section-area">
            <h2 className="fs-two mb-3 mb-md-5">Committee</h2>
          </div>
          <div className="breadcrumb-area">
            <nav aria-label="breadcrumb">
              <ol className="breadcrumb second position-relative m-0 d-center flex-wrap gap-2 gap-md-5">
                <li className="breadcrumb-item d-center fs-seven">
                  <a href="index.html" className="fw-normal">Home</a>
                </li>
                <li className="breadcrumb-item d-center fs-seven">
                  <a href="#" className="fw-normal">Pages</a>
                </li>
                <li className="breadcrumb-item d-center fs-seven p6-color active" aria-current="page">
                  <span className="p6-color">Committee</span>
                </li>
              </ol>
            </nav>
          </div>
        </div>
      </div>
    </div>
  </section>
);

export default CommitteeBanner;