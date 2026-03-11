import React, { useState } from 'react';

/**
 * Modal to quickly clear a customer's total outstanding balance.
 * Useful for bulk payments or end-of-month settlements.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Close callback.
 * @param {Function} props.onConfirm - Callback receiving the payment method ('Cash' | 'Bank').
 * @param {Object|null} props.customer - The customer object whose balance is being cleared.
 */
const MarkAsPaidModal = ({ isOpen, onClose, onConfirm, customer }) => {
    // Initializing state without TypeScript union types
    const [paymentMethod, setPaymentMethod] = useState('Cash');

    // Early return if modal shouldn't be visible
    if (!isOpen || !customer) return null;

    const handleConfirm = () => {
        onConfirm(paymentMethod);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brand-text-primary">Clear Outstanding Balance</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>

                {/* Status Message */}
                <p className="text-brand-text-secondary mb-6">
                    You are clearing an outstanding balance of <span className="font-bold text-yellow-600">PKR {customer.totalBalance.toLocaleString()}</span> for <span className="font-bold text-brand-text-primary">{customer.name}</span>. This will be recorded as a full payment.
                </p>

                

                {/* Payment Method Selector */}
                <div className="mb-6">
                    <label htmlFor="payment-method-clear" className="block text-sm font-medium text-brand-text-secondary">
                        Payment Method
                    </label>
                    <select
                        id="payment-method-clear"
                        value={paymentMethod}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                    >
                        <option value="Cash">Cash</option>
                        <option value="Bank">Bank Transfer</option>
                    </select>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300 font-semibold transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 font-semibold transition-colors shadow-md active:scale-95"
                    >
                        Confirm Payment
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MarkAsPaidModal;