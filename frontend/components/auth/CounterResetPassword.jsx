import React, { useState, useEffect } from 'react';
import { WaterDropIcon } from '../icons/WaterDropIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';
import { apiService } from '../../api/apiService'; // Ensure this path is correct
import toast from 'react-hot-toast';

/**
 * Component to handle the final stage of password recovery.
 * @param {Object} props
 * @param {Function} props.onBack - Navigates back to the login screen.
 * @param {Function} props.onSuccess - Callback after successful password change.
 * @param {string} [props.initialToken] - Optional token if passed via URL or previous step.
 */
const CounterResetPassword = ({ onBack, onSuccess, initialToken = '' }) => {
  const [resetToken, setResetToken] = useState(initialToken);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });

  // Automatically check password strength as the user types
  useEffect(() => {
    if (newPassword) {
      const strength = checkPasswordStrength(newPassword);
      setPasswordStrength(strength);
    } else {
      setPasswordStrength({ score: 0, feedback: '' });
    }
  }, [newPassword]);


  const checkPasswordStrength = (pwd) => {
    let score = 0;
    const feedback = [];

    if (pwd.length >= 8) score += 1;
    else feedback.push('At least 8 characters');
    
    if (pwd.length >= 12) score += 1;
    if (/[a-z]/.test(pwd)) score += 1;
    else feedback.push('lowercase letter');
    if (/[A-Z]/.test(pwd)) score += 1;
    else feedback.push('uppercase letter');
    if (/[0-9]/.test(pwd)) score += 1;
    else feedback.push('number');
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;
    else feedback.push('special character');

    let feedbackText = '';
    if (score < 4) {
      feedbackText = `Add: ${feedback.slice(0, 2).join(', ')}`;
    } else if (score < 5) {
      feedbackText = `Consider adding: ${feedback[0]}`;
    }

    return { score, feedback: feedbackText };
  };

  const validateForm = () => {
    if (!resetToken.trim()) return 'Reset token is required.';
    if (newPassword.length < 8) return 'Password must be at least 8 characters long.';
    if (passwordStrength.score < 4) return 'Password is too weak. ' + passwordStrength.feedback;
    if (newPassword !== confirmPassword) return 'Passwords do not match.';
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    try {
      // Send token and new password to the backend securely
      await apiService.resetPassword({ 
        token: resetToken, 
        newPassword: newPassword 
      });

      toast.success('Password has been reset successfully!');
      
      // Delay slightly so the user sees the success message before redirecting
      setTimeout(() => {
        onSuccess();
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to reset password. The token may be invalid or expired.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg animate-fade-in p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-blue-50 rounded-full mb-4 shadow-inner border border-blue-100">
            <WaterDropIcon className="h-10 w-10 text-brand-blue" />
          </div>
          <h2 className="text-3xl font-black text-center text-brand-text-primary tracking-tight">
            Secure Reset
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-brand-text-secondary max-w-xs">
            Enter the recovery token you received and set your new password.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div>
            <label htmlFor="reset-token" className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Recovery Token</label>
            <input
              id="reset-token"
              type="text"
              value={resetToken}
              onChange={e => {
                setResetToken(e.target.value);
                setError('');
              }}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm font-medium tracking-widest text-center"
              placeholder="e.g. 8f4a2b9..."
            />
          </div>

          <div>
            <label htmlFor="new-password" className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">New Password</label>
            <div className="relative">
              <input
                id="new-password"
                type={showPassword ? 'text' : 'password'}
                value={newPassword}
                onChange={e => {
                  setNewPassword(e.target.value);
                  setError('');
                }}
                className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm pr-12 font-medium"
                placeholder="Enter new password"
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(s => !s)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors focus:outline-none p-1"
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
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
                    passwordStrength.score < 5 ? 'bg-blue-500 w-3/4' :
                    'bg-green-500 w-full'
                  }`}
                />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-wider w-12 text-right text-gray-500">
                {passwordStrength.score === 0 ? '' :
                 passwordStrength.score < 2 ? 'Weak' :
                 passwordStrength.score < 4 ? 'Fair' :
                 passwordStrength.score < 5 ? 'Good' : 'Strong'}
              </span>
            </div>
            {passwordStrength.feedback && (
              <p className="text-[10px] font-semibold text-yellow-600">{passwordStrength.feedback}</p>
            )}
          </div>

          <div>
            <label htmlFor="confirm-password" className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">Confirm Password</label>
            <div className="relative">
              <input
                id="confirm-password"
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={e => {
                  setConfirmPassword(e.target.value);
                  setError('');
                }}
                className={`mt-1 block w-full px-4 py-3 bg-gray-50 border rounded-lg shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm pr-12 font-medium ${
                  confirmPassword && newPassword !== confirmPassword ? 'border-red-300 focus:ring-red-400' : 'border-gray-200'
                }`}
                placeholder="Confirm new password"
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(s => !s)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue transition-colors focus:outline-none p-1"
              >
                {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !newPassword || !confirmPassword || !resetToken}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent font-bold rounded-xl text-white bg-brand-blue hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Updating...
                </div>
              ) : 'Confirm Password Reset'}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 font-bold rounded-xl text-brand-text-secondary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all active:scale-[0.98]"
            >
              Back to Login
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterResetPassword;