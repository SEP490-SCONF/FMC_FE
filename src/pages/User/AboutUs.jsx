import React from "react";

const AboutUs = () => (
  <div className="bg-gray-50 min-h-screen py-10">
    <div className="max-w-3xl mx-auto bg-white rounded-lg shadow p-4">
      <h1 className="text-3xl font-bold text-center text-blue-900 mb-6">
        About FPT University DaNang Conference Hub
      </h1>
      <p className="text-lg text-gray-700 mb-6 text-center">
        Welcome to <span className="font-semibold text-blue-700">FPT University DaNang Conference Hub</span> – a comprehensive platform designed to revolutionize the organization, management, and participation in academic conferences and scientific events at FPT University Da Nang.
      </p>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Our Mission</h2>
        <p className="text-gray-700">
          Our mission is to become a leading knowledge connection center, providing maximum support for lecturers, researchers, students, and the academic community in sharing, exchanging, and developing breakthrough ideas.
          <br />
          We believe that technology can simplify complex processes, allowing the community to focus more on the core values of research and education.
        </p>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">About the System</h2>
        <p className="text-gray-700 mb-2">
          <span className="font-semibold">FPT University DaNang Conference Hub (FMC – FPT Multi Conference)</span> is a dedicated project developed to digitize and optimize the entire lifecycle of an academic conference:
        </p>
        <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
          <li>
            <span className="font-medium text-blue-700">Comprehensive Conference Management:</span> From planning, event configuration, program committee management, to tracking the overall progress of the conference.
          </li>
          <li>
            <span className="font-medium text-blue-700">Efficient Submission and Review Process:</span> An intuitive interface for authors to submit and track their papers, and a robust system for reviewers to provide fair and timely evaluations.
          </li>
          <li>
            <span className="font-medium text-blue-700">Easy Registration and Participation:</span> Simplifying the registration process for all participants, including speakers, authors, and guests, ensuring a seamless experience.
          </li>
          <li>
            <span className="font-medium text-blue-700">Proceedings Publication and Knowledge Repository:</span> Supporting the publication of official conference proceedings and building a digital archive for easy access and citation of scientific papers.
          </li>
          <li>
            <span className="font-medium text-blue-700">Community Connection:</span> Creating a space for academic discussions, idea exchange, and professional networking through an integrated forum.
          </li>
        </ul>
      </section>

      <section className="mb-6">
        <h2 className="text-xl font-semibold text-blue-800 mb-2">Our Role at FPT University Da Nang</h2>
        <p className="text-gray-700">
          As part of FPT University Da Nang, Conference Hub is committed to fostering a dynamic and innovative research environment.
          <br />
          We are proud to be the bridge that enables both internal conferences and international collaborative events to be organized professionally, transparently, and efficiently.
          <br />
          This system not only serves current needs but also lays the foundation for the sustainable development of scientific research activities at FPTU Da Nang in the future.
        </p>
      </section>

      <div className="text-center mt-8 text-blue-700 font-semibold">
        <p>Join us in exploring the future of academic conferences and be a part of our vibrant community.</p>
      </div>
    </div>
  </div>
);

export default AboutUs;