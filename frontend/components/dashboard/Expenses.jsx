// import React from 'react';
// import { PlusCircleIcon } from '../icons/PlusCircleIcon';
// import { EditIcon } from '../icons/EditIcon';

// /**
//  * Component for viewing and managing business expenses.
//  * @param {Object} props
//  * @param {Array} props.expenses - List of expense records.
//  * @param {Array} props.salesmen - List of salesmen for account lookup.
//  * @param {Array} props.expenseOwners - List of owners for account lookup.
//  * @param {Function} props.onAddExpense - Callback to open the add expense modal.
//  * @param {Function} props.onEditExpense - Callback to edit a specific expense.
//  */
// const Expenses = ({ expenses, salesmen, expenseOwners, onAddExpense, onEditExpense }) => {
    
//     /**
//      * Helper to resolve the name of the person or entity responsible for the expense.
//      */
//     const getOwnerName = (expense) => {
//         if (!expense.ownerId || !expense.ownerType) {
//             return 'N/A';
//         }
//         if (expense.ownerType === 'salesman') {
//             return salesmen.find(s => s.id === expense.ownerId)?.name || 'Unknown';
//         }
//         return expenseOwners.find(o => o.id === expense.ownerId)?.name || 'Unknown';
//     };
    
//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-brand-text-primary">Expenses Management</h1>
//                 <button 
//                   onClick={onAddExpense}
//                   className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors shadow-sm"
//                 >
//                   <PlusCircleIcon className="h-5 w-5 mr-2" />
//                   Add Expense
//                 </button>
//             </div>

            

//             <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
//                 <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50/50">
//                     <h3 className="text-xl font-bold text-brand-text-primary">Transaction History</h3>
//                     <button className="bg-white text-brand-text-secondary px-4 py-2 rounded-lg border border-gray-300 hover:bg-gray-50 text-sm font-semibold transition-all">
//                         Filter by Account
//                     </button>
//                 </div>
//                 <div className="overflow-x-auto">
//                     <table className="w-full text-sm text-left text-brand-text-secondary">
//                         <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
//                             <tr>
//                                 <th scope="col" className="px-6 py-3">Date</th>
//                                 <th scope="col" className="px-6 py-3">Account Holder</th>
//                                 <th scope="col" className="px-6 py-3">Category</th>
//                                 <th scope="col" className="px-6 py-3">Payment Via</th>
//                                 <th scope="col" className="px-6 py-3">Amount (PKR)</th>
//                                 <th scope="col" className="px-6 py-3 text-center">Actions</th>
//                             </tr>
//                         </thead>
//                         <tbody>
//                             {expenses.length > 0 ? expenses.map((expense) => (
//                                 <tr key={expense.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
//                                     <td className="px-6 py-4 whitespace-nowrap">
//                                         {new Date(expense.date).toLocaleDateString()}
//                                     </td>
//                                     <td className="px-6 py-4 font-medium text-brand-text-primary">
//                                         {getOwnerName(expense)}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className="px-2.5 py-0.5 text-xs font-medium text-gray-800 bg-gray-100 rounded-full border border-gray-200">
//                                             {expense.category}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <span className={`font-medium ${expense.paymentMethod === 'Cash' ? 'text-green-600' : 'text-blue-600'}`}>
//                                             {expense.paymentMethod}
//                                         </span>
//                                     </td>
//                                     <td className="px-6 py-4 font-bold text-brand-text-primary">
//                                         {expense.amount.toLocaleString()}
//                                     </td>
//                                     <td className="px-6 py-4 text-center">
//                                         <button 
//                                             onClick={() => onEditExpense(expense)} 
//                                             className="p-1.5 text-brand-blue hover:bg-blue-50 rounded-full transition-colors" 
//                                             title="Edit Expense"
//                                         >
//                                             <EditIcon className="h-4 w-4" />
//                                         </button>
//                                     </td>
//                                 </tr>
//                             )) : (
//                                 <tr>
//                                     <td colSpan={6} className="text-center py-12 px-6 text-brand-text-secondary italic">
//                                         No expenses recorded in the ledger yet.
//                                     </td>
//                                 </tr>
//                             )}
//                         </tbody>
//                     </table>
//                 </div>
//             </div>
//         </div>
//     );
// };

// export default Expenses;




import React, { useMemo } from 'react';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EditIcon } from '../icons/EditIcon';

/**
 * Component for viewing and managing business expenses.
 * @param {Object} props
 * @param {Array} props.expenses - List of expense records from MongoDB.
 * @param {Array} props.salesmen - List of salesmen for account lookup.
 * @param {Array} props.expenseOwners - List of owners for account lookup.
 * @param {Function} props.onAddExpense - Callback to open the add expense modal.
 * @param {Function} props.onEditExpense - Callback to edit a specific expense.
 */
const Expenses = ({ expenses = [], salesmen = [], expenseOwners = [], onAddExpense, onEditExpense }) => {
    
    /**
     * Helper to resolve the name of the person or entity responsible for the expense using MongoDB _id.
     */
    const getOwnerName = (expense) => {
        if (!expense.ownerId || !expense.ownerType) {
            return <span className="text-gray-400 italic font-normal">General Plant</span>;
        }

        // Ensure we extract the string ID just in case ownerId was populated as an object
        const targetId = String(typeof expense.ownerId === 'object' ? expense.ownerId._id : expense.ownerId);

        if (expense.ownerType === 'salesman') {
            const salesman = salesmen.find(s => String(s._id || s.id) === targetId);
            return salesman ? salesman.name : 'Unknown Salesman';
        }
        
        const owner = expenseOwners.find(o => String(o._id || o.id) === targetId);
        return owner ? owner.name : 'Unknown Account';
    };

    // Sort expenses so newest appear first
    const sortedExpenses = useMemo(() => {
        return [...expenses].sort((a, b) => {
            const dateA = a.date ? new Date(a.date).getTime() : 0;
            const dateB = b.date ? new Date(b.date).getTime() : 0;
            return dateB - dateA;
        });
    }, [expenses]);
    
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Expenses Management</h1>
                    <p className="text-brand-text-secondary mt-1">Track and manage operational and route expenses.</p>
                </div>
                <button 
                  onClick={onAddExpense}
                  className="flex items-center justify-center bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-lightblue transition-all shadow-md active:scale-95 w-full md:w-auto whitespace-nowrap"
                >
                  <PlusCircleIcon className="h-5 w-5 mr-2" />
                  Record Expense
                </button>
            </div>

            

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row justify-between sm:items-center bg-gray-50/50 gap-4">
                    <h3 className="text-xl font-black text-brand-text-primary tracking-tight">Ledger History</h3>
                    <div className="flex items-center space-x-2">
                        <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
                            {sortedExpenses.length} Records
                        </span>
                    </div>
                </div>
                
                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left text-brand-text-secondary relative">
                        <thead className="text-xs text-brand-text-secondary uppercase bg-white font-bold tracking-wider border-b border-gray-200 sticky top-0 shadow-sm">
                            <tr>
                                <th scope="col" className="px-6 py-4">Date</th>
                                <th scope="col" className="px-6 py-4">Account Holder</th>
                                <th scope="col" className="px-6 py-4">Title / Category</th>
                                <th scope="col" className="px-6 py-4">Payment Via</th>
                                <th scope="col" className="px-6 py-4 text-right">Amount (PKR)</th>
                                <th scope="col" className="px-6 py-4 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {sortedExpenses.length > 0 ? sortedExpenses.map((expense) => (
                                <tr key={expense._id || expense.id} className="bg-white hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-500">
                                        {expense.date ? new Date(expense.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">
                                        {getOwnerName(expense)}
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="font-bold text-brand-text-primary truncate max-w-[200px]" title={expense.name}>
                                            {expense.name}
                                        </div>
                                        <span className="inline-block mt-1 px-2.5 py-0.5 text-[10px] font-bold text-gray-600 bg-gray-100 rounded-md uppercase tracking-wider border border-gray-200">
                                            {expense.category}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center font-bold px-2 py-1 rounded-md text-[10px] uppercase tracking-wider border ${
                                            expense.paymentMethod === 'Cash' 
                                                ? 'bg-green-50 text-green-700 border-green-200' 
                                                : 'bg-blue-50 text-blue-700 border-blue-200'
                                        }`}>
                                            {expense.paymentMethod || 'Cash'}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-black text-red-600 text-right text-base whitespace-nowrap">
                                        {Number(expense.amount || 0).toLocaleString()}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <div className="flex items-center justify-center opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => onEditExpense(expense)} 
                                                className="p-1.5 text-brand-text-secondary hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors" 
                                                title="Edit Expense"
                                            >
                                                <EditIcon className="h-5 w-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="text-center py-16 px-6">
                                        <div className="flex justify-center mb-3">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"></path></svg>
                                        </div>
                                        <p className="text-brand-text-primary font-bold text-lg">No expenses recorded.</p>
                                        <p className="text-brand-text-secondary mt-1">Click "Record Expense" to add your first transaction.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Expenses;