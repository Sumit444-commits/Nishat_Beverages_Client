// import React, { useState, useEffect } from 'react';

// /**
//  * Modal component for editing existing customer details.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls visibility.
//  * @param {Function} props.onClose - Closes the modal.
//  * @param {Object|null} props.customer - The customer object being edited.
//  * @param {Function} props.onUpdateCustomer - Callback to save changes.
//  * @param {Array} props.salesmen - List of available salesmen.
//  * @param {Array} [props.areas] - Array of existing area strings.
//  * @param {Array} [props.areaAssignments] - Mappings of areas to specific salesmen.
//  * @param {Function} [props.onNavigateToAreaAssignment] - Link to area management settings.
//  */
// const EditCustomerModal = ({ 
//     isOpen, 
//     onClose, 
//     customer, 
//     onUpdateCustomer, 
//     salesmen, 
//     areas = [], 
//     areaAssignments = [], 
//     onNavigateToAreaAssignment 
// }) => {
//     const [name, setName] = useState('');
//     const [address, setAddress] = useState('');
//     const [mobile, setMobile] = useState('');
//     const [area, setArea] = useState('');
//     const [salesmanId, setSalesmanId] = useState('unassigned');
//     const [outstandingBalance, setOutstandingBalance] = useState(0);
//     const [deliveryFrequency, setDeliveryFrequency] = useState(1);
//     const [emptyBottles, setEmptyBottles] = useState(0);
//     const [lastCollectionDate, setLastCollectionDate] = useState('');
//     const [autoAssignedSalesman, setAutoAssignedSalesman] = useState(null);
//     const [manualOverride, setManualOverride] = useState(false);

//     // Sync local state when the customer prop changes
//     useEffect(() => {
//         if (customer) {
//             setName(customer.name);
//             setAddress(customer.address);
//             setMobile(customer.mobile);
//             setArea(customer.area || '');
//             setSalesmanId(customer.salesmanId ?? 'unassigned');
//             setOutstandingBalance(customer.totalBalance);
//             setDeliveryFrequency(customer.deliveryFrequencyDays);
//             setEmptyBottles(customer.emptyBottlesHeld);
//             setLastCollectionDate(customer.lastEmptiesCollectionDate ? customer.lastEmptiesCollectionDate.split('T')[0] : '');
//             setManualOverride(false);
//             setAutoAssignedSalesman(null);
//         }
//     }, [customer]);

//     // Auto-assign salesman when area changes (only if not manually overridden)
//     useEffect(() => {
//         if (area.trim() && !manualOverride) {
//             const areaAssignment = areaAssignments.find(a => a.area === area.trim());
//             if (areaAssignment && areaAssignment.salesmanId) {
//                 setSalesmanId(areaAssignment.salesmanId.toString());
//                 setAutoAssignedSalesman(areaAssignment.salesmanId);
//             } else {
//                 setAutoAssignedSalesman(null);
//             }
//         }
//     }, [area, areaAssignments, manualOverride]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!customer) return;
        
//         const updatedCustomer = {
//             ...customer,
//             name,
//             address,
//             mobile,
//             area: area.trim(),
//             salesmanId: salesmanId === 'unassigned' ? null : Number(salesmanId),
//             totalBalance: outstandingBalance,
//             deliveryFrequencyDays: deliveryFrequency,
//             emptyBottlesHeld: emptyBottles,
//             lastEmptiesCollectionDate: lastCollectionDate ? new Date(lastCollectionDate).toISOString() : null,
//         };

//         onUpdateCustomer(updatedCustomer);
//         onClose();
//     };

//     if (!isOpen || !customer) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-full overflow-y-auto">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-xl font-bold text-brand-text-primary">Edit Customer Details</h2>
//                     <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-3xl leading-none">&times;</button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                         <input 
//                             type="text" 
//                             placeholder="Full Name" 
//                             value={name} 
//                             onChange={e => setName(e.target.value)} 
//                             required 
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                         <input 
//                             type="tel" 
//                             placeholder="Mobile Number" 
//                             value={mobile} 
//                             onChange={e => setMobile(e.target.value)} 
//                             required 
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                         <textarea
//                             placeholder="Full Address"
//                             value={address}
//                             onChange={e => setAddress(e.target.value)}
//                             required
//                             rows={3}
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm md:col-span-2"
//                         />
                        
//                         <div className="md:col-span-2">
//                             <label className="block text-sm font-medium text-brand-text-secondary mb-1">
//                                 Area/Sector
//                                 {onNavigateToAreaAssignment && (
//                                     <button
//                                         type="button"
//                                         onClick={onNavigateToAreaAssignment}
//                                         className="ml-2 text-xs text-brand-blue hover:text-brand-lightblue hover:underline"
//                                     >
//                                         (Manage Areas)
//                                     </button>
//                                 )}
//                             </label>
//                             <div className="flex gap-2">
//                                 <select
//                                     value={area}
//                                     onChange={e => setArea(e.target.value)}
//                                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                                 >
//                                     <option value="">Select Area</option>
//                                     {areas.map(a => (
//                                         <option key={a} value={a}>{a}</option>
//                                     ))}
//                                 </select>
//                                 <input
//                                     type="text"
//                                     placeholder="Or enter new area"
//                                     value={area}
//                                     onChange={e => setArea(e.target.value)}
//                                     className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                                 />
//                             </div>
//                         </div>

//                         <div>
//                             <label className="block text-sm font-medium text-brand-text-secondary mb-1">
//                                 Assigned Salesman
//                                 {autoAssignedSalesman && !manualOverride && (
//                                     <span className="ml-2 text-xs text-green-600 font-medium">(Auto-assigned)</span>
//                                 )}
//                             </label>
//                             <select 
//                                 value={salesmanId} 
//                                 onChange={e => {
//                                     setSalesmanId(e.target.value);
//                                     setManualOverride(true);
//                                     setAutoAssignedSalesman(null);
//                                 }} 
//                                 className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                             >
//                                 <option value="unassigned">Unassigned Salesman</option>
//                                 {salesmen.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
//                             </select>
//                         </div>

//                         <input 
//                             type="number" 
//                             placeholder="Balance (PKR)" 
//                             value={outstandingBalance} 
//                             onChange={e => setOutstandingBalance(Number(e.target.value))} 
//                             required 
//                             className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
                        
//                         <div>
//                             <label htmlFor="edit_deliveryFrequency" className="block text-xs font-medium text-brand-text-secondary mb-1">Frequency (Days)</label>
//                             <input type="number" id="edit_deliveryFrequency" value={deliveryFrequency} onChange={e => setDeliveryFrequency(Number(e.target.value))} required min="1" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
//                         </div>
//                         <div>
//                             <label htmlFor="edit_emptyBottles" className="block text-xs font-medium text-brand-text-secondary mb-1">Empty Bottles Held</label>
//                             <input type="number" id="edit_emptyBottles" value={emptyBottles} onChange={e => setEmptyBottles(Number(e.target.value))} required min="0" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
//                         </div>
                        
//                         <div className="md:col-span-2">
//                              <label htmlFor="edit_lastCollectionDate" className="block text-xs font-medium text-brand-text-secondary mb-1">Last Empties Collection Date</label>
//                              <input type="date" id="edit_lastCollectionDate" value={lastCollectionDate} onChange={e => setLastCollectionDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" />
//                         </div>
//                     </div>

//                     <div className="flex justify-end pt-4 space-x-4">
//                         <button type="button" onClick={onClose} className="px-6 py-2 bg-gray-100 text-brand-text-secondary rounded-md hover:bg-gray-200 font-semibold">Cancel</button>
//                         <button type="submit" className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue font-semibold">Update Customer</button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditCustomerModal;


import React, { useState, useEffect } from 'react';
import { apiService } from '../../api/apiService';
import toast from 'react-hot-toast';

/**
 * Modal component for editing existing customer details via MongoDB.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Closes the modal.
 * @param {Object|null} props.customer - The customer object being edited.
 * @param {Function} props.onUpdateCustomer - Callback to update Dashboard state after DB save.
 * @param {Array} props.salesmen - List of available salesmen.
 * @param {Array} [props.areas] - Array of existing area strings.
 * @param {Array} [props.areaAssignments] - Mappings of areas to specific salesmen.
 * @param {Function} [props.onNavigateToAreaAssignment] - Link to area management settings.
 */
const EditCustomerModal = ({ 
    isOpen, 
    onClose, 
    customer, 
    onUpdateCustomer, 
    salesmen, 
    areas = [], 
    areaAssignments = [], 
    onNavigateToAreaAssignment 
}) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [area, setArea] = useState('');
    const [salesmanId, setSalesmanId] = useState('unassigned');
    const [outstandingBalance, setOutstandingBalance] = useState(0);
    const [deliveryFrequency, setDeliveryFrequency] = useState(1);
    const [emptyBottles, setEmptyBottles] = useState(0);
    const [lastCollectionDate, setLastCollectionDate] = useState('');
    const [autoAssignedSalesman, setAutoAssignedSalesman] = useState(null);
    const [manualOverride, setManualOverride] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Sync local state when the customer prop changes
    useEffect(() => {
        if (customer) {
            setName(customer.name);
            setAddress(customer.address);
            setMobile(customer.mobile);
            setArea(customer.area || '');
            setSalesmanId(customer.salesmanId ?? 'unassigned');
            setOutstandingBalance(customer.totalBalance);
            setDeliveryFrequency(customer.deliveryFrequencyDays);
            setEmptyBottles(customer.emptyBottlesHeld);
            setLastCollectionDate(customer.lastEmptiesCollectionDate ? customer.lastEmptiesCollectionDate.split('T')[0] : '');
            setManualOverride(false);
            setAutoAssignedSalesman(null);
        }
    }, [customer]);

    // Auto-assign salesman when area changes (only if not manually overridden)
    useEffect(() => {
        if (area.trim() && !manualOverride) {
            const areaAssignment = areaAssignments.find(a => a.area === area.trim());
            if (areaAssignment && areaAssignment.salesmanId) {
                const sid = typeof areaAssignment.salesmanId === 'object' 
                    ? areaAssignment.salesmanId._id 
                    : areaAssignment.salesmanId.toString();
                    
                setSalesmanId(sid);
                setAutoAssignedSalesman(sid);
            } else {
                setAutoAssignedSalesman(null);
            }
        }
    }, [area, areaAssignments, manualOverride]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!customer) return;
        
        setIsLoading(true);
        const customerId = customer._id || customer.id;

        try {
            // Build payload for Express PUT route
            const updates = {
                name,
                address,
                mobile,
                area: area.trim(),
                salesmanId: salesmanId === 'unassigned' ? null : salesmanId,
                totalBalance: outstandingBalance,
                deliveryFrequencyDays: deliveryFrequency,
                emptyBottlesHeld: emptyBottles,
                lastEmptiesCollectionDate: lastCollectionDate ? new Date(lastCollectionDate).toISOString() : null,
            };

            // Call MongoDB Backend
            const updatedCustomer = await apiService.updateCustomer(customerId, updates);
            
            toast.success("Customer updated successfully");
            onUpdateCustomer(updatedCustomer); // Update Dashboard state
            onClose();

        } catch (error) {
            toast.error(error.message || "Failed to update customer");
            console.error("Update error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen || !customer) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-text-primary">Edit Customer Details</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                        disabled={isLoading}
                    >
                        &times;
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">Full Name</label>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={name} 
                                onChange={e => setName(e.target.value)} 
                                required 
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                            />
                        </div>
                        <div>
                            <label className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">Mobile Number</label>
                            <input 
                                type="tel" 
                                placeholder="e.g., +9230********" 
                                value={mobile} 
                                onChange={e => setMobile(e.target.value)} 
                                required 
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                             <label className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">Address</label>
                            <textarea
                                placeholder="Full Address"
                                value={address}
                                onChange={e => setAddress(e.target.value)}
                                required
                                rows={2}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">
                                Area/Sector
                                {onNavigateToAreaAssignment && (
                                    <button
                                        type="button"
                                        onClick={onNavigateToAreaAssignment}
                                        className="ml-2 text-xs text-brand-blue hover:text-brand-lightblue hover:underline"
                                    >
                                        (Manage Areas)
                                    </button>
                                )}
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={area}
                                    onChange={e => setArea(e.target.value)}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                                >
                                    <option value="">Select Area</option>
                                    {areas.map(a => (
                                        <option key={a} value={a}>{a}</option>
                                    ))}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Or enter new area"
                                    value={area}
                                    onChange={e => setArea(e.target.value)}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
                                />
                            </div>
                        </div>

                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">
                                Assigned Salesman
                                {autoAssignedSalesman && !manualOverride && (
                                    <span className="ml-2 text-xs text-green-600 font-medium">(Auto-assigned)</span>
                                )}
                            </label>
                            <select 
                                value={salesmanId || 'unassigned'} 
                                onChange={e => {
                                    setSalesmanId(e.target.value);
                                    setManualOverride(true);
                                    setAutoAssignedSalesman(null);
                                }} 
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm bg-white"
                            >
                                <option value="unassigned">Unassigned Salesman</option>
                                {salesmen.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        
                        <div>
                             <label className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">Balance (PKR)</label>
                            <input 
                                type="number" 
                                placeholder="Balance (PKR)" 
                                value={outstandingBalance} 
                                onChange={e => setOutstandingBalance(Number(e.target.value))} 
                                required 
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="edit_deliveryFrequency" className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">Frequency (Days)</label>
                            <input 
                                type="number" 
                                id="edit_deliveryFrequency" 
                                value={deliveryFrequency} 
                                onChange={e => setDeliveryFrequency(Number(e.target.value))} 
                                required 
                                min="1" 
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit_emptyBottles" className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">Empty Bottles Held</label>
                            <input 
                                type="number" 
                                id="edit_emptyBottles" 
                                value={emptyBottles} 
                                onChange={e => setEmptyBottles(Number(e.target.value))} 
                                required 
                                min="0" 
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                             <label htmlFor="edit_lastCollectionDate" className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">Last Empties Collection Date</label>
                             <input 
                                type="date" 
                                id="edit_lastCollectionDate" 
                                value={lastCollectionDate} 
                                onChange={e => setLastCollectionDate(e.target.value)} 
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3 border-t border-gray-200 mt-2">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isLoading}
                            className="px-5 py-2 bg-gray-100 text-brand-text-secondary rounded-lg hover:bg-gray-200 font-bold disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="px-5 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-lightblue font-bold shadow-md active:scale-95 transition-all disabled:opacity-50"
                        >
                            {isLoading ? 'Saving...' : 'Update Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditCustomerModal;