// import React, { useState, useEffect } from 'react';

// /**
//  * Modal component for editing existing salesman details.
//  * @param {Object} props
//  * @param {boolean} props.isOpen - Controls visibility.
//  * @param {Function} props.onClose - Function to close the modal.
//  * @param {Object|null} props.salesman - The salesman data object to edit.
//  * @param {Function} props.onUpdateSalesman - Callback to save the updated data.
//  */
// const EditSalesmanModal = ({ isOpen, onClose, salesman, onUpdateSalesman }) => {
//     // TypeScript union types like <number | ''> removed for JS flexibility
//     const [name, setName] = useState('');
//     const [mobile, setMobile] = useState('');
//     const [hireDate, setHireDate] = useState('');
//     const [monthlySalary, setMonthlySalary] = useState('');

//     // Sync local state whenever the salesman prop changes
//     useEffect(() => {
//         if (salesman) {
//             setName(salesman.name);
//             setMobile(salesman.mobile);
//             // Extracts only the YYYY-MM-DD portion for HTML date input compatibility
//             setHireDate(salesman.hireDate.split('T')[0]);
//             setMonthlySalary(salesman.monthlySalary);
//         }
//     }, [salesman]);

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         if (!salesman) return;

//         // Construct the updated object using standard JS spread syntax
//         const updatedSalesman = {
//             ...salesman,
//             name,
//             mobile,
//             hireDate,
//             monthlySalary: Number(monthlySalary),
//         };
        
//         onUpdateSalesman(updatedSalesman);
//     };

//     // Conditional rendering check
//     if (!isOpen || !salesman) return null;

//     return (
//         <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
//             <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
//                 <div className="flex justify-between items-center mb-6">
//                     <h2 className="text-2xl font-bold text-brand-text-primary">Edit Salesman Details</h2>
//                     <button 
//                         onClick={onClose} 
//                         className="text-gray-400 hover:text-gray-600 text-3xl leading-none"
//                     >
//                         &times;
//                     </button>
//                 </div>
                
//                 <form onSubmit={handleSubmit} className="space-y-4">
//                     <div>
//                         <label htmlFor="edit-salesman-name" className="block text-sm font-medium text-brand-text-secondary">Full Name</label>
//                         <input 
//                             type="text" 
//                             id="edit-salesman-name" 
//                             value={name} 
//                             onChange={e => setName(e.target.value)} 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="edit-salesman-mobile" className="block text-sm font-medium text-brand-text-secondary">Mobile Number</label>
//                         <input 
//                             type="tel" 
//                             id="edit-salesman-mobile" 
//                             value={mobile} 
//                             onChange={e => setMobile(e.target.value)} 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>
                    
//                      <div>
//                         <label htmlFor="edit-salesman-hire-date" className="block text-sm font-medium text-brand-text-secondary">Hire Date</label>
//                         <input 
//                             type="date" 
//                             id="edit-salesman-hire-date" 
//                             value={hireDate} 
//                             onChange={e => setHireDate(e.target.value)} 
//                             required 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>
                    
//                     <div>
//                         <label htmlFor="edit-salesman-salary" className="block text-sm font-medium text-brand-text-secondary">Monthly Salary (PKR)</label>
//                         <input 
//                             type="number" 
//                             id="edit-salesman-salary" 
//                             value={monthlySalary} 
//                             onChange={e => setMonthlySalary(e.target.value === '' ? '' : Number(e.target.value))} 
//                             required 
//                             min="0" 
//                             className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-brand-blue focus:border-brand-blue sm:text-sm" 
//                         />
//                     </div>
                    
//                     <div className="flex justify-end pt-4 space-x-4">
//                         <button 
//                             type="button" 
//                             onClick={onClose} 
//                             className="px-6 py-2 bg-gray-100 text-brand-text-secondary rounded-md hover:bg-gray-200 font-semibold"
//                         >
//                             Cancel
//                         </button>
//                         <button 
//                             type="submit" 
//                             className="px-6 py-2 bg-brand-blue text-white rounded-md hover:bg-brand-lightblue font-semibold"
//                         >
//                             Update Salesman
//                         </button>
//                     </div>
//                 </form>
//             </div>
//         </div>
//     );
// };

// export default EditSalesmanModal;


import React, { useState, useEffect } from 'react';

/**
 * Modal component for editing existing salesman details.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls visibility.
 * @param {Function} props.onClose - Function to close the modal.
 * @param {Object|null} props.salesman - The salesman data object to edit from MongoDB.
 * @param {Function} props.onUpdateSalesman - Callback to pass updated data to Dashboard.
 */
const EditSalesmanModal = ({ isOpen, onClose, salesman, onUpdateSalesman }) => {
    const [name, setName] = useState('');
    const [mobile, setMobile] = useState('');
    const [address, setAddress] = useState('');
    const [hireDate, setHireDate] = useState('');
    const [monthlySalary, setMonthlySalary] = useState('');
    const [areasAssigned, setAreasAssigned] = useState('');
    const [notes, setNotes] = useState('');

    // Sync local state whenever the salesman prop changes
    useEffect(() => {
        if (salesman && isOpen) {
            setName(salesman.name || '');
            setMobile(salesman.mobile || '');
            setAddress(salesman.address || '');
            
            // Extracts only the YYYY-MM-DD portion for HTML date input compatibility
            if (salesman.hireDate) {
                setHireDate(salesman.hireDate.split('T')[0]);
            } else {
                setHireDate('');
            }
            
            setMonthlySalary(salesman.monthlySalary || 0);
            
            // Convert areas array back to a comma-separated string for easy editing
            setAreasAssigned(Array.isArray(salesman.areasAssigned) ? salesman.areasAssigned.join(', ') : '');
            
            setNotes(salesman.notes || '');
        }
    }, [salesman, isOpen]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!salesman) return;

        if (!name.trim() || !mobile.trim()) {
            alert("Name and Mobile are required.");
            return;
        }

        // Construct the updated object using standard JS spread syntax
        const updatedSalesman = {
            ...salesman,
            name: name.trim(),
            mobile: mobile.trim(),
            address: address.trim(),
            hireDate,
            monthlySalary: Number(monthlySalary),
            areasAssigned: areasAssigned.split(',').map(a => a.trim()).filter(a => a !== ''),
            notes: notes.trim()
        };
        
        onUpdateSalesman(updatedSalesman);
        onClose();
    };

    // Conditional rendering check
    if (!isOpen || !salesman) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md max-h-[90vh] overflow-y-auto animate-fade-in">
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <div>
                        <h2 className="text-xl font-bold text-brand-text-primary">Edit Salesman</h2>
                        <p className="text-sm font-medium text-brand-blue mt-1">Editing: {salesman.name}</p>
                    </div>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none self-start focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="edit-salesman-name" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Full Name</label>
                        <input 
                            type="text" 
                            id="edit-salesman-name" 
                            value={name} 
                            onChange={e => setName(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div>
                        <label htmlFor="edit-salesman-mobile" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Mobile Number</label>
                        <input 
                            type="tel" 
                            id="edit-salesman-mobile" 
                            value={mobile} 
                            placeholder='e.g., +9230********'
                            onChange={e => setMobile(e.target.value)} 
                            required 
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-salesman-address" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Address</label>
                        <textarea 
                            id="edit-salesman-address" 
                            value={address} 
                            onChange={e => setAddress(e.target.value)} 
                            rows={2}
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label htmlFor="edit-salesman-hire-date" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Hire Date</label>
                            <input 
                                type="date" 
                                id="edit-salesman-hire-date" 
                                value={hireDate} 
                                onChange={e => setHireDate(e.target.value)} 
                                required 
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="edit-salesman-salary" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Salary (PKR)</label>
                            <input 
                                type="number" 
                                id="edit-salesman-salary" 
                                value={monthlySalary} 
                                onChange={e => setMonthlySalary(e.target.value === '' ? '' : Number(e.target.value))} 
                                required 
                                min="0" 
                                className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                            />
                        </div>
                    </div>

                    <div>
                        <label htmlFor="edit-salesman-areas" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">
                            Assigned Areas <span className="normal-case text-xs font-normal text-gray-500">(Comma separated)</span>
                        </label>
                        <input 
                            type="text" 
                            id="edit-salesman-areas" 
                            value={areasAssigned} 
                            onChange={e => setAreasAssigned(e.target.value)} 
                            placeholder="e.g. Block A, Block B"
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>

                    <div>
                        <label htmlFor="edit-salesman-notes" className="block text-sm font-bold text-brand-text-secondary uppercase mb-1">Notes</label>
                        <textarea 
                            id="edit-salesman-notes" 
                            value={notes} 
                            onChange={e => setNotes(e.target.value)} 
                            rows={2}
                            className="mt-1 block w-full px-4 py-2.5 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-blue focus:border-brand-blue sm:text-sm transition-all" 
                        />
                    </div>
                    
                    <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100 mt-4">
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

export default EditSalesmanModal;