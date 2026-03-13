
import React, { useState } from 'react';
import { WaterDropIcon } from '../icons/WaterDropIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';
import { apiService } from '../../api/apiService';

/**
 * Admin Login component for Nishat Beverages.
 * Connects to the Express/MongoDB backend for authentication.
 * * @param {Object} props
 * @param {Function} props.onLogin - Callback after successful authentication.
 * @param {Function} props.showSignup - Navigates to the signup view.
 * @param {Function} props.onForgotPassword - Navigates to the forgot password modal.
 */
const Login = ({ onLogin, onForgotPassword }) => {
  const [identifier, setIdentifier] = useState(''); // Email or Phone
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!identifier.trim()) {
      setError('Please enter your email or phone number');
      return false;
    }

    if (!password.trim()) {
      setError('Please enter your password');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // 1. Use the centralized apiService
      // Your Express server natively handles { identifier, password }
      const response = await apiService.login({
        identifier: identifier.trim(),
        password: password
      });

      if (response.success) {
        // 2. Enforce Role-Based Access Control (Admin Only)
        if (response.user.role !== 'admin') {
          setError('Access Denied: You do not have administrator privileges.');
          setIsLoading(false);
          return;
        }

        // 3. Clean up UI state
        setIdentifier('');
        setPassword('');
        
        // 4. Pass the verified MongoDB user object back to App.jsx
        // Note: App.jsx will handle saving the session to localStorage
        onLogin(response.user);
      }
    } catch (err) {
      // Catches the 401/400 error messages sent by your Express backend
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-blue to-brand-lightblue">
      <div className="w-full max-w-sm p-8 space-y-8 bg-white rounded-2xl shadow-xl transform transition-all hover:scale-105">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-brand-accent rounded-full mb-4">
            <WaterDropIcon className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-brand-text-primary">
            Admin Login
          </h2>
          <p className="mt-2 text-center text-md text-brand-text-secondary">
            Sign in to manage Nishat Beverages
          </p>
        </div>

        
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-4">
            <div>
              <input
                id="identifier"
                name="identifier"
                type="text"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm"
                placeholder="Email or Phone Number"
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
                autoComplete="username"
              />
            </div>
            
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? 'text' : 'password'}
                autoComplete="current-password"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent focus:z-10 sm:text-sm pr-10"
                placeholder="Password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 focus:outline-none"
                disabled={isLoading}
              >
                {showPassword ? (
                  <EyeOffIcon className="h-5 w-5 text-gray-500 hover:text-brand-blue transition-colors" />
                ) : (
                  <EyeIcon className="h-5 w-5 text-gray-500 hover:text-brand-blue transition-colors" />
                )}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <input
                id="remember-me"
                name="remember-me"
                type="checkbox"
                className="h-4 w-4 text-brand-blue focus:ring-brand-accent border-gray-300 rounded"
              />
              <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                Remember me
              </label>
            </div>
            
            <div className="text-sm">
              <button 
                type="button"
                onClick={onForgotPassword}
                className="font-medium text-brand-blue hover:text-brand-accent disabled:text-gray-400 transition-colors"
                disabled={isLoading}
              >
                Forgot password?
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border-l-4 border-red-500 rounded-md shadow-sm">
              <p className="text-red-700 text-sm font-medium text-center">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 shadow-md"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Verifying...
                </>
              ) : 'Sign In as Admin'}
            </button>
          </div>
        </form>
        
        {/* <p className="mt-4 text-center text-sm text-brand-text-secondary">
          Don't have an account?{' '}
          <button 
            onClick={showSignup} 
            className="font-bold text-brand-blue hover:text-brand-accent disabled:text-gray-400 transition-colors underline"
            disabled={isLoading}
          >
            Sign up
          </button>
        </p> */}
      </div>
    </div>
  );
};

export default Login;