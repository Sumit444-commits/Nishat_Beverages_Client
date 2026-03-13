import React, { useState } from 'react';
import { WaterDropIcon } from '../icons/WaterDropIcon';
import { apiService } from '../../api/apiService';
import toast from 'react-hot-toast';

/**
 * Component for handling the "Forgot Password" flow for Counter users.
 * @param {Object} props
 * @param {Function} props.onBack - Function to return to the login screen.
 * @param {Function} props.onSuccess - Function to proceed to the token entry screen.
 */
const CounterForgotPassword = ({ onBack, onSuccess }) => {
  const [resetMethod, setResetMethod] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhone = (phone) => {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (resetMethod === 'email') {
      if (!identifier.trim()) return setError('Please enter your email address.');
      if (!validateEmail(identifier)) return setError('Please enter a valid email address.');
    } else {
      if (!identifier.trim()) return setError('Please enter your phone number.');
      if (!validatePhone(identifier)) return setError('Please enter a valid phone number.');
    }

    setIsLoading(true);
    try {
      // Call the backend to generate and "send" the token
      const response = await apiService.requestPasswordReset({ 
        identifier: identifier.trim().toLowerCase(), 
        method: resetMethod 
      });

      toast.success(`Reset instructions sent to your ${resetMethod}!`);
      
      // For development/demo purposes, if the backend returns the token, we can pass it along
      // In production, the user would get this from their email/SMS
      if (response && response.resetToken) {
          console.log(`[DEMO MODE] Your reset token is: ${response.resetToken}`);
          toast(`Demo Token: ${response.resetToken}`, { icon: '🔑', duration: 6000 });
      }

      // Move to the next screen (CounterResetPassword) after a brief delay
      setTimeout(() => {
        onSuccess(response.resetToken);
      }, 1500);

    } catch (err) {
      setError(err.message || 'No account found with these details.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdentifierChange = (value) => {
    setIdentifier(value);
    if (error) setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg animate-fade-in p-4">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl border border-gray-100">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-blue-50 rounded-full mb-4 shadow-inner border border-blue-100">
            <WaterDropIcon className="h-10 w-10 text-brand-blue" />
          </div>
          <h2 className="text-3xl font-black text-center text-brand-text-primary tracking-tight">
            Forgot Password?
          </h2>
          <p className="mt-2 text-center text-sm font-medium text-brand-text-secondary max-w-xs">
            No worries! Choose how you want to receive your secure reset token.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-lg flex items-start">
              <svg className="w-5 h-5 text-red-500 mr-2 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="flex bg-gray-100 rounded-xl p-1.5 shadow-inner">
            <button
              type="button"
              onClick={() => { setResetMethod('email'); setError(''); }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                resetMethod === 'email'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              Email
            </button>
            <button
              type="button"
              onClick={() => { setResetMethod('phone'); setError(''); }}
              className={`flex-1 py-2.5 px-4 rounded-lg text-sm font-bold transition-all ${
                resetMethod === 'phone'
                  ? 'bg-white text-brand-blue shadow-sm'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200/50'
              }`}
            >
              Phone
            </button>
          </div>

          <div>
            <label htmlFor="reset-identifier" className="block text-xs font-bold text-brand-text-secondary uppercase tracking-wider mb-1">
              {resetMethod === 'email' ? 'Registered Email' : 'Registered Phone Number'}
            </label>
            <input
              id="reset-identifier"
              type={resetMethod === 'email' ? 'email' : 'tel'}
              value={identifier}
              onChange={e => handleIdentifierChange(e.target.value)}
              className="mt-1 block w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg shadow-inner focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-blue transition-all sm:text-sm font-medium"
              placeholder={resetMethod === 'email' ? 'name@example.com' : '0300 1234567'}
            />
          </div>

          <div className="space-y-3 pt-4">
            <button
              type="submit"
              disabled={isLoading || !identifier}
              className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent font-bold rounded-xl text-white bg-brand-blue hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-blue transition-all shadow-md active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Sending...
                </div>
              ) : 'Send Reset Instructions'}
            </button>

            <button
              type="button"
              onClick={onBack}
              disabled={isLoading}
              className="w-full flex justify-center items-center py-3 px-4 border border-gray-200 font-bold rounded-xl text-brand-text-secondary bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-200 transition-all active:scale-[0.98]"
            >
              Wait, I remember it!
            </button>
          </div>
        </form>

        <div className="text-center pt-2">
          <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
            Secure Authentication
          </p>
        </div>
      </div>
    </div>
  );
};

export default CounterForgotPassword;