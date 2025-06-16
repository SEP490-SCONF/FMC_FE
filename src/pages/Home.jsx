import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import Banner from "../components/layout/Banner";
import Event from "../components/layout/Event";
import Faq from "../components/layout/Faq";
import Schedule from "../components/layout/schedule";
import Service from "../components/layout/Service";
import Solution from "../components/layout/Solution";

const Home = () => {
    return (
        <>
            <Header />
            <main>
                <Banner />
                <Service />
                <Event />
                <Schedule />
                <Solution />
                <Faq />
            </main>
            <Footer />
        </>
    );
};

export default Home;