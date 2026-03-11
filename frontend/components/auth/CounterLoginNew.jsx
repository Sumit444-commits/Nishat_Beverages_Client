import React, { useState } from 'react';
import { WaterDropIcon } from '../icons/WaterDropIcon';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';
import { apiService } from '../../api/apiService';

/**
 * Component for the Counter Login flow using MongoDB Backend.
 * Supports both Email and Phone number identification.
 */
const CounterLoginNew = ({ onLogin, onSignup, onForgotPassword }) => {
  const [loginMethod, setLoginMethod] = useState('email');
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Note: Lockout logic is now managed by the Backend for better security.
  // Frontend purely handles the UI state and API communication.

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

    // Client-side validation
    if (loginMethod === 'email') {
      if (!identifier.trim()) {
        setError('Please enter your email address.');
        return;
      }
      if (!validateEmail(identifier)) {
        setError('Please enter a valid email address.');
        return;
      }
    } else {
      if (!identifier.trim()) {
        setError('Please enter your phone number.');
        return;
      }
      if (!validatePhone(identifier)) {
        setError('Please enter a valid phone number.');
        return;
      }
    }

    if (!password) {
      setError('Please enter your password.');
      return;
    }

    setIsLoading(true);
    try {
      // Hit the actual Express route: POST /api/auth/login
      // Sending 'identifier' which the backend checks for either email or phone
      const response = await apiService.login({
        identifier: identifier.trim(),
        password: password
      });

      if (response.success) {
        // Clear sensitive local state
        setPassword('');
        // Trigger the parent login handler with the MongoDB user object
        onLogin(response.user);
      }
    } catch (err) {
      // Displays the specific error from your Express server (e.g., "Invalid credentials")
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleIdentifierChange = (value) => {
    setIdentifier(value);
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-lightblue">
      <div className="w-full max-sm:w-[95%] max-w-sm p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-brand-accent rounded-full mb-4 shadow-inner">
            <WaterDropIcon className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-brand-text-primary">
            Counter Login
          </h2>
          <p className="mt-2 text-center text-sm text-brand-text-secondary">
            Nishat Beverages Plant Management
          </p>
        </div>

        

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Method Selector */}
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              type="button"
              onClick={() => { setLoginMethod('email'); setIdentifier(''); setError(''); }}
              className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${
                loginMethod === 'email' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500'
              }`}
            >
              EMAIL
            </button>
            <button
              type="button"
              onClick={() => { setLoginMethod('phone'); setIdentifier(''); setError(''); }}
              className={`flex-1 py-2 rounded-md text-xs font-bold transition-all ${
                loginMethod === 'phone' ? 'bg-white text-brand-blue shadow-sm' : 'text-gray-500'
              }`}
            >
              PHONE
            </button>
          </div>

          {/* Identifier Input */}
          <div>
            <label className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">
              {loginMethod === 'email' ? 'Email Address' : 'Phone Number'}
            </label>
            <input
              type={loginMethod === 'email' ? 'email' : 'tel'}
              value={identifier}
              onChange={e => handleIdentifierChange(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm transition-all"
              placeholder={loginMethod === 'email' ? 'staff@nishat.com' : 'e.g., +9230********'}
              required
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-xs font-bold text-brand-text-secondary uppercase mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => { setPassword(e.target.value); setError(''); }}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue focus:outline-none text-sm transition-all pr-10"
                placeholder="••••••••"
                required
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-blue"
              >
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-2 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-brand-blue hover:bg-brand-lightblue transition-all shadow-md active:scale-95 disabled:opacity-50"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-2" />
            {isLoading ? 'Verifying...' : 'Sign In'}
          </button>

          <div className="flex flex-col space-y-3 pt-2">
            <button
              type="button"
              onClick={onForgotPassword}
              className="text-xs text-brand-blue font-semibold hover:underline"
            >
              Forgot your password?
            </button>
            <button
              type="button"
              onClick={onSignup}
              className="text-xs text-brand-text-secondary hover:text-brand-blue font-semibold"
            >
              Don't have an account? <span className="text-brand-blue underline">Sign up</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterLoginNew;