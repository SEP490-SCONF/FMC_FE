import React from "react";
import bgImage from "../../assets/images/tru-so-fpt20250415141843.jpg";

const MainHomePage = () => {
  return (
    <div
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "rgba(0,0,0,0.45)",
          zIndex: 1,
        }}
      />
      <div className="flex flex-col items-center justify-center h-screen relative z-10">
        <h1 className="text-white text-5xl font-bold text-center mb-6">
          Welcome to the FPT University DaNang Conference Hub.
          <br />
          Your comprehensive platform for organizing, attending,
          <br />
          and exploring academic events.
        </h1>
      </div>
      {/* Services Section */}
      <div className="relative z-10 bg-white py-16">
        <h2 className="text-4xl font-semibold text-center text-red-700 mb-12">
          What We Offer
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10 px-6">
          {/* Conference Management */}
          <div className="flex flex-col items-center text-center">
            <img
              src="https://img.icons8.com/ios-filled/64/000000/conference-call.png"
              alt="Conference management"
              className="mb-6"
              style={{ height: 64 }}
            />
            <a
              href="#" // Link to Conference Management section or page
              className="text-2xl font-semibold text-red-700 mb-3 underline"
              style={{ textUnderlineOffset: 4 }}
            >
              Conference Management
            </a>
            <p className="text-base text-gray-800 mb-6">
              From comprehensive program committee oversight to efficient paper
              review processes, our platform simplifies every step of organizing
              academic conferences at FPT University DaNang.
            </p>
            <span className="text-gray-400 italic text-sm">
              Learn more &nbsp;▶
            </span>
          </div>
          {/* Registration & Attendance */}
          <div className="flex flex-col items-center text-center">
            <img
              src="https://img.icons8.com/ios-filled/64/000000/add-user-group-man-man.png"
              alt="Registration and attendance"
              className="mb-6"
              style={{ height: 64 }}
            />
            <a
              href="#" // Link to Registration information or process
              className="text-2xl font-semibold text-red-700 mb-3 underline"
              style={{ textUnderlineOffset: 4 }}
            >
              Registration & Attendance
            </a>
            <p className="text-base text-gray-800 mb-6">
              Streamlined registration for all participants, authors, and
              reviewers. Our system ensures a smooth process for joining and
              managing your participation in academic events.
            </p>
            <span className="text-gray-400 italic text-sm">
              Learn more &nbsp;▶
            </span>
          </div>
          {/* Publication & Proceedings */}
          <div className="flex flex-col items-center text-center">
            <img
              src="https://img.icons8.com/ios-filled/64/000000/book.png"
              alt="Publication and proceedings"
              className="mb-6"
              style={{ height: 64 }}
            />
            <a
              href="#" // Link to Publications/Proceedings archive
              className="text-2xl font-semibold text-red-700 mb-3 underline"
              style={{ textUnderlineOffset: 4 }}
            >
              Publication & Proceedings
            </a>
            <p className="text-base text-gray-800 mb-6">
              Facilitate the seamless submission, review, and publication of
              research papers. Access and explore official conference
              proceedings and academic content digitally.
            </p>
            <span className="text-gray-400 italic text-sm">
              Learn more &nbsp;▶
            </span>
          </div>
        </div>
      </div>
      {/* Statistics Section - NEW ADDITION */}
      <div className="relative z-10 bg-gray-100 py-16">
        {" "}
        {/* Changed background to grey for contrast */}
        <h2 className="text-4xl font-semibold text-center text-red-700 mb-12">
          Our Impact at a Glance
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 px-6">
          {/* Stat 1: Conferences */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <p className="text-6xl font-bold text-red-700 mb-2">50+</p>{" "}
            {/* Replace with dynamic data */}
            <p className="text-xl font-semibold text-gray-800">
              Conferences Hosted
            </p>
          </div>
          {/* Stat 2: Users */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <p className="text-6xl font-bold text-red-700 mb-2">1,200+</p>{" "}
            {/* Replace with dynamic data */}
            <p className="text-xl font-semibold text-gray-800">Active Users</p>
          </div>
          {/* Stat 3: Papers */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <p className="text-6xl font-bold text-red-700 mb-2">300+</p>{" "}
            {/* Replace with dynamic data */}
            <p className="text-xl font-semibold text-gray-800">
              Papers Published
            </p>
          </div>
          {/* Stat 4: Reviews (or another relevant metric like "Topics" or "Events") */}
          <div className="flex flex-col items-center text-center p-6 bg-white rounded-lg shadow-md">
            <p className="text-6xl font-bold text-red-700 mb-2">1,500+</p>{" "}
            {/* Replace with dynamic data */}
            <p className="text-xl font-semibold text-gray-800">
              Reviews Completed
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHomePage;
