import React, { useState, useEffect } from 'react';

/**
 * Modal component for recording payments made to salesmen (e.g., commissions, salaries).
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Closes the modal.
 * @param {Function} props.onAddPayment - Callback receiving the payment object.
 * @param {Array} props.salesmen - List of available salesmen.
 * @param {string} [props.preselectedSalesmanId] - Optional MongoDB _id to default the selection.
 */
const AddSalesmanPaymentModal = ({ isOpen, onClose, onAddPayment, salesmen, preselectedSalesmanId }) => {
    const [salesmanId, setSalesmanId] = useState('');
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [notes, setNotes] = useState('');

    const resetForm = () => {
        setSalesmanId('');
        setDate(new Date().toISOString().split('T')[0]);
        setAmount('');
        setPaymentMethod('Cash');
        setNotes('');
    };

    /**
     * Effect: Reset form and handle pre-selection when the modal opens.
     */
    useEffect(() => {
        if (isOpen) {
            resetForm();
            if (preselectedSalesmanId) {
                // Ensure ID is passed as string to match MongoDB object structure
                setSalesmanId(preselectedSalesmanId.toString());
            }
        }
    }, [isOpen, preselectedSalesmanId]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!salesmanId || !amount) {
            alert('Please select a salesman and enter an amount.');
            return;
        }

        // For your MongoDB setup, treating this payment as an "Expense" where ownerType is 'salesman'
        const newPayment = {
            ownerId: salesmanId,
            ownerType: 'salesman',
            date: new Date(date).toISOString(),
            amount: Number(amount),
            paymentMethod,
            notes,
            // Assuming your backend might map this to the generic Expense model
            category: 'Salesman Payment',
            name: `Payment to Salesman`,
            description: notes || 'Commission or salary payout',
        };

        onAddPayment(newPayment);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-brand-text-primary">Record Salesman Payment</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="payment-salesman" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Salesman
                        </label>
                        <select
                            id="payment-salesman"
                            value={salesmanId}
                            onChange={e => setSalesmanId(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm cursor-pointer transition-all"
                        >
                            <option value="" disabled>-- Select a salesman --</option>
                            {salesmen.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="payment-date" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Payment Date
                        </label>
                        <input 
                            type="date" 
                            id="payment-date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>

                     <div>
                        <label htmlFor="payment-amount" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Amount (PKR)
                        </label>
                        <input 
                            type="number" 
                            id="payment-amount" 
                            value={amount} 
                            onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} 
                            required 
                            min="1" 
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>

                     <div>
                        <label htmlFor="payment-method-salesman" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Payment Method
                        </label>
                        <select 
                            id="payment-method-salesman" 
                            value={paymentMethod} 
                            onChange={e => setPaymentMethod(e.target.value)} 
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 bg-white rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm cursor-pointer transition-all"
                        >
                            <option value="Cash">Cash Drawer</option>
                            <option value="Bank">Bank Account Transfer</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="payment-notes" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Notes (optional)
                        </label>
                        <textarea
                            id="payment-notes"
                            value={notes}
                            onChange={e => setNotes(e.target.value)}
                            rows={3}
                            placeholder="e.g., Salary advance, October commission payout..."
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                        />
                    </div>

                    <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100 mt-4">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 bg-gray-100 text-brand-text-secondary rounded-lg hover:bg-gray-200 font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-lightblue font-bold shadow-md transition-all active:scale-95"
                        >
                            Record Payout
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSalesmanPaymentModal;