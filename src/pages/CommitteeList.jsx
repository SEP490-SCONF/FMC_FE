import React from 'react';
import Header from '../components/layout/Header';
import Footer from '../components/layout/Footer';
import ComTop from '../components/layout/ComTop';
import Committee from '../components/layout/Committee';


const Comm = () => {
    return (
        <>
            <Header />
            <main className="pt-20">
                <ComTop />
                <Committee />
            </main>
            <Footer />
        </>
    );
};

export default Comm;