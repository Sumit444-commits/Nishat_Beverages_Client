// import React, { useState, useEffect } from 'react';

// /**
//  * Modal to update the number of bottles returned by a salesman at the end of the day.
//  * Helps in reconciling inventory (Assigned - Returned = Sold).
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls visibility of the modal.
//  * @param {Function} props.onClose - Callback to close the modal.
//  * @param {Object|null} props.assignment - The daily assignment record being updated.
//  * @param {Function} props.onUpdate - Callback to save the updated return count.
//  * @param {string} props.salesmanName - Name of the salesman for the header.
//  */
// const UpdateAssignmentModal = ({ isOpen, onClose, assignment, onUpdate, salesmanName }) => {
//     const [bottlesReturned, setBottlesReturned] = useState('');

//     // Sync local state when the assignment prop changes
//     useEffect(() => {
//         if (assignment) {
//             setBottlesReturned(assignment.bottlesReturned ?? '');
//         }
//     }, [assignment]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!assignment || bottlesReturned === '') return;

//         // Pass the updated object back to the parent handler
//         onUpdate({
//             ...assignment,
//             bottlesReturned: Number(bottlesReturned)
//         });
//         onClose();
//     };

//     if (!isOpen || !assignment) return null;

//     return (
//          <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md animate-fade-in">
//                 <div className="flex justify-between items-center mb-4">
//                     <h2 className="text-xl font-bold text-brand-text-primary">Update Return for {salesmanName}</h2>
//                     <button 
//                         onClick={onClose} 
//                         className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
//                     >
//                         &times;
//                     </button>
//                 </div>
                
//                 <p className="text-sm text-brand-text-secondary mb-4">
//                     <span className="font-semibold">Date:</span> {new Date(assignment.date).toLocaleDateString()} 
//                     <span className="mx-2">|</span> 
//                     <span className="font-semibold">Full Bottles Issued:</span> {assignment.bottlesAssigned}
//                 </p>

                

//                 <form onSubmit={handleSubmit} className="space-y-4">
//                      <div>
//                         <label htmlFor="bottles-returned" className="block text-sm font-medium text-brand-text-secondary">
//                             Bottles Returned (Unsold/Empty)
//                         </label>
//                         <input
//                             type="number"
//                             id="bottles-returned"
//                             value={bottlesReturned}
//                             onChange={(e) => setBottlesReturned(e.target.value === '' ? '' : Number(e.target.value))}
//                             required
//                             min="0"
//                             max={assignment.bottlesAssigned} // Logic safety: can't return more than assigned
//                             placeholder="Enter quantity"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
//                         />
//                         <p className="text-[10px] text-brand-text-secondary mt-1 italic">
//                             Sold quantity will be calculated as: {assignment.bottlesAssigned - (Number(bottlesReturned) || 0)}
//                         </p>
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
//                             Update Record
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default UpdateAssignmentModal;









import React, { useState, useEffect } from 'react';

/**
 * Modal to update the number of bottles returned by a salesman at the end of the day.
 * Helps in reconciling inventory (Assigned - Returned = Sold).
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility of the modal.
 * @param {Function} props.onClose - Callback to close the modal.
 * @param {Object|null} props.assignment - The daily assignment record being updated.
 * @param {Function} props.onUpdate - Callback to save the updated return count via API.
 * @param {string} props.salesmanName - Name of the salesman for the header.
 */
const UpdateAssignmentModal = ({ isOpen, onClose, assignment, onUpdate, salesmanName }) => {
    const [bottlesReturned, setBottlesReturned] = useState('');

    // Sync local state when the assignment prop changes
    useEffect(() => {
        if (assignment && isOpen) {
            setBottlesReturned(assignment.bottlesReturned ?? '');
        }
    }, [assignment, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!assignment || bottlesReturned === '') return;

        const returnedNum = Number(bottlesReturned);

        // Additional validation
        if (returnedNum < 0 || returnedNum > assignment.bottlesAssigned) {
            alert("Invalid return amount. Cannot be negative or greater than bottles assigned.");
            return;
        }

        // Pass the updated data back to the parent handler (which will call the API)
        onUpdate({
            ...assignment,
            bottlesReturned: returnedNum
        });
        onClose();
    };

    if (!isOpen || !assignment) return null;

    return (
         <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md animate-fade-in border border-gray-100">
                <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                    <div>
                        <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Log Evening Return</h2>
                        <p className="text-sm font-bold text-brand-blue mt-1 uppercase tracking-wider">{salesmanName}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                
                <div className="flex justify-between items-center bg-blue-50/50 border border-blue-100 p-4 rounded-lg mb-6">
                    <div>
                        <span className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Route Date</span>
                        <span className="font-bold text-brand-text-primary">
                            {assignment.date ? new Date(assignment.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : 'N/A'}
                        </span>
                    </div>
                    <div className="w-px h-8 bg-blue-200"></div>
                    <div className="text-right">
                        <span className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Loaded (Full)</span>
                        <span className="font-black text-xl text-brand-blue">{assignment.bottlesAssigned}</span>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                     <div>
                        <label htmlFor="bottles-returned" className="block text-sm font-bold text-brand-text-secondary uppercase tracking-wider mb-2">
                            Bottles Returned (Unsold/Empty)
                        </label>
                        <div className="relative">
                            <input
                                type="number"
                                id="bottles-returned"
                                value={bottlesReturned}
                                onChange={(e) => setBottlesReturned(e.target.value === '' ? '' : Number(e.target.value))}
                                required
                                min="0"
                                max={assignment.bottlesAssigned} // Logic safety: can't return more than assigned
                                placeholder="e.g. 15"
                                className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-lg shadow-inner focus:outline-none focus:ring-2 focus:ring-brand-blue text-lg font-bold text-brand-text-primary transition-all"
                            />
                        </div>
                        <div className="mt-3 p-3 bg-gray-50 border border-gray-100 rounded-lg flex justify-between items-center">
                            <span className="text-xs font-bold text-gray-500 uppercase">Calculated Sales:</span>
                            <span className="font-black text-green-600 text-lg">
                                {bottlesReturned !== '' ? (assignment.bottlesAssigned - Number(bottlesReturned)) : '--'}
                            </span>
                        </div>
                    </div>

                    <div className="flex justify-end pt-2 space-x-3 border-t border-gray-100">
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
                            <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>
                            Log Return
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdateAssignmentModal;