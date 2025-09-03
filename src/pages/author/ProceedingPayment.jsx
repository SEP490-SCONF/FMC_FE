import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonPay from "../../components/ui/button/ButtonPayment";
import PayService from '../../services/PayService';
import { useUser } from '../../context/UserContext';
import { getFeesByConferenceId } from '../../services/ConferenceFeesService';

const PaymentPage = () => {
  const { user } = useUser();
  const userId = user?.userId;
  const displayName = user?.userName || user?.fullName || user?.name || 'Unknown';
  const userEmail = user?.email || '';

  const navigate = useNavigate();
  const location = useLocation();
  const { conferenceId, feeDetailId: initFeeDetailId } = location.state || {};

  const [feeDetails, setFeeDetails] = useState([]);
  const [feeDetail, setFeeDetail] = useState(null);
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState('');
  const [loading, setLoading] = useState(true);

  const formatVnd = n => Number(n || 0).toLocaleString('vi-VN') + ' VND';

  // ✅ Nếu email có @fpt hoặc @fe thì mặc định là FPT Account
  const isFptAccount = /@fpt|@fe/i.test(userEmail);

  // Load fee details
  useEffect(() => {
    if (!conferenceId) return;

    getFeesByConferenceId(conferenceId)
      .then(fees => {
        const visibleFees = fees.filter(f => f.isVisible && f.feeTypeName === "Proceedings Access");
        setFeeDetails(visibleFees);

        let initialFee = null;

        if (isFptAccount) {
          // Nếu là FPT account → chọn luôn mode = "Student" (hoặc "FPT Account" nếu DB để vậy)
          initialFee = visibleFees.find(f => f.mode === "Student" || f.mode === "FPT Account");
        } else if (initFeeDetailId) {
          initialFee = visibleFees.find(f => f.feeDetailId === initFeeDetailId);
        }

        if (!initialFee && visibleFees.length > 0) {
          initialFee = visibleFees[0];
        }

        if (initialFee) {
          setFeeDetail(initialFee);
          setSelectedMode(initialFee.mode);

          const typeModes = visibleFees.map(f => f.mode);
          setModes([...new Set(typeModes)]);
        }
      })
      .catch(err => console.error("Error loading fees:", err))
      .finally(() => setLoading(false));
  }, [conferenceId, initFeeDetailId, isFptAccount]);

  // Update feeDetail khi đổi mode (nếu cho phép đổi)
  useEffect(() => {
    if (!selectedMode || !feeDetails.length) return;
    const newDetail = feeDetails.find(f => f.mode === selectedMode);
    if (newDetail) setFeeDetail(newDetail);
  }, [selectedMode, feeDetails]);

  const payable = feeDetail ? feeDetail.amount : 0;

  const handleCompleteOrder = async () => {
    if (!feeDetail) return;

    const paymentDTO = {
      UserId: userId,
      ConferenceId: conferenceId,
      Fees: [{ FeeDetailId: feeDetail.feeDetailId, Quantity: 1 }]
    };

    try {
      const res = await PayService.createPayment(paymentDTO);
      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        alert("Payment initiation failed!");
      }
    } catch (err) {
      console.error("Payment error:", err);
      alert("Payment failed! Check console for details.");
    }
  };

  if (loading) return <p>Loading payment info...</p>;
  if (!feeDetail) return <p>No fee detail found or missing payment info.</p>;

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">FMC Payment</h2>

      {/* Purpose */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-4">
        <span className="font-medium text-gray-700">Purpose</span>
        <span className="text-gray-900">{feeDetail.feeTypeName}</span>
      </div>

      {/* Mode selector */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-4">
        <span className="font-medium text-gray-700">Mode</span>
        {isFptAccount ? (
          // ✅ Nếu là FPT Account thì chỉ hiển thị mode cố định
          <span className="text-gray-900">{feeDetail.mode} (FPT Account)</span>
        ) : (
          <select
            value={selectedMode}
            onChange={e => setSelectedMode(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
          >
            {modes.map(mode => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Payment method */}
      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <p className="font-medium mb-2 text-gray-700">Payment Method</p>
        <span className="text-gray-600">Pay via PayOS</span>
      </div>

      {/* Summary */}
      <div className="border border-gray-200 p-6 rounded-lg bg-gray-50 mb-6">
        <h3 className="text-lg font-semibold mb-4 text-gray-900">Summary</h3>
        <div className="flex justify-between mb-3 text-gray-700">
          <span>{feeDetail.feeTypeName} Fee</span>
          <span>{formatVnd(payable)}</span>
        </div>
        <div className="flex justify-between font-semibold text-gray-900">
          <span>Total</span>
          <span>{formatVnd(payable)}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4">
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
  );
};

export default PaymentPage;
