// import React, { useState, useEffect } from 'react';

// /**
//  * Modal component for editing existing sales records.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls visibility.
//  * @param {Function} props.onClose - Function to close the modal.
//  * @param {Function} props.onUpdateSale - Callback that receives the updated sale object.
//  * @param {Object|null} props.sale - The existing sale object to populate the form.
//  * @param {Array} props.customers - List of all customers for re-assignment.
//  * @param {Array} props.salesmen - List of available salesmen.
//  * @param {Array} props.inventory - List of inventory items for pricing lookup.
//  */
// const EditSaleModal = ({ isOpen, onClose, onUpdateSale, sale, customers, salesmen, inventory }) => {
//     // TypeScript union types and generics removed
//     const [selectedCustomerId, setSelectedCustomerId] = useState('');
//     const [selectedInventoryItemId, setSelectedInventoryItemId] = useState('');
//     const [quantity, setQuantity] = useState(1);
//     const [unitPrice, setUnitPrice] = useState('');
//     const [emptiesCollected, setEmptiesCollected] = useState(0);
//     const [paymentMethod, setPaymentMethod] = useState('Pending');
//     const [salesmanId, setSalesmanId] = useState('');
//     const [amountReceived, setAmountReceived] = useState('');
//     const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

//     // Derived total amount calculated on every render
//     const amount = (Number(unitPrice) || 0) * quantity;

//     const resetForm = () => {
//         setSelectedCustomerId('');
//         setSelectedInventoryItemId('');
//         setQuantity(1);
//         setUnitPrice('');
//         setEmptiesCollected(0);
//         setPaymentMethod('Pending');
//         setSalesmanId('');
//         setAmountReceived('');
//         setSaleDate(new Date().toISOString().split('T')[0]);
//     };

//     /**
//      * Effect: Populate form fields when the modal opens with a specific sale
//      */
//     useEffect(() => {
//         if (isOpen && sale) {
//             setSelectedCustomerId(sale.customerId?.toString() || '');
//             setSelectedInventoryItemId(sale.inventoryItemId?.toString() || '');
//             setQuantity(sale.quantity);
//             // Calculating original unit price from total and quantity
//             setUnitPrice(sale.amount / sale.quantity);
//             setEmptiesCollected(sale.emptiesCollected);
//             setPaymentMethod(sale.paymentMethod);
//             setSalesmanId(sale.salesmanId?.toString() || '');
//             setAmountReceived(sale.amountReceived);
//             setSaleDate(new Date(sale.date).toISOString().split('T')[0]);
//         } else if (!isOpen) {
//             resetForm();
//         }
//     }, [isOpen, sale]);

//     /**
//      * Effect: Auto-assign unit price from inventory if an item is selected and price is empty
//      */
//     useEffect(() => {
//         const selectedItem = inventory.find(i => i.id === Number(selectedInventoryItemId));
//         if (selectedItem && !unitPrice) {
//             setUnitPrice(selectedItem.sellingPrice);
//         }
//     }, [selectedInventoryItemId, inventory, unitPrice]);

//     /**
//      * Effect: Auto-adjust amount received based on payment status
//      */
//     useEffect(() => {
//         if (paymentMethod === 'Pending') {
//             setAmountReceived(0);
//         } else {
//             setAmountReceived(amount);
//         }
//     }, [paymentMethod, amount]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!sale || !selectedCustomerId || !selectedInventoryItemId) {
//             alert("Please fill in all required fields.");
//             return;
//         }

//         // Plain JS object construction following the Sale data shape
//         const updatedSale = {
//             ...sale,
//             customerId: Number(selectedCustomerId),
//             salesmanId: salesmanId ? Number(salesmanId) : null,
//             inventoryItemId: Number(selectedInventoryItemId),
//             quantity,
//             emptiesCollected: Number(emptiesCollected) || 0,
//             amount,
//             amountReceived: Number(amountReceived) || 0,
//             date: new Date(saleDate).toISOString(),
//             paymentMethod,
//         };

//         onUpdateSale(updatedSale);
//         onClose();
//     };

//     if (!isOpen || !sale) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-full overflow-y-auto">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-bold text-brand-text-primary">Edit Sale</h2>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
//                 </div>
                
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="edit-sale-date" className="block text-sm font-medium text-brand-text-secondary">Sale Date</label>
//                         <input
//                             type="date"
//                             id="edit-sale-date"
//                             value={saleDate}
//                             onChange={e => setSaleDate(e.target.value)}
//                             required
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="edit-customer-select" className="block text-sm font-medium text-brand-text-secondary">Customer</label>
//                         <select id="edit-customer-select" value={selectedCustomerId} onChange={e => setSelectedCustomerId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
//                             <option value="" disabled>Select a customer</option>
//                             {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                         </select>
//                     </div>

//                     <div>
//                         <label htmlFor="edit-item-select" className="block text-sm font-medium text-brand-text-secondary">Item</label>
//                         <select id="edit-item-select" value={selectedInventoryItemId} onChange={e => setSelectedInventoryItemId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
//                             <option value="" disabled>Select an item</option>
//                             {inventory.map(i => <option key={i.id} value={i.id}>{i.name} (PKR {i.sellingPrice})</option>)}
//                         </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label htmlFor="edit-quantity" className="block text-sm font-medium text-brand-text-secondary">Quantity</label>
//                             <input type="number" id="edit-quantity" value={quantity} onChange={e => setQuantity(Number(e.target.value))} required min="1" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
//                         </div>
//                         <div>
//                             <label htmlFor="edit-unitPrice" className="block text-sm font-medium text-brand-text-secondary">Unit Price (PKR)</label>
//                             <input type="number" id="edit-unitPrice" value={unitPrice} onChange={e => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
//                         </div>
//                     </div>

//                     <div>
//                         <label htmlFor="edit-empties" className="block text-sm font-medium text-brand-text-secondary">Empties Collected</label>
//                         <input type="number" id="edit-empties" value={emptiesCollected} onChange={e => setEmptiesCollected(e.target.value === '' ? '' : Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
//                     </div>

//                     <div>
//                         <label htmlFor="edit-payment-method" className="block text-sm font-medium text-brand-text-secondary">Payment Method</label>
//                         <select id="edit-payment-method" value={paymentMethod} onChange={e => setPaymentMethod(e.target.value)} className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
//                             <option value="Pending">Add to Balance</option>
//                             <option value="Cash">Cash</option>
//                             <option value="Bank">Bank Transfer</option>
//                         </select>
//                     </div>

//                     <div>
//                         <label htmlFor="edit-amount-received" className="block text-sm font-medium text-brand-text-secondary">Amount Received (PKR)</label>
//                         <input type="number" id="edit-amount-received" value={amountReceived} onChange={e => setAmountReceived(e.target.value === '' ? '' : Number(e.target.value))} required min="0" className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
//                     </div>

//                     <div>
//                         <label htmlFor="edit-salesman-assign" className="block text-sm font-medium text-brand-text-secondary">Assigned Salesman</label>
//                         <select id="edit-salesman-assign" value={salesmanId} onChange={e => setSalesmanId(e.target.value)} required className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm">
//                             <option value="" disabled>Select a salesman</option>
//                             {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//                         </select>
//                     </div>

//                     <div className="pt-2">
//                         <p className="text-lg font-semibold text-right text-brand-text-primary">Total Amount: PKR {amount.toLocaleString()}</p>
//                     </div>
                    
//                     <div className="flex justify-end pt-4 space-x-4">
//                         <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-brand-text-secondary rounded-md hover:bg-gray-200 font-semibold">Cancel</button>
//                         <button type="submit" className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue font-semibold">Update Sale</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditSaleModal;


import React, { useState, useEffect } from 'react';

/**
 * Modal component for editing existing sales records.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onUpdateSale - Callback that pushes the updated payload to the Dashboard.
 * @param {Object|null} props.sale - The existing sale object from MongoDB to populate the form.
 * @param {Array} props.customers - List of all customers for re-assignment.
 * @param {Array} props.salesmen - List of available salesmen.
 * @param {Array} props.inventory - List of inventory items for pricing lookup.
 */
const EditSaleModal = ({ isOpen, onClose, onUpdateSale, sale, customers, salesmen, inventory }) => {
    // State
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedInventoryItemId, setSelectedInventoryItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState('');
    const [emptiesCollected, setEmptiesCollected] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Pending');
    const [salesmanId, setSalesmanId] = useState('');
    const [amountReceived, setAmountReceived] = useState('');
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);

    // Derived total amount calculated dynamically
    const amount = (Number(unitPrice) || 0) * quantity;

    const resetForm = () => {
        setSelectedCustomerId('');
        setSelectedInventoryItemId('');
        setQuantity(1);
        setUnitPrice('');
        setEmptiesCollected(0);
        setPaymentMethod('Pending');
        setSalesmanId('');
        setAmountReceived('');
        setSaleDate(new Date().toISOString().split('T')[0]);
    };

    /**
     * Effect: Populate form fields when the modal opens with a specific sale
     */
    useEffect(() => {
        if (isOpen && sale) {
            // Check for MongoDB _id first, fallback to id for backwards compatibility
            setSelectedCustomerId(sale.customerId?._id || sale.customerId?.toString() || '');
            setSelectedInventoryItemId(sale.inventoryItemId?._id || sale.inventoryItemId?.toString() || '');
            setQuantity(sale.quantity);
            
            // Calculating original unit price from total and quantity
            if (sale.quantity > 0) {
                 setUnitPrice(sale.amount / sale.quantity);
            } else {
                 setUnitPrice(0);
            }
            
            setEmptiesCollected(sale.emptiesCollected || 0);
            setPaymentMethod(sale.paymentMethod || 'Pending');
            setSalesmanId(sale.salesmanId?._id || sale.salesmanId?.toString() || '');
            setAmountReceived(sale.amountReceived || 0);
            
            if (sale.date) {
                setSaleDate(new Date(sale.date).toISOString().split('T')[0]);
            }
        } else if (!isOpen) {
            resetForm();
        }
    }, [isOpen, sale]);

    /**
     * Effect: Auto-assign unit price from inventory if an item is selected and price is empty
     */
    useEffect(() => {
        const selectedItem = inventory.find(i => (i._id === selectedInventoryItemId || i.id === selectedInventoryItemId));
        if (selectedItem && !unitPrice && unitPrice !== 0) {
            setUnitPrice(selectedItem.sellingPrice);
        }
    }, [selectedInventoryItemId, inventory, unitPrice]);

    /**
     * Effect: Auto-adjust amount received based on payment status
     */
    useEffect(() => {
        if (paymentMethod === 'Pending') {
            setAmountReceived(0);
        } else if (paymentMethod === 'Cash' || paymentMethod === 'Bank') {
            setAmountReceived(amount);
        }
    }, [paymentMethod, amount]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!sale || !selectedCustomerId || !selectedInventoryItemId) {
            alert("Please fill in all required fields (Customer and Item).");
            return;
        }

        // Payload structure formatted for Express / MongoDB PUT route
        const updatedSale = {
            ...sale,
            customerId: selectedCustomerId,
            salesmanId: salesmanId ? salesmanId : null,
            inventoryItemId: selectedInventoryItemId,
            quantity: Number(quantity) || 1,
            emptiesCollected: Number(emptiesCollected) || 0,
            amount: amount,
            amountReceived: Number(amountReceived) || 0,
            date: new Date(saleDate).toISOString(),
            paymentMethod: paymentMethod,
        };

        onUpdateSale(updatedSale);
        onClose();
    };

    if (!isOpen || !sale) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-brand-text-primary">Edit Sale Record</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-sale-date" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Sale Date</label>
                        <input
                            type="date"
                            id="edit-sale-date"
                            value={saleDate}
                            onChange={e => setSaleDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-customer-select" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Customer</label>
                        <select 
                            id="edit-customer-select" 
                            value={selectedCustomerId} 
                            onChange={e => setSelectedCustomerId(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                        >
                            <option value="" disabled>-- Select a customer --</option>
                            {customers.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name}</option>)}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="edit-item-select" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Item</label>
                        <select 
                            id="edit-item-select" 
                            value={selectedInventoryItemId} 
                            onChange={e => setSelectedInventoryItemId(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                        >
                            <option value="" disabled>-- Select an item --</option>
                            {inventory.map(i => <option key={i._id || i.id} value={i._id || i.id}>{i.name} (PKR {i.sellingPrice})</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-quantity" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Quantity</label>
                            <input 
                                type="number" 
                                id="edit-quantity" 
                                value={quantity} 
                                onChange={e => setQuantity(Number(e.target.value))} 
                                required 
                                min="1" 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-unitPrice" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Unit Price (PKR)</label>
                            <input 
                                type="number" 
                                id="edit-unitPrice" 
                                value={unitPrice} 
                                onChange={e => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                                required 
                                min="0" 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="edit-empties" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Empties Collected</label>
                        <input 
                            type="number" 
                            id="edit-empties" 
                            value={emptiesCollected} 
                            onChange={e => setEmptiesCollected(e.target.value === '' ? '' : Number(e.target.value))} 
                            required 
                            min="0" 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>

                    <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg mt-2">
                        <div className="mb-3">
                            <label htmlFor="edit-payment-method" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Payment Status</label>
                            <select 
                                id="edit-payment-method" 
                                value={paymentMethod} 
                                onChange={e => setPaymentMethod(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                            >
                                <option value="Pending">Add to Balance (Pending)</option>
                                <option value="Cash">Paid Cash</option>
                                <option value="Bank">Paid Bank Transfer</option>
                            </select>
                        </div>

                        <div>
                            <label htmlFor="edit-amount-received" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Amount Received</label>
                            <input 
                                type="number" 
                                id="edit-amount-received" 
                                value={amountReceived} 
                                onChange={e => setAmountReceived(e.target.value === '' ? '' : Number(e.target.value))} 
                                required 
                                min="0" 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="edit-salesman-assign" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Assigned Salesman</label>
                        <select 
                            id="edit-salesman-assign" 
                            value={salesmanId} 
                            onChange={e => setSalesmanId(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                        >
                            <option value="" disabled>-- Select a salesman --</option>
                            {salesmen.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="pt-4 border-t border-gray-200 mt-2">
                        <p className="text-xl font-black text-right text-brand-blue">
                            Total Bill: PKR {amount.toLocaleString()}
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
                            className="px-5 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-lightblue font-bold shadow-md transition-all active:scale-95"
                        >
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSaleModal;