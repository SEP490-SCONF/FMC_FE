import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import PayService from "../../services/PayService";
import { updatePaperPublishStatus, setPaperPresented } from "../../services/PaperSerice";

const PaymentSuccess = () => {
    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const orderCode = params.get("orderCode");

    // Lấy paperId và feeTypeName từ localStorage nếu có
    const paperId = params.get("paperId") || localStorage.getItem("paymentPaperId");
    const feeTypeName = localStorage.getItem("paymentFeeType") || 'Registration';

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const confirmPayment = async () => {
            if (!orderCode) {
                setError("Order code not found");
                setLoading(false);
                return;
            }

            try {
                // Xác nhận thanh toán ở backend
                await PayService.paymentSuccess(orderCode);

                // Cập nhật trạng thái paper nếu có
                if (paperId) {
                    if (feeTypeName === "Presentation") {
                        await setPaperPresented(paperId, true);
                    } else {
                        await updatePaperPublishStatus(paperId, true);
                    }
                    localStorage.removeItem("paymentPaperId");
                    localStorage.removeItem("paymentFeeType");
                }
            } catch (err) {
                setError("Failed to confirm payment");
            } finally {
                setLoading(false);
            }
        };

        confirmPayment();
    }, [orderCode, paperId, feeTypeName]);

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Processing payment...</div>;
    }

    if (error) {
        return <div className="flex items-center justify-center min-h-screen text-red-600">{error}</div>;
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-green-50">
            <h1 className="text-3xl font-bold text-green-700 mb-4">Payment Successful!</h1>
            <p className="text-lg mb-2">Thank you for your payment.</p>
            {orderCode && (
                <p className="text-md text-gray-700 mb-4">
                    Order Code: <span className="font-semibold">{orderCode}</span>
                </p>
            )}
            <a href="/" className="px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition">
                Go to Home
            </a>
        </div>
    );
};

export default PaymentSuccess;
