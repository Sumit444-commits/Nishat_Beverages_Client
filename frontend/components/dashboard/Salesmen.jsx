

import React from 'react';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EditIcon } from '../icons/EditIcon';
import { TrashIcon } from '../icons/TrashIcon';

/**
 * Component for viewing and managing the list of salesmen.
 * Tracks assignments and daily performance at a glance.
 * @param {Object} props
 * @param {Array} props.salesmen - List of salesman objects from MongoDB.
 * @param {Function} props.onAddSalesman - Callback to open the add salesman modal.
 * @param {Function} props.onViewDetails - Callback to navigate to a specific salesman profile.
 * @param {Function} props.onEditSalesman - Callback to edit salesman details.
 * @param {Function} props.onDeleteSalesman - Callback to remove a salesman record.
 */
const Salesmen = ({ 
    salesmen = [], 
    onAddSalesman, 
    onViewDetails, 
    onEditSalesman, 
    onDeleteSalesman 
}) => {
    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Team Directory</h1>
                    <p className="text-brand-text-secondary mt-1">Manage delivery personnel, assignments, and performance.</p>
                </div>
                <button 
                    onClick={onAddSalesman}
                    className="flex items-center justify-center bg-brand-blue text-white px-5 py-2.5 rounded-lg font-bold hover:bg-brand-lightblue transition-all shadow-md active:scale-95 w-full md:w-auto whitespace-nowrap"
                >
                    <PlusCircleIcon className="h-5 w-5 mr-2" />
                    Add Salesman
                </button>
            </div>

            

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                    <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Active Roster</h2>
                    <span className="text-xs font-bold text-brand-text-secondary uppercase tracking-wider bg-white px-3 py-1.5 rounded-lg shadow-sm border border-gray-200">
                        {salesmen.length} Member{salesmen.length !== 1 ? 's' : ''}
                    </span>
                </div>

                <div className="overflow-x-auto min-h-[400px]">
                    <table className="w-full text-sm text-left text-brand-text-secondary relative">
                        <thead className="text-xs text-brand-text-secondary uppercase bg-white font-bold tracking-wider border-b border-gray-200 sticky top-0 shadow-sm z-10">
                            <tr>
                                <th scope="col" className="px-6 py-4">Name</th>
                                <th scope="col" className="px-6 py-4">Mobile</th>
                                <th scope="col" className="px-6 py-4">Hire Date</th>
                                <th scope="col" className="px-6 py-4 text-center">Customers Assigned</th>
                                <th scope="col" className="px-6 py-4 text-center">Units Sold Today</th>
                                <th scope="col" className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {salesmen.length > 0 ? salesmen.map((salesman) => (
                                <tr key={salesman._id || salesman.id} className="bg-white hover:bg-blue-50/30 transition-colors group">
                                    <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">
                                        <button 
                                            onClick={() => onViewDetails(salesman)} 
                                            className="flex items-center hover:text-brand-blue focus:outline-none transition-colors"
                                        >
                                            <div className="w-8 h-8 rounded-full bg-blue-100 text-brand-blue flex items-center justify-center mr-3 font-black text-xs">
                                                {salesman.name.charAt(0).toUpperCase()}
                                            </div>
                                            {salesman.name}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 font-medium whitespace-nowrap">{salesman.mobile}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {salesman.hireDate ? new Date(salesman.hireDate).toLocaleDateString(undefined, {month:'short', day:'numeric', year:'numeric'}) : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center bg-gray-100 text-gray-700 font-bold px-3 py-1 rounded-md">
                                            {salesman.customersAssigned || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-center">
                                        <span className="inline-flex items-center justify-center bg-green-50 text-green-700 font-black px-3 py-1 rounded-md border border-green-200">
                                            {salesman.quantitySoldToday || 0}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end space-x-2 opacity-100 lg:opacity-0 lg:group-hover:opacity-100 transition-opacity">
                                            <button 
                                                onClick={() => onViewDetails(salesman)} 
                                                className="text-xs font-bold text-brand-blue bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-md transition-colors"
                                            >
                                                PROFILE
                                            </button>
                                            
                                            <div className="w-px h-5 bg-gray-200 mx-1"></div>

                                            <button 
                                                onClick={() => onEditSalesman(salesman)} 
                                                className="p-1.5 text-brand-text-secondary hover:text-brand-blue hover:bg-blue-50 rounded-md transition-colors"
                                                title="Edit Details"
                                            >
                                                <EditIcon className="h-4 w-4" />
                                            </button>
                                            <button 
                                                onClick={() => {
                                                    if(window.confirm(`Are you sure you want to permanently delete ${salesman.name}? This cannot be undone.`)) {
                                                        onDeleteSalesman(salesman._id || salesman.id);
                                                    }
                                                }} 
                                                className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                title="Delete Record"
                                            >
                                                <TrashIcon className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan="6" className="text-center py-16 px-6">
                                        <div className="flex justify-center mb-3">
                                            <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path></svg>
                                        </div>
                                        <p className="text-brand-text-primary font-bold text-lg">No staff found.</p>
                                        <p className="text-brand-text-secondary mt-1">Click "Add Salesman" to register your delivery team.</p>
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

export default Salesmen;