import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import SubmitPapers from "../components/layout/SubmitPapers";


const PaperSubmition = () => {
    return (
        <>
            <Header />
            <main className="pt-20">
                <SubmitPapers />
            </main>
            <Footer />
        </>
    );
};

export default PaperSubmition;