import React from "react";
import { Link, useParams } from "react-router-dom";

const CFP = () => {
  const { id } = useParams();

  return (
    <section
      className="min-h-[80vh] flex items-center justify-center bg-gray-50 py-20"
    >
      <div className="container mx-auto px-4">
        <div className="flex justify-center">
          <div className="w-full max-w-2xl">
            <div className="grid gap-4 text-center mb-8">
              <span className="text-blue-700 font-semibold text-sm tracking-widest uppercase">
                CALL FOR PAPERS
              </span>
              <h1 className="text-3xl md:text-4xl font-bold mb-3">
                Submit Your Research to Our Conference
              </h1>
              <p className="text-gray-600 text-base">
                We invite researchers, practitioners, and students to submit
                their original work to our upcoming conference. Share your
                latest findings, innovative ideas, and practical experiences
                with a vibrant academic and professional community.
              </p>
            </div>
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <ul className="space-y-2 text-left">
                <li>
                  <strong>Submission Deadline:</strong>{" "}
                  <span className="text-gray-700">August 31, 2025</span>
                </li>
                <li>
                  <strong>Notification of Acceptance:</strong>{" "}
                  <span className="text-gray-700">September 30, 2025</span>
                </li>
                <li>
                  <strong>Camera-Ready Submission:</strong>{" "}
                  <span className="text-gray-700">October 15, 2025</span>
                </li>
                <li>
                  <strong>Conference Dates:</strong>{" "}
                  <span className="text-gray-700">November 20–22, 2025</span>
                </li>
              </ul>
            </div>
            <div className="mb-6">
              <h2 className="text-lg font-semibold mb-2 text-blue-700">
                Topics of Interest include, but are not limited to:
              </h2>
              <ul className="list-decimal list-inside text-gray-700 text-left max-w-xl mx-auto space-y-1">
                <li>Artificial Intelligence &amp; Machine Learning</li>
                <li>Cloud Computing &amp; Big Data</li>
                <li>Cybersecurity &amp; Privacy</li>
                <li>Software Engineering</li>
                <li>Internet of Things (IoT)</li>
                <li>Human-Computer Interaction</li>
                <li>Other related topics</li>
              </ul>
            </div>
            <div className="text-center mt-8">
              <Link
                to={`/conference/${id}/paper-submition`}
                className="inline-block bg-blue-700 hover:bg-blue-800 text-white font-semibold py-2 px-6 rounded transition"
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
