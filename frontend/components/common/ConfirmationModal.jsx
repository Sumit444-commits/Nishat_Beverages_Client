import React from 'react';

/**
 * A reusable modal for destructive or important actions.
 * @param {Object} props
 * @param {boolean} props.isOpen - Visibility toggle.
 * @param {Function} props.onClose - Cancel/Close handler.
 * @param {Function} props.onConfirm - Success/Confirm handler.
 * @param {string} props.title - Modal heading.
 * @param {string} props.message - Descriptive text.
 */

const ConfirmationModal = ({ isOpen, onClose, onConfirm, title, message }) => {
    // Conditional rendering remains the same
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm">
                <h2 className="text-xl font-bold text-brand-text-primary mb-4">{title}</h2>
                <p className="text-brand-text-secondary mb-6">{message}</p>
                
                <div className="flex justify-end space-x-4">
                    <button 
                        onClick={onClose} 
                        className="px-4 py-2 bg-gray-200 text-brand-text-secondary rounded-md hover:bg-gray-300 font-semibold"
                    >
                        Cancel
                    </button>
                    <button 
                        onClick={onConfirm} 
                        className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 font-semibold"
                    >
                        Confirm
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationModal;