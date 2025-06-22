import React from "react";
import Header from "../../components/layout/Header";
import Footer from "../../components/layout/Footer";
import Submited from "../../components/layout/Submited";


const Sub = () => {
    return (
        <>
            <Header />
            <main className="pt-20">
                <Submited />
            </main>
            <Footer />
        </>
    );
};

export default Sub;