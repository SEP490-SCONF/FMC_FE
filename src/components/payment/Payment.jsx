import React, { useState } from 'react';
import ButtonPay from '../ui/button/ButtonPayment';

const PaymentPage = () => {
    const [giftCode, setGiftCode] = useState('');

    const handleGiftCodeApply = () => {
        // Logic to apply gift code
        console.log('Applying gift code:', giftCode);
    };

    const handleCompleteOrder = () => {
        // Logic to process payment and complete order with PayOS
        console.log('Redirecting to PayOS checkout...');
        // Example: window.location.href = checkoutUrlFromBackend;
    };

    return (
        <div className="max-w-2xl mx-auto p-6 bg-white shadow-md rounded-xl">
            <h2 className="text-2xl font-bold mb-4">FMC Payment</h2>

            <div className="space-y-6">
                <div className="flex justify-between items-center">
                    <span className="font-medium">Purpose</span>
                    <span className="text-gray-700">Pay the publishing fee</span>
                </div>

                <div className="flex justify-between items-center">
                    <span className="font-medium">Total Fee</span>
                    <span className="text-gray-700">500,000 VND</span>
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
                        <span>500,000 VND</span>
                    </div>
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
                        <span>500,000 VND</span>
                    </div>

                    <div onClick={handleCompleteOrder} className="text-center mt-4">
                        <ButtonPay />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentPage;