
import React, { useState, useMemo, useEffect } from 'react';
import { EXPENSE_CATEGORIES } from '../../types';

/**
 * Modal for recording expenses and attributing them to specific accounts.
 * @param {Object} props
 * @param {boolean} props.isOpen
 * @param {Function} props.onClose
 * @param {Function} props.onAddExpense
 * @param {Array} props.salesmen
 * @param {Array} props.expenseOwners
 * @param {Function} props.onAddOwner
 * @param {Object} [props.preselectedAccountId]
 */
const AddExpenseModal = ({ 
    isOpen, 
    onClose, 
    onAddExpense, 
    salesmen = [], 
    expenseOwners = [], 
    onAddOwner, 
    preselectedAccountId 
}) => {
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [selectedOwner, setSelectedOwner] = useState(''); // Format: "salesman-mongoId123" or "owner-mongoId456"
    const [newOwnerName, setNewOwnerName] = useState('');
    const [isCreatingOwner, setIsCreatingOwner] = useState(false);

    // Combine salesman and custom owner accounts for the dropdown
    const accounts = useMemo(() => {
        const salesmanAccounts = salesmen.map(s => ({ 
            id: `salesman-${s._id || s.id}`, 
            name: s.name 
        }));
        const ownerAccounts = expenseOwners.map(o => ({ 
            id: `owner-${o._id || o.id}`, 
            name: o.name 
        }));
        
        return [...salesmanAccounts, ...ownerAccounts].sort((a, b) => a.name.localeCompare(b.name));
    }, [salesmen, expenseOwners]);

    useEffect(() => {
        if (!isOpen) {
            // Reset form on close
            setDate(new Date().toISOString().split('T')[0]);
            setCategory('');
            setName('');
            setDescription('');
            setAmount('');
            setPaymentMethod('Cash');
            setSelectedOwner('');
            setNewOwnerName('');
            setIsCreatingOwner(false);
        } else if (preselectedAccountId && preselectedAccountId.id && preselectedAccountId.type) {
            // Set preselected account when modal opens (e.g. from a specific profile view)
            setSelectedOwner(`${preselectedAccountId.type}-${preselectedAccountId.id}`);
        }
    }, [isOpen, preselectedAccountId]);

    const handleCreateOwner = async () => {
        if (!newOwnerName.trim()) {
            alert("Owner name cannot be empty.");
            return;
        }
        setIsCreatingOwner(true);
        try {
            // Wait for backend to create the owner and return the DB object
            const newOwner = await onAddOwner(newOwnerName.trim());
            if (newOwner) {
                setNewOwnerName('');
                const ownerId = newOwner._id || newOwner.id;
                setSelectedOwner(`owner-${ownerId}`);
            }
        } catch (error) {
            console.error("Failed to create owner:", error);
            alert("Failed to create new account owner. Please try again.");
        } finally {
            setIsCreatingOwner(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Parse the compound string (e.g. "salesman-64f1b2c3...")
        // Using substring parsing in case the MongoDB ID itself contains hyphens (though rare)
        let ownerType = null;
        let ownerId = null;

        if (selectedOwner) {
            const separatorIndex = selectedOwner.indexOf('-');
            ownerType = selectedOwner.substring(0, separatorIndex);
            ownerId = selectedOwner.substring(separatorIndex + 1);
        }

        // Object formatted for Express backend
        const newExpense = {
            date: new Date(date).toISOString(), // Standardize to full ISO string
            category,
            name,
            description,
            amount: Number(amount),
            paymentMethod,
            ownerId: ownerId || null,
            ownerType: ownerId ? ownerType : null,
        };
        
        onAddExpense(newExpense);
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-text-primary">Record Expense</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <label htmlFor="account-owner" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Account / Owner (Optional)
                        </label>
                        <select
                            id="account-owner"
                            value={selectedOwner}
                            onChange={e => setSelectedOwner(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm cursor-pointer transition-all"
                        >
                            <option value="">-- General Plant Expense --</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                        
                        <div className="flex items-center mt-3 space-x-2">
                            <input
                                type="text"
                                placeholder="Add new account (e.g., Electricity)"
                                value={newOwnerName}
                                onChange={e => setNewOwnerName(e.target.value)}
                                className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                            />
                            <button
                                type="button"
                                onClick={handleCreateOwner}
                                disabled={!newOwnerName.trim() || isCreatingOwner}
                                className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300 font-bold disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed transition-colors whitespace-nowrap"
                            >
                                {isCreatingOwner ? '...' : 'Create'}
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="date" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Date</label>
                            <input 
                                type="date" 
                                id="date" 
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                        <div>
                            <label htmlFor="category" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Category</label>
                            <input 
                                type="text" 
                                id="category" 
                                list="expense-categories" 
                                value={category} 
                                placeholder="e.g., Fuel" 
                                onChange={e => setCategory(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                            <datalist id="expense-categories">
                                {EXPENSE_CATEGORIES.map(cat => <option key={cat} value={cat} />)}
                            </datalist>
                        </div>
                    </div>

                    <div>
                        <label htmlFor="name" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Expense Title</label>
                        <input 
                            type="text" 
                            id="name" 
                            value={name} 
                            placeholder="e.g., Generator Diesel" 
                            onChange={e => setName(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="description" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Description (Optional)</label>
                        <input 
                            type="text" 
                            id="description" 
                            value={description} 
                            placeholder="Receipt number or details..." 
                            onChange={e => setDescription(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="amount" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Amount (PKR)</label>
                            <input 
                                type="number" 
                                id="amount" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} 
                                required 
                                min="1" 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                        <div>
                            <label htmlFor="paymentMethod" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Paid From</label>
                            <select 
                                id="paymentMethod" 
                                value={paymentMethod} 
                                onChange={e => setPaymentMethod(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all cursor-pointer"
                            >
                                <option value="Cash">Cash Drawer</option>
                                <option value="Bank">Bank Account</option>
                            </select>
                        </div>
                    </div>

                    <div className="flex justify-end pt-6 border-t border-gray-100 mt-6 space-x-3">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            className="px-5 py-2.5 bg-gray-100 text-brand-text-secondary rounded-lg hover:bg-gray-200 font-bold transition-all"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            className="px-5 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-lightblue font-bold shadow-md transition-all active:scale-95"
                        >
                            Save Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddExpenseModal;