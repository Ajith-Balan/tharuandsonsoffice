import React from "react";
import Header from "./Header";
import Footer from "./Footer";
import { Helmet } from "react-helmet";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Layout = ({
  children,
  title = "Tharu & Sons",
  description = "Tharu & Sons provides laundry, linen management, room services, mechanized cleaning, and onboard housekeeping for Indian Railway and other sectors.",
  keywords = "Tharu & Sons, railway contract, mcc, ernakulamm",
  author = "ajith-balan",
}) => {
  return (
    <div className="flex flex-col min-h-screen bg-white">
      <Helmet>
        <meta charSet="utf-8" />
        <meta name="description" content={description} />
        <meta name="keywords" content={keywords} />
        <meta name="author" content={author} />
        <meta property="og:title" content={title} />
        <meta property="og:description" content={description} />
        <meta property="og:type" content="website" />
        <meta property="og:url" content={window.location.href} />
        <meta
          property="og:image"
          content="https://www.tharuandsons.in/wp-content/uploads/2023/04/logo-tagline-2.jpg"
        />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={title} />
        <meta name="twitter:description" content={description} />
        <title>{title}</title>
      </Helmet>

      <Header />

      <main className="flex-grow pt-20 bg-gray-50 min-h-screen">
        <ToastContainer />
        {children}
      </main>

      <Footer />
    </div>
  );
};

export default Layout;
