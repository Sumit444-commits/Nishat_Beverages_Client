// import React from 'react';
// import { PlusCircleIcon } from '../icons/PlusCircleIcon';
// import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
// import { EditIcon } from '../icons/EditIcon';
// import { PackageIcon } from '../icons/PackageIcon';
// import { TrashIcon } from '../icons/TrashIcon';

// /**
//  * Inventory Management Component.
//  * Displays a list of all products (Water Bottles, Accessories, etc.) with stock levels.
//  * * @param {Object} props
//  * @param {Array} props.inventory - Array of items in the inventory.
//  * @param {Function} props.onAddItem - Callback for adding a new product.
//  * @param {Function} props.onEditItem - Callback for editing item details.
//  * @param {Function} props.onUpdateStock - Callback for manual stock adjustments (Add/Subtract).
//  * @param {Function} props.onSellItem - Callback for initiating a quick sale of an item.
//  * @param {Function} props.onDeleteItem - Callback for removing an item from the system.
//  * @param {Function} props.onViewDetails - Callback for navigating to item history/analytics.
//  */
// const Inventory = ({ 
//     inventory, 
//     onAddItem, 
//     onEditItem, 
//     onUpdateStock, 
//     onSellItem, 
//     onDeleteItem, 
//     onViewDetails 
// }) => {
//     return (
//         <div className="bg-brand-surface rounded-xl shadow-md overflow-hidden">
//             <div className="p-6 flex justify-between items-center border-b border-gray-200">
//                 <h2 className="text-xl font-bold text-brand-text-primary">Inventory Management</h2>
//                 <button 
//                     onClick={onAddItem}
//                     className="flex items-center bg-brand-blue text-white px-4 py-2 rounded-lg font-semibold hover:bg-brand-lightblue transition-colors shadow-sm"
//                 >
//                     <PlusCircleIcon className="h-5 w-5 mr-2" />
//                     Add Item
//                 </button>
//             </div>

            

//             <div className="overflow-x-auto">
//                 <table className="w-full text-sm text-left text-brand-text-secondary">
//                     <thead className="text-xs text-brand-text-secondary uppercase bg-gray-50">
//                         <tr>
//                             <th scope="col" className="px-6 py-3 font-bold">Item Name</th>
//                             <th scope="col" className="px-6 py-3 font-bold">Category</th>
//                             <th scope="col" className="px-6 py-3 font-bold">Current Stock</th>
//                             <th scope="col" className="px-6 py-3 font-bold">Low Stock Threshold</th>
//                             <th scope="col" className="px-6 py-3 font-bold">Status</th>
//                             <th scope="col" className="px-6 py-3 text-center font-bold">Actions</th>
//                         </tr>
//                     </thead>
//                     <tbody>
//                         {inventory.length > 0 ? inventory.map((item) => {
//                             // Logic to determine if we should show a warning
//                             const isLowStock = item.stock < item.lowStockThreshold;
                            
//                             return (
//                                 <tr key={item.id} className="bg-white border-b hover:bg-gray-50 transition-colors">
//                                     <td className="px-6 py-4 font-medium text-brand-text-primary">{item.name}</td>
//                                     <td className="px-6 py-4">{item.category}</td>
//                                     <td className={`px-6 py-4 font-semibold ${isLowStock ? 'text-red-500' : 'text-brand-text-primary'}`}>
//                                         {item.stock.toLocaleString()}
//                                     </td>
//                                     <td className="px-6 py-4">{item.lowStockThreshold}</td>
//                                     <td className="px-6 py-4">
//                                         {isLowStock ? (
//                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
//                                                 <AlertTriangleIcon className="h-3 w-3 mr-1.5" />
//                                                 Low Stock
//                                             </span>
//                                         ) : (
//                                             <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
//                                                 In Stock
//                                             </span>
//                                         )}
//                                     </td>
//                                     <td className="px-6 py-4">
//                                         <div className="flex items-center justify-center space-x-4">
//                                             {/* Details Button */}
//                                             <button 
//                                                 onClick={() => onViewDetails(item)} 
//                                                 className="font-semibold text-xs text-brand-blue hover:underline"
//                                             >
//                                                 Details
//                                             </button>

//                                             {/* Edit Button */}
//                                             <button onClick={() => onEditItem(item)} title="Edit Item Details" className="text-brand-blue hover:text-brand-accent">
//                                                 <EditIcon className="h-4 w-4" />
//                                             </button>

//                                             {/* Stock Adjustment Button */}
//                                             <button onClick={() => onUpdateStock(item)} title="Add/Subtract Stock" className="text-blue-600 hover:text-blue-800">
//                                                 <PlusCircleIcon className="h-5 w-5" />
//                                             </button>

//                                             {/* Quick Sale Button */}
//                                             <button onClick={() => onSellItem(item)} title="Quick Sale" className="text-green-600 hover:text-green-800">
//                                                 <PackageIcon className="h-5 w-5" />
//                                             </button>

//                                             {/* Delete Button */}
//                                             <button 
//                                                 onClick={() => {
//                                                     if(window.confirm(`Are you sure you want to delete ${item.name}?`)) {
//                                                         onDeleteItem(item.id);
//                                                     }
//                                                 }} 
//                                                 title="Delete Item" 
//                                                 className="text-red-500 hover:text-red-700"
//                                             >
//                                                 <TrashIcon className="h-4 w-4" />
//                                             </button>
//                                         </div>
//                                     </td>
//                                 </tr>
//                             );
//                         }) : (
//                             <tr>
//                                 <td colSpan="6" className="text-center py-10 text-gray-500">
//                                     No items found. Click "Add Item" to begin tracking stock.
//                                 </td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </div>
//     );
// };

// export default Inventory;


import React from 'react';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { AlertTriangleIcon } from '../icons/AlertTriangleIcon';
import { EditIcon } from '../icons/EditIcon';
import { PackageIcon } from '../icons/PackageIcon';
import { TrashIcon } from '../icons/TrashIcon';

/**
 * Inventory Management Component.
 * Displays a list of all products (Water Bottles, Accessories, etc.) with stock levels.
 * @param {Object} props
 * @param {Array} props.inventory - Array of items in the inventory from MongoDB.
 * @param {Function} props.onAddItem - Callback for adding a new product.
 * @param {Function} props.onEditItem - Callback for editing item details.
 * @param {Function} props.onUpdateStock - Callback for manual stock adjustments (Add/Subtract).
 * @param {Function} props.onSellItem - Callback for initiating a quick sale of an item.
 * @param {Function} props.onDeleteItem - Callback for removing an item from the system.
 * @param {Function} props.onViewDetails - Callback for navigating to item history/analytics.
 */
const Inventory = ({ 
    inventory = [], 
    onAddItem, 
    onEditItem, 
    onUpdateStock, 
    onSellItem, 
    onDeleteItem, 
    onViewDetails 
}) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Master Inventory</h1>
                    <p className="text-brand-text-secondary mt-1">Manage plant products, accessories, and stock thresholds.</p>
                </div>
                <button 
                    onClick={onAddItem}
                    className="flex items-center justify-center bg-brand-blue text-white px-6 py-2.5 rounded-lg font-bold hover:bg-brand-lightblue transition-all shadow-md active:scale-95 w-full md:w-auto"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add Product
                </button>
            </div>

            

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                    <h3 className="text-xl font-black text-brand-text-primary tracking-tight">Stock Levels</h3>
                    <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
                        {inventory.length} Item{inventory.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left text-brand-text-secondary relative">
                        <thead className="text-xs text-brand-text-secondary uppercase bg-white font-bold tracking-wider border-b border-gray-200 sticky top-0 shadow-sm z-10">
                            <tr>
                                <th scope="col" className="px-6 py-4">Item Name</th>
                                <th scope="col" className="px-6 py-4">Category</th>
                                <th scope="col" className="px-6 py-4 text-center">Current Stock</th>
                                <th scope="col" className="px-6 py-4 text-center">Price (PKR)</th>
                                <th scope="col" className="px-6 py-4 text-center">Status</th>
                                <th scope="col" className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {inventory.length > 0 ? inventory.map((item) => {
                                // Logic to determine if we should show a warning
                                const isLowStock = item.stock <= item.lowStockThreshold;
                                
                                return (
                                    <tr key={item._id || item.id} className={`bg-white transition-colors group ${isLowStock ? 'hover:bg-red-50/30' : 'hover:bg-blue-50/30'}`}>
                                        <td className="px-6 py-5 font-bold text-brand-text-primary whitespace-nowrap">
                                            {item.name}
                                        </td>
                                        <td className="px-6 py-5 whitespace-nowrap">
                                            <span className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border border-gray-200">
                                                {item.category || 'General'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            <div className="flex flex-col items-center">
                                                <span className={`text-xl font-black ${isLowStock ? 'text-red-600' : 'text-brand-text-primary'}`}>
                                                    {Number(item.stock || 0).toLocaleString()}
                                                </span>
                                                <span className="text-[10px] text-gray-400 font-medium">
                                                    Warn at {item.lowStockThreshold}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-5 text-center font-bold text-brand-blue">
                                            {Number(item.sellingPrice || 0).toLocaleString()}
                                        </td>
                                        <td className="px-6 py-5 text-center">
                                            {isLowStock ? (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-red-50 text-red-700 border border-red-200">
                                                    <AlertTriangleIcon className="h-3 w-3 mr-1.5" />
                                                    Low Stock
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-green-50 text-green-700 border border-green-200">
                                                    In Stock
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-5 text-right">
                                            <div className="flex items-center justify-end space-x-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                                
                                                {/* Primary Actions */}
                                                <button 
                                                    onClick={() => onSellItem(item)} 
                                                    title="Quick Sale" 
                                                    className="bg-brand-blue text-white p-1.5 rounded-md hover:bg-brand-lightblue transition-colors shadow-sm active:scale-95"
                                                >
                                                    <PackageIcon className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => onUpdateStock(item)} 
                                                    title="Adjust Stock Levels" 
                                                    className="bg-green-500 text-white p-1.5 rounded-md hover:bg-green-600 transition-colors shadow-sm active:scale-95"
                                                >
                                                    <PlusCircleIcon className="h-4 w-4" />
                                                </button>

                                                <div className="w-px h-5 bg-gray-200 mx-1"></div>

                                                {/* Administrative Actions */}
                                                {/* Details Button Disabled for now as it's not fully implemented in standard views 
                                                <button 
                                                    onClick={() => onViewDetails(item)} 
                                                    className="font-semibold text-xs text-brand-blue hover:underline px-2"
                                                >
                                                    History
                                                </button> */}
                                                <button 
                                                    onClick={() => onEditItem(item)} 
                                                    title="Edit Item Pricing/Thresholds" 
                                                    className="text-brand-text-secondary hover:text-brand-blue hover:bg-blue-50 p-1.5 rounded-md transition-colors"
                                                >
                                                    <EditIcon className="h-4 w-4" />
                                                </button>
                                                <button 
                                                    onClick={() => {
                                                        if(window.confirm(`Are you sure you want to permanently delete ${item.name}? This may break past sales records.`)) {
                                                            onDeleteItem(item._id || item.id);
                                                        }
                                                    }} 
                                                    title="Delete Product" 
                                                    className="text-gray-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded-md transition-colors"
                                                >
                                                    <TrashIcon className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            }) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-16 px-6">
                                        <div className="flex justify-center mb-3">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"></path></svg>
                                        </div>
                                        <p className="text-brand-text-primary font-bold text-lg">No products found.</p>
                                        <p className="text-brand-text-secondary mt-1">Click "Add Product" to build your inventory.</p>
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

export default Inventory;