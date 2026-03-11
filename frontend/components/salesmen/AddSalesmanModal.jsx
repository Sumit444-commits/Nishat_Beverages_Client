// import React, { useState } from 'react';

// // API URL pulled from environment variables
// const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// /**
//  * Modal component for adding new salesmen to the system.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls the visibility of the modal.
//  * @param {Function} props.onClose - Function to close the modal.
//  * @param {Function} props.onAddSalesman - Callback function after successful creation.
//  */
// const AddSalesmanModal = ({ isOpen, onClose, onAddSalesman }) => {
//     const [name, setName] = useState('');
//     const [mobile, setMobile] = useState('');
//     const [address, setAddress] = useState('');
//     const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);
//     const [monthlySalary, setMonthlySalary] = useState('');
//     const [areasAssigned, setAreasAssigned] = useState('');
//     const [notes, setNotes] = useState('');
    
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState('');
//     const [success, setSuccess] = useState('');

//     const resetForm = () => {
//         setName('');
//         setMobile('');
//         setAddress('');
//         setHireDate(new Date().toISOString().split('T')[0]);
//         setMonthlySalary('');
//         setAreasAssigned('');
//         setNotes('');
//         setError('');
//         setSuccess('');
//     };

//     const validateForm = () => {
//         if (!name.trim()) {
//             setError('Salesman name is required');
//             return false;
//         }
        
//         if (!mobile.trim()) {
//             setError('Mobile number is required');
//             return false;
//         }
        
//         // Mobile number validation logic
//         const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
//         const cleanedMobile = mobile.replace(/\D/g, '');
//         if (!mobileRegex.test(cleanedMobile)) {
//             setError('Please enter a valid mobile number');
//             return false;
//         }
        
//         if (monthlySalary === '' || Number(monthlySalary) < 0) {
//             setError('Monthly salary must be a positive number');
//             return false;
//         }
        
//         return true;
//     };

//     const handleSubmit = async (e) => {
//         e.preventDefault();
        
//         if (!validateForm()) {
//             return;
//         }

//         setIsLoading(true);
//         setError('');
//         setSuccess('');

//         try {
//             // Prepare data for the API request
//             const salesmanData = {
//                 name: name.trim(),
//                 mobile: mobile.trim(),
//                 address: address.trim(),
//                 hireDate: hireDate,
//                 monthlySalary: Number(monthlySalary),
//                 // Convert comma-separated string to an array
//                 areasAssigned: areasAssigned.split(',').map(area => area.trim()).filter(area => area !== ''),
//                 notes: notes.trim()
//             };

//             const response = await fetch(`${API_URL}/salesmen`, {
//                 method: 'POST',
//                 headers: {
//                     'Content-Type': 'application/json',
//                 },
//                 body: JSON.stringify(salesmanData),
//             });

//             const data = await response.json();

//             if (!response.ok) {
//                 throw new Error(data.message || 'Failed to add salesman');
//             }

//             if (data.success && data.data) {
//                 setSuccess('Salesman added successfully!');
                
//                 // Invoke parent callback with newly created salesman object
//                 onAddSalesman(data.data);
                
//                 // Cleanup and close
//                 setTimeout(() => {
//                     resetForm();
//                     onClose();
//                 }, 1500);
//             } else {
//                 throw new Error(data.message || 'Failed to add salesman');
//             }

//         } catch (err) {
//             console.error('Error adding salesman:', err);
//             setError(err.message || 'An unexpected error occurred');
//         } finally {
//             setIsLoading(false);
//         }
//     };

//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-brand-text-primary">Add New Salesman</h2>
//                     <button 
//                         onClick={onClose} 
//                         className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
//                         disabled={isLoading}
//                     >
//                         &times;
//                     </button>
//                 </div>
                
//                 {success && (
//                     <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-md">
//                         <p className="text-green-600 text-sm">{success}</p>
//                     </div>
//                 )}
                
//                 {error && (
//                     <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
//                         <p className="text-red-600 text-sm">{error}</p>
//                     </div>
//                 )}
                
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="salesman-name" className="block text-sm font-medium text-brand-text-secondary">Full Name *</label>
//                         <input 
//                             type="text" 
//                             id="salesman-name" 
//                             value={name} 
//                             onChange={e => {
//                                 setName(e.target.value);
//                                 setError('');
//                             }} 
//                             required 
//                             disabled={isLoading}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100" 
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="salesman-mobile" className="block text-sm font-medium text-brand-text-secondary">Mobile Number *</label>
//                         <input 
//                             type="tel" 
//                             id="salesman-mobile" 
//                             value={mobile} 
//                             onChange={e => {
//                                 setMobile(e.target.value);
//                                 setError('');
//                             }} 
//                             required 
//                             disabled={isLoading}
//                             placeholder="e.g., 03001234567"
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100" 
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="salesman-address" className="block text-sm font-medium text-brand-text-secondary">Address</label>
//                         <textarea 
//                             id="salesman-address" 
//                             value={address} 
//                             onChange={e => setAddress(e.target.value)} 
//                             rows={2}
//                             disabled={isLoading}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100"
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="salesman-hire-date" className="block text-sm font-medium text-brand-text-secondary">Hire Date *</label>
//                         <input 
//                             type="date" 
//                             id="salesman-hire-date" 
//                             value={hireDate} 
//                             onChange={e => setHireDate(e.target.value)} 
//                             required 
//                             disabled={isLoading}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100" 
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="salesman-salary" className="block text-sm font-medium text-brand-text-secondary">Monthly Salary (PKR) *</label>
//                         <input 
//                             type="number" 
//                             id="salesman-salary" 
//                             value={monthlySalary} 
//                             onChange={e => {
//                                 setMonthlySalary(e.target.value === '' ? '' : Number(e.target.value));
//                                 setError('');
//                             }} 
//                             required 
//                             min="0" 
//                             placeholder="e.g., 30000" 
//                             disabled={isLoading}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100" 
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="salesman-areas" className="block text-sm font-medium text-brand-text-secondary">
//                             Areas Assigned (Optional)
//                             <span className="text-xs text-gray-500 ml-1">Separate multiple areas with commas</span>
//                         </label>
//                         <input 
//                             type="text" 
//                             id="salesman-areas" 
//                             value={areasAssigned} 
//                             onChange={e => setAreasAssigned(e.target.value)} 
//                             placeholder="e.g., Area 1, Area 2, Area 3"
//                             disabled={isLoading}
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100" 
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="salesman-notes" className="block text-sm font-medium text-brand-text-secondary">Notes (Optional)</label>
//                         <textarea 
//                             id="salesman-notes" 
//                             value={notes} 
//                             onChange={e => setNotes(e.target.value)} 
//                             rows={2}
//                             disabled={isLoading}
//                             placeholder="Additional notes about the salesman..."
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100"
//                         />
//                     </div>
                    
//                     <div className="flex justify-end pt-4 space-x-4">
//                         <button 
//                             type="button" 
//                             onClick={onClose} 
//                             disabled={isLoading}
//                             className="px-6 py-2 bg-gray-100 text-brand-text-secondary rounded-md hover:bg-gray-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
//                         >
//                             Cancel
//                         </button>
//                         <button 
//                             type="submit" 
//                             disabled={isLoading}
//                             className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
//                         >
//                             {isLoading ? 'Adding...' : 'Add Salesman'}
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default AddSalesmanModal;


import React, { useState } from 'react';
import { apiService } from '../../api/apiService';
import toast from 'react-hot-toast';

/**
 * Modal component for adding new salesmen to the system.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Function} props.onAddSalesman - Callback function to update Dashboard state.
 */
const AddSalesmanModal = ({ isOpen, onClose, onAddSalesman }) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [hireDate, setHireDate] = useState(new Date().toISOString().split('T')[0]);
    const [monthlySalary, setMonthlySalary] = useState('');
    const [areasAssigned, setAreasAssigned] = useState('');
    const [notes, setNotes] = useState('');
    
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const resetForm = () => {
        setName('');
        setMobile('');
        setAddress('');
        setHireDate(new Date().toISOString().split('T')[0]);
        setMonthlySalary('');
        setAreasAssigned('');
        setNotes('');
        setError('');
    };

    const validateForm = () => {
        if (!name.trim()) {
            setError('Salesman name is required');
            return false;
        }
        
        if (!mobile.trim()) {
            setError('Mobile number is required');
            return false;
        }
        
        // Mobile number validation logic
        const mobileRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanedMobile = mobile.replace(/\D/g, '');
        if (!mobileRegex.test(cleanedMobile)) {
            setError('Please enter a valid mobile number');
            return false;
        }
        
        if (monthlySalary === '' || Number(monthlySalary) < 0) {
            setError('Monthly salary must be a positive number');
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
            // Prepare data for the API request
            const salesmanData = {
                name: name.trim(),
                mobile: mobile.trim(),
                address: address.trim(),
                hireDate: hireDate,
                monthlySalary: Number(monthlySalary),
                // Convert comma-separated string to an array
                areasAssigned: areasAssigned.split(',').map(area => area.trim()).filter(area => area !== ''),
                notes: notes.trim()
            };

            // Hit the Express API via the centralized service
            const newSalesman = await apiService.addSalesman(salesmanData);

            toast.success('Salesman added successfully!');
            onAddSalesman(newSalesman); // Pass the new DB object to the parent
            
            setTimeout(() => {
                resetForm();
                onClose();
            }, 1000);

        } catch (err) {
            console.error('Error adding salesman:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md animate-fade-in max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className="text-xl font-bold text-brand-text-primary">Add New Salesman</h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                        disabled={isLoading}
                    >
                        &times;
                    </button>
                </div>
                
                {error && (
                    <div className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
                        <p className="text-red-700 text-sm font-medium">{error}</p>
                    </div>
                )}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="salesman-name" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Full Name *</label>
                        <input 
                            type="text" 
                            id="salesman-name" 
                            value={name} 
                            onChange={e => {
                                setName(e.target.value);
                                setError('');
                            }} 
                            required 
                            disabled={isLoading}
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-all" 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="salesman-mobile" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Mobile Number *</label>
                        <input 
                            type="tel" 
                            id="salesman-mobile" 
                            value={mobile} 
                            onChange={e => {
                                setMobile(e.target.value);
                                setError('');
                            }} 
                            required 
                            disabled={isLoading}
                            placeholder="e.g., +9230********"
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-all" 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="salesman-address" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Address</label>
                        <textarea 
                            id="salesman-address" 
                            value={address} 
                            onChange={e => setAddress(e.target.value)} 
                            rows={2}
                            disabled={isLoading}
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-all"
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="salesman-hire-date" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Hire Date *</label>
                            <input 
                                type="date" 
                                id="salesman-hire-date" 
                                value={hireDate} 
                                onChange={e => setHireDate(e.target.value)} 
                                required 
                                disabled={isLoading}
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-all" 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="salesman-salary" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Salary (PKR) *</label>
                            <input 
                                type="number" 
                                id="salesman-salary" 
                                value={monthlySalary} 
                                onChange={e => {
                                    setMonthlySalary(e.target.value === '' ? '' : Number(e.target.value));
                                    setError('');
                                }} 
                                required 
                                min="0" 
                                placeholder="e.g., 30000" 
                                disabled={isLoading}
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-all" 
                            />
                        </div>
                    </div>
                    
                    <div>
                        <label htmlFor="salesman-areas" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Areas Assigned <span className="text-xs font-normal text-gray-500 normal-case ml-1">(Comma separated)</span>
                        </label>
                        <input 
                            type="text" 
                            id="salesman-areas" 
                            value={areasAssigned} 
                            onChange={e => setAreasAssigned(e.target.value)} 
                            placeholder="e.g., Block A, Block B"
                            disabled={isLoading}
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-all" 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="salesman-notes" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Notes</label>
                        <textarea 
                            id="salesman-notes" 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            rows={2}
                            disabled={isLoading}
                            placeholder="Additional notes..."
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm disabled:bg-gray-100 transition-all"
                        />
                    </div>
                    
                    <div className="flex justify-end pt-6 space-x-3 border-t border-gray-100 mt-6">
                        <button 
                            type="button" 
                            onClick={onClose} 
                            disabled={isLoading}
                            className="px-5 py-2.5 bg-gray-100 text-brand-text-secondary rounded-lg hover:bg-gray-200 font-bold transition-all disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button 
                            type="submit" 
                            disabled={isLoading}
                            className="px-5 py-2.5 bg-brand-blue text-white rounded-lg hover:bg-brand-lightblue font-bold shadow-md transition-all active:scale-95 disabled:opacity-50 min-w-[140px] flex items-center justify-center"
                        >
                            {isLoading ? (
                                <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : 'Add Salesman'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddSalesmanModal;