// import React, { useState } from 'react';
// import { WaterDropIcon } from '../icons/WaterDropIcon';
// import { EyeIcon } from '../icons/EyeIcon';
// import { EyeOffIcon } from '../icons/EyeOffIcon';

// // Pulling API URL from environment variables
// const API_URL = import.meta.env.VITE_API_URL || process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// /**
//  * Admin Signup component for Nishat Beverages.
//  * @param {Object} props
//  * @param {Function} props.onSignup - Callback after successful account creation.
//  * @param {Function} props.showLogin - Navigates back to the login view.
//  */
// const Signup = ({ onSignup, showLogin }) => {
//   const [name, setName] = useState('');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [showConfirmPassword, setShowConfirmPassword] = useState(false);
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);

//   const validateForm = () => {
//     if (!name.trim()) {
//       setError('Please enter your full name');
//       return false;
//     }
    
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
//     if (!emailRegex.test(email)) {
//       setError('Please enter a valid email address');
//       return false;
//     }

//     const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
//     if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
//       setError('Please enter a valid phone number');
//       return false;
//     }

//     if (password.length < 6) {
//       setError('Password must be at least 6 characters');
//       return false;
//     }

//     if (password !== confirmPassword) {
//       setError("Passwords don't match");
//       return false;
//     }

//     return true;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       return;
//     }

//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await fetch(`${API_URL}/auth/signup`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({
//           name,
//           email,
//           phone,
//           password,
//           confirmPassword
//         }),
//       });

//       const data = await response.json();

//       if (!response.ok) {
//         throw new Error(data.message || 'Signup failed');
//       }

//       if (data.success) {
//         // Optional: Store temporary user data
//         localStorage.setItem('ro_plant_user', JSON.stringify(data.user));
//         localStorage.setItem('ro_plant_token', 'dummy-token-for-now'); 
        
//         setName('');
//         setEmail('');
//         setPhone('');
//         setPassword('');
//         setConfirmPassword('');
        
//         alert('Account created successfully! Please login.');
//         onSignup(); // Return to login view
//       } else {
//         setError(data.message);
//       }
//     } catch (error) {
//       setError(error.message || 'An unexpected error occurred. Please try again.');
//       console.error('Signup error:', error);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-blue to-brand-lightblue">
//       <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl transform transition-all hover:scale-105">
//         <div className="flex flex-col items-center">
//           <div className="p-4 bg-brand-accent rounded-full mb-4">
//             <WaterDropIcon className="h-12 w-12 text-white" />
//           </div>
//           <h2 className="text-3xl font-extrabold text-center text-brand-text-primary">
//             Create Admin Account
//           </h2>
//           <p className="mt-2 text-center text-md text-brand-text-secondary">
//             Get started with managing Nishat Beverages
//           </p>
//         </div>
        
//         <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
//           <div>
//             <input
//               id="full-name"
//               name="name"
//               type="text"
//               autoComplete="name"
//               required
//               className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
//               placeholder="Full Name"
//               value={name}
//               onChange={(e) => {
//                 setName(e.target.value);
//                 setError('');
//               }}
//               disabled={isLoading}
//             />
//           </div>
          
//           <div>
//             <input
//               id="email-address-signup"
//               name="email"
//               type="email"
//               autoComplete="email"
//               required
//               className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
//               placeholder="Email address"
//               value={email}
//               onChange={(e) => {
//                 setEmail(e.target.value);
//                 setError('');
//               }}
//               disabled={isLoading}
//             />
//           </div>
          
//           <div>
//             <input
//               id="phone-number"
//               name="phone"
//               type="tel"
//               autoComplete="tel"
//               required
//               className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
//               placeholder="Phone Number (e.g., +1234567890)"
//               value={phone}
//               onChange={(e) => {
//                 setPhone(e.target.value);
//                 setError('');
//               }}
//               disabled={isLoading}
//             />
//           </div>
          
//           <div className="relative">
//             <input
//               id="password-signup"
//               name="password"
//               type={showPassword ? 'text' : 'password'}
//               autoComplete="new-password"
//               required
//               className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
//               placeholder="Password (min. 6 characters)"
//               value={password}
//               onChange={(e) => {
//                 setPassword(e.target.value);
//                 setError('');
//               }}
//               disabled={isLoading}
//             />
//             <button
//               type="button"
//               onClick={() => setShowPassword(!showPassword)}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
//               disabled={isLoading}
//             >
//               {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
//             </button>
//           </div>
          
//           <div className="relative">
//             <input
//               id="confirm-password"
//               name="confirmPassword"
//               type={showConfirmPassword ? 'text' : 'password'}
//               autoComplete="new-password"
//               required
//               className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm"
//               placeholder="Confirm Password"
//               value={confirmPassword}
//               onChange={(e) => {
//                 setConfirmPassword(e.target.value);
//                 setError('');
//               }}
//               disabled={isLoading}
//             />
//             <button
//               type="button"
//               onClick={() => setShowConfirmPassword(!showConfirmPassword)}
//               className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
//               disabled={isLoading}
//             >
//               {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-500" /> : <EyeIcon className="h-5 w-5 text-gray-500" />}
//             </button>
//           </div>

//           {error && (
//             <div className="p-3 bg-red-50 border border-red-200 rounded-md">
//               <p className="text-red-600 text-sm text-center">{error}</p>
//             </div>
//           )}

//           <div className="pt-2">
//             <button
//               type="submit"
//               disabled={isLoading}
//               className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-brand-blue hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors duration-300"
//             >
//               {isLoading ? (
//                 <>
//                   <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                     <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                     <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                   </svg>
//                   Creating account...
//                 </>
//               ) : 'Sign up'}
//             </button>
//           </div>
//         </form>
        
//         <p className="mt-4 text-center text-sm text-brand-text-secondary">
//           Already have an account?{' '}
//           <button 
//             onClick={showLogin} 
//             className="font-medium text-brand-blue hover:text-brand-accent disabled:text-gray-400"
//             disabled={isLoading}
//           >
//             Sign in
//           </button>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;


import React, { useState } from 'react';
import { WaterDropIcon } from '../icons/WaterDropIcon';
import { EyeIcon } from '../icons/EyeIcon';
import { EyeOffIcon } from '../icons/EyeOffIcon';
import { apiService } from '../../api/apiService'; 

/**
 * Admin Signup component for Nishat Beverages.
 * Connects directly to the MongoDB backend to create administrator accounts.
 * @param {Object} props
 * @param {Function} props.onSignup - Callback after successful account creation.
 * @param {Function} props.showLogin - Navigates back to the login view.
 */
const Signup = ({ onSignup, showLogin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const validateForm = () => {
    if (!name.trim()) {
      setError('Please enter your full name');
      return false;
    }
    
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Please enter a valid email address');
      return false;
    }

    const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
    if (!phoneRegex.test(phone.replace(/\D/g, ''))) {
      setError('Please enter a valid phone number');
      return false;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return false;
    }

    if (password !== confirmPassword) {
      setError("Passwords don't match");
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
      // Use the centralized apiService to send data to MongoDB
      const response = await apiService.signup({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim(),
        password,
        confirmPassword,
        role: 'admin' // Ensure the backend registers this as an administrator
      });

      if (response.success) {
        // Clear form state
        setName('');
        setEmail('');
        setPhone('');
        setPassword('');
        setConfirmPassword('');
        
        alert('Admin account created successfully! Please login.');
        onSignup(); // Routes the user back to the login screen
      }
    } catch (err) {
      // Catch specific errors from the Express backend (e.g., Duplicate Email)
      setError(err.message || 'An unexpected error occurred. Please try again.');
      console.error('Signup error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-brand-blue to-brand-lightblue">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-2xl shadow-2xl transform transition-all animate-fade-in">
        <div className="flex flex-col items-center">
          <div className="p-4 bg-brand-accent rounded-full mb-4 shadow-inner">
            <WaterDropIcon className="h-12 w-12 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-center text-brand-text-primary">
            Create Admin Account
          </h2>
          <p className="mt-2 text-center text-sm text-brand-text-secondary">
            Get started with managing Nishat Beverages
          </p>
        </div>
        
        

        <form className="mt-6 space-y-4" onSubmit={handleSubmit}>
          <div>
            <input
              id="full-name"
              name="name"
              type="text"
              autoComplete="name"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm transition-colors"
              placeholder="Full Name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError('');
              }}
              disabled={isLoading}
            />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                id="email-address-signup"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm transition-colors"
                placeholder="Email address"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
              />
            </div>
            
            <div>
              <input
                id="phone-number"
                name="phone"
                type="tel"
                autoComplete="tel"
                required
                className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm transition-colors"
                placeholder="e.g., +9230********"
                value={phone}
                onChange={(e) => {
                  setPhone(e.target.value);
                  setError('');
                }}
                disabled={isLoading}
              />
            </div>
          </div>
          
          <div className="relative">
            <input
              id="password-signup"
              name="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm pr-10 transition-colors"
              placeholder="Password (min. 6 characters)"
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
              {showPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-brand-blue" /> : <EyeIcon className="h-5 w-5 text-gray-400 hover:text-brand-blue" />}
            </button>
          </div>
          
          <div className="relative">
            <input
              id="confirm-password"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              autoComplete="new-password"
              required
              className="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-brand-accent focus:border-brand-accent sm:text-sm pr-10 transition-colors"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                setError('');
              }}
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 focus:outline-none"
              disabled={isLoading}
            >
              {showConfirmPassword ? <EyeOffIcon className="h-5 w-5 text-gray-400 hover:text-brand-blue" /> : <EyeIcon className="h-5 w-5 text-gray-400 hover:text-brand-blue" />}
            </button>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700 font-medium text-sm text-center">{error}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-md text-white bg-brand-blue hover:bg-brand-lightblue focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brand-accent disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-300 active:scale-95 shadow-md"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Creating account...
                </>
              ) : 'Register Admin'}
            </button>
          </div>
        </form>
        
        <p className="mt-4 text-center text-sm text-brand-text-secondary">
          Already have an account?{' '}
          <button 
            onClick={showLogin} 
            className="font-bold text-brand-blue hover:text-brand-accent disabled:text-gray-400 transition-colors underline"
            disabled={isLoading}
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
};

export default Signup;