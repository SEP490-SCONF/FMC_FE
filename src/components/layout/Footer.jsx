import React from "react";
import { Link } from "react-router-dom";
import fptLogo from "../../assets/images/fptlogo.png";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300">
      {/* Top section */}
      <div className="container mx-auto px-4 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Logo and Description */}
        <div className="space-y-3 flex flex-col justify-center">
          <div className="flex items-center gap-2">
            <img src={fptLogo} alt="FPT Logo" className="h-10 w-auto" />
            <span className="font-bold text-lg text-gray-800 dark:text-gray-100">
              FPT Conferences
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Leading the Way with Expert Forums.
          </p>
        </div>

        {/* Pages */}
        <div className="flex flex-col justify-center">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Pages
          </h4>
          <ul className="space-y-2">
            <li><Link to="/" className="hover:text-blue-600">Home</Link></li>
            <li><Link to="/about" className="hover:text-blue-600">About</Link></li>
            {/* <li><Link to="/blog" className="hover:text-blue-600">Blog</Link></li> */}
            <li><Link to="/conferences" className="hover:text-blue-600">Conferences</Link></li>
            {/* <li><Link to="/contact" className="hover:text-blue-600">Contact</Link></li> */}
          </ul>
        </div>

        {/* Contact */}
        <div className="flex flex-col justify-center">
          <h4 className="font-semibold text-gray-800 dark:text-gray-100 mb-4">
            Contact
          </h4>
          <ul className="space-y-2 text-sm">
            <li>Email: <a href="mailto:support@example.com" className="hover:text-blue-600">support@example.com</a></li>
            <li>Address: FPT City, Ngu Hanh Son, Da Nang 550000, Viet Nam</li>
            <li>Phone: <a href="tel:+842367300999" className="hover:text-blue-600">0236 7300 999</a></li>
          </ul>
        </div>
      </div>

      {/* Bottom section */}
      <div className="border-t border-gray-200 dark:border-gray-800 mt-6">
        <div className="container mx-auto px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">
          © {new Date().getFullYear()} FPT Conferences. All Rights Reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
