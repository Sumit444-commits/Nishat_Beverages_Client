// import React, { useState, useEffect } from 'react';

// /**
//  * Modal component for adding a new sale to a specific customer.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Modal visibility state.
//  * @param {Function} props.onClose - Function to close the modal.
//  * @param {Function} props.onAddSale - Callback that receives the new sale object.
//  * @param {Object} props.customer - The preselected customer (if any).
//  * @param {Array} props.customers - List of all customers for selection.
//  * @param {Array} props.salesmen - List of available salesmen.
//  * @param {Array} props.inventory - List of inventory items.
//  * @param {number} [props.preselectedInventoryItemId] - Optional ID to default the item select.
//  */
// const AddSaleModal = ({ 
//     isOpen, 
//     onClose, 
//     onAddSale, 
//     customer, 
//     customers, 
//     salesmen, 
//     inventory, 
//     preselectedInventoryItemId 
// }) => {
//     // TypeScript generics and type unions removed
//     const [selectedCustomerId, setSelectedCustomerId] = useState('');
//     const [selectedInventoryItemId, setSelectedInventoryItemId] = useState('');
//     const [quantity, setQuantity] = useState(1);
//     const [unitPrice, setUnitPrice] = useState('');
//     const [emptiesCollected, setEmptiesCollected] = useState(0);
//     const [paymentMethod, setPaymentMethod] = useState('Pending');
//     const [salesmanId, setSalesmanId] = useState('');
//     const [amountReceived, setAmountReceived] = useState('');
//     const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
    
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
    
//     // Effect: Initialize form when modal opens
//     useEffect(() => {
//         if (isOpen) {
//             resetForm();
//             if (customer) {
//                 const currentCustomer = customers.find(c => c.id === customer.id);
//                 setSelectedCustomerId(customer.id.toString());
//                 if (currentCustomer) {
//                     setSalesmanId(currentCustomer.salesmanId?.toString() || '');
//                     setQuantity(1); 
//                     setEmptiesCollected(0);
//                 }
//             }
//             if (preselectedInventoryItemId) {
//                 setSelectedInventoryItemId(preselectedInventoryItemId.toString());
//             }
//         }
//     }, [isOpen, customer, customers, preselectedInventoryItemId]);

//     // Effect: Auto-update unit price when item selection changes
//     useEffect(() => {
//         const selectedItem = inventory.find(i => i.id === Number(selectedInventoryItemId));
//         if (selectedItem) {
//             setUnitPrice(selectedItem.sellingPrice);
//         } else {
//             setUnitPrice('');
//         }
//     }, [selectedInventoryItemId, inventory]);

//     // Effect: Auto-calculate amount received based on payment method
//     useEffect(() => {
//         if (paymentMethod === 'Pending') {
//             setAmountReceived(0);
//         } else {
//             setAmountReceived(amount);
//         }
//     }, [paymentMethod, amount]);


//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!selectedCustomerId || !selectedInventoryItemId) {
//             alert("Please select a customer and an item.");
//             return;
//         }

//         // Object structure follows the Sale interface from your old types.ts
//         const newSale = {
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

//         onAddSale(newSale);
//         onClose();
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-full overflow-y-auto">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-bold text-brand-text-primary">Add New Sale</h2>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
//                 </div>
                
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="sale-date" className="block text-sm font-medium text-brand-text-secondary">Sale Date</label>
//                         <input
//                             type="date"
//                             id="sale-date"
//                             value={saleDate}
//                             onChange={e => setSaleDate(e.target.value)}
//                             required
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                         />
//                     </div>

//                     {!customer && (
//                         <div>
//                              <label htmlFor="customer-select" className="block text-sm font-medium text-brand-text-secondary">Customer</label>
//                              <select 
//                                 id="customer-select" 
//                                 value={selectedCustomerId} 
//                                 onChange={e => setSelectedCustomerId(e.target.value)} 
//                                 required 
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                             >
//                                  <option value="" disabled>Select a customer</option>
//                                  {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
//                              </select>
//                         </div>
//                     )}

//                     <div>
//                         <label htmlFor="item-select" className="block text-sm font-medium text-brand-text-secondary">Item</label>
//                          <select 
//                             id="item-select" 
//                             value={selectedInventoryItemId} 
//                             onChange={e => setSelectedInventoryItemId(e.target.value)} 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                         >
//                              <option value="" disabled>Select an item</option>
//                              {inventory.map(i => (
//                                  <option key={i.id} value={i.id}>
//                                      {i.name} (PKR {i.sellingPrice})
//                                  </option>
//                              ))}
//                          </select>
//                     </div>

//                     <div className="grid grid-cols-2 gap-4">
//                         <div>
//                             <label htmlFor="quantity" className="block text-sm font-medium text-brand-text-secondary">Quantity</label>
//                             <input 
//                                 type="number" 
//                                 id="quantity" 
//                                 value={quantity} 
//                                 onChange={e => setQuantity(Number(e.target.value))} 
//                                 required 
//                                 min="1" 
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                             />
//                         </div>
//                         <div>
//                             <label htmlFor="unitPrice" className="block text-sm font-medium text-brand-text-secondary">Unit Price (PKR)</label>
//                             <input 
//                                 type="number" 
//                                 id="unitPrice" 
//                                 value={unitPrice} 
//                                 onChange={e => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))} 
//                                 required 
//                                 min="0" 
//                                 className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                             />
//                         </div>
//                     </div>

//                      <div>
//                         <label htmlFor="empties" className="block text-sm font-medium text-brand-text-secondary">Empties Collected</label>
//                         <input 
//                             type="number" 
//                             id="empties" 
//                             value={emptiesCollected} 
//                             onChange={e => setEmptiesCollected(e.target.value === '' ? '' : Number(e.target.value))} 
//                             required 
//                             min="0" 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>

//                     <div>
//                         <label htmlFor="payment-method" className="block text-sm font-medium text-brand-text-secondary">Payment Method</label>
//                         <select 
//                             id="payment-method" 
//                             value={paymentMethod} 
//                             onChange={e => setPaymentMethod(e.target.value)} 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                         >
//                             <option value="Pending">Add to Balance</option>
//                             <option value="Cash">Cash</option>
//                             <option value="Bank">Bank Transfer</option>
//                         </select>
//                     </div>

//                      <div>
//                         <label htmlFor="amount-received" className="block text-sm font-medium text-brand-text-secondary">Amount Received (PKR)</label>
//                         <input 
//                             type="number" 
//                             id="amount-received" 
//                             value={amountReceived} 
//                             onChange={e => setAmountReceived(e.target.value === '' ? '' : Number(e.target.value))} 
//                             required 
//                             min="0" 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>

//                      <div>
//                         <label htmlFor="salesman-assign" className="block text-sm font-medium text-brand-text-secondary">Assigned Salesman</label>
//                         <select 
//                             id="salesman-assign" 
//                             value={salesmanId} 
//                             onChange={e => setSalesmanId(e.target.value)} 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                         >
//                              <option value="" disabled>Select a salesman</option>
//                             {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//                         </select>
//                     </div>

//                     <div className="pt-2">
//                         <p className="text-lg font-semibold text-right text-brand-text-primary">
//                             Total Amount: PKR {amount.toLocaleString()}
//                         </p>
//                     </div>

//                     <div className="flex justify-end pt-4 space-x-4">
//                         <button 
//                             type="button" 
//                             onClick={onClose} 
//                             className="px-6 py-2 bg-gray-100 text-brand-text-secondary rounded-md hover:bg-gray-200 font-semibold"
//                         >
//                             Cancel
//                         </button>
//                         <button 
//                             type="submit" 
//                             className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue font-semibold"
//                         >
//                             Add Sale
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddSaleModal;


import React, { useState, useEffect } from 'react';

/**
 * Modal component for recording a new water delivery/sale to a specific customer.
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility state.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onAddSale - Callback to push the payload to Dashboard (which hits the API).
 * @param {Object} props.customer - The preselected customer (if triggered from customer row).
 * @param {Array} props.customers - List of all active customers.
 * @param {Array} props.salesmen - List of all active salesmen.
 * @param {Array} props.inventory - List of active inventory items (bottles).
 * @param {string} [props.preselectedInventoryItemId] - Optional MongoDB _id to default the item select.
 */
const AddSaleModal = ({ 
    isOpen, 
    onClose, 
    onAddSale, 
    customer, 
    customers, 
    salesmen, 
    inventory, 
    preselectedInventoryItemId 
}) => {
    // State initialization
    const [selectedCustomerId, setSelectedCustomerId] = useState('');
    const [selectedInventoryItemId, setSelectedInventoryItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState('');
    const [emptiesCollected, setEmptiesCollected] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Pending');
    const [salesmanId, setSalesmanId] = useState('');
    const [amountReceived, setAmountReceived] = useState('');
    const [saleDate, setSaleDate] = useState(new Date().toISOString().split('T')[0]);
    
    // Dynamic Calculation
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
    
    // Effect: Initialize form when modal opens
    useEffect(() => {
        if (isOpen) {
            resetForm();
            
            // Auto-fill if a specific customer was passed in
            if (customer) {
                const currentCustomer = customers.find(c => (c._id === customer._id || c.id === customer.id));
                const custIdStr = customer._id || customer.id;
                setSelectedCustomerId(custIdStr);
                
                if (currentCustomer) {
                    setSalesmanId(currentCustomer.salesmanId || '');
                    setQuantity(1); 
                    setEmptiesCollected(0);
                }
            }
            
            // Auto-fill inventory item if provided
            if (preselectedInventoryItemId) {
                setSelectedInventoryItemId(preselectedInventoryItemId);
            }
        }
    }, [isOpen, customer, customers, preselectedInventoryItemId]);

    // Effect: Auto-update unit price when item selection changes
    useEffect(() => {
        const selectedItem = inventory.find(i => (i._id === selectedInventoryItemId || i.id === selectedInventoryItemId));
        if (selectedItem) {
            setUnitPrice(selectedItem.sellingPrice);
        } else {
            setUnitPrice('');
        }
    }, [selectedInventoryItemId, inventory]);

    // Effect: Auto-calculate amount received based on payment method
    useEffect(() => {
        if (paymentMethod === 'Pending') {
            setAmountReceived(0);
        } else {
            setAmountReceived(amount);
        }
    }, [paymentMethod, amount]);


    const handleSubmit = (e) => {
        e.preventDefault();
        if (!selectedCustomerId || !selectedInventoryItemId) {
            alert("Please select a customer and an inventory item.");
            return;
        }

        // Structure payload exactly as the Express Sale model expects
        const newSale = {
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

        onAddSale(newSale);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-text-primary">Add Delivery / Sale</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="sale-date" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Sale Date</label>
                        <input
                            type="date"
                            id="sale-date"
                            value={saleDate}
                            onChange={e => setSaleDate(e.target.value)}
                            required
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                        />
                    </div>

                    {!customer && (
                        <div>
                             <label htmlFor="customer-select" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Customer</label>
                             <select 
                                id="customer-select" 
                                value={selectedCustomerId} 
                                onChange={e => {
                                    setSelectedCustomerId(e.target.value);
                                    // Auto-assign their default salesman if available
                                    const selected = customers.find(c => c._id === e.target.value || c.id === e.target.value);
                                    if(selected && selected.salesmanId) setSalesmanId(selected.salesmanId);
                                }} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                            >
                                 <option value="" disabled>-- Select a customer --</option>
                                 {customers.map(c => <option key={c._id || c.id} value={c._id || c.id}>{c.name} ({c.area})</option>)}
                             </select>
                        </div>
                    )}

                    <div>
                        <label htmlFor="item-select" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Inventory Item</label>
                         <select 
                            id="item-select" 
                            value={selectedInventoryItemId} 
                            onChange={e => setSelectedInventoryItemId(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                        >
                             <option value="" disabled>-- Select a bottle type --</option>
                             {inventory.map(i => (
                                 <option key={i._id || i.id} value={i._id || i.id}>
                                     {i.name} (PKR {i.sellingPrice})
                                 </option>
                             ))}
                         </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="quantity" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Quantity Sold</label>
                            <input 
                                type="number" 
                                id="quantity" 
                                value={quantity} 
                                onChange={e => setQuantity(Number(e.target.value))} 
                                required 
                                min="1" 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                        <div>
                            <label htmlFor="unitPrice" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Unit Price (PKR)</label>
                            <input 
                                type="number" 
                                id="unitPrice" 
                                value={unitPrice} 
                                onChange={e => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                                required 
                                min="0" 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-gray-50 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                    </div>

                     <div>
                        <label htmlFor="empties" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Empties Collected</label>
                        <input 
                            type="number" 
                            id="empties" 
                            value={emptiesCollected} 
                            onChange={e => setEmptiesCollected(e.target.value === '' ? '' : Number(e.target.value))} 
                            required 
                            min="0" 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>

                    <div>
                        <label htmlFor="payment-method" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Payment Method</label>
                        <select 
                            id="payment-method" 
                            value={paymentMethod} 
                            onChange={e => setPaymentMethod(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                        >
                            <option value="Pending">Add to Customer Balance</option>
                            <option value="Cash">Cash (Paid in full)</option>
                            <option value="Bank">Bank Transfer (Paid in full)</option>
                        </select>
                    </div>

                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <label htmlFor="amount-received" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Amount Received Today</label>
                        <input 
                            type="number" 
                            id="amount-received" 
                            value={amountReceived} 
                            onChange={e => setAmountReceived(e.target.value === '' ? '' : Number(e.target.value))} 
                            required 
                            min="0" 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                        <p className="text-[10px] text-brand-text-secondary mt-1 italic">
                            If pending, this should be 0. If paid, it should match the total.
                        </p>
                    </div>

                     <div>
                        <label htmlFor="salesman-assign" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Delivered By</label>
                        <select 
                            id="salesman-assign" 
                            value={salesmanId} 
                            onChange={e => setSalesmanId(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                        >
                             <option value="" disabled>-- Assign a Salesman --</option>
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
                            className="px-5 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 font-bold shadow-md transition-all active:scale-95"
                        >
                            Record Sale
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSaleModal;