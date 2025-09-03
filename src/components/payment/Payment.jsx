import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonPay from '../../components/ui/button/ButtonPayment';
import PayService from '../../services/PayService';
import { useUser } from '../../context/UserContext';
import { getFeesByConferenceId } from '../../services/ConferenceFeesService';
import { getPaperPageCount } from '../../services/PaperSerice';


const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

const { userId, conferenceId, paperId, feeDetailId: initFeeDetailId, feeMode: initFeeMode, fees: feesToPay, includeAdditional,paymentType   } = location.state || {};


  const [feeDetails, setFeeDetails] = useState([]);
  const [feeDetail, setFeeDetail] = useState(null);
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(initFeeMode || '');
  const [loading, setLoading] = useState(true);
  const [additionalFee, setAdditionalFee] = useState(null);


  const displayName = user?.userName || user?.fullName || user?.name || 'Unknown';
    const userEmail = user?.email || '';
  const isFptAccount =
    userEmail.toLowerCase().includes('@fpt') ||
    userEmail.toLowerCase().includes('@fe');


  
  useEffect(() => {
    if (!conferenceId || !paperId) return;

    Promise.all([
      getFeesByConferenceId(conferenceId),
      getPaperPageCount(paperId)
    ])
      .then(([fees, pageCount]) => {
        const visibleFees = fees.filter(f => f.isVisible);
        setFeeDetails(visibleFees);

        // Nếu user là FPT/FE thì fix mode = FPT Account
        if (isFptAccount) {
  if (paymentType === "Publish") {
    const fptFee = visibleFees.find(
      f => f.mode === "FPT Account" && f.feeTypeName === "Registration"
    );
    if (fptFee) {
      setFeeDetail(fptFee);
      setSelectedMode("FPT Account");
      setModes(["FPT Account"]);
    }
  } else if (paymentType === "Presentation") {
    const fptFee = visibleFees.find(
      f => f.mode === "FPT Account" && f.feeTypeName === "Presentation"
    );
    if (fptFee) {
      setFeeDetail(fptFee);
      setSelectedMode("FPT Account");
      setModes(["FPT Account"]);
    }
  }
}

        else {
  if (paymentType === "Publish") {
    const registrationFees = visibleFees.filter(f => f.feeTypeName === "Registration");
    if (registrationFees.length) {
      setFeeDetail(registrationFees[0]);
      setSelectedMode(registrationFees[0].mode);
      setModes(registrationFees.map(f => f.mode));
    }
  } else if (paymentType === "Presentation") {
    const presentationFees = visibleFees.filter(f => f.feeTypeName === "Presentation");
    if (presentationFees.length) {
      const chosen = initFeeDetailId
        ? presentationFees.find(f => f.feeDetailId === initFeeDetailId)
        : presentationFees[0];
      if (chosen) {
        setFeeDetail(chosen);
        setSelectedMode(chosen.mode);
        setModes(presentationFees.map(f => f.mode));
      }
    }
  }
}


        // Additional Page Fee
        if (includeAdditional) {
          const addFee = visibleFees.find(f => f.feeTypeName === 'Additional Page');
          if (addFee && pageCount > 5) {
            const excessPages = pageCount - 5;
            setAdditionalFee({
              ...addFee,
              total: addFee.amount * excessPages,
              pages: excessPages
            });
          }
        }
      })
      .catch(err => console.error('Error loading fees:', err))
      .finally(() => setLoading(false));
  }, [conferenceId, paperId, initFeeDetailId, initFeeMode, isFptAccount, includeAdditional]);


  useEffect(() => {
  if (paymentType === "Publish") {
    // Logic cho Registration + Additional Page
  } else if (paymentType === "Presentation") {
    // Logic riêng cho Presentation
  }
}, [paymentType]);

  useEffect(() => {
  if (!selectedMode) return;

  // Ưu tiên theo feeDetailId được truyền vào từ state
  if (initFeeDetailId) {
    const detail = feeDetails.find(f => f.feeDetailId === initFeeDetailId);
    if (detail) {
      setFeeDetail(detail);
      return;
    }
  }

  // Nếu không có thì fallback theo mode như cũ
  const detail = feeDetails.find(
    f => f.mode === selectedMode && f.feeTypeName === feeDetail?.feeTypeName
  );
  if (detail) setFeeDetail(detail);
}, [selectedMode, feeDetails, feeDetail?.feeTypeName, initFeeDetailId]);


  const formatVnd = (n) => Number(n || 0).toLocaleString('vi-VN') + ' VND';

  if (loading) return <p>Loading payment info...</p>;
  if (!feeDetail) return <p>No fee detail found</p>;

  const originalFee = feeDetail.amount || 0;

  const handleCompleteOrder = async () => {
  const originalFee = feeDetail.amount || 0;

  // danh sách phí gửi sang backend
  const fees = [
    {
      feeDetailId: feeDetail.feeDetailId, // Registration
      quantity: 1,
    },
  ];

  // nếu có phí trang thêm
  if (additionalFee) {
    fees.push({
      feeDetailId: additionalFee.feeDetailId,
      quantity: additionalFee.pages, // số trang vượt
    });
  }

  // TODO: nếu có thêm loại phí khác như Proceedings thì push tiếp ở đây

  const paymentData = {
    conferenceId,
    paperId,
    fees,
  };

  try {
    const res = await PayService.createPayment(paymentData);
    if (res.checkoutUrl) {
      if (paperId) {
        localStorage.setItem("paymentPaperId", paperId);
        localStorage.setItem("paymentFeeType", feeDetail.feeTypeName);
      }
      window.location.href = res.checkoutUrl;
    }
  } catch (err) {
    alert("Payment failed!");
  }
};



  const handleCancel = () => navigate(-1);

  return (
  <div className="max-w-2xl mx-auto p-6 bg-white shadow-xl rounded-2xl border border-gray-100">
    {/* Header */}
    <h2 className="text-center text-2xl font-extrabold mb-6 text-gray-900">
      💳 FMC Payment
    </h2>

    <div className="space-y-6">
      {/* Purpose */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-600 font-medium">Purpose</span>
        <span className="text-gray-900 font-semibold">{feeDetail.feeTypeName}</span>
      </div>

      {/* Mode */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-600 font-medium">Mode</span>
        <select
  value={selectedMode}
  onChange={(e) => setSelectedMode(e.target.value)}
  className="border border-gray-300 rounded-lg px-3 py-2 text-sm text-gray-800 focus:ring-2 focus:ring-blue-400 transition"
>
  {modes
    .filter(mode => isFptAccount || mode !== "FPT Account") // 👈 bỏ nếu ko phải FPT/FE
    .map((mode) => (
      <option key={mode} value={mode}>
        {mode}
      </option>
    ))}
</select>

      </div>

      {/* Base Fee */}
      <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
        <span className="text-gray-600 font-medium">Base Fee</span>
        <span className="text-gray-900 font-semibold">{formatVnd(feeDetail.amount)}</span>
      </div>

      {/* Method */}
      <div className="p-4 bg-gray-50 rounded-lg">
        <p className="text-gray-600 font-medium mb-1">Method</p>
        <span className="text-gray-800 font-semibold">Pay via PayOS</span>
      </div>

      {/* Summary */}
      <div className="border border-gray-200 p-6 rounded-xl bg-gradient-to-br from-gray-50 to-white">
        <h3 className="text-lg font-bold mb-4 text-gray-900">Summary</h3>

        <div className="flex justify-between mb-2 text-gray-700">
          <span>{feeDetail.feeTypeName} Fee</span>
          <span>{formatVnd(originalFee)}</span>
        </div>

        {additionalFee && (
          <div className="flex justify-between mb-2 text-gray-700">
            <span>Additional Pages ({additionalFee.pages})</span>
            <span>{formatVnd(additionalFee.total)}</span>
          </div>
        )}

        <div className="flex justify-between text-lg font-bold mt-4 text-green-700">
          <span>Total</span>
          <span>{formatVnd(originalFee + (additionalFee?.total || 0))}</span>
        </div>
      </div>

      {/* Buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={handleCompleteOrder}
          className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-2 rounded-lg font-semibold shadow hover:opacity-90 transition"
        >
          Pay Now
        </button>
        <button
          onClick={handleCancel}
          className="border border-gray-300 text-gray-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition"
        >
          Cancel
        </button>
      </div>
    </div>
  </div>
);


};

export default PaymentPage;
