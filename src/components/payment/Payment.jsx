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
        console.log('Applying gift code:', giftCode);
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
            const checkoutUrl = res?.data?.checkoutUrl || res?.checkoutUrl || res;
            if (checkoutUrl) {
                window.location.href = checkoutUrl;
            } else {
                alert('Payment created but no checkout URL returned.');
            }
        } catch (err) {
            console.error('Payment error', err);
            alert(`Payment failed! ${err.message || 'Please check your input or contact support.'}`);
        }
    };

    const handleCancel = () => {
        window.history.back();
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-4">FMC Payment</h2>
            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Purpose</span>
                    <div className="flex items-center space-x-3">
                        <select
                            value={purpose}
                            onChange={e => setPurpose(e.target.value)}
                            className="border rounded px-2 py-1"
                        >
                            {PURPOSE_OPTIONS.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                        <span className="text-sm text-gray-600">User: <strong>{displayName}</strong></span>
                    </div>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-medium">Total Fee</span>
                    <select
                        value={fee}
                        onChange={e => setFee(Number(e.target.value))}
                        className="border rounded px-2 py-1"
                    >
                        {FEE_OPTIONS.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <p className="font-medium mb-2">Payment Method</p>
                    <div className="flex items-center space-x-2">
                        <span className="text-gray-600">Pay via PayOS</span>
                    </div>
                </div>

                <div className="border p-4 rounded-md bg-gray-50">
                    <h3 className="text-lg font-semibold mb-3">Summary</h3>

                    <div className="flex justify-between mb-2">
                        <span>Subtotal</span>
                        <span>{formatVnd(originalFee)}</span>
                    </div>

                    {hasFptDiscount && (
                        <div className="flex justify-between mb-2">
                            <span>FPT discount (10%)</span>
                            <span>-{formatVnd(discountAmount)}</span>
                        </div>
                    )}

                    <div className="flex justify-between mb-2">
                        <span>Est. Taxes</span>
                        <span>0 VND</span>
                    </div>

                    <div className="mb-2">
                        <label className="block text-sm font-medium mb-1">Gift code</label>
                        <div className="flex">
                            <input
                                type="text"
                                value={giftCode}
                                onChange={(e) => setGiftCode(e.target.value)}
                                className="border rounded-l px-3 py-1 w-full"
                            />
                            <button
                                onClick={handleGiftCodeApply}
                                className="bg-blue-600 text-white px-4 py-1 rounded-r"
                            >
                                Apply
                            </button>
                        </div>
                    </div>

                    <div className="flex justify-between font-semibold mb-2">
                        <span>Total</span>
                        <span>{formatVnd(payable)}</span>
                    </div>

                    <div className="text-center mt-4">
                        <div onClick={handleCompleteOrder} className="inline-block mr-2">
                            <ButtonPay />
                        </div>
                        <button
                            onClick={handleCancel}
                            className="bg-gray-500 text-white px-4 py-2 rounded"
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