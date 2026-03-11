import React, { useState, useEffect } from 'react';
import { WaterDropIcon } from '../icons/WaterDropIcon';
import { ShoppingCartIcon } from '../icons/ShoppingCartIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';
import { apiService } from '../../api/apiService'; // Assuming your API service is here
import toast from 'react-hot-toast';
/**
 * Component for creating a new Counter Staff account via MongoDB.
 */
const CounterSignup = ({ onSignup, onLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'user'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, feedback: '' });

  useEffect(() => {
    if (formData.password) {
      const strength = checkPasswordStrength(formData.password);
      setPasswordStrength(strength);
    }
  }, [formData.password]);

  // Frontend helper remains for UI feedback only
  const checkPasswordStrength = (pwd) => {
    let score = 0;
    const feedback = [];
    if (pwd.length >= 8) score += 1;
    else feedback.push('At least 8 characters');
    if (/[a-z]/.test(pwd)) score += 1;
    if (/[A-Z]/.test(pwd)) score += 1;
    if (/[0-9]/.test(pwd)) score += 1;
    if (/[^a-zA-Z0-9]/.test(pwd)) score += 1;

    let feedbackText = '';
    if (score < 4) feedbackText = `Include: ${feedback.slice(0, 2).join(', ')}`;
    return { score, feedback: feedbackText };
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Basic frontend validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    setIsLoading(true);
    try {
      // Hit your actual Express route: POST /api/auth/signup
      const response = await apiService.signup({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        role: formData.role
      });

      if (response.success) {
        // Callback to parent to show success message or auto-login
        toast.success("SignUp Successfull")
        onSignup(response.user);
      }
    } catch (err) {
      // Backend error (e.g., email already registered)
      setError(err.message || 'Failed to create account.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setError('');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-lightblue">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-xl">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-brand-accent rounded-full mb-4">
            <WaterDropIcon className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-brand-text-primary">
            Counter Staff Signup
          </h2>
          <p className="mt-2 text-center text-md text-brand-text-secondary">
            Nishat Beverages Plant Access
          </p>
        </div>

        

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Full Name</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={e => handleInputChange('name', e.target.value)}
              className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              placeholder="Staff Member Name"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary">Email Address</label>
              <input
                type="email"
                required
                value={formData.email}
                onChange={e => handleInputChange('email', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-text-secondary">Phone</label>
              <input
                type="tel"
                required
                value={formData.phone}
                placeholder='e.g., +9230********'
                onChange={e => handleInputChange('phone', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue sm:text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={formData.password}
                onChange={e => handleInputChange('password', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue sm:text-sm pr-10"
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-brand-text-secondary">Confirm Password</label>
            <div className="relative">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                required
                value={formData.confirmPassword}
                onChange={e => handleInputChange('confirmPassword', e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-brand-blue focus:border-brand-blue sm:text-sm pr-10"
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500">
                {showConfirmPassword ? <EyeOffIcon className="h-5 w-5" /> : <EyeIcon className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {error && <p className="text-red-600 text-xs font-bold italic">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-lightblue transition-all shadow-md active:scale-95 disabled:opacity-60"
          >
            <ShoppingCartIcon className="h-5 w-5 mr-3" />
            {isLoading ? 'Registering Staff...' : 'Create Account'}
          </button>

          <div className="text-center">
            <button
              type="button"
              onClick={onLogin}
              className="text-sm text-brand-blue hover:underline"
            >
              Already have an account? Sign in
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CounterSignup;