import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ButtonPay from "../../components/ui/button/ButtonPayment";
import { useUser } from "../../context/UserContext";
import PayService from "../../services/PayService";
import { getFeesByConferenceId } from "../../services/ConferenceFeesService";

const RegisterPaymentPage = () => {
  const { user } = useUser();
  const userId = user?.userId;
  const userEmail = user?.email || "";
  const navigate = useNavigate();
  const location = useLocation();
  const { id: paramConferenceId } = useParams();

  const conferenceId = location.state?.conferenceId || paramConferenceId;

  const [feeDetails, setFeeDetails] = useState([]);
  const [feeDetail, setFeeDetail] = useState(null);
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ check mail FE/FPT
  const isFptAccount = /@(fpt|fe)\./i.test(userEmail);

  useEffect(() => {
    if (!conferenceId || !userId) return;

    const fetchFee = async () => {
      try {
        const fees = await getFeesByConferenceId(conferenceId);

        const visibleFees = fees.filter(f => f.isVisible);
        setFeeDetails(visibleFees);

        // chỉ lấy participation fees
        const participationFees = visibleFees.filter(f => f.feeTypeId === 2);
        if (!participationFees.length)
          throw new Error("Participation fee not found");

        if (isFptAccount) {
          // ✅ ép mode FPT Account
          const fptFee = participationFees.find(f => f.mode === "FPT Account");
          if (fptFee) {
            setFeeDetail(fptFee);
            setSelectedMode("FPT Account");
          }

          
const availableModes = participationFees
  .map(f => f.mode)
  .filter(mode => isFptAccount || mode !== "FPT Account");

setModes(availableModes);
        } else {
  const nonFptFees = participationFees.filter(f => f.mode !== "FPT Account");
  setFeeDetail(nonFptFees[0]);
  setSelectedMode(nonFptFees[0]?.mode || "");
  setModes(nonFptFees.map(f => f.mode));
}

      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFee();
  }, [conferenceId, userId, isFptAccount]);

  // khi đổi mode (nếu không phải FPT)
  useEffect(() => {
    if (!selectedMode || isFptAccount) return;
    const detail = feeDetails.find(
      f => f.feeTypeId === 2 && f.mode === selectedMode && f.isVisible
    );
    if (detail) setFeeDetail(detail);
  }, [selectedMode, feeDetails, isFptAccount]);

  if (loading) return <p className="text-center mt-8">Loading payment info...</p>;
  if (!feeDetail) return <p className="text-center mt-8">Participation fee not found.</p>;

  const originalFee = feeDetail.amount || 0;

  const formatVnd = n => Number(n || 0).toLocaleString("vi-VN") + " VND";

  const handleCompleteOrder = async () => {
    const paymentDTO = {
      UserId: userId,
      ConferenceId: conferenceId,
      PaperId: null,
      Fees: [{ FeeDetailId: feeDetail.feeDetailId, Quantity: 1 }],
      Mode: selectedMode,
    };

    try {
      const res = await PayService.createPayment(paymentDTO);
      if (res?.checkoutUrl) {
        window.location.href = res.checkoutUrl;
      } else {
        alert("Payment initiation failed!");
      }
    } catch (err) {
      console.error(err);
      alert("Payment failed!");
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Conference Registration</h2>

      <div className="space-y-6">
        {/* Purpose */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Purpose</span>
          <span className="text-gray-900">{feeDetail.feeTypeName}</span>
        </div>

        {/* Mode selector */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Mode</span>
          <select
            value={selectedMode}
            onChange={e => setSelectedMode(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-2"
            disabled={isFptAccount} // ✅ disable nếu mail @fpt/@fe
          >
            {modes.map(mode => (
              <option key={mode} value={mode}>
                {mode}
              </option>
            ))}
          </select>
        </div>
        
        {/* Payment method */}
      <div className="p-4 bg-gray-50 rounded-lg mb-6">
        <p className="font-medium mb-2 text-gray-700">Payment Method</p>
        <span className="text-gray-600">Pay via PayOS</span>
      </div>

        {/* Summary */}
        <div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4 text-gray-900">Summary</h3>
          <div className="flex justify-between mb-2 text-gray-700">
            <span>{feeDetail.feeTypeName}</span>
            <span>{formatVnd(originalFee)}</span>
          </div>

          <div className="flex justify-between font-semibold text-gray-900">
            <span>Total</span>
            <span>{formatVnd(originalFee)}</span>
          </div>
        </div>

        {/* Buttons */}
        <div className="flex justify-center gap-4 mt-4">
          <div onClick={handleCompleteOrder}>
            <ButtonPay />
          </div>
          <button
            onClick={() => navigate(-1)}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default RegisterPaymentPage;
