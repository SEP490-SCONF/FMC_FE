import React from "react";
import { Link, useParams } from "react-router-dom";
import "../../assets/styles/pages/_section.scss";

const CFP = () => {
  const { id } = useParams();

  return (
    <section
      className="cfp-section n1-bg-color pt-120 pb-120 d-flex align-items-center justify-content-center"
      style={{ minHeight: "80vh" }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-lg-8">
            <div className="section-area d-grid gap-3 gap-md-4 text-center mb-8">
              <span className="p7-color fw-semibold fs-eight">
                CALL FOR PAPERS
              </span>
              <h1 className="fs-two fw-bold mb-3">
                Submit Your Research to Our Conference
              </h1>
              <p className="n3-color fs-seven">
                We invite researchers, practitioners, and students to submit
                their original work to our upcoming conference. Share your
                latest findings, innovative ideas, and practical experiences
                with a vibrant academic and professional community.
              </p>
            </div>
            <div className="box-second second-alt alt-two p-5 mb-6 cfp-deadlines">
              <ul>
                <li>
                  <strong>Submission Deadline:</strong>
                  <span>August 31, 2025</span>
                </li>
                <li>
                  <strong>Notification of Acceptance:</strong>
                  <span>September 30, 2025</span>
                </li>
                <li>
                  <strong>Camera-Ready Submission:</strong>
                  <span>October 15, 2025</span>
                </li>
                <li>
                  <strong>Conference Dates:</strong>
                  <span>November 20–22, 2025</span>
                </li>
              </ul>
            </div>
            <div className="mb-6 cfp-topics">
              <h2 className="fs-five fw-semibold mb-2 p7-color">
                Topics of Interest include, but are not limited to:
              </h2>
              <ul className="ul-decimal n2-color text-start max-ch mx-auto">
                <li>Artificial Intelligence &amp; Machine Learning</li>
                <li>Cloud Computing &amp; Big Data</li>
                <li>Cybersecurity &amp; Privacy</li>
                <li>Software Engineering</li>
                <li>Internet of Things (IoT)</li>
                <li>Human-Computer Interaction</li>
                <li>Other related topics</li>
              </ul>
            </div>
            <div className="text-center mt-5">
              <Link
                to={`/conference/${id}/paper-submition`}
                className="box-style box-second first-alt alt-two d-inline-block py-2 px-5 fs-seven fw-semibold transition cfp-submit-btn"
              >
                Submit Your Paper
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CFP;
