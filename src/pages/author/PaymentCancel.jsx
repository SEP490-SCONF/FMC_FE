import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PayService from "../../services/PayService";

const PaymentCancel = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const orderCode = params.get("orderCode");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const cancelPayment = async () => {
            if (!orderCode) {
                setError("Order code not found");
                setLoading(false);
                return;
            }
            try {
                await PayService.paymentCancel(orderCode);
            } catch (err) {
                setError("Failed to cancel payment");
            } finally {
                setLoading(false);
            }
        };

        cancelPayment();
    }, [orderCode]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Processing cancellation...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-red-50">
            <h1 className="text-3xl font-bold text-red-700 mb-4">Payment Cancelled</h1>
            <p className="text-lg mb-2">Your payment was not completed.</p>
            {orderCode && (
                <p className="text-md text-gray-700 mb-4">
                    Order Code: <span className="font-semibold">{orderCode}</span>
                </p>
            )}
            <a href="/" className="px-6 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition">
                Go to Home
            </a>
        </div>
    );
};

export default PaymentCancel;
