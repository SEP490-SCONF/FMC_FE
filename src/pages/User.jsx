import React from "react";
import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import UserInfo from "../components/layout/UserInfo";


const UserP = () => {
    return (
        <>
            <Header />
            <main className="pt-20">
                <UserInfo />
            </main>
            <Footer />
        </>
    );
};

export default UserP;