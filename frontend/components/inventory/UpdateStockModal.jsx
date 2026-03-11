// import React, { useState, useMemo, useEffect } from 'react';

// /**
//  * Modal component for adjusting inventory stock levels with a recorded reason.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls the visibility of the modal.
//  * @param {Function} props.onClose - Function to close the modal.
//  * @param {Object|null} props.item - The inventory item to be updated.
//  * @param {Function} props.onUpdateStock - Callback function (itemId, adjustment, reason).
//  */
// const UpdateStockModal = ({ isOpen, onClose, item, onUpdateStock }) => {
//     const [adjustment, setAdjustment] = useState(0);
//     const [reason, setReason] = useState('');

//     // Reset local state when the modal closes to prevent data carry-over
//     useEffect(() => {
//         if (!isOpen) {
//             setAdjustment(0);
//             setReason('');
//         }
//     }, [isOpen]);

//     // Calculate the preview of the new stock level based on user input
//     const newStockLevel = useMemo(() => {
//         if (!item) return 0;
//         return item.stock + adjustment;
//     }, [item, adjustment]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
        
//         if (!item || adjustment === 0 || !reason) {
//             alert("Please provide a non-zero adjustment quantity and a reason.");
//             return;
//         }

//         onUpdateStock(item.id, adjustment, reason);
//     };

//     if (!isOpen || !item) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center">
//             <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-brand-text-primary">
//                         Update Stock for {item.name}
//                     </h2>
//                     <button 
//                         onClick={onClose} 
//                         className="text-gray-400 hover:text-gray-600 text-3xl"
//                     >
//                         &times;
//                     </button>
//                 </div>

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label className="block text-sm font-medium text-brand-text-secondary">
//                             Current Stock
//                         </label>
//                         <p className="mt-1 text-lg font-semibold text-brand-text-primary">
//                             {item.stock}
//                         </p>
//                     </div>

//                     <div>
//                         <label htmlFor="adjustment-quantity" className="block text-sm font-medium text-brand-text-secondary">
//                             Adjustment Quantity
//                         </label>
//                         <input 
//                             type="number" 
//                             id="adjustment-quantity" 
//                             value={adjustment} 
//                             onChange={e => setAdjustment(parseInt(e.target.value, 10) || 0)} 
//                             required 
//                             placeholder="e.g., 50 or -10"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                         <p className="text-xs text-gray-500 mt-1">
//                             Enter a positive number to add stock, or a negative number to remove it.
//                         </p>
//                     </div>

//                     <div>
//                         <label htmlFor="adjustment-reason" className="block text-sm font-medium text-brand-text-secondary">
//                             Reason for Adjustment
//                         </label>
//                         <input 
//                             type="text" 
//                             id="adjustment-reason" 
//                             value={reason} 
//                             onChange={e => setReason(e.target.value)} 
//                             required 
//                             placeholder="e.g., New shipment, stock count correction"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>

//                     <div>
//                         <label className="block text-sm font-medium text-brand-text-secondary">
//                             New Stock Level
//                         </label>
//                         <p className="mt-1 text-lg font-bold text-brand-blue">
//                             {newStockLevel}
//                         </p>
//                     </div>

//                     <div className="flex justify-end pt-4 space-x-2">
//                         <button 
//                             type="button" 
//                             onClick={onClose} 
//                             className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300"
//                         >
//                             Cancel
//                         </button>
//                         <button 
//                             type="submit" 
//                             className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue"
//                         >
//                             Update Stock
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UpdateStockModal;


import React, { useState, useMemo, useEffect } from 'react';

/**
 * Modal component for manually adjusting inventory stock levels (e.g., due to breakage, audits, or manual refills).
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Object|null} props.item - The inventory item to be updated.
 * @param {Function} props.onUpdateStock - Callback function (itemId, adjustmentQuantity, reason).
 */
const UpdateStockModal = ({ isOpen, onClose, item, onUpdateStock }) => {
    const [adjustment, setAdjustment] = useState(0);
    const [reason, setReason] = useState('');

    // Reset local state when the modal closes or opens to prevent data carry-over
    useEffect(() => {
        if (!isOpen) {
            setAdjustment(0);
            setReason('');
        }
    }, [isOpen]);

    // Calculate the preview of the new stock level based on user input
    const newStockLevel = useMemo(() => {
        if (!item) return 0;
        return item.stock + adjustment;
    }, [item, adjustment]);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!item || adjustment === 0 || !reason.trim()) {
            alert("Please provide a non-zero adjustment quantity and a reason.");
            return;
        }

        // Support both MongoDB _id and local id formats
        const targetId = item._id || item.id;
        
        // Pass the data up to the Dashboard to handle the API request
        onUpdateStock(targetId, adjustment, reason.trim());
        onClose();
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-brand-text-primary">
                            Update Stock
                        </h2>
                        <p className="text-sm font-medium text-brand-blue mt-1">{item.name}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none self-start focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex justify-between items-center">
                        <label className="text-sm font-bold text-brand-text-secondary uppercase tracking-wide">
                            Current Stock
                        </label>
                        <p className="text-2xl font-black text-brand-text-primary">
                            {item.stock}
                        </p>
                    </div>

                    <div>
                        <label htmlFor="adjustment-quantity" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Adjustment Quantity
                        </label>
                        <input 
                            type="number" 
                            id="adjustment-quantity" 
                            value={adjustment} 
                            onChange={e => setAdjustment(parseInt(e.target.value, 10) || 0)} 
                            required 
                            placeholder="e.g. 50 or -10"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                        <p className="text-xs font-medium text-gray-500 mt-2 bg-blue-50 p-2 rounded border border-blue-100">
                            <span className="text-brand-blue font-bold">Tip:</span> Enter a positive number (e.g. <span className="font-bold text-green-600">50</span>) to add stock, or a negative number (e.g. <span className="font-bold text-red-600">-10</span>) to mark items as broken/lost.
                        </p>
                    </div>

                    <div>
                        <label htmlFor="adjustment-reason" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Reason for Adjustment
                        </label>
                        <input 
                            type="text" 
                            id="adjustment-reason" 
                            value={reason} 
                            onChange={e => setReason(e.target.value)} 
                            required 
                            placeholder="e.g. Shipment arrived, 3 bottles broken"
                            className="mt-1 block w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>

                    <div className="flex justify-between items-center pt-2 border-t border-gray-100 mt-2">
                        <label className="text-sm font-bold text-brand-text-secondary uppercase">
                            New Stock Level:
                        </label>
                        <p className={`text-2xl font-black ${newStockLevel < item.lowStockThreshold ? 'text-red-600' : 'text-green-600'}`}>
                            {newStockLevel}
                        </p>
                    </div>

                    <div className="flex justify-end pt-4 space-x-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 bg-gray-100 text-brand-text-secondary font-bold rounded-lg hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={adjustment === 0}
                            className="px-5 py-2.5 bg-brand-blue text-white font-bold rounded-lg hover:bg-brand-lightblue transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Confirm Stock Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateStockModal;