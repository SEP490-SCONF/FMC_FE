import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import SubmittedOrga from "../../components/layout/SubmittedOrga";



const SubOrganizer = () => {
    return (
        <>
            <Header />
            <main className="pt-20">
                <SubmittedOrga />
            </main>
            <Footer />
        </>
    );
};

export default SubOrganizer;