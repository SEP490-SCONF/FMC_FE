import React, { useState } from 'react';
import ButtonPay from '../ui/button/ButtonPayment';
import PaymentService from '../../services/PayService';

const PURPOSE_OPTIONS = [
    { value: 'publish', label: 'Pay the publishing fee' },
    { value: 'review', label: 'Pay the review fee' },
    { value: 'other', label: 'Other fee' }
];

const FEE_OPTIONS = [
    { value: 500000, label: '500,000 VND' },
    { value: 300000, label: '300,000 VND' },
    { value: 10000, label: '10,000 VND' }
];

const PaymentPage = ({ userId, conferenceId, paperId }) => {
    const [giftCode, setGiftCode] = useState('');
    const [purpose, setPurpose] = useState(PURPOSE_OPTIONS[0].value);
    const [fee, setFee] = useState(FEE_OPTIONS[0].value);

    const handleGiftCodeApply = () => {
        console.log('Applying gift code:', giftCode);
    };

    const handleCompleteOrder = async () => {
        const paymentData = {
            userId,
            conferenceId,
            paperId,
            amount: fee,
            currency: 'VND',
            purpose,
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

    return (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow p-6 space-y-6">
            {/* Header */}
            <div>
                <h2 className="text-2xl font-bold">
                    FMC Payment
                </h2>
                <p className="text-gray-500 text-sm">
                    Complete your payment for conference services
                </p>
            </div>

            {/* Payment Purpose */}
            <div>
                <label className="block text-sm font-medium mb-1">Payment Purpose</label>
                <select
                    value={purpose}
                    onChange={(e) => setPurpose(e.target.value)}
                    className="w-full border rounded-lg px-3 py-2"
                >
                    {PURPOSE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Fee Amount */}
            <div>
                <label className="block text-sm font-medium mb-1">Fee Amount</label>
                <select
                    value={fee}
                    onChange={(e) => setFee(Number(e.target.value))}
                    className="w-full border rounded-lg px-3 py-2"
                >
                    {FEE_OPTIONS.map(opt => (
                        <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                </select>
            </div>

            {/* Payment Method */}
            <div>
                <label className="block text-sm font-medium mb-1">Payment Method</label>
                <div className="flex items-center justify-between border rounded-lg px-4 py-3 h-16">
                    <span className="flex items-center gap-3 h-full">
                        <img
                            src="/payOS-logo.jpg"
                            alt="PayOS Logo"
                            className="h-15 w-15 rounded-full object-cover"
                        />
                    </span>
                    <span className="text-gray-500 text-sm border px-3 py-1 rounded">Secure</span>
                </div>
            </div>



            {/* Order Summary */}
            <div className="border rounded-lg p-4 space-y-4 bg-gray-50">
                <h3 className="font-semibold text-lg">Order Summary</h3>
                <div className="flex justify-between text-sm">
                    <span>Purpose:</span>
                    <span>{PURPOSE_OPTIONS.find(p => p.value === purpose)?.label}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Subtotal:</span>
                    <span>{fee.toLocaleString()} VND</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span>Est. Taxes:</span>
                    <span>0 VND</span>
                </div>

                {/* Gift code */}
                <div>
                    <label className="block text-sm font-medium mb-1">Gift Code</label>
                    <div className="flex">
                        <input
                            type="text"
                            value={giftCode}
                            onChange={(e) => setGiftCode(e.target.value)}
                            className="border rounded-l px-3 py-1 w-full"
                            placeholder="Enter gift code"
                        />
                        <button
                            onClick={handleGiftCodeApply}
                            className="bg-gray-200 px-4 py-1 rounded-r"
                        >
                            Apply
                        </button>
                    </div>
                </div>

                {/* Total */}
                <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>{fee.toLocaleString()} VND</span>
                </div>

                {/* Complete Payment */}
                <button
                    onClick={handleCompleteOrder}
                    className="w-full bg-black text-white py-2 rounded-lg"
                >
                    Complete Payment
                </button>
            </div>
        </div>
    );
};

export default PaymentPage;
