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

const { userId, conferenceId, paperId, feeDetailId: initFeeDetailId, feeMode: initFeeMode, fees: feesToPay, includeAdditional  } = location.state || {};


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
          const fptFee = visibleFees.find(f => f.mode === "FPT Account");
          if (fptFee) {
            setFeeDetail(fptFee);
            setSelectedMode("FPT Account");
            setModes([ "FPT Account" ]); // chỉ cho hiển thị 1 mode
          }
        }
        else {
          // Normal logic cho user thường
          if (!initFeeDetailId) {
            const registrationFees = visibleFees.filter(f => f.feeTypeName === 'Registration');
            if (registrationFees.length) {
              setFeeDetail(registrationFees[0]);
              setSelectedMode(registrationFees[0].mode);
              setModes(registrationFees.map(f => f.mode));
            }
          } else {
            const detail = visibleFees.find(f => f.feeDetailId === initFeeDetailId);
            if (detail) {
              setFeeDetail(detail);
              setSelectedMode(initFeeMode || detail.mode);
              setModes(
                visibleFees
                  .filter(f => f.feeTypeName === detail.feeTypeName)
                  .map(f => f.mode)
              );
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
    <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">FMC Payment</h2>

      <div className="space-y-6">
        {/* Fee info */}
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
    disabled={isFptAccount} // ✅ disable nếu là FPT/FE
  >
    {modes.map(mode => (
      <option key={mode} value={mode}>
        {mode}
      </option>
    ))}
  </select>
</div>


        {/* Total Fee */}
        <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
          <span className="font-medium text-gray-700">Total Fee</span>
          <span className="text-gray-900">{formatVnd(feeDetail.amount)}</span>
        </div>

        {/* Payment method */}
        <div className="p-4 bg-gray-50 rounded-lg">
          <p className="font-medium mb-2 text-gray-700">Payment Method</p>
          <span className="text-gray-600">Pay via PayOS</span>
        </div>

        {/* Summary */}
<div className="border border-gray-200 p-6 rounded-lg bg-gray-50">
  <h3 className="text-lg font-semibold mb-4 text-gray-900">Summary</h3>

  <div className="flex justify-between mb-3 text-gray-700">
    <span>{feeDetail.feeTypeName} Fee</span>
    <span>{formatVnd(originalFee)}</span>
  </div>

  {additionalFee && (
    <div className="flex justify-between mb-3 text-gray-700">
      <span>Additional Pages ({additionalFee.pages} pages)</span>
      <span>{formatVnd(additionalFee.total)}</span>
    </div>
  )}

  

  <div className="flex justify-between font-semibold mb-6 text-gray-900">
    <span>Total</span>
    <span>
      {formatVnd(originalFee + (additionalFee?.total || 0))}
    </span>
  </div>

          {/* Buttons */}
          <div className="flex justify-center gap-4 mt-6">
            <div onClick={handleCompleteOrder} className="inline-block">
              <ButtonPay />
            </div>
            <button
              onClick={handleCancel}
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
