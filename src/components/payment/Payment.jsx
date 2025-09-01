import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import ButtonPay from '../../components/ui/button/ButtonPayment';
import PayService from '../../services/PayService';
import { useUser } from '../../context/UserContext';
import { getFeesByConferenceId } from '../../services/ConferenceFeesService';

const PaymentPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useUser();

const { userId, conferenceId, paperId, feeDetailId: initFeeDetailId, feeMode: initFeeMode, fees: feesToPay } = location.state || {};


  const [feeDetails, setFeeDetails] = useState([]);
  const [feeDetail, setFeeDetail] = useState(null);
  const [modes, setModes] = useState([]);
  const [selectedMode, setSelectedMode] = useState(initFeeMode || '');
  const [giftCode, setGiftCode] = useState('');
  const [loading, setLoading] = useState(true);
  const [additionalFee, setAdditionalFee] = useState(null);


  const displayName = user?.userName || user?.fullName || user?.name || 'Unknown';
  const userEmail = user?.email || '';
  const hasFptDiscount = userEmail.toLowerCase().includes('@fpt');

  useEffect(() => {
    if (!conferenceId) {
      setLoading(false);
      return;
    }

    getFeesByConferenceId(conferenceId)
      .then(res => {
        setFeeDetails(res);
        if (initFeeDetailId) {
          const detail = res.find(f => f.feeDetailId === initFeeDetailId);
          if (detail) {
            setFeeDetail(detail);
            setSelectedMode(initFeeMode || detail.mode);
            setModes(res.filter(f => f.feeTypeName === detail.feeTypeName).map(f => f.mode));
            return;
          }
        }
        // Default: Registration đầu tiên
        const registrationFees = res.filter(f => f.feeTypeName === 'Registration');
        if (registrationFees.length) {
          setFeeDetail(registrationFees[0]);
          setSelectedMode(registrationFees[0].mode);
          setModes(registrationFees.map(f => f.mode));
        }
      })
      .catch(err => console.error('Cannot load fees:', err))
      .finally(() => setLoading(false));
  }, [conferenceId, initFeeDetailId, initFeeMode]);
  

  useEffect(() => {
    if (!selectedMode) return;
    const detail = feeDetails.find(f => f.mode === selectedMode && f.feeTypeName === feeDetail?.feeTypeName);
    if (detail) setFeeDetail(detail);
  }, [selectedMode, feeDetails, feeDetail?.feeTypeName]);

  const formatVnd = (n) => Number(n || 0).toLocaleString('vi-VN') + ' VND';

  if (loading) return <p>Loading payment info...</p>;
  if (!feeDetail) return <p>No fee detail found</p>;

  const originalFee = feeDetail.amount || 0;
  const discountAmount = hasFptDiscount ? Math.round(originalFee * 0.1) : 0;
  const payable = originalFee - discountAmount;

  const handleCompleteOrder = async () => {
    const description = `${displayName} - ${feeDetail.feeTypeName}`.slice(0, 25);

    const paymentData = {
      userId,
      conferenceId,
      paperId,
      amount: payable,
      currency: feeDetail.currency || 'VND',
      purpose: description,
      feeDetailId: feeDetail.feeDetailId,
      giftCode: giftCode || undefined,
    };

    try {
      const res = await PayService.createPayment(paymentData);
      if (res.checkoutUrl) {
        // Lưu paperId + feeTypeName để PaymentSuccess biết cập nhật trạng thái
        if (paperId) {
          localStorage.setItem('paymentPaperId', paperId);
          localStorage.setItem('paymentFeeType', feeDetail.feeTypeName);
        }
        window.location.href = res.checkoutUrl;
      }
    } catch (err) {
      alert('Payment failed!');
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
          >
            {modes.map(mode => (
              <option key={mode} value={mode}>{mode}</option>
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
            <span>Subtotal</span>
            <span>{formatVnd(originalFee)}</span>
          </div>

          {hasFptDiscount && (
            <div className="flex justify-between mb-3 text-gray-700">
              <span>FPT discount (10%)</span>
              <span className="text-green-600">-{formatVnd(discountAmount)}</span>
            </div>
          )}

          <div className="flex justify-between font-semibold mb-6 text-gray-900">
            <span>Total</span>
            <span>{formatVnd(payable)}</span>
          </div>

          {/* Gift code */}
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2 text-gray-700">Gift code</label>
            <div className="flex">
              <input
                type="text"
                value={giftCode}
                onChange={e => setGiftCode(e.target.value)}
                className="border border-gray-300 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => {}}
                className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition duration-200"
              >
                Apply
              </button>
            </div>
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
