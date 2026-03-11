// import React from 'react';
// import { PlusCircleIcon } from '../icons/PlusCircleIcon';

// /**
//  * Component to display a table of all payments made to salesmen.
//  * @param {Object} props
//  * @param {Array} props.payments - List of payment records.
//  * @param {Array} props.salesmen - List of salesmen for name lookup.
//  * @param {Function} props.onAddPayment - Callback to open the payment modal.
//  */
// const SalesmanPayments = ({ payments, salesmen, onAddPayment }) => {
    
//     /**
//      * Finds a salesman's name by their ID.
//      * @param {number} salesmanId 
//      * @returns {string}
//      */
//     const getSalesmanName = (salesmanId) => {
//         return salesmen.find(s => s.id === salesmanId)?.name || 'Unknown Salesman';
//     };

//     // Sorting payments by date in descending order (most recent first)
//     const sortedPayments = [...payments].sort((a, b) => 
//         new Date(b.date).getTime() - new Date(a.date).getTime()
//     );

//     return (
//         <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
//             {/* Table Header with Action Button */}
//             <div className="p-6 flex justify-between items-center border-b border-gray-200">
//                 <h2 className="text-xl font-bold text-brand-text-primary">Salesman Payments</h2>
//                 <button 
//                   onClick={onAddPayment}
//                   className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors"
//                 >
//                   <PlusCircleIcon className="h-5 w-5 mr-2" />
//                   Record Payment
//                 </button>
//             </div>

//             {/* Responsive Table Wrapper */}
//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm text-left text-brand-text-secondary">
//                     <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
//                         <tr>
//                             <th scope="col" className="px-6 py-3">Date</th>
//                             <th scope="col" className="px-6 py-3">Salesman</th>
//                             <th scope="col" className="px-6 py-3">Payment Method</th>
//                             <th scope="col" className="px-6 py-3">Notes</th>
//                             <th scope="col" className="px-6 py-3 text-right">Amount (PKR)</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {sortedPayments.length > 0 ? sortedPayments.map((payment) => (
//                             <tr key={payment.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
//                                 <td className="px-6 py-4">
//                                     {new Date(payment.date).toLocaleDateString()}
//                                 </td>
//                                 <td className="px-6 py-4 font-medium text-brand-text-primary">
//                                     {getSalesmanName(payment.salesmanId)}
//                                 </td>
//                                 <td className="px-6 py-4">
//                                     {payment.paymentMethod}
//                                 </td>
//                                 <td className="px-6 py-4 truncate max-w-xs" title={payment.notes}>
//                                     {payment.notes || '-'}
//                                 </td>
//                                 <td className="px-6 py-4 font-semibold text-right">
//                                     {payment.amount.toLocaleString()}
//                                 </td>
//                             </tr>
//                         )) : (
//                             <tr>
//                                 <td colSpan={5} className="text-center py-10 px-6 text-brand-text-secondary">
//                                     No payments have been recorded yet.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default SalesmanPayments;

import React from 'react';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';

/**
 * Component to display a table of all payments made to salesmen.
 * @param {Object} props
 * @param {Array} props.payments - List of payment records.
 * @param {Array} props.salesmen - List of salesmen for name lookup.
 * @param {Function} props.onAddPayment - Callback to open the payment modal.
 */
const SalesmanPayments = ({ payments = [], salesmen = [], onAddPayment }) => {
    
    /**
     * Finds a salesman's name by their ID (supporting both MongoDB _id and local id).
     * @param {string|number} salesmanId 
     * @returns {string}
     */
    const getSalesmanName = (salesmanId) => {
        if (!salesmanId) return 'Unknown Salesman';
        const targetId = String(salesmanId);
        const salesman = salesmen.find(s => String(s._id || s.id) === targetId);
        return salesman ? salesman.name : 'Unknown Salesman';
    };

    // Sorting payments by date in descending order (most recent first)
    const sortedPayments = [...payments].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    });

    return (
        <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden animate-fade-in">
            {/* Table Header with Action Button */}
            <div className="p-6 flex justify-between items-center border-b border-gray-100 bg-gray-50/50">
                <div>
                    <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Salesman Payments</h2>
                    <p className="text-sm font-medium text-brand-text-secondary mt-1">Salary advances and commission payouts.</p>
                </div>
                <button 
                  onClick={onAddPayment}
                  className="flex items-center bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-lightblue transition-all shadow-sm active:scale-95"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Record Payment
                </button>
            </div>

            {/* Responsive Table Wrapper */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left text-brand-text-secondary">
                    <thead className="text-xs text-brand-text-secondary uppercase bg-gray-100/80 font-bold tracking-wider border-b border-gray-200">
                        <tr>
                            <th scope="col" className="px-6 py-4">Date</th>
                            <th scope="col" className="px-6 py-4">Salesman</th>
                            <th scope="col" className="px-6 py-4">Payment Method</th>
                            <th scope="col" className="px-6 py-4">Notes</th>
                            <th scope="col" className="px-6 py-4 text-right">Amount (PKR)</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {sortedPayments.length > 0 ? sortedPayments.map((payment) => (
                            <tr key={payment._id || payment.id || Math.random()} className="bg-white hover:bg-blue-50/50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap font-medium">
                                    {payment.date ? new Date(payment.date).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' }) : 'N/A'}
                                </td>
                                <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">
                                    {getSalesmanName(payment.salesmanId || payment.ownerId)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="px-2.5 py-1 bg-gray-100 rounded-full text-xs font-semibold text-gray-700 uppercase tracking-wider">
                                        {payment.paymentMethod || 'Cash'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 truncate max-w-[200px]" title={payment.notes || payment.description}>
                                    {payment.notes || payment.description || '-'}
                                </td>
                                <td className="px-6 py-4 font-black text-brand-blue text-right whitespace-nowrap">
                                    {Number(payment.amount || 0).toLocaleString()}
                                </td>
                            </tr>
                        )) : (
                            <tr>
                                <td colSpan={5} className="text-center py-12 px-6">
                                    <p className="text-gray-500 font-medium text-lg">No payments have been recorded yet.</p>
                                    <p className="text-sm text-gray-400 mt-1">Click "Record Payment" to log a salary or commission payout.</p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default SalesmanPayments;