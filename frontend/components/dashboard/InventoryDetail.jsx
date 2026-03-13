
import React from 'react';
import { ArrowLeftIcon } from '../icons/ArrowLeftIcon';
import StatCard from './StatCard';
import { PackageIcon } from '../icons/PackageIcon';
import { DollarSignIcon } from '../icons/DollarSignIcon';
import { BarChartIcon } from '../icons/BarChartIcon';

/**
 * Detailed view for a specific inventory item.
 * Shows historical sales, stock adjustments, and financial value.
 * @param {Object} props
 * @param {Object} props.item - The inventory item object from MongoDB.
 * @param {Array} props.sales - Sales records associated with this item.
 * @param {Array} props.customers - Global customer list for name lookup.
 * @param {Array} props.adjustments - History of manual stock changes.
 * @param {Function} props.onBack - Navigation callback to return to the list.
 */
const InventoryDetail = ({ item, sales = [], customers = [], adjustments = [], onBack }) => {

    const getCustomerName = (customerId) => {
        if (!customerId) return 'Counter Sale';
        const targetId = String(typeof customerId === 'object' ? customerId._id : customerId);
        const customer = customers.find(c => String(c._id || c.id) === targetId);
        return customer ? customer.name : 'Unknown Customer';
    };

    // Sort data by date (most recent first)
    const sortedSales = [...sales].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    });

    const sortedAdjustments = [...adjustments].sort((a, b) => {
        const dateA = a.date ? new Date(a.date).getTime() : 0;
        const dateB = b.date ? new Date(b.date).getTime() : 0;
        return dateB - dateA;
    });

    if (!item) return null;

    return (
        <div className="space-y-6 animate-fade-in">
            <div>
                <button 
                    onClick={onBack} 
                    className="flex items-center text-sm font-bold text-brand-text-secondary hover:text-brand-blue mb-3 transition-colors"
                >
                    <ArrowLeftIcon className="h-4 w-4 mr-2" />
                    Back to Master Inventory
                </button>
                <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-2 border-b border-gray-200 pb-4">
                    <div>
                        <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">{item.name}</h1>
                        <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-brand-blue font-bold text-xs uppercase tracking-wider rounded-md border border-blue-100">
                            {item.category || 'General'}
                        </span>
                    </div>
                </div>
            </div>

            

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                    title="Current Stock" 
                    value={Number(item.stock || 0).toLocaleString()} 
                    icon={<PackageIcon />} 
                    color={item.stock <= item.lowStockThreshold ? 'text-red-500' : 'text-brand-text-primary'}
                />
                <StatCard 
                    title="Selling Price" 
                    value={`PKR ${Number(item.sellingPrice || 0).toLocaleString()}`} 
                    icon={<DollarSignIcon />} 
                    color="text-green-600"
                />
                <StatCard 
                    title="Gross Stock Value" 
                    value={`PKR ${((Number(item.stock) || 0) * (Number(item.sellingPrice) || 0)).toLocaleString()}`} 
                    icon={<BarChartIcon />} 
                    color="text-brand-blue"
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales History Table */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/80">
                        <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Sales History</h2>
                    </div>
                    <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
                        <table className="w-full text-sm text-left text-brand-text-secondary relative">
                             <thead className="text-xs text-brand-text-secondary uppercase bg-white font-bold tracking-wider border-b border-gray-200 sticky top-0 shadow-sm z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Date</th>
                                    <th scope="col" className="px-6 py-4">Customer</th>
                                    <th scope="col" className="px-6 py-4 text-center">Qty</th>
                                    <th scope="col" className="px-6 py-4 text-right">Amount</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedSales.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center p-12">
                                            <div className="text-gray-300 mb-2 flex justify-center">
                                                <DollarSignIcon className="h-8 w-8" />
                                            </div>
                                            <p className="text-brand-text-secondary font-medium">No sales recorded.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedSales.map(sale => (
                                        <tr key={sale._id || sale.id} className="bg-white hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                                                {sale.date ? new Date(sale.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-brand-text-primary">
                                                {getCustomerName(sale.customerId)}
                                            </td>
                                            <td className="px-6 py-4 font-black text-center text-brand-text-primary">
                                                {sale.quantity}
                                            </td>
                                            <td className="px-6 py-4 font-black text-green-600 text-right">
                                                {Number(sale.amount || 0).toLocaleString()}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Stock Adjustments Table */}
                <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col">
                    <div className="p-5 border-b border-gray-100 bg-gray-50/80">
                        <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Manual Adjustments</h2>
                    </div>
                    <div className="overflow-x-auto max-h-[450px] overflow-y-auto">
                        <table className="w-full text-sm text-left text-brand-text-secondary relative">
                            <thead className="text-xs text-brand-text-secondary uppercase bg-white font-bold tracking-wider border-b border-gray-200 sticky top-0 shadow-sm z-10">
                                <tr>
                                    <th scope="col" className="px-6 py-4">Date</th>
                                    <th scope="col" className="px-6 py-4">Reason</th>
                                    <th scope="col" className="px-6 py-4 text-center">Change</th>
                                    <th scope="col" className="px-6 py-4 text-right">New Level</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {sortedAdjustments.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="text-center p-12">
                                            <div className="text-gray-300 mb-2 flex justify-center">
                                                <PackageIcon className="h-8 w-8" />
                                            </div>
                                            <p className="text-brand-text-secondary font-medium">No stock adjustments recorded.</p>
                                        </td>
                                    </tr>
                                ) : (
                                    sortedAdjustments.map(adj => (
                                        <tr key={adj._id || adj.id} className="bg-white hover:bg-blue-50/30 transition-colors">
                                            <td className="px-6 py-4 whitespace-nowrap text-gray-500 font-medium">
                                                {adj.date ? new Date(adj.date).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : 'N/A'}
                                            </td>
                                            <td className="px-6 py-4 font-bold text-brand-text-primary">
                                                {adj.reason || 'Manual Adjustment'}
                                            </td>
                                            <td className="px-6 py-4 text-center">
                                                <span className={`inline-block px-2.5 py-1 rounded-md text-xs font-black ${
                                                    adj.quantity > 0 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                                }`}>
                                                    {adj.quantity > 0 ? `+${adj.quantity}` : adj.quantity}
                                                </span>
                                            </td>
                                            <td className="px-6 py-4 font-black text-brand-text-primary text-right">
                                                {adj.newStockLevel}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Placeholder for future expansion */}
            <div className="bg-white rounded-xl shadow-sm p-8 border-2 border-dashed border-gray-200 text-center">
                <div className="mx-auto w-12 h-12 bg-gray-100 text-gray-400 rounded-full flex items-center justify-center mb-3">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
                </div>
                <h2 className="text-xl font-bold text-brand-text-primary">Supplier Information</h2>
                <p className="text-brand-text-secondary mt-2 max-w-md mx-auto">
                    Supplier details, wholesale pricing, and procurement history for this item are currently under development.
                </p>
            </div>
        </div>
    );
};

export default InventoryDetail;