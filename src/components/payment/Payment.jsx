import React, { useState } from 'react';
import ButtonPay from '../ui/button/ButtonPayment';
import PaymentService from '../../services/PayService';
import { useUser } from '../../context/UserContext';

const PURPOSE_OPTIONS = [
    { value: 'publish fee', label: 'publish' },
    { value: 'review fee', label: 'review' },
    { value: 'other fee', label: 'Other' }
];

const FEE_OPTIONS = [
    { value: 500000, label: '500,000 VND' },
    { value: 300000, label: '300,000 VND' },
    { value: 10000, label: '10,000 VND' }
];

const PaymentPage = ({ userId, conferenceId, paperId }) => {
    const { user } = useUser(); // Get user from context
    const displayName = user?.userName || user?.fullName || user?.name || 'Unknown';

    const [giftCode, setGiftCode] = useState('');
    const [purpose, setPurpose] = useState(PURPOSE_OPTIONS[0].value);
    const [fee, setFee] = useState(FEE_OPTIONS[0].value);

    const handleGiftCodeApply = () => {
        // console.log('Applying gift code:', giftCode);
    };

    const formatVnd = (n) => {
        if (n === null || n === undefined) return '0';
        return Number(n).toLocaleString('vi-VN') + ' VND';
    };

    const userEmail = (user && (user.email || user.mail || user.emailAddress)) || '';
    const hasFptDiscount = userEmail.toLowerCase().includes('@fpt');

    const originalFee = Number(fee) || 0;
    const discountAmount = hasFptDiscount ? Math.round(originalFee * 0.10) : 0;
    const payable = originalFee - discountAmount;

    const handleCompleteOrder = async () => {
        const selectedPurposeLabel = PURPOSE_OPTIONS.find(opt => opt.value === purpose)?.label || purpose;
        // Truncate description to 25 characters
        const description = `${displayName} - ${selectedPurposeLabel}`.slice(0, 25);

        const paymentData = {
            userId,
            conferenceId,
            paperId,
            amount: payable,
            currency: 'VND',
            purpose: description, // Use truncated description
            giftCode: giftCode || undefined
        };

        try {
            const res = await PaymentService.createPayment(paymentData);
            if (res.checkoutUrl) {
                if (paperId) {
                    localStorage.setItem("paymentPaperId", paperId);
                }
                window.location.href = res.checkoutUrl;
            }
        } catch (err) {
            alert('Payment failed!');
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-lg rounded-xl border border-gray-200">
            <h2 className="text-2xl font-bold mb-6 text-gray-900">FMC Payment</h2>
            <div className="space-y-8">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Purpose</span>
                    <div className="flex items-center space-x-4">
                        <select
                            value={purpose}
                            onChange={e => setPurpose(e.target.value)}
                            className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {PURPOSE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-600">User: <strong className="text-gray-900">{displayName}</strong></span>
                    </div>
                </div>

                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                    <span className="font-medium text-gray-700">Total Fee</span>
                    <select
                        value={fee}
                        onChange={e => setFee(Number(e.target.value))}
                        className="border border-gray-300 rounded-md px-3 py-2 text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {FEE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div className="p-4 bg-gray-50 rounded-lg">
                    <p className="font-medium mb-3 text-gray-700">Payment Method</p>
                    <div className="flex items-center space-x-3">
                        <span className="text-gray-600">Pay via PayOS</span>
                    </div>
                </div>

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

                    <div className="flex justify-between mb-3 text-gray-700">
                        <span>Est. Taxes</span>
                        <span>0 VND</span>
                    </div>

                    <div className="mb-4">
                        <label className="block text-sm font-medium mb-2 text-gray-700">Gift code</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={giftCode}
                                onChange={(e) => setGiftCode(e.target.value)}
                                className="border border-gray-300 rounded-l-md px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleGiftCodeApply}
                                className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700 transition duration-200"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between font-semibold mb-6 text-gray-900">
                        <span>Total</span>
                        <span>{formatVnd(payable)}</span>
                    </div>

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