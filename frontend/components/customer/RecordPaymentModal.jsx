
import React, { useState, useEffect } from 'react';

/**
 * Modal component for recording a partial or full payment from a customer.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Closes the modal.
 * @param {Object|null} props.customer - The customer object receiving the payment.
 * @param {Function} props.onConfirm - Callback: (customerId, amount, paymentMethod, date).
 */
const RecordPaymentModal = ({ isOpen, onClose, customer, onConfirm }) => {
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [error, setError] = useState('');
    
    // Reset form state when the modal opens/closes
    useEffect(() => {
        if (isOpen && customer) {
            // Auto-fill amount with total balance as a convenience
            setAmount(customer.totalBalance > 0 ? customer.totalBalance : '');
            setPaymentMethod('Cash');
            setDate(new Date().toISOString().split('T')[0]);
            setError('');
        }
    }, [isOpen, customer]);

    // Safety check for conditional rendering
    if (!isOpen || !customer) return null;

    const handleConfirm = () => {
        const numAmount = Number(amount);
        
        if (numAmount <= 0) {
            setError("Please enter a valid payment amount.");
            return;
        }
        
        // Prevent recording more than the actual debt
        if (numAmount > customer.totalBalance) {
            setError(`Payment cannot be greater than the outstanding balance of PKR ${customer.totalBalance.toLocaleString()}.`);
            return;
        }

        setError('');
        // Support both MongoDB _id and local id formats
        const targetId = customer._id || customer.id;
        onConfirm(targetId, numAmount, paymentMethod, date);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-text-primary">Record Payment</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                

                <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
                    <p className="text-sm text-brand-text-secondary mb-1">
                        Recording payment for:
                    </p>
                    <p className="text-lg font-bold text-brand-text-primary truncate">
                        {customer.name}
                    </p>
                    <div className="mt-2 pt-2 border-t border-blue-200 flex justify-between items-center">
                        <span className="text-xs font-bold text-brand-text-secondary uppercase">Current Debt:</span>
                        <span className="font-bold text-yellow-600">PKR {customer.totalBalance.toLocaleString()}</span>
                    </div>
                </div>
                
                <form 
                    onSubmit={(e) => { e.preventDefault(); handleConfirm(); }} 
                    className="space-y-4"
                >
                    <div>
                        <label htmlFor="payment-date" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Payment Date
                        </label>
                        <input
                            type="date"
                            id="payment-date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="amount-paid" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Amount Paid (PKR)
                        </label>
                        <input
                            type="number"
                            id="amount-paid"
                            value={amount}
                            onChange={(e) => setAmount(e.target.value === '' ? '' : Number(e.target.value))}
                            required
                            min="1"
                            max={customer.totalBalance}
                            placeholder="Enter amount"
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="payment-method-record" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Payment Method
                        </label>
                        <select
                            id="payment-method-record"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank Transfer / Cheque</option>
                        </select>
                    </div>

                    {error && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-3 rounded-md mt-2">
                            <p className="text-red-700 text-sm font-medium">{error}</p>
                        </div>
                    )}

                    <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 bg-gray-100 text-brand-text-secondary rounded-lg hover:bg-gray-200 font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md transition-all active:scale-95"
                        >
                            Confirm Payment
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordPaymentModal;