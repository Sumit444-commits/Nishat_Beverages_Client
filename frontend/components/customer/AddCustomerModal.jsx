
import React, { useState, useEffect } from 'react';
import { apiService } from '../../api/apiService';
import toast from 'react-hot-toast';

/**
 * Modal component for adding new customers with auto-salesman assignment based on area.
 * @param {Object} props
 * @param {boolean} props.isOpen - Modal visibility toggle.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onAddCustomer - Callback after successful creation.
 * @param {Array} props.salesmen - List of available salesmen.
 * @param {Array} [props.areas] - Default areas list.
 * @param {Array} [props.areaAssignments] - Pre-defined area-to-salesman mappings.
 * @param {Function} [props.onNavigateToAreaAssignment] - Navigates to area management.
 */
const AddCustomerModal = ({ 
    isOpen, 
    onClose, 
    onAddCustomer, 
    salesmen, 
    areas = [], 
    areaAssignments = [], 
    onNavigateToAreaAssignment 
}) => {
    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [mobile, setMobile] = useState('');
    const [area, setArea] = useState('');
    const [salesmanId, setSalesmanId] = useState('');
    const [outstandingBalance, setOutstandingBalance] = useState(0);
    const [deliveryFrequency, setDeliveryFrequency] = useState(1);
    const [emptyBottles, setEmptyBottles] = useState(0);
    const [notes, setNotes] = useState('');
    const [autoAssignedSalesman, setAutoAssignedSalesman] = useState(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [availableAreas, setAvailableAreas] = useState(areas);

    /**
     * Effect: Auto-assign salesman when area changes
     */
    useEffect(() => {
        if (area.trim()) {
            const areaAssignment = areaAssignments.find(a => a.area === area.trim());
            if (areaAssignment && areaAssignment.salesmanId) {
                // Only auto-assign if no manual override or if current selection is unassigned
                if (!autoAssignedSalesman || salesmanId === '') {
                    setSalesmanId(areaAssignment.salesmanId.toString());
                    setAutoAssignedSalesman(areaAssignment.salesmanId.toString());
                }
            } else {
                // Reset if area doesn't have an assignment
                if (autoAssignedSalesman && salesmanId === autoAssignedSalesman) {
                    setSalesmanId('');
                    setAutoAssignedSalesman(null);
                }
            }
        } else {
            if (autoAssignedSalesman && salesmanId === autoAssignedSalesman) {
                setSalesmanId('');
                setAutoAssignedSalesman(null);
            }
        }
    }, [area, areaAssignments, autoAssignedSalesman, salesmanId]);

    /**
     * Effect: Reset and fetch when modal opens
     */
    useEffect(() => {
        if (isOpen) {
            fetchAreas();
            resetForm();
        }
    }, [isOpen]);

    const fetchAreas = async () => {
        try {
            // Using a hypothetical endpoint in apiService or raw fetch if it's very specific
            // If you add this to apiService, use: const response = await apiService.getAreasList();
            const data = await apiService.getCustomersAreas(); // Example: Assuming this exists in apiService
            if (data && data.length > 0) {
                setAvailableAreas(data);
            }
        } catch (err) {
            console.error('Error fetching areas:', err);
        }
    };

    const resetForm = () => {
        setName('');
        setAddress('');
        setMobile('');
        setArea('');
        setSalesmanId('');
        setOutstandingBalance(0);
        setDeliveryFrequency(1);
        setEmptyBottles(0);
        setNotes('');
        setAutoAssignedSalesman(null);
        setError('');
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError('Customer name is required');
            return false;
        }
        if (!address.trim()) {
            setError('Address is required');
            return false;
        }
        if (!mobile.trim()) {
            setError('Mobile number is required');
            return false;
        }
        
        const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanedMobile = mobile.replace(/\D/g, '');
        if (!mobileRegex.test(cleanedMobile)) {
            setError('Please enter a valid mobile number');
            return false;
        }
        
        if (!area.trim()) {
            setError('Area is required');
            return false;
        }
        if (outstandingBalance < 0) {
            setError('Outstanding balance cannot be negative');
            return false;
        }
        if (deliveryFrequency < 1) {
            setError('Delivery frequency must be at least 1 day');
            return false;
        }
        if (emptyBottles < 0) {
            setError('Empty bottles cannot be negative');
            return false;
        }
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) return;

        setIsLoading(true);
        setError('');

        try {
            const customerData = {
                name: name.trim(),
                address: address.trim(),
                mobile: mobile.trim(),
                area: area.trim(),
                salesmanId: salesmanId || null,
                totalBalance: outstandingBalance,
                deliveryFrequencyDays: deliveryFrequency,
                emptyBottlesHeld: emptyBottles,
                notes: notes.trim()
            };

            // Call the centralized API Service
            const newCustomer = await apiService.addCustomer(customerData);

            toast.success('Customer added successfully!');
            onAddCustomer(newCustomer); // Pass the newly created DB object back to Dashboard
            
            setTimeout(() => {
                resetForm();
                onClose();
            }, 1000);

        } catch (err) {
            console.error('Error adding customer:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-xl font-bold text-brand-text-primary">Add New Customer</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                        disabled={isLoading}
                    >
                        &times;
                    </button>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                        <p className="text-red-600 text-sm font-medium">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Full Name *</label>
                            <input 
                                type="text" 
                                placeholder="Full Name" 
                                value={name} 
                                onChange={e => { setName(e.target.value); setError(''); }}
                                required 
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-colors"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Mobile Number *</label>
                            <input 
                                type="tel" 
                                placeholder="e.g., +9230********" 
                                value={mobile} 
                                onChange={e => { setMobile(e.target.value); setError(''); }}
                                required 
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-colors"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Full Address *</label>
                            <textarea
                                placeholder="Full Address"
                                value={address}
                                onChange={e => { setAddress(e.target.value); setError(''); }}
                                required
                                rows={3}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-colors"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1 flex items-center">
                                Area/Sector *
                                {onNavigateToAreaAssignment && (
                                    <button
                                        type="button"
                                        onClick={onNavigateToAreaAssignment}
                                        disabled={isLoading}
                                        className="ml-2 text-xs text-brand-blue hover:text-brand-lightblue hover:underline disabled:text-gray-400 focus:outline-none"
                                    >
                                        (Manage Areas)
                                    </button>
                                )}
                            </label>
                            <div className="flex gap-2">
                                <select
                                    value={area}
                                    onChange={e => { setArea(e.target.value); setError(''); }}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 bg-white transition-colors"
                                >
                                    <option value="">Select Area</option>
                                    {availableAreas.map(a => <option key={a} value={a}>{a}</option>)}
                                </select>
                                <input
                                    type="text"
                                    placeholder="Or type new area"
                                    value={area}
                                    onChange={e => { setArea(e.target.value); setError(''); }}
                                    disabled={isLoading}
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-colors"
                                />
                            </div>
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">
                                Assigned Salesman
                                {autoAssignedSalesman && (
                                    <span className="ml-2 text-xs text-green-600 font-medium bg-green-50 px-2 py-0.5 rounded-full">Auto-assigned based on Area</span>
                                )}
                            </label>
                            <select 
                                value={salesmanId} 
                                onChange={e => {
                                    setSalesmanId(e.target.value);
                                    setAutoAssignedSalesman(null); // User manually overrode the system
                                    setError('');
                                }}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 bg-white transition-colors"
                            >
                                <option value="">Unassigned Salesman</option>
                                {/* Maps over salesmen array fetching their name and MongoDB _id */}
                                {salesmen.map(s => <option key={s._id || s.id} value={s._id || s.id}>{s.name}</option>)}
                            </select>
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Initial Balance (PKR)</label>
                            <input 
                                type="number" 
                                value={outstandingBalance} 
                                onChange={e => setOutstandingBalance(Number(e.target.value))}
                                required 
                                min="0"
                                step="0.01"
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-colors"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Delivery Frequency (Days) *</label>
                            <input 
                                type="number" 
                                value={deliveryFrequency} 
                                onChange={e => setDeliveryFrequency(Number(e.target.value))}
                                required 
                                min="1"
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-colors"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Initial Empty Bottles Held</label>
                            <input 
                                type="number" 
                                value={emptyBottles} 
                                onChange={e => setEmptyBottles(Number(e.target.value))}
                                required 
                                min="0"
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-colors"
                            />
                        </div>
                        
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-brand-text-secondary mb-1">Notes (Optional)</label>
                            <textarea
                                placeholder="Additional details, delivery instructions, etc."
                                value={notes}
                                onChange={e => setNotes(e.target.value)}
                                rows={2}
                                disabled={isLoading}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-colors"
                            />
                        </div>
                    </div>
                    
                    <div className="flex justify-end pt-4 mt-2 space-x-3 border-t border-gray-200">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isLoading}
                            className="px-5 py-2 bg-gray-100 text-brand-text-secondary rounded-lg hover:bg-gray-200 font-semibold disabled:opacity-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="px-5 py-2 bg-brand-blue text-white rounded-lg hover:bg-brand-lightblue font-semibold shadow-sm disabled:opacity-50 min-w-[140px] transition-all active:scale-95 flex justify-center items-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Add Customer'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCustomerModal;