import React, { useState, useMemo, useEffect } from 'react';
import { PlusCircleIcon, EditIcon, TrashIcon, UsersIcon } from '../icons';
import { apiService } from '../../api/apiService';
import toast from 'react-hot-toast';

/**
 * Component for managing geographical areas and assigning them to salesmen.
 * @param {Object} props
 * @param {Array} props.salesmen - List of available salesmen.
 * @param {Array} props.customers - List of customers to calculate area density.
 * @param {Function} props.onNavigateToSalesman - Navigation callback.
 */
const AreaAssignment = ({
    salesmen = [],
    customers = [],
    onNavigateToSalesman
}) => {
    const [areaAssignments, setAreaAssignments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newAreaName, setNewAreaName] = useState('');
    
    // Edit State
    const [editingId, setEditingId] = useState(null);
    const [editAreaName, setEditAreaName] = useState('');
    const [editSalesmanId, setEditSalesmanId] = useState('unassigned');
    
    const [searchTerm, setSearchTerm] = useState('');

    // Fetch areas on mount
    useEffect(() => {
        fetchAreas();
    }, []);

    const fetchAreas = async () => {
        setLoading(true);
        try {
            const data = await apiService.getAreaAssignments();
            setAreaAssignments(data || []);
        } catch (error) {
            console.error("Failed to load areas:", error);
            toast.error("Failed to load area assignments.");
        } finally {
            setLoading(false);
        }
    };

    // Calculate customer density per area locally based on loaded customers
    const getCustomerCount = (areaName) => {
        return customers.filter(c => c.area === areaName).length;
    };

    // Filter logic for search bar
    const filteredAreas = useMemo(() => {
        if (!searchTerm) return areaAssignments;
        const term = searchTerm.toLowerCase();
    
        return areaAssignments.filter(a => {
            const areaMatch = a.area.toLowerCase().includes(term);
            const salesmanName = a.salesmanId ? salesmen.find(s => String(s._id || s.id) === String(a.salesmanId))?.name : '';
            const salesmanMatch = salesmanName ? salesmanName.toLowerCase().includes(term) : false;
            return areaMatch || salesmanMatch;
        });
    }, [areaAssignments, searchTerm, salesmen]);

    // Grouping areas by salesman for the dashboard view
    const areasBySalesman = useMemo(() => {
        const grouped = {};
        areaAssignments.forEach(area => {
            const sid = area.salesmanId ? String(area.salesmanId) : 'unassigned';
            if (!grouped[sid]) {
                grouped[sid] = [];
            }
            grouped[sid].push(area);
        });
        return grouped;
    }, [areaAssignments]);

    const handleAddArea = async () => {
        if (!newAreaName.trim()) return;
        
        try {
            const payload = { area: newAreaName.trim(), salesmanId: null };
            const newArea = await apiService.addAreaAssignment(payload);
            setAreaAssignments(prev => [...prev, newArea]);
            setNewAreaName('');
            toast.success('Area added successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to add area');
        }
    };

    const handleStartEdit = (area) => {
        setEditingId(area._id || area.id);
        setEditAreaName(area.area);
        setEditSalesmanId(area.salesmanId ? String(area.salesmanId) : 'unassigned');
    };

    const handleSaveEdit = async () => {
        if (!editingId || !editAreaName.trim()) return;
        
        try {
            const sId = editSalesmanId === 'unassigned' ? null : editSalesmanId;
            const updatedArea = await apiService.updateAreaAssignment(editingId, {
                area: editAreaName.trim(),
                salesmanId: sId
            });
            
            setAreaAssignments(prev => prev.map(a => (a._id || a.id) === editingId ? updatedArea : a));
            setEditingId(null);
            setEditAreaName('');
            setEditSalesmanId('unassigned');
            toast.success('Area updated successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to update area');
        }
    };

    const handleDeleteArea = async (id) => {
        if (!window.confirm('Are you sure you want to delete this area?')) return;
        
        try {
            await apiService.deleteAreaAssignment(id);
            setAreaAssignments(prev => prev.filter(a => (a._id || a.id) !== id));
            toast.success('Area deleted successfully!');
        } catch (error) {
            toast.error(error.message || 'Failed to delete area');
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditAreaName('');
        setEditSalesmanId('unassigned');
    };

    const getSalesmanName = (salesmanId) => {
        if (!salesmanId) return 'Unassigned';
        const salesman = salesmen.find(s => String(s._id || s.id) === String(salesmanId));
        return salesman ? salesman.name : 'Unknown';
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center flex-wrap gap-4">
                <div>
                    <h1 className="text-3xl font-black text-brand-text-primary tracking-tight">Area Assignments</h1>
                    <p className="text-brand-text-secondary mt-1">Manage delivery sectors and assign them to your drivers.</p>
                </div>
            </div>

            {/* Form Section */}
            <div className="bg-white rounded-xl shadow-md border border-gray-100 p-6">
                <h2 className="text-lg font-bold text-brand-text-primary mb-4">Add New Delivery Area</h2>
                <div className="flex gap-3 flex-wrap md:flex-nowrap">
                    <input
                        type="text"
                        placeholder="Enter sector or phase name (e.g. DHA Phase 1)"
                        value={newAreaName}
                        onChange={e => setNewAreaName(e.target.value)}
                        onKeyPress={e => e.key === 'Enter' && handleAddArea()}
                        className="flex-1 min-w-[300px] px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all"
                        disabled={loading}
                    />
                    <button
                        onClick={handleAddArea}
                        disabled={loading || !newAreaName.trim()}
                        className="flex justify-center items-center bg-brand-blue text-white px-8 py-2.5 rounded-lg font-bold hover:bg-brand-lightblue transition-all shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                    >
                        <PlusCircleIcon className="h-5 w-5 mr-2" />
                        {loading ? 'Adding...' : 'Add Area'}
                    </button>
                </div>
            </div>
            
            

            {/* Filter Section */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                <input
                    type="text"
                    placeholder="Search areas or salesmen..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-blue focus:bg-white transition-all sm:text-sm"
                />
            </div>

            {loading && areaAssignments.length === 0 ? (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                    <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-brand-blue"></div>
                    <p className="mt-3 font-medium text-brand-text-secondary tracking-wide">Loading territories...</p>
                </div>
            ) : (
                <>
                    {/* Grouped View */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Areas by Salesman</h2>
                        </div>
                        <div className="p-6 space-y-6">
                            {Object.entries(areasBySalesman).map(([salesmanIdStr, areas]) => {
                                const salesman = salesmanIdStr === 'unassigned' ? null : salesmen.find(s => String(s._id || s.id) === salesmanIdStr);
                                const totalCustomers = areas.reduce((sum, area) => sum + getCustomerCount(area.area), 0);

                                return (
                                    <div key={salesmanIdStr} className={`border rounded-xl p-5 transition-all ${salesman ? 'border-blue-100 bg-blue-50/30' : 'border-gray-200 bg-gray-50/50'}`}>
                                        <div className="flex flex-col md:flex-row justify-between md:items-center mb-5 gap-3">
                                            <div>
                                                <h3 className={`text-lg font-black ${salesman ? 'text-brand-blue' : 'text-gray-500'}`}>
                                                    {salesman ? salesman.name : 'Unassigned Areas'}
                                                </h3>
                                                <p className="text-sm font-medium text-brand-text-secondary mt-0.5">
                                                    {areas.length} territory{areas.length !== 1 && 's'} • {totalCustomers} active customer{totalCustomers !== 1 && 's'}
                                                </p>
                                            </div>
                                            {salesman && (
                                                <button
                                                    onClick={() => onNavigateToSalesman(salesman._id || salesman.id)}
                                                    className="text-brand-blue hover:text-brand-lightblue font-bold text-sm bg-white px-4 py-2 border border-blue-200 rounded-lg shadow-sm transition-all hover:shadow md:w-auto w-full"
                                                >
                                                    View Profile &rarr;
                                                </button>
                                            )}
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                            {areas.map(area => (
                                                <div key={area._id || area.id} className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:border-brand-blue transition-colors">
                                                    <div className="flex justify-between items-start">
                                                        <span className="font-bold text-brand-text-primary pr-2">{area.area}</span>
                                                        <div className="flex items-center bg-gray-100 px-2 py-1 rounded-md text-brand-text-secondary whitespace-nowrap">
                                                            <UsersIcon className="h-3.5 w-3.5 mr-1.5" />
                                                            <span className="text-xs font-bold">
                                                                {getCustomerCount(area.area)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Management Table */}
                    <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 bg-gray-50">
                            <h2 className="text-xl font-black text-brand-text-primary tracking-tight">All Areas Directory ({filteredAreas.length})</h2>
                        </div>
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-brand-text-secondary">
                                <thead className="text-xs text-brand-text-secondary uppercase bg-gray-100/80 font-bold tracking-wider border-b border-gray-200">
                                    <tr>
                                        <th scope="col" className="px-6 py-4">Area Name</th>
                                        <th scope="col" className="px-6 py-4">Assigned Salesman</th>
                                        <th scope="col" className="px-6 py-4">Customers</th>
                                        <th scope="col" className="px-6 py-4 text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-gray-100">
                                    {filteredAreas.map(area => (
                                        <tr key={area._id || area.id} className="bg-white hover:bg-blue-50/50 transition-colors">
                                            {editingId === (area._id || area.id) ? (
                                                <>
                                                    <td className="px-6 py-4">
                                                        <input
                                                            type="text"
                                                            value={editAreaName}
                                                            onChange={e => setEditAreaName(e.target.value)}
                                                            className="w-full px-3 py-2 border border-brand-blue rounded shadow-inner text-sm focus:outline-none"
                                                        />
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <select
                                                            value={editSalesmanId}
                                                            onChange={e => setEditSalesmanId(e.target.value)}
                                                            className="w-full px-3 py-2 border border-brand-blue rounded shadow-inner text-sm focus:outline-none bg-white cursor-pointer"
                                                        >
                                                            <option value="unassigned">Unassigned</option>
                                                            {salesmen.map(s => (
                                                                <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>
                                                            ))}
                                                        </select>
                                                    </td>
                                                    <td className="px-6 py-4 font-medium text-gray-500">
                                                        {getCustomerCount(area.area)}
                                                    </td>
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end space-x-2">
                                                            <button onClick={handleSaveEdit} className="bg-green-100 text-green-700 px-3 py-1 rounded font-bold text-xs hover:bg-green-200 transition-colors">Save</button>
                                                            <button onClick={handleCancelEdit} className="bg-gray-100 text-gray-600 px-3 py-1 rounded font-bold text-xs hover:bg-gray-200 transition-colors">Cancel</button>
                                                        </div>
                                                    </td>
                                                </>
                                            ) : (
                                                <>
                                                    <td className="px-6 py-4 font-bold text-brand-text-primary">{area.area}</td>
                                                    <td className="px-6 py-4">
                                                        {area.salesmanId ? (
                                                            <span className="font-medium text-brand-blue bg-blue-50 px-3 py-1 rounded-full text-xs">
                                                                {getSalesmanName(area.salesmanId)}
                                                            </span>
                                                        ) : (
                                                            <span className="font-medium text-gray-500 bg-gray-100 px-3 py-1 rounded-full text-xs">
                                                                Unassigned
                                                            </span>
                                                        )}
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <span className="font-bold text-brand-text-primary">
                                                            {getCustomerCount(area.area)}
                                                        </span>
                                                    </td>
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center justify-end space-x-3">
                                                            <button onClick={() => handleStartEdit(area)} className="text-brand-blue hover:text-brand-accent p-1.5 rounded-full hover:bg-blue-50 transition-colors" title="Edit Area">
                                                                <EditIcon className="h-4 w-4" />
                                                            </button>
                                                            <button onClick={() => handleDeleteArea(area._id || area.id)} className="text-red-500 hover:text-red-700 p-1.5 rounded-full hover:bg-red-50 transition-colors" title="Delete Area">
                                                                <TrashIcon className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </>
                                            )}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default AreaAssignment;