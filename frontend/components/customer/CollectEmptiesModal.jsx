// import React, { useState } from 'react';

// /**
//  * Modal component for recording the return of empty bottles from a customer.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls visibility.
//  * @param {Function} props.onClose - Closes the modal.
//  * @param {Object|null} props.customer - The customer object to collect from.
//  * @param {Function} props.onConfirm - Callback returning (customerId, bottlesCollected).
//  */
// const CollectEmptiesModal = ({ isOpen, onClose, customer, onConfirm }) => {
//     // TypeScript union types like <number | ''> removed
//     const [bottlesCollected, setBottlesCollected] = useState('');
//     const [error, setError] = useState('');

//     // Safe return if modal shouldn't be visible
//     if (!isOpen || !customer) return null;

//     const handleConfirm = () => {
//         const numCollected = Number(bottlesCollected);
        
//         if (numCollected <= 0) {
//             setError("Please enter a positive number of bottles.");
//             return;
//         }
        
//         // Logical check against customer data
//         if (numCollected > customer.emptyBottlesHeld) {
//             setError(`Cannot collect more than the ${customer.emptyBottlesHeld} bottles held by the customer.`);
//             return;
//         }

//         setError('');
//         onConfirm(customer.id, numCollected);
//     };

//     const handleClose = () => {
//         setBottlesCollected('');
//         setError('');
//         onClose();
//     };

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold text-brand-text-primary">Collect Empties</h2>
//                     <button 
//                         onClick={handleClose} 
//                         className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
//                     >
//                         &times;
//                     </button>
//                 </div>
                
//                 <p className="text-brand-text-secondary mb-4">
//                     Collecting from: <span className="font-bold">{customer.name}</span>
//                 </p>
//                 <p className="text-sm text-brand-text-secondary mb-4">
//                     Currently holding: <span className="font-bold text-red-600">{customer.emptyBottlesHeld}</span> empty bottles.
//                 </p>
                
//                 <div>
//                     <label htmlFor="bottles-collected" className="block text-sm font-medium text-brand-text-secondary">
//                         Number of Bottles to Collect
//                     </label>
//                     <input
//                         type="number"
//                         id="bottles-collected"
//                         value={bottlesCollected}
//                         onChange={(e) => setBottlesCollected(e.target.value === '' ? '' : Number(e.target.value))}
//                         required
//                         min="1"
//                         max={customer.emptyBottlesHeld}
//                         className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                     />
//                 </div>

//                 {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

//                 <div className="flex justify-end space-x-4 mt-6">
//                     <button 
//                         onClick={handleClose} 
//                         className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300 font-semibold"
//                     >
//                         Cancel
//                     </button>
//                     <button 
//                         onClick={handleConfirm} 
//                         className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-semibold"
//                     >
//                         Confirm Collection
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default CollectEmptiesModal;

import React, { useState } from 'react';

/**
 * Modal component for recording the return of empty bottles from a customer.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Closes the modal.
 * @param {Object|null} props.customer - The customer object to collect from.
 * @param {Function} props.onConfirm - Callback returning (customerId, bottlesCollected).
 */
const CollectEmptiesModal = ({ isOpen, onClose, customer, onConfirm }) => {
    const [bottlesCollected, setBottlesCollected] = useState('');
    const [error, setError] = useState('');

    // Safe return if modal shouldn't be visible
    if (!isOpen || !customer) return null;

    const handleConfirm = () => {
        const numCollected = Number(bottlesCollected);
        
        if (numCollected <= 0) {
            setError("Please enter a positive number of bottles.");
            return;
        }
        
        // Logical check against customer data
        if (numCollected > customer.emptyBottlesHeld) {
            setError(`Cannot collect more than the ${customer.emptyBottlesHeld} bottles held by the customer.`);
            return;
        }

        setError('');
        // Ensure compatibility with MongoDB _id or standard id
        const targetId = customer._id || customer.id;
        onConfirm(targetId, numCollected);
        
        // Reset state after confirmation
        setBottlesCollected('');
    };

    const handleClose = () => {
        setBottlesCollected('');
        setError('');
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold text-brand-text-primary">Collect Empties</h2>
                    <button 
                        onClick={handleClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                

                <p className="text-brand-text-secondary mb-2">
                    Collecting from: <span className="font-bold text-brand-text-primary">{customer.name}</span>
                </p>
                <div className="bg-red-50 border border-red-100 rounded-md p-3 mb-4">
                    <p className="text-sm text-red-800 font-medium text-center">
                        Currently holding: <span className="font-bold text-red-600 text-lg">{customer.emptyBottlesHeld}</span> empty bottles.
                    </p>
                </div>
                
                <div>
                    <label htmlFor="bottles-collected" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                        Number of Bottles
                    </label>
                    <input
                        type="number"
                        id="bottles-collected"
                        value={bottlesCollected}
                        onChange={(e) => setBottlesCollected(e.target.value === '' ? '' : Number(e.target.value))}
                        required
                        min="1"
                        max={customer.emptyBottlesHeld}
                        placeholder="e.g. 5"
                        className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                    />
                </div>

                {error && <p className="text-red-500 text-sm font-semibold mt-2">{error}</p>}

                <div className="flex justify-end space-x-3 mt-6 pt-4 border-t border-gray-100">
                    <button 
                        onClick={handleClose} 
                        className="px-4 py-2 bg-gray-100 text-brand-text-secondary rounded-lg hover:bg-gray-200 font-bold transition-colors"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={handleConfirm} 
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold shadow-md transition-all active:scale-95"
                    >
                        Confirm Collection
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CollectEmptiesModal;