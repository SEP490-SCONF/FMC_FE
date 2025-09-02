import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonPay from "../../components/ui/button/ButtonPayment";
import PayService from '../../services/PayService';
import { useUser } from '../../context/UserContext';

const PaymentPage = () => {
  const { user } = useUser();
  const userId = user?.userId;
  const displayName = user?.userName || user?.fullName || user?.name || 'Unknown';
  const userEmail = user?.email || user?.mail || user?.emailAddress || '';

  const navigate = useNavigate();
  const location = useLocation();
  const { conferenceId, feeDetailId, paperId } = location.state || {};

  const [feeDetail, setFeeDetail] = useState(null);
  const [giftCode, setGiftCode] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!conferenceId || !feeDetailId || !userId) {
      setLoading(false);
      console.error("Missing payment info:", { conferenceId, feeDetailId, userId });
      return;
    }

    PayService.getFeeDetail(feeDetailId)
      .then(res => setFeeDetail(res))
      .catch(err => console.error("Error loading fee detail:", err))
      .finally(() => setLoading(false));
  }, [conferenceId, feeDetailId, userId]);

  const hasFptDiscount = userEmail.toLowerCase().includes('@fpt');
  const payable = feeDetail ? feeDetail.amount - (hasFptDiscount ? feeDetail.amount * 0.1 : 0) : 0;
  const formatVnd = n => Number(n || 0).toLocaleString('vi-VN') + ' VND';

  const handleCompleteOrder = async () => {
    if (!feeDetail) return;

    // DTO mới theo backend
    const paymentDTO = {
      UserId: userId,
      ConferenceId: conferenceId,
      PaperId: paperId,
      Fees: [
        {
          FeeDetailId: feeDetail.feeDetailId,
          Quantity: 1
        }
      ]
    };

    try {
      const res = await PayService.createPayment(paymentDTO);

      if (res?.checkoutUrl) {
        if (paperId) localStorage.setItem('paymentPaperId', paperId);
        window.location.href = res.checkoutUrl;
      } else {
        console.error("No checkoutUrl returned", res);
        alert("Payment initiation failed!");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed! Check console for details.");
    }
  };

  if (loading) return <p>Loading payment info...</p>;
  if (!feeDetail) return <p>No fee detail found or missing payment info.</p>;

  // --- Giao diện giữ nguyên hoàn toàn ---
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">FMC Payment</h2>
      <div className="space-y-8">
        {/* Purpose */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Purpose</span>
          <span className="text-gray-900">{feeDetail?.feeType}</span>
        </div>

        {/* Mode */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Mode</span>
          <span className="text-gray-900">{feeDetail?.mode}</span>
        </div>

        {/* Total Fee */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Total Fee</span>
          <span className="text-gray-900">{formatVnd(feeDetail.amount)}</span>
        </div>

        {/* Payment Method */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-medium mb-3 text-gray-700">Payment Method</p>
          <span className="text-gray-600">Pay via PayOS</span>
        </div>

        {/* Summary */}
        <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Summary</h3>

          <div className="flex justify-between mb-3 text-gray-700">
            <span>Subtotal</span>
            <span>{formatVnd(feeDetail.amount)}</span>
          </div>

          {hasFptDiscount && (
            <div className="flex justify-between mb-3 text-gray-700">
              <span>FPT discount (10%)</span>
              <span className="text-green-600">-{formatVnd(feeDetail.amount * 0.1)}</span>
            </div>
          )}

          <div className="flex justify-between font-semibold mb-6 text-gray-900">
            <span>Total</span>
            <span>{formatVnd(payable)}</span>
          </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <div onClick={handleCompleteOrder} className="inline-block">
              <ButtonPay />
            </div>
            <button
              onClick={() => navigate(-1)}
              className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentPage;
