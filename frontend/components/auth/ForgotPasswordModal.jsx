import React, { useState, useEffect } from 'react';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';
import { apiService } from '../../api/apiService';
import toast from 'react-hot-toast';

/**
 * Modal component for handling the administrator password reset flow.
 * Now fully connected to the MongoDB backend via API.
 * @param {Object} props
 * @param {boolean} props.isOpen - Controls the visibility of the modal.
 * @param {Function} props.onClose - Function to close the modal.
 */
const ForgotPasswordModal = ({ isOpen, onClose }) => {
    const [step, setStep] = useState('enterIdentifier');
    const [identifier, setIdentifier] = useState('');
    const [resetToken, setResetToken] = useState(''); // NEW: Token state
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });

    const resetState = () => {
        setStep('enterIdentifier');
        setIdentifier('');
        setResetToken('');
        setNewPassword('');
        setConfirmPassword('');
        setError('');
        setShowNewPassword(false);
        setShowConfirmPassword(false);
        setPasswordStrength({ score: 0, feedback: '' });
        setIsLoading(false);
    };

    const handleClose = () => {
        onClose();
        // Reset local state after the modal closing animation finishes
        setTimeout(resetState, 300);
    };
    
    useEffect(() => {
        if (!isOpen) {
            resetState();
        }
    }, [isOpen]);

    // Dynamic Password Strength logic
    useEffect(() => {
        if (newPassword) {
            let score = 0;
            const feedback = [];
            if (newPassword.length >= 8) score += 1; else feedback.push('8+ chars');
            if (newPassword.length >= 12) score += 1;
            if (/[a-z]/.test(newPassword)) score += 1; else feedback.push('lowercase');
            if (/[A-Z]/.test(newPassword)) score += 1; else feedback.push('uppercase');
            if (/[0-9]/.test(newPassword)) score += 1; else feedback.push('number');
            if (/[^a-zA-Z0-9]/.test(newPassword)) score += 1; else feedback.push('special char');

            let feedbackText = '';
            if (score < 4) feedbackText = `Add: ${feedback.slice(0, 2).join(', ')}`;
            setPasswordStrength({ score, feedback: feedbackText });
        } else {
            setPasswordStrength({ score: 0, feedback: '' });
        }
    }, [newPassword]);

    // STEP 1: Verify User and Request Token from Backend
    const handleIdentifierSubmit = async (e) => {
        e.preventDefault();
        setError('');
        if (!identifier.trim()) return setError('Please enter your email or phone number.');

        setIsLoading(true);
        try {
            const method = identifier.includes('@') ? 'email' : 'phone';
            
            // Call the Express Backend
            const response = await apiService.requestPasswordReset({
                method,
                identifier: identifier.trim().toLowerCase()
            });

            // Auto-fill the token for testing/demo purposes. 
            // In production, the user would check their email and type it in manually.
            if (response.resetToken) {
                setResetToken(response.resetToken);
            }

            setStep('enterNewPassword');
            toast.success("Account verified. Check your email for the reset token.");
        } catch (err) {
            setError(err.message || 'No account found with that email or phone number.');
        } finally {
            setIsLoading(false);
        }
    };

    // STEP 2: Submit Token and New Password to Backend
    const handlePasswordResetSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!resetToken) return setError('Recovery token is required.');
        if (newPassword !== confirmPassword) return setError('Passwords do not match.');
        if (newPassword.length < 8) return setError('Password must be at least 8 characters long.');
        if (passwordStrength.score < 4) return setError('Password is too weak. ' + passwordStrength.feedback);

        setIsLoading(true);
        try {
            // Call the Express Backend to save the new password
            await apiService.resetPassword({
                token: resetToken,
                newPassword: newPassword
            });

            setStep('success');
            toast.success("Password successfully updated!");
        } catch (err) {
            setError(err.message || 'Failed to reset password. The token may be invalid or expired.');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    const renderStepContent = () => {
        switch (step) {
            case 'enterIdentifier':
                return (
                    <form onSubmit={handleIdentifierSubmit} className="space-y-5">
                        <div>
                            <label htmlFor="reset-identifier" className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">
                                Email or Phone Number
                            </label>
                            <input 
                                type="text" 
                                id="reset-identifier" 
                                value={identifier} 
                                onChange={e => setIdentifier(e.target.value)} 
                                required 
                                placeholder="admin@nishat.com"
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm font-medium" 
                            />
                        </div>
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
                                <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}
                        <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100">
                            <button 
                                type="button" 
                                onClick={handleClose} 
                                disabled={isLoading}
                                className="px-5 py-2.5 bg-gray-100 text-brand-text-secondary font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-lg shadow-md hover:bg-brand-lightblue active:scale-95 transition-all flex items-center disabled:opacity-50"
                            >
                                {isLoading ? 'Verifying...' : 'Send Recovery Token'}
                            </button>
                        </div>
                    </form>
                );
            case 'enterNewPassword':
                 return (
                    <form onSubmit={handlePasswordResetSubmit} className="space-y-4 animate-fade-in">
                        <div className="bg-blue-50 p-3 rounded-lg border border-blue-100 mb-2">
                            <p className="text-sm font-medium text-brand-blue text-center">
                                Token sent to: <span className="font-black">{identifier}</span>
                            </p>
                        </div>

                        <div>
                            <label htmlFor="reset-token" className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">
                                Recovery Token
                            </label>
                            <input 
                                type="text" 
                                id="reset-token" 
                                value={resetToken} 
                                onChange={e => setResetToken(e.target.value)} 
                                required 
                                placeholder="Enter token from email/SMS"
                                className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm font-medium text-center tracking-widest" 
                            />
                        </div>
                        
                        <div>
                            <label htmlFor="new-password" className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">
                                New Password
                            </label>
                            <div className="relative">
                                <input 
                                    type={showNewPassword ? 'text' : 'password'}
                                    id="new-password" 
                                    value={newPassword} 
                                    onChange={e => setNewPassword(e.target.value)} 
                                    required 
                                    placeholder="Enter new password"
                                    className="block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm pr-12 font-medium" 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowNewPassword(!showNewPassword)} 
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-blue transition-colors focus:outline-none"
                                >
                                    {showNewPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {/* Password Strength Indicator */}
                        <div className="space-y-2 px-1">
                            <div className="flex items-center space-x-3">
                                <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden flex">
                                    <div className={`h-full transition-all duration-500 ease-out ${
                                        passwordStrength.score === 0 ? 'w-0' :
                                        passwordStrength.score < 2 ? 'bg-red-500 w-1/4' :
                                        passwordStrength.score < 4 ? 'bg-yellow-500 w-2/4' :
                                        passwordStrength.score < 5 ? 'bg-blue-500 w-3/4' : 'bg-green-500 w-full'
                                    }`}/>
                                </div>
                            </div>
                            {passwordStrength.feedback && (
                                <p className="text-[10px] font-semibold text-yellow-600">{passwordStrength.feedback}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="confirm-password" className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">
                               Confirm New Password
                            </label>
                            <div className="relative">
                                <input 
                                    type={showConfirmPassword ? 'text' : 'password'}
                                    id="confirm-password" 
                                    value={confirmPassword} 
                                    onChange={e => setConfirmPassword(e.target.value)} 
                                    required 
                                    placeholder="Confirm new password"
                                    className={`block w-full px-4 py-3 bg-gray-50 border rounded-lg shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm pr-12 font-medium ${
                                        confirmPassword && newPassword !== confirmPassword ? 'border-red-300 focus:ring-red-400' : 'border-gray-200'
                                    }`} 
                                />
                                <button 
                                    type="button" 
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-brand-blue transition-colors focus:outline-none"
                                >
                                    {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
                                <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                                <p className="text-red-700 text-sm font-medium">{error}</p>
                            </div>
                        )}

                        <div className="flex justify-end pt-4 space-x-3 border-t border-gray-100 mt-4">
                            <button 
                                type="button" 
                                onClick={handleClose} 
                                disabled={isLoading}
                                className="px-5 py-2.5 bg-gray-100 text-brand-text-secondary font-bold rounded-lg hover:bg-gray-200 transition-colors disabled:opacity-50"
                            >
                                Cancel
                            </button>
                            <button 
                                type="submit" 
                                disabled={isLoading || !newPassword || !confirmPassword || !resetToken}
                                className="px-6 py-2.5 bg-brand-blue text-white font-bold rounded-lg shadow-md hover:bg-brand-lightblue active:scale-95 transition-all flex items-center disabled:opacity-50 disabled:pointer-events-none"
                            >
                                {isLoading ? 'Updating...' : 'Save Password'}
                            </button>
                        </div>
                    </form>
                );
            case 'success':
                 return (
                    <div className="text-center py-6 animate-fade-in">
                        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                            </svg>
                        </div>
                        <h3 className="text-2xl font-black text-brand-text-primary mb-2">Password Reset Successful</h3>
                        <p className="text-brand-text-secondary font-medium mb-8 max-w-sm mx-auto">
                            Your password has been securely updated in the database. You can now log into your admin account.
                        </p>
                        <button 
                            onClick={handleClose} 
                            className="w-full px-6 py-3 bg-brand-blue text-white font-bold rounded-xl shadow-md hover:bg-brand-lightblue active:scale-95 transition-all"
                        >
                            Return to Login
                        </button>
                    </div>
                );
            default:
                return null;
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 md:p-8 w-full max-w-md animate-fade-in border border-gray-100">
                {step !== 'success' && (
                    <div className="flex justify-between items-start mb-6 border-b border-gray-100 pb-4">
                        <div>
                            <h2 className="text-xl font-black text-brand-text-primary tracking-tight">Admin Recovery</h2>
                            <p className="text-sm font-medium text-brand-text-secondary mt-1">Database Verification</p>
                        </div>
                        <button 
                            onClick={handleClose} 
                            className="text-gray-400 hover:text-gray-600 p-1.5 rounded-full hover:bg-gray-100 transition-colors focus:outline-none"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                    </div>
                )}
                {renderStepContent()}
            </div>
        </div>
    );
};

export default ForgotPasswordModal;