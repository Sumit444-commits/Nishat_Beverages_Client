// import React, { useState, useEffect } from 'react';

// /**
//  * Modal component for recording the starting cash and bank balances for a specific day.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls the visibility of the modal.
//  * @param {Function} props.onClose - Callback to close the modal.
//  * @param {Function} props.onSave - Callback to persist the balance data.
//  * @param {string} props.selectedDate - The date for which the balance is being set.
//  * @param {Object} [props.currentBalance] - Existing balance data if editing.
//  */
// const RecordOpeningBalanceModal = ({ isOpen, onClose, onSave, selectedDate, currentBalance }) => {
//     const [cash, setCash] = useState('');
//     const [bank, setBank] = useState('');

//     // Pre-populate fields if an existing record is provided
//     useEffect(() => {
//         if (isOpen) {
//             setCash(currentBalance?.cash ?? '');
//             setBank(currentBalance?.bank ?? '');
//         }
//     }, [isOpen, currentBalance]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         // Convert empty strings to 0 and ensure numeric types are passed back
//         onSave(selectedDate, Number(cash) || 0, Number(bank) || 0);
//         onClose(); // Optional: close the modal after saving
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold text-brand-text-primary">Record Opening Balance</h2>
//                     <button 
//                         onClick={onClose} 
//                         className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
//                         aria-label="Close"
//                     >
//                         &times;
//                     </button>
//                 </div>
                
//                 <p className="text-sm text-brand-text-secondary mb-6">
//                     Set the starting balance for <span className="font-semibold text-brand-blue">{new Date(selectedDate).toLocaleDateString()}</span>.
//                 </p>

                

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="opening-cash" className="block text-sm font-medium text-brand-text-secondary">
//                             Opening Cash (PKR)
//                         </label>
//                         <input
//                             type="number"
//                             id="opening-cash"
//                             value={cash}
//                             onChange={(e) => setCash(e.target.value === '' ? '' : Number(e.target.value))}
//                             min="0"
//                             placeholder="e.g., 5000"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="opening-bank" className="block text-sm font-medium text-brand-text-secondary">
//                             Opening Bank (PKR)
//                         </label>
//                         <input
//                             type="number"
//                             id="opening-bank"
//                             value={bank}
//                             onChange={(e) => setBank(e.target.value === '' ? '' : Number(e.target.value))}
//                             min="0"
//                             placeholder="e.g., 25000"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                         />
//                     </div>

//                     <div className="flex justify-end pt-4 space-x-4">
//                         <button 
//                             type="button" 
//                             onClick={onClose} 
//                             className="px-6 py-2 bg-gray-100 text-brand-text-secondary rounded-md hover:bg-gray-200 font-semibold transition-colors"
//                         >
//                             Cancel
//                         </button>
//                         <button 
//                             type="submit" 
//                             className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue font-semibold shadow-sm transition-colors"
//                         >
//                             Save Balance
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default RecordOpeningBalanceModal;




import React, { useState, useEffect } from 'react';

/**
 * Modal component for recording the starting cash and bank balances for a specific day.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {Function} props.onSave - Callback to persist the balance data.
 * @param {string} props.selectedDate - The date for which the balance is being set.
 * @param {Object} [props.currentBalance] - Existing balance data if editing.
 */
const RecordOpeningBalanceModal = ({ isOpen, onClose, onSave, selectedDate, currentBalance }) => {
    const [cash, setCash] = useState('');
    const [bank, setBank] = useState('');

    // Pre-populate fields if an existing record is provided
    useEffect(() => {
        if (isOpen) {
            setCash(currentBalance?.cash ?? '');
            setBank(currentBalance?.bank ?? '');
        }
    }, [isOpen, currentBalance]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Convert empty strings to 0 and ensure numeric types are passed back
        onSave(selectedDate, Number(cash) || 0, Number(bank) || 0);
        onClose(); 
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md animate-fade-in border border-gray-100">
                <div className="flex justify-between items-center mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Record Opening Balance</h2>
                        <p className="text-sm font-medium text-brand-blue mt-1">
                            For {new Date(selectedDate).toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'})}
                        </p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none self-start"
                        aria-label="Close"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <label htmlFor="opening-cash" className="block text-sm font-bold text-brand-text-secondary uppercase tracking-wider mb-0 flex-shrink-0">
                            Cash Register
                        </label>
                        <div className="relative w-1/2">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-bold text-sm">PKR</span>
                            <input
                                type="number"
                                id="opening-cash"
                                value={cash}
                                onChange={(e) => setCash(e.target.value === '' ? '' : Number(e.target.value))}
                                min="0"
                                placeholder="0"
                                className="block w-full pl-12 pr-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-blue text-right font-black text-brand-text-primary transition-all"
                            />
                        </div>
                    </div>
                    
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 flex items-center justify-between">
                        <label htmlFor="opening-bank" className="block text-sm font-bold text-brand-text-secondary uppercase tracking-wider mb-0 flex-shrink-0">
                            Bank Account
                        </label>
                        <div className="relative w-1/2">
                            <span className="absolute inset-y-0 left-0 pl-3 flex items-center text-gray-500 font-bold text-sm">PKR</span>
                            <input
                                type="number"
                                id="opening-bank"
                                value={bank}
                                onChange={(e) => setBank(e.target.value === '' ? '' : Number(e.target.value))}
                                min="0"
                                placeholder="0"
                                className="block w-full pl-12 pr-3 py-2.5 bg-white border border-gray-300 rounded-md shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-blue text-right font-black text-brand-text-primary transition-all"
                            />
                        </div>
                    </div>

                    <div className="flex justify-end pt-5 space-x-3 border-t border-gray-100 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 bg-gray-100 text-brand-text-secondary rounded-lg font-bold hover:bg-gray-200 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-6 py-2.5 bg-brand-blue text-white rounded-lg font-bold shadow-md hover:bg-brand-lightblue active:scale-95 transition-all flex items-center"
                        >
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"></path></svg>
                            Save Balance
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default RecordOpeningBalanceModal;