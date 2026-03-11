import React from 'react';

/**
 * A modal component for adding a sale to a customer.
 * NOTE: This is currently a placeholder. Consider using AddSaleModal instead.
 * * @param {Object} props
 * @param {boolean} props.isOpen - Controls if the modal is visible.
 * @param {Function} props.onClose - Function to call when closing the modal.
 */
const AddSaleToCustomerModal = ({ isOpen, onClose }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-xl p-8 w-full max-w-md animate-fade-in">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-brand-text-primary">
                        Add New Sale
                    </h2>
                    <button 
                        onClick={onClose} 
                        className="text-gray-400 hover:text-gray-600 text-3xl leading-none focus:outline-none"
                    >
                        &times;
                    </button>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 text-brand-blue p-4 rounded-lg mb-6">
                    <p className="text-sm font-medium text-center">
                        This is a placeholder modal. 
                        <br/><br/>
                        For full functionality, please use the <strong>AddSaleModal</strong> component which is already connected to the MongoDB backend.
                    </p>
                </div>

                <div className="flex justify-end pt-2">
                    <button 
                        type="button" 
                        onClick={onClose} 
                        className="px-6 py-2.5 bg-gray-200 text-brand-text-secondary font-bold rounded-lg hover:bg-gray-300 transition-colors active:scale-95"
                    >
                        Close
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddSaleToCustomerModal;