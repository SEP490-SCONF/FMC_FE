import React from "react";
import PaymentPage from "../../components/payment/Payment";
import { useLocation } from "react-router-dom";

const PaperPay = () => {
    const location = useLocation();
    const { userId, conferenceId, paperId } = location.state || {};

    return (
        <main className="pt-20">
            <PaymentPage userId={userId} conferenceId={conferenceId} paperId={paperId} />
        </main>
    );
};

export default PaperPay;