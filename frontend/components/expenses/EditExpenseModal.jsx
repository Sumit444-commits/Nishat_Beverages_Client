

import React, { useState, useEffect, useMemo } from 'react';
import { EXPENSE_CATEGORIES } from '../../types';

/**
 * Modal component for editing existing expense records via MongoDB.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Closes the modal.
 * @param {Object|null} props.expense - The existing expense object to populate the form.
 * @param {Function} props.onUpdateExpense - Callback to push changes to the Dashboard/Backend.
 * @param {Array} props.salesmen - List of salesmen for account mapping.
 * @param {Array} props.expenseOwners - List of custom expense owners.
 */
const EditExpenseModal = ({ 
    isOpen, 
    onClose, 
    expense, 
    onUpdateExpense, 
    salesmen = [], 
    expenseOwners = [] 
}) => {
    const [date, setDate] = useState('');
    const [category, setCategory] = useState('');
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [amount, setAmount] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('Cash');
    const [selectedOwner, setSelectedOwner] = useState('');

    // Prepares the list of available accounts for attribution using MongoDB _id
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

    // Populate form fields when the expense prop changes
    useEffect(() => {
        if (expense && isOpen) {
            setDate(expense.date ? expense.date.split('T')[0] : '');
            setCategory(expense.category || '');
            setName(expense.name || '');
            setDescription(expense.description || '');
            setAmount(expense.amount || '');
            setPaymentMethod(expense.paymentMethod || 'Cash');
            
            // Reconstruct the compound string using the string IDs
            if (expense.ownerType && expense.ownerId) {
                // Ensure ownerId is extracted properly if it was populated as an object
                const oId = typeof expense.ownerId === 'object' ? expense.ownerId._id : expense.ownerId;
                setSelectedOwner(`${expense.ownerType}-${oId}`);
            } else {
                setSelectedOwner('');
            }
        }
    }, [expense, isOpen]);
    
    const handleSubmit = (e) => {
        e.preventDefault();
        if (!expense) return;

        // Split the compound string (e.g., "salesman-64f1b2c3...") back into components
        let ownerType = null;
        let ownerId = null;

        if (selectedOwner) {
            const separatorIndex = selectedOwner.indexOf('-');
            ownerType = selectedOwner.substring(0, separatorIndex);
            ownerId = selectedOwner.substring(separatorIndex + 1);
        }

        const updatedExpense = {
            ...expense,
            date: new Date(date).toISOString(),
            category,
            name,
            description,
            amount: Number(amount),
            paymentMethod,
            ownerId: ownerId || null,
            ownerType: ownerId ? ownerType : null,
        };
        
        onUpdateExpense(updatedExpense);
        onClose();
    };

    if (!isOpen || !expense) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Edit Expense</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
                        <label htmlFor="edit-account-owner" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Account / Owner (Optional)
                        </label>
                        <select
                            id="edit-account-owner"
                            value={selectedOwner}
                            onChange={e => setSelectedOwner(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm cursor-pointer transition-all"
                        >
                            <option value="">-- General Plant Expense --</option>
                            {accounts.map(acc => <option key={acc.id} value={acc.id}>{acc.name}</option>)}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-date" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Date</label>
                            <input 
                                type="date" 
                                id="edit-date" 
                                value={date} 
                                onChange={e => setDate(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-category" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Category</label>
                            <input 
                                type="text" 
                                id="edit-category" 
                                list="expense-categories" 
                                value={category} 
                                placeholder="e.g., Utilities" 
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
                        <label htmlFor="edit-name" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Expense Title</label>
                        <input 
                            type="text" 
                            id="edit-name" 
                            value={name} 
                            placeholder="e.g., Electricity Bill" 
                            onChange={e => setName(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="edit-description" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Description</label>
                        <input 
                            type="text" 
                            id="edit-description" 
                            value={description} 
                            placeholder="Optional details" 
                            onChange={e => setDescription(e.target.value)} 
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-amount" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Amount (PKR)</label>
                            <input 
                                type="number" 
                                id="edit-amount" 
                                value={amount} 
                                onChange={e => setAmount(e.target.value === '' ? '' : Number(e.target.value))} 
                                required 
                                min="0" 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-paymentMethod" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Payment From</label>
                            <select 
                                id="edit-paymentMethod" 
                                value={paymentMethod} 
                                onChange={e => setPaymentMethod(e.target.value)} 
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm cursor-pointer transition-all"
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
                            Update Expense
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditExpenseModal;