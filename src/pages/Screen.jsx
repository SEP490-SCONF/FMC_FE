import React from "react";
import Header from "../components/layout/ConfereanceHeader";
import Footer from "../components/layout/Footer";
import HomeScreen from "../components/layout/HomeScreen";
import NewsAndSponsorPage from "../components/layout/NewsASponsor";

const Screen = () => {
    return (
        <>
           
            <main className="pt-20">
                <div className="container">
                    <div className="row g-4">
                        {/* Cột HomeScreen */}
                        <div className="col-lg-8">
                            <HomeScreen />
                        </div>

                        {/* Cột News & Sponsor */}
                        <div className="col-lg-4">
                            <NewsAndSponsorPage />
                        </div>
                    </div>
                </div>
            </main>
           
        </>
    );
};

export default Screen;
