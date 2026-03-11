// import React from 'react';

// /**
//  * A confirmation modal displayed before finalizing the financial period closing.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls the visibility of the modal.
//  * @param {Function} props.onClose - Function to dismiss the modal without action.
//  * @param {Function} props.onConfirm - Function to proceed with closing the period.
//  * @param {Object|null} props.data - The financial summary data for the period.
//  */
// const ConfirmClosingModal = ({ isOpen, onClose, onConfirm, data }) => {
//     // Standard JS conditional rendering
//     if (!isOpen || !data) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg">
//                 <h2 className="text-xl font-bold text-brand-text-primary mb-4">
//                     Confirm Period Closing
//                 </h2>
//                 <p className="text-brand-text-secondary mb-6">
//                     You are about to close the books for the period <span className="font-bold text-brand-text-primary">{data.periodName}</span>. This will create a historical record and this action cannot be undone. Please verify the numbers below.
//                 </p>

//                 {/* Summary Ledger Data */}
//                 <div className="space-y-2 bg-gray-50 p-4 rounded-md mb-6">
//                     <div className="flex justify-between">
//                         <span className="text-brand-text-secondary">Total Revenue:</span> 
//                         <span className="font-semibold">PKR {data.totalRevenue.toLocaleString()}</span>
//                     </div>
//                     <div className="flex justify-between">
//                         <span className="text-brand-text-secondary">Total Expenses:</span> 
//                         <span className="font-semibold">PKR {data.totalExpenses.toLocaleString()}</span>
//                     </div>
//                     <div className={`flex justify-between font-bold text-lg border-t pt-2 mt-2 ${data.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
//                         <span>Net Balance:</span> 
//                         <span>PKR {data.netBalance.toLocaleString()}</span>
//                     </div>
//                 </div>

//                 <div className="flex justify-end space-x-4">
//                     <button 
//                         onClick={onClose} 
//                         className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300 font-semibold transition-colors"
//                     >
//                         Cancel
//                     </button>
//                     <button 
//                         onClick={onConfirm} 
//                         className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue font-semibold transition-colors shadow-sm"
//                     >
//                         Confirm & Close
//                     </button>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default ConfirmClosingModal;


import React from 'react';

/**
 * A confirmation modal displayed before finalizing the financial period closing.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {Function} props.onClose - Function to dismiss the modal without action.
 * @param {Function} props.onConfirm - Function to proceed with closing the period.
 * @param {Object|null} props.data - The financial summary data for the period.
 */
const ConfirmClosingModal = ({ isOpen, onClose, onConfirm, data }) => {
    // Standard JS conditional rendering
    if (!isOpen || !data) return null;

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-lg animate-fade-in border border-gray-100">
                <div className="flex items-center space-x-3 mb-5">
                    <div className="bg-orange-100 p-2.5 rounded-full flex-shrink-0">
                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                        </svg>
                    </div>
                    <h2 className="text-2xl font-black text-brand-text-primary tracking-tight">
                        Confirm Period Closing
                    </h2>
                </div>
                
                <p className="text-brand-text-secondary mb-6 leading-relaxed">
                    You are about to lock the books for <span className="font-bold text-brand-text-primary bg-gray-100 px-2 py-0.5 rounded">{data.periodName}</span>. This will create a permanent historical record and <span className="font-bold text-red-600">cannot be undone</span>. Please verify the final ledger amounts below.
                </p>

                {/* Summary Ledger Data */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-5 mb-8 space-y-3">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-brand-text-secondary uppercase tracking-wider">Total Revenue:</span> 
                        <span className="font-black text-lg text-brand-text-primary">PKR {Number(data.totalRevenue || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-brand-text-secondary uppercase tracking-wider">Total Expenses:</span> 
                        <span className="font-black text-lg text-brand-text-primary">PKR {Number(data.totalExpenses || 0).toLocaleString()}</span>
                    </div>
                    <div className="border-t-2 border-dashed border-gray-300 my-2 pt-3"></div>
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-bold text-brand-text-secondary uppercase tracking-wider">Net Balance:</span> 
                        <span className={`font-black text-2xl ${data.netBalance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                            PKR {Number(data.netBalance || 0).toLocaleString()}
                        </span>
                    </div>
                </div>

                <div className="flex justify-end space-x-3">
                    <button 
                        onClick={onClose} 
                        className="px-5 py-2.5 bg-gray-100 text-brand-text-secondary rounded-lg hover:bg-gray-200 font-bold transition-all"
                    >
                        Review Again
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-5 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-lightblue font-bold transition-all shadow-md active:scale-95 flex items-center"
                    >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path>
                        </svg>
                        Confirm & Lock
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmClosingModal;