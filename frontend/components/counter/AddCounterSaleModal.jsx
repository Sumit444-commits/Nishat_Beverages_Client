import React, { useState, useEffect } from 'react';

/**
 * Modal component for recording custom sales made directly at the plant counter.
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility state.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onAddSale - Callback to save the new sale to MongoDB.
 * @param {Array} props.inventory - List of available inventory items fetched from the backend.
 */
const AddCounterSaleModal = ({user, isOpen, onClose, onAddSale, inventory }) => {
    // State
    const [selectedInventoryItemId, setSelectedInventoryItemId] = useState(''); // 'manual' or item._id
    const [quantity, setQuantity] = useState(1);
    const [manualAmount, setManualAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

    // Derived values
    const isManualEntry = selectedInventoryItemId === 'manual';
    // Using _id or id depending on what the backend returned
    const selectedItem = inventory.find(i => (i._id === selectedInventoryItemId || i.id === selectedInventoryItemId));
    const amount = isManualEntry ? Number(manualAmount) : (selectedItem?.sellingPrice || 0) * quantity;

    // Reset form when opened
    useEffect(() => {
        if (isOpen) {
            setSelectedInventoryItemId('');
            setQuantity(1);
            setManualAmount('');
            setPaymentMethod('Cash');
            setSaleDate(new Date().toISOString().split('T')[0]);
        }
    }, [isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!selectedInventoryItemId) {
            alert("Please select an item or choose manual entry.");
            return;
        }

        if (isManualEntry && (amount <= 0)) {
            alert("Please enter a valid amount for manual sale.");
            return;
        }

        // Construct the payload expected by your Express `/sales` POST route
        const newSale = {
            salesmanId: null,
            customerId: user.id,
            inventoryItemId: isManualEntry ? null : selectedInventoryItemId, // Pass string _id
            quantity: isManualEntry ? 0 : quantity,
            emptiesCollected: 0,
            amount: amount,
            amountReceived: amount, // Counter sales are assumed paid in full immediately
            date: new Date(saleDate).toISOString(),
            paymentMethod: paymentMethod,
            description: isManualEntry ? 'Manual/Custom Sale' : undefined,
        };
        
        onAddSale(newSale);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-text-primary">Add Custom Counter Sale</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="counter-sale-date" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Sale Date
                        </label>
                        <input
                            type="date"
                            id="counter-sale-date"
                            value={saleDate}
                            onChange={e => setSaleDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                        />
                        <p className="mt-1 text-xs text-brand-text-secondary italic">
                            Backdate allowed for missed entries.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="counter-item-select" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Item
                        </label>
                        <select 
                            id="counter-item-select" 
                            value={selectedInventoryItemId} 
                            onChange={e => setSelectedInventoryItemId(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                        >
                            <option value="" disabled>-- Select an option --</option>
                            <option value="manual" className="font-bold text-brand-blue">
                                + Add Manual/Custom Entry
                            </option>
                            {inventory.map(i => (
                                <option key={i._id || i.id} value={i._id || i.id}>
                                    {i.name} (PKR {i.sellingPrice}) - {i.stock} in stock
                                </option>
                            ))}
                        </select>
                    </div>

                    {isManualEntry ? (
                        <div className="animate-fade-in p-3 bg-gray-50 border border-gray-200 rounded-md">
                            <label htmlFor="manual-amount" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                                Custom Amount (PKR)
                            </label>
                            <input 
                                type="number" 
                                id="manual-amount" 
                                value={manualAmount} 
                                onChange={e => setManualAmount(e.target.value === '' ? '' : Number(e.target.value))} 
                                required 
                                min="1" 
                                placeholder="e.g. 500"
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                    ) : (
                        <div className="animate-fade-in">
                            <label htmlFor="counter-quantity" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                                Quantity
                            </label>
                            <input 
                                type="number" 
                                id="counter-quantity" 
                                value={quantity} 
                                onChange={e => setQuantity(Number(e.target.value))} 
                                required 
                                min="1" 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                    )}
                    
                    <div>
                        <label htmlFor="payment-method-counter" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Payment Method
                        </label>
                        <select
                            id="payment-method-counter"
                            value={paymentMethod}
                            onChange={(e) => setPaymentMethod(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                        >
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank Transfer / Card</option>
                        </select>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200 mt-2">
                        <p className="text-xl font-black text-right text-brand-blue">
                            Total: PKR {amount.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex justify-end pt-2 space-x-3">
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
                            Confirm Sale
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCounterSaleModal;