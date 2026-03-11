// import React, { useState, useEffect } from 'react';

// /**
//  * Modal component for editing existing inventory item details.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls visibility.
//  * @param {Function} props.onClose - Closes the modal.
//  * @param {Object|null} props.item - The inventory item object to be edited.
//  * @param {Function} props.onUpdateItem - Callback to save changes.
//  */
// const EditInventoryItemModal = ({ isOpen, onClose, item, onUpdateItem }) => {
//     const [name, setName] = useState('');
//     const [category, setCategory] = useState('');
//     const [lowStockThreshold, setLowStockThreshold] = useState(10);
//     const [sellingPrice, setSellingPrice] = useState(0);

//     // Sync local state when the item prop changes (modal opens or item switches)
//     useEffect(() => {
//         if (item) {
//             setName(item.name);
//             setCategory(item.category);
//             setLowStockThreshold(item.lowStockThreshold);
//             setSellingPrice(item.sellingPrice);
//         }
//     }, [item]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!item) return;

//         // Spread existing item and overwrite with new values
//         onUpdateItem({ 
//             ...item, 
//             name, 
//             category, 
//             lowStockThreshold, 
//             sellingPrice 
//         });
//     };

//     if (!isOpen || !item) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
//             <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-brand-text-primary">Edit Item Details</h2>
//                     <button 
//                         onClick={onClose} 
//                         className="text-gray-400 hover:text-gray-600 text-3xl"
//                     >
//                         &times;
//                     </button>
//                 </div>
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="edit-item-name" className="block text-sm font-medium text-brand-text-secondary">
//                             Item Name
//                         </label>
//                         <input 
//                             type="text" 
//                             id="edit-item-name" 
//                             value={name} 
//                             onChange={e => setName(e.target.value)} 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="edit-item-category" className="block text-sm font-medium text-brand-text-secondary">
//                             Category
//                         </label>
//                         <input 
//                             type="text" 
//                             id="edit-item-category" 
//                             value={category} 
//                             onChange={e => setCategory(e.target.value)} 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>
//                     <div>
//                         <label htmlFor="edit-item-threshold" className="block text-sm font-medium text-brand-text-secondary">
//                             Low Stock Threshold
//                         </label>
//                         <input 
//                             type="number" 
//                             id="edit-item-threshold" 
//                             value={lowStockThreshold} 
//                             onChange={e => setLowStockThreshold(Number(e.target.value))} 
//                             required 
//                             min="0" 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>
//                      <div>
//                         <label htmlFor="edit-item-price" className="block text-sm font-medium text-brand-text-secondary">
//                             Selling Price (PKR)
//                         </label>
//                         <input 
//                             type="number" 
//                             id="edit-item-price" 
//                             value={sellingPrice} 
//                             onChange={e => setSellingPrice(Number(e.target.value))} 
//                             required 
//                             min="0" 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>
//                     <div className="flex justify-end pt-4 space-x-2">
//                         <button 
//                             type="button" 
//                             onClick={onClose} 
//                             className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300"
//                         >
//                             Cancel
//                         </button>
//                         <button 
//                             type="submit" 
//                             className="px-4 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue"
//                         >
//                             Update Item
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditInventoryItemModal;


import React, { useState, useEffect } from 'react';

/**
 * Modal component for editing existing inventory item details.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Closes the modal.
 * @param {Object|null} props.item - The inventory item object from MongoDB to be edited.
 * @param {Function} props.onUpdateItem - Callback to pass the updated object to the Dashboard.
 */
const EditInventoryItemModal = ({ isOpen, onClose, item, onUpdateItem }) => {
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [lowStockThreshold, setLowStockThreshold] = useState(10);
    const [sellingPrice, setSellingPrice] = useState(0);

    // Sync local state when the item prop changes (modal opens or item switches)
    useEffect(() => {
        if (item && isOpen) {
            setName(item.name || '');
            setCategory(item.category || '');
            setLowStockThreshold(item.lowStockThreshold || 0);
            setSellingPrice(item.sellingPrice || 0);
        }
    }, [item, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!item) return;

        if (!name.trim() || !category.trim()) {
            alert("Name and Category cannot be empty.");
            return;
        }

        // Spread existing item to preserve its MongoDB _id, then overwrite with new values
        onUpdateItem({ 
            ...item, 
            name: name.trim(), 
            category: category.trim(), 
            lowStockThreshold: Number(lowStockThreshold), 
            sellingPrice: Number(sellingPrice) 
        });
        
        onClose();
    };

    if (!isOpen || !item) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-2xl font-bold text-brand-text-primary">Edit Item</h2>
                        <p className="text-sm font-medium text-brand-blue mt-1">Editing: {item.name}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none self-start"
                    >
                        &times;
                    </button>
                </div>
                
                

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-item-name" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Item Name
                        </label>
                        <input 
                            type="text" 
                            id="edit-item-name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="edit-item-category" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Category
                        </label>
                        <input 
                            type="text" 
                            id="edit-item-category" 
                            value={category} 
                            onChange={e => setCategory(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-item-price" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                                Selling Price (PKR)
                            </label>
                            <input 
                                type="number" 
                                id="edit-item-price" 
                                value={sellingPrice} 
                                onChange={e => setSellingPrice(Number(e.target.value))} 
                                required 
                                min="0" 
                                className="mt-1 block w-full px-3 py-3 border border-gray-300 bg-gray-50 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                        <div>
                            <label htmlFor="edit-item-threshold" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                                Low Stock Alert At
                            </label>
                            <input 
                                type="number" 
                                id="edit-item-threshold" 
                                value={lowStockThreshold} 
                                onChange={e => setLowStockThreshold(Number(e.target.value))} 
                                required 
                                min="0" 
                                className="mt-1 block w-full px-3 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
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
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditInventoryItemModal;