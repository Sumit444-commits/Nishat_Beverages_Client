import React, { useState, useEffect } from 'react';

/**
 * Modal component for editing existing sales or payment records.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onUpdateSale - Callback that receives the updated record.
 * @param {Object|null} props.sale - The existing sale/payment object.
 * @param {Array} props.customers - List of customers for reference.
 * @param {Array} props.salesmen - List of available salesmen.
 * @param {Array} props.inventory - List of inventory items.
 */
const EditSaleModal = ({ isOpen, onClose, onUpdateSale, sale, customers, salesmen, inventory }) => {
    // TypeScript generics and union types removed
    const [customerId, setCustomerId] = useState('');
    const [selectedInventoryItemId, setSelectedInventoryItemId] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [unitPrice, setUnitPrice] = useState('');
    const [emptiesCollected, setEmptiesCollected] = useState(0);
    const [paymentMethod, setPaymentMethod] = useState('Pending');
    const [salesmanId, setSalesmanId] = useState('');
    const [date, setDate] = useState('');
    const [amountReceived, setAmountReceived] = useState(0);

    // Determine if this record represents a pure payment (no items sold)
    const isPaymentOnly = sale && sale.quantity === 0 && sale.amount === 0;
    const amount = isPaymentOnly ? 0 : (Number(unitPrice) || 0) * quantity;

    /**
     * Effect: Populate local state when the sale object is provided.
     */
   /**
     * Effect: Populate local state when the sale object is provided.
     */
    useEffect(() => {
        if (sale) {
            // 💡 FIX: Safely extract IDs using optional chaining (?.) to prevent crashes
            const custId = sale.customerId?._id || sale.customerId || '';
            const invId = sale.inventoryItemId?._id || sale.inventoryItemId || '';
            const salesmId = sale.salesmanId?._id || sale.salesmanId || '';

            setCustomerId(String(custId));
            setSelectedInventoryItemId(String(invId));
            setSalesmanId(String(salesmId));
            
            setQuantity(sale.quantity || 0);
            setEmptiesCollected(sale.emptiesCollected || 0);
            setPaymentMethod(sale.paymentMethod || 'Pending');
            setDate(sale.date ? sale.date.split('T')[0] : '');
            setAmountReceived(sale.amountReceived || 0);
            
            if (sale.quantity > 0 && sale.amount > 0) {
                setUnitPrice(sale.amount / sale.quantity);
            } else {
                setUnitPrice('');
            }
        }
    }, [sale]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!sale) return;
        // Construct updated object with numeric conversions
        const updatedSale = {
            ...sale,
            customerId: customerId ? customerId : null,
            inventoryItemId: selectedInventoryItemId ? selectedInventoryItemId : null,
            salesmanId: salesmanId ? salesmanId : null,
            quantity,
            emptiesCollected,
            amount,
            amountReceived: Number(amountReceived) || 0,
            date: new Date(date).toISOString(),
            paymentMethod,
        };
//   console.log(updatedSale)
        onUpdateSale(updatedSale);
        onClose();
    };

    if (!isOpen || !sale) return null;

    const customerName = customers.find(c => c.id === Number(customerId))?.name || 'Unknown';

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md max-h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-text-primary">
                        Edit {isPaymentOnly ? 'Payment' : 'Sale'} for {customerName}
                    </h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-sale-date" className="block text-sm font-medium text-brand-text-secondary">Date</label>
                        <input 
                            type="date" 
                            id="edit-sale-date" 
                            value={date} 
                            onChange={e => setDate(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-item-select" className="block text-sm font-medium text-brand-text-secondary">Item</label>
                         <select 
                            id="edit-item-select" 
                            value={selectedInventoryItemId} 
                            onChange={e => setSelectedInventoryItemId(e.target.value)} 
                            required 
                            disabled={isPaymentOnly} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100"
                        >
                             <option value="" disabled>Select an item</option>
                             {inventory.map(i => <option key={i.id} value={i.id}>{i.name} (PKR {i.sellingPrice})</option>)}
                         </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit_quantity" className="block text-sm font-medium text-brand-text-secondary">Quantity</label>
                            <input 
                                type="number" 
                                id="edit_quantity" 
                                value={quantity} 
                                onChange={e => setQuantity(Number(e.target.value))} 
                                required 
                                min="0" 
                                disabled={isPaymentOnly} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100" 
                            />
                        </div>
                        <div>
                           <label htmlFor="edit_unitPrice" className="block text-sm font-medium text-brand-text-secondary">Unit Price (PKR)</label>
                           <input 
                                type="number" 
                                id="edit_unitPrice" 
                                value={unitPrice} 
                                onChange={e => setUnitPrice(e.target.value === '' ? '' : Number(e.target.value))} 
                                required 
                                min="0" 
                                disabled={isPaymentOnly} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100" 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="edit_empties" className="block text-sm font-medium text-brand-text-secondary">Empties Collected</label>
                        <input 
                            type="number" 
                            id="edit_empties" 
                            value={emptiesCollected} 
                            onChange={e => setEmptiesCollected(Number(e.target.value))} 
                            required 
                            min="0" 
                            disabled={isPaymentOnly} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100" 
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-payment-method" className="block text-sm font-medium text-brand-text-secondary">Payment Method</label>
                        <select 
                            id="edit-payment-method" 
                            value={paymentMethod} 
                            onChange={e => setPaymentMethod(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                        >
                            <option value="Pending">Add to Balance</option>
                            <option value="Cash">Cash</option>
                            <option value="Bank">Bank Transfer</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="edit-amount-received" className="block text-sm font-medium text-brand-text-secondary">Amount Received (PKR)</label>
                        <input 
                            type="number" 
                            id="edit-amount-received" 
                            value={amountReceived} 
                            onChange={e => setAmountReceived(e.target.value === '' ? '' : Number(e.target.value))} 
                            required 
                            min="0" 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-salesman-assign" className="block text-sm font-medium text-brand-text-secondary">Salesman</label>
                        <select 
                            id="edit-salesman-assign" 
                            value={salesmanId} 
                            onChange={e => setSalesmanId(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                        >
                            <option value="">Unassigned</option>
                             {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                        </select>
                    </div>

                    <div className="pt-2">
                        <p className="text-lg font-semibold text-right text-brand-text-primary">
                            Total Amount: PKR {amount.toLocaleString()}
                        </p>
                    </div>

                    <div className="flex justify-end pt-4 space-x-4">
                        <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-brand-text-secondary rounded-md hover:bg-gray-200 font-semibold">Cancel</button>
                        <button type="submit" className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue font-semibold">Update Record</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSaleModal;