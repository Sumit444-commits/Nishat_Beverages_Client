import React, { useState, useMemo } from 'react';
import { PlusCircleIcon } from '../icons/PlusCircleIcon';
import { EditIcon } from '../icons/EditIcon';
import UpdateAssignmentModal from './UpdateAssignmentModal';

/**
 * Component for managing daily bottle assignments to salesmen.
 * Tracks full bottles assigned in the morning and unsold bottles returned in the evening.
 * @param {Object} props
 * @param {Array} props.salesmen - List of available salesmen.
 * @param {Array} props.assignments - List of daily assignments.
 * @param {Function} props.onAddAssignment - Callback to save new assignment.
 * @param {Function} props.onUpdateAssignment - Callback to update existing assignment.
 */
const DailyBottlesAssigned = ({ salesmen = [], assignments = [], onAddAssignment, onUpdateAssignment }) => {
    const todayISO = new Date().toISOString().split('T')[0];
    
    const [selectedDate, setSelectedDate] = useState(todayISO);
    const [selectedSalesmanId, setSelectedSalesmanId] = useState('');
    const [bottlesAssigned, setBottlesAssigned] = useState('');

    const [isUpdateModalOpen, setUpdateModalOpen] = useState(false);
    const [selectedAssignment, setSelectedAssignment] = useState(null);

  
    const handleAddSubmit = (e) => {
        e.preventDefault();
        if (!selectedSalesmanId || bottlesAssigned === '' || Number(bottlesAssigned) <= 0) {
            alert("Please select a salesman and enter a valid number of bottles.");
            return;
        }

        // Construct the new assignment object
        const newAssignment = {
            salesmanId: selectedSalesmanId,
            date: todayISO, // Backend should ideally generate the exact timestamp
            bottlesAssigned: Number(bottlesAssigned),
            bottlesReturned: null,
        };

        onAddAssignment(newAssignment);
        setSelectedSalesmanId('');
        setBottlesAssigned('');
    };

    const handleOpenUpdateModal = (assignment) => {
        setSelectedAssignment(assignment);
        setUpdateModalOpen(true);
    };

    // Filter assignments based on the date picker
    const filteredAssignments = useMemo(() => {
        return assignments
            .filter(a => {
                if (!a.date) return false;
                return new Date(a.date).toISOString().split('T')[0] === selectedDate;
            })
            .sort((a, b) => a.salesmanId.name.localeCompare(b.salesmanId.name));
    }, [assignments, selectedDate, salesmen]);

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Daily Logistics</h1>
                    <p className="text-brand-text-secondary mt-1">Assign stock for morning routes and reconcile evening returns.</p>
                </div>
            </div>
        

            {/* Form Section: Assigning bottles in the morning */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
                <h2 className="text-lg font-bold text-brand-text-primary mb-4 border-b border-gray-100 pb-2">
                    Dispatch Load for Today <span className="text-brand-blue font-black ml-2">({new Date(todayISO).toLocaleDateString()})</span>
                </h2>
                <form onSubmit={handleAddSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-5 items-end">
                    <div>
                        <label htmlFor="salesman-select" className="block text-sm font-bold text-brand-text-secondary uppercase tracking-wider mb-1">
                            Salesman
                        </label>
                        <select
                            id="salesman-select"
                            value={selectedSalesmanId}
                            onChange={e => setSelectedSalesmanId(e.target.value)}
                            required
                            className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm cursor-pointer"
                        >
                            <option value="" disabled>-- Select a driver --</option>
                            {salesmen.map(s => (
                                <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="bottles-assigned" className="block text-sm font-bold text-brand-text-secondary uppercase tracking-wider mb-1">
                            Bottles to Load (Full)
                        </label>
                        <input
                            type="number"
                            id="bottles-assigned"
                            value={bottlesAssigned}
                            onChange={e => setBottlesAssigned(e.target.value === '' ? '' : Number(e.target.value))}
                            required
                            min="1"
                            placeholder="e.g. 150"
                            className="mt-1 block w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg shadow-sm focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="flex items-center justify-center bg-brand-blue text-white px-4 py-2.5 rounded-lg font-bold hover:bg-brand-lightblue transition-colors shadow-md active:scale-95"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        Log Dispatch
                    </button>
                </form>
                {salesmen.length === 0 && (
                    <div className="mt-4 p-3 bg-red-50 text-red-700 text-sm font-medium rounded-md border border-red-100 flex items-center">
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>
                        You must add salesmen to the system before logging dispatches.
                    </div>
                )}
            </div>
            
            {/* Data Table Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-100 bg-gray-50/80 gap-4">
                    <div>
                        <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Assignment Records</h2>
                        <p className="text-sm font-medium text-brand-text-secondary mt-0.5">Showing route loads for the selected date.</p>
                    </div>
                    <div>
                        <label htmlFor="date-filter" className="sr-only">Filter by Date</label>
                        <input
                            type="date"
                            id="date-filter"
                            value={selectedDate}
                            onChange={e => setSelectedDate(e.target.value)}
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue sm:text-sm font-bold cursor-pointer transition-all"
                        />
                    </div>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left text-brand-text-secondary">
                        <thead className="text-xs text-brand-text-secondary uppercase bg-white font-bold tracking-wider border-b border-gray-200">
                            <tr>
                                <th scope="col" className="px-6 py-4">Salesman</th>
                                <th scope="col" className="px-6 py-4">Loaded (Full)</th>
                                <th scope="col" className="px-6 py-4">Returned (Unsold)</th>
                                <th scope="col" className="px-6 py-4">Est. Sales</th>
                                <th scope="col" className="px-6 py-4 text-right">Evening Check-in</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredAssignments.map(assignment => {
                                // Calculate actual sales based on assignment and return
                                const isReturned = assignment.bottlesReturned !== null && assignment.bottlesReturned !== undefined;
                                const bottlesSold = isReturned
                                    ? Number(assignment.bottlesAssigned) - Number(assignment.bottlesReturned) 
                                    : null;
                                    
                                return (
                                    <tr key={assignment._id || assignment.id} className="bg-white hover:bg-blue-50/30 transition-colors">
                                        <td className="px-6 py-4 font-bold text-brand-text-primary whitespace-nowrap">
                                            {assignment.salesmanId.name}
                                        </td>
                                        <td className="px-6 py-4 font-black text-gray-700">
                                            {assignment.bottlesAssigned}
                                        </td>
                                        <td className="px-6 py-4 font-semibold">
                                            {isReturned ? (
                                                <span className="text-orange-600">{assignment.bottlesReturned}</span>
                                            ) : (
                                                <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-gray-100 text-gray-500">On Route</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4">
                                            {bottlesSold !== null ? (
                                                <span className="font-black text-green-600">{bottlesSold} sold</span>
                                            ) : (
                                                <span className="text-gray-300">—</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <button 
                                                onClick={() => handleOpenUpdateModal(assignment)} 
                                                className={`inline-flex items-center px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95 ${
                                                    isReturned 
                                                        ? 'bg-white border border-gray-200 text-brand-text-secondary hover:bg-gray-50' 
                                                        : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-100'
                                                }`}
                                            >
                                                <EditIcon className="h-3 w-3 mr-1.5"/>
                                                {isReturned ? 'Edit Return' : 'Log Return'}
                                            </button>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filteredAssignments.length === 0 && (
                                 <tr>
                                    <td colSpan={5} className="text-center py-16 px-6">
                                        <div className="text-gray-300 mb-3 flex justify-center">
                                            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                                        </div>
                                        <p className="text-brand-text-primary font-bold text-lg">No dispatch records</p>
                                        <p className="text-brand-text-secondary text-sm mt-1">No loads were dispatched on {new Date(selectedDate).toLocaleDateString()}.</p>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <UpdateAssignmentModal
                isOpen={isUpdateModalOpen}
                onClose={() => setUpdateModalOpen(false)}
                assignment={selectedAssignment}
                onUpdate={onUpdateAssignment}
                salesmanName={selectedAssignment ? selectedAssignment.salesmanId.name : ''}
            />
        </div>
    );
};

export default DailyBottlesAssigned;