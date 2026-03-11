// import React, { useState, useMemo } from 'react';
// import { PlusCircleIcon } from '../icons/PlusCircleIcon';
// import { EditIcon } from '../icons/EditIcon';

// /**
//  * Component for managing different expense accounts (Salesmen and Owners).
//  * @param {Object} props
//  * @param {Array} props.expenses - List of all expense records.
//  * @param {Array} props.salesmen - List of salesmen.
//  * @param {Array} props.expenseOwners - List of custom expense owners.
//  * @param {Function} props.onAddExpense - Callback to trigger the add expense modal.
//  * @param {Function} props.onEditExpense - Callback to trigger the edit expense modal.
//  * @param {Function} props.onAddOwner - Async function to create a new expense owner.
//  */
// const AccountManagement = ({ 
//     expenses, 
//     salesmen, 
//     expenseOwners, 
//     onAddExpense, 
//     onEditExpense,
//     onAddOwner 
// }) => {
//     const [newOwnerName, setNewOwnerName] = useState('');
//     const [isCreatingOwner, setIsCreatingOwner] = useState(false);

//     // Group expenses by account using a Map for efficient lookup
//     const accountExpenses = useMemo(() => {
//         const accounts = new Map();
        
//         // Initialize salesman accounts
//         salesmen.forEach(salesman => {
//             accounts.set(`salesman-${salesman.id}`, {
//                 id: salesman.id,
//                 name: salesman.name,
//                 type: 'salesman',
//                 expenses: [],
//                 totalExpenses: 0
//             });
//         });

//         // Initialize owner accounts
//         expenseOwners.forEach(owner => {
//             accounts.set(`owner-${owner.id}`, {
//                 id: owner.id,
//                 name: owner.name,
//                 type: 'owner',
//                 expenses: [],
//                 totalExpenses: 0
//             });
//         });

//         // Aggregate expenses into their respective accounts
//         expenses.forEach(expense => {
//             if (expense.ownerId && expense.ownerType) {
//                 const key = `${expense.ownerType}-${expense.ownerId}`;
//                 const account = accounts.get(key);
//                 if (account) {
//                     account.expenses.push(expense);
//                     account.totalExpenses += expense.amount;
//                 }
//             }
//         });

//         return Array.from(accounts.values());
//     }, [expenses, salesmen, expenseOwners]);

//     const handleCreateOwner = async () => {
//         if (!newOwnerName.trim()) {
//             alert("Account name cannot be empty.");
//             return;
//         }
//         setIsCreatingOwner(true);
//         try {
//             await onAddOwner(newOwnerName.trim());
//             setNewOwnerName('');
//         } catch (error) {
//             alert("Failed to create account. Please try again.");
//         } finally {
//             setIsCreatingOwner(false);
//         }
//     };

//     const handleAddExpenseForAccount = (accountId, accountType) => {
//         onAddExpense(accountId, accountType);
//     };

//     return (
//         <div className="space-y-6">
//             <div className="flex justify-between items-center">
//                 <h1 className="text-3xl font-bold text-brand-text-primary">Account Management</h1>
//             </div>

//             {/* Create New Account Section */}
//             <div className="bg-brand-surface rounded-xl shadow-md p-6">
//                 <h3 className="text-xl font-bold text-brand-text-primary mb-4">Create New Account</h3>
//                 <div className="flex items-center space-x-4">
//                     <input
//                         type="text"
//                         placeholder="Enter account name (e.g., Chander, Sham)"
//                         value={newOwnerName}
//                         onChange={e => setNewOwnerName(e.target.value)}
//                         className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-brand-blue focus:border-brand-blue"
//                     />
//                     <button
//                         onClick={handleCreateOwner}
//                         disabled={!newOwnerName.trim() || isCreatingOwner}
//                         className="px-6 py-2 bg-brand-blue text-white rounded-lg font-semibold hover:bg-brand-lightblue disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
//                     >
//                         {isCreatingOwner ? 'Creating...' : 'Create Account'}
//                     </button>
//                 </div>
//             </div>

//             {/* Accounts Grid */}
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {accountExpenses.map((account) => (
//                     <div key={`${account.type}-${account.id}`} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow">
//                         <div className="p-6 border-b border-gray-200">
//                             <div className="flex justify-between items-start mb-2">
//                                 <h3 className="text-lg font-bold text-brand-text-primary">{account.name}</h3>
//                                 <span className={`px-2 py-1 text-xs font-medium rounded-full ${
//                                     account.type === 'salesman' 
//                                         ? 'bg-blue-100 text-blue-800' 
//                                         : 'bg-green-100 text-green-800'
//                                 }`}>
//                                     {account.type === 'salesman' ? 'Salesman' : 'Owner'}
//                                 </span>
//                             </div>
//                             <div className="text-sm text-brand-text-secondary">
//                                 {account.expenses.length} expense{account.expenses.length !== 1 ? 's' : ''}
//                             </div>
//                         </div>
                        
//                         <div className="p-6">
//                             <div className="mb-4">
//                                 <div className="text-sm text-brand-text-secondary mb-1">Total Expenses</div>
//                                 <div className="text-2xl font-bold text-red-600">
//                                     PKR {account.totalExpenses.toLocaleString()}
//                                 </div>
//                             </div>
                            
//                             <button
//                                 onClick={() => handleAddExpenseForAccount(account.id, account.type)}
//                                 className="w-full flex items-center justify-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors"
//                             >
//                                 <PlusCircleIcon className="h-4 w-4 mr-2" />
//                                 Add Expense
//                             </button>
                            
//                             {account.expenses.length > 0 && (
//                                 <div className="mt-4 space-y-2">
//                                     <div className="text-sm font-medium text-brand-text-secondary mb-2">Recent Expenses:</div>
//                                     {account.expenses.slice(-3).reverse().map((expense) => (
//                                         <div key={expense.id} className="flex justify-between items-center text-sm p-2 bg-gray-50 rounded">
//                                             <div className="flex-1">
//                                                 <div className="font-medium text-brand-text-primary">{expense.name}</div>
//                                                 <div className="text-xs text-brand-text-secondary">
//                                                     {new Date(expense.date).toLocaleDateString()} • {expense.category}
//                                                 </div>
//                                             </div>
//                                             <div className="flex items-center space-x-2">
//                                                 <span className="font-semibold text-red-600">PKR {expense.amount.toLocaleString()}</span>
//                                                 <button 
//                                                     onClick={() => onEditExpense(expense)}
//                                                     className="text-brand-blue hover:text-brand-accent transition-colors"
//                                                     title="Edit Expense"
//                                                 >
//                                                     <EditIcon className="h-3 w-3" />
//                                                 </button>
//                                             </div>
//                                         </div>
//                                     ))}
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//                 ))}
                
//                 {accountExpenses.length === 0 && (
//                     <div className="col-span-full text-center py-12">
//                         <div className="text-brand-text-secondary text-lg">No accounts found</div>
//                         <div className="text-brand-text-secondary text-sm mt-2">Create your first account to start tracking expenses</div>
//                     </div>
//                 )}
//             </div>
//         </div>
//     );
// };

// export default AccountManagement;









import React, { useState, useMemo } from 'react';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EditIcon } from '../icons/EditIcon';

/**
 * Component for managing different expense accounts (Salesmen and Owners).
 * @param {Object} props
 * @param {Array} props.expenses - List of all expense records.
 * @param {Array} props.salesmen - List of salesmen.
 * @param {Array} props.expenseOwners - List of custom expense owners.
 * @param {Function} props.onAddExpense - Callback to trigger the add expense modal.
 * @param {Function} props.onEditExpense - Callback to trigger the edit expense modal.
 * @param {Function} props.onAddOwner - Async function to create a new expense owner via API.
 */
const AccountManagement = ({ 
    expenses = [], 
    salesmen = [], 
    expenseOwners = [], 
    onAddExpense, 
    onEditExpense,
    onAddOwner 
}) => {
    const [newOwnerName, setNewOwnerName] = useState('');
    const [isCreatingOwner, setIsCreatingOwner] = useState(false);

    // Group expenses by account using a Map for efficient lookup
    const accountExpenses = useMemo(() => {
        const accounts = new Map();
        
        // Initialize salesman accounts using MongoDB _id
        salesmen.forEach(salesman => {
            const id = salesman._id || salesman.id;
            accounts.set(`salesman-${id}`, {
                id: id,
                name: salesman.name,
                type: 'salesman',
                expenses: [],
                totalExpenses: 0
            });
        });

        // Initialize custom owner accounts using MongoDB _id
        expenseOwners.forEach(owner => {
            const id = owner._id || owner.id;
            accounts.set(`owner-${id}`, {
                id: id,
                name: owner.name,
                type: 'owner',
                expenses: [],
                totalExpenses: 0
            });
        });

        // Aggregate expenses into their respective accounts
        expenses.forEach(expense => {
            if (expense.ownerId && expense.ownerType) {
                // Ensure we extract the string ID just in case ownerId was populated as an object by Mongoose
                const oId = typeof expense.ownerId === 'object' ? expense.ownerId._id : expense.ownerId;
                const key = `${expense.ownerType}-${oId}`;
                
                const account = accounts.get(key);
                if (account) {
                    account.expenses.push(expense);
                    account.totalExpenses += (Number(expense.amount) || 0);
                }
            }
        });

        // Sort to show accounts with the most expenses first
        return Array.from(accounts.values()).sort((a, b) => b.totalExpenses - a.totalExpenses);
    }, [expenses, salesmen, expenseOwners]);

    const handleCreateOwner = async () => {
        if (!newOwnerName.trim()) {
            alert("Account name cannot be empty.");
            return;
        }
        setIsCreatingOwner(true);
        try {
            await onAddOwner(newOwnerName.trim());
            setNewOwnerName('');
        } catch (error) {
            console.error("Failed to create owner:", error);
            alert("Failed to create account. Please try again.");
        } finally {
            setIsCreatingOwner(false);
        }
    };

    const handleAddExpenseForAccount = (accountId, accountType) => {
        // Construct the expected payload object to prefill the AddExpenseModal
        onAddExpense({ id: accountId, type: accountType });
    };

    return (
        <div className="space-y-8 animate-fade-in">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Account Management</h1>
                    <p className="text-brand-text-secondary mt-1">Track and manage expenses across different profiles.</p>
                </div>
            </div>

            {/* Create New Account Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h3 className="text-lg font-bold text-brand-text-primary">Create Custom Account</h3>
                    <p className="text-sm text-brand-text-secondary">Useful for tracking non-salesman expenses (e.g. Utility Bills, Rent).</p>
                </div>
                <div className="flex items-center space-x-3 w-full md:w-auto">
                    <input
                        type="text"
                        placeholder="Enter account name..."
                        value={newOwnerName}
                        onChange={e => setNewOwnerName(e.target.value)}
                        className="flex-1 md:w-64 px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue shadow-sm transition-all"
                    />
                    <button
                        onClick={handleCreateOwner}
                        disabled={!newOwnerName.trim() || isCreatingOwner}
                        className="px-6 py-2.5 bg-brand-blue text-white rounded-lg font-bold shadow-md hover:bg-brand-lightblue disabled:bg-gray-300 disabled:cursor-not-allowed active:scale-95 transition-all whitespace-nowrap"
                    >
                        {isCreatingOwner ? 'Creating...' : 'Create'}
                    </button>
                </div>
            </div>
            
            

            {/* Accounts Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {accountExpenses.map((account) => (
                    <div key={`${account.type}-${account.id}`} className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col">
                        <div className="p-6 border-b border-gray-100 bg-gray-50 flex-grow-0">
                            <div className="flex justify-between items-start mb-3">
                                <h3 className="text-xl font-bold text-brand-text-primary truncate pr-2" title={account.name}>{account.name}</h3>
                                <span className={`px-2.5 py-1 text-[10px] uppercase tracking-wider font-bold rounded-full border ${
                                    account.type === 'salesman' 
                                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                                        : 'bg-green-50 text-green-700 border-green-200'
                                }`}>
                                    {account.type === 'salesman' ? 'Salesman' : 'General'}
                                </span>
                            </div>
                            <div className="flex justify-between items-end mt-4">
                                <div>
                                    <div className="text-xs text-brand-text-secondary uppercase font-bold tracking-wider mb-1">Total Expenses</div>
                                    <div className="text-2xl font-black text-red-600 leading-none">
                                        PKR {account.totalExpenses.toLocaleString()}
                                    </div>
                                </div>
                                <div className="text-xs font-semibold text-gray-500 bg-white px-2 py-1 rounded-md border border-gray-200">
                                    {account.expenses.length} record{account.expenses.length !== 1 ? 's' : ''}
                                </div>
                            </div>
                        </div>
                        
                        <div className="p-5 flex-grow flex flex-col justify-between bg-white">
                            {account.expenses.length > 0 ? (
                                <div className="mb-5 space-y-2">
                                    <div className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-3">Recent Activity:</div>
                                    {account.expenses.slice(-3).reverse().map((expense) => (
                                        <div key={expense._id || expense.id} className="flex justify-between items-center p-2.5 bg-gray-50/80 border border-gray-100 rounded-lg group hover:bg-blue-50/50 transition-colors">
                                            <div className="flex-1 min-w-0 pr-2">
                                                <div className="font-bold text-sm text-brand-text-primary truncate" title={expense.name}>
                                                    {expense.name}
                                                </div>
                                                <div className="text-[10px] text-brand-text-secondary font-medium uppercase mt-0.5">
                                                    {new Date(expense.date).toLocaleDateString(undefined, {month:'short', day:'numeric'})} • {expense.category}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-3 flex-shrink-0">
                                                <span className="font-black text-sm text-red-600">
                                                    {Number(expense.amount).toLocaleString()}
                                                </span>
                                                <button 
                                                    onClick={() => onEditExpense(expense)}
                                                    className="text-gray-400 hover:text-brand-blue transition-colors p-1 focus:outline-none opacity-0 group-hover:opacity-100"
                                                    title="Edit Expense"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="mb-5 py-6 text-center text-sm text-gray-400 italic bg-gray-50/50 rounded-lg border border-gray-100 border-dashed">
                                    No expenses recorded yet.
                                </div>
                            )}

                            <button
                                onClick={() => handleAddExpenseForAccount(account.id, account.type)}
                                className="w-full flex items-center justify-center bg-gray-100 text-brand-text-primary px-4 py-2.5 rounded-lg font-bold hover:bg-gray-200 transition-colors active:scale-95"
                            >
                                <PlusCircleIcon className="h-4 w-4 mr-2" />
                                Record Expense
                            </button>
                        </div>
                    </div>
                ))}
                
                {accountExpenses.length === 0 && (
                    <div className="col-span-full text-center py-16 bg-white rounded-xl shadow-sm border border-gray-100">
                        <div className="text-gray-400 mb-3 flex justify-center">
                            <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"></path></svg>
                        </div>
                        <div className="text-brand-text-primary font-bold text-xl">No accounts generated</div>
                        <div className="text-brand-text-secondary text-sm mt-1">Add salesmen or create custom owners to start tracking.</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AccountManagement;