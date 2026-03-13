

import React, { useState } from 'react';

/**
 * Modal component for adding new items to the plant inventory.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls modal visibility.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onAddItem - Callback to pass the new item data to the Dashboard.
 */
const AddInventoryItemModal = ({ isOpen, onClose, onAddItem }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [stock, setStock] = useState(0);
    const [lowStockThreshold, setLowStockThreshold] = useState(20);
    const [sellingPrice, setSellingPrice] = useState(0);

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!name.trim() || !category.trim()) {
            alert("Name and Category are required.");
            return;
        }

        // Construct object matching the MongoDB schema
        onAddItem({ 
            name: name.trim(), 
            category: category.trim(), 
            stock: Number(stock), 
            lowStockThreshold: Number(lowStockThreshold), 
            sellingPrice: Number(sellingPrice) 
        });

        // Reset form fields
        setName('');
        setCategory('');
        setStock(0);
        setLowStockThreshold(20);
        setSellingPrice(0);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-2xl font-bold text-brand-text-primary">Add Inventory Item</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="item-name" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Item Name</label>
                        <input 
                            type="text" 
                            id="item-name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            placeholder="e.g. 19 Ltr Bottle"
                            required 
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="item-category" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Category</label>
                        <input 
                            type="text" 
                            id="item-category" 
                            value={category} 
                            placeholder="e.g. Water, Maintenance, Filters" 
                            onChange={e => setCategory(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="item-stock" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Initial Stock</label>
                            <input 
                                type="number" 
                                id="item-stock" 
                                value={stock} 
                                onChange={e => setStock(Number(e.target.value))} 
                                required 
                                min="0" 
                                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                        <div>
                            <label htmlFor="item-price" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Sell Price (PKR)</label>
                            <input 
                                type="number" 
                                id="item-price" 
                                value={sellingPrice} 
                                placeholder="e.g. 150" 
                                onChange={e => setSellingPrice(Number(e.target.value))} 
                                required 
                                min="0" 
                                className="mt-1 block w-full px-3 py-3 border border-gray-300 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="item-threshold" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Low Stock Warning At</label>
                        <input 
                            type="number" 
                            id="item-threshold" 
                            value={lowStockThreshold} 
                            onChange={e => setLowStockThreshold(Number(e.target.value))} 
                            required 
                            min="0" 
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                        <p className="text-xs text-gray-500 mt-1">Dashboard will alert you when stock drops below this number.</p>
                    </div>
                    
                    <div className="flex justify-end pt-4 space-x-3 mt-4 border-t border-gray-100">
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
                            Save Item
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddInventoryItemModal;