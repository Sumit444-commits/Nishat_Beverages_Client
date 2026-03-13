import React, { useState, useEffect } from "react";
import RoleSelection from "../components/auth/RoleSelection";
import Login from "../components/auth/Login";
// import Signup from "../components/auth/Signup";
import Dashboard from "../components/dashboard/Dashboard";
import ForgotPasswordModal from "../components/auth/ForgotPasswordModal";
import CounterLoginNew from "../components/auth/CounterLoginNew";
import CounterSignup from "../components/auth/CounterSignup";
import CounterForgotPassword from "../components/auth/CounterForgotPassword";
import CounterResetPassword from "../components/auth/CounterResetPassword";
import CounterView from "../components/counter/CounterView";
import { Toaster } from "react-hot-toast";

/**
 * Main Application Controller
 * Handles authentication routing and session persistence using the backend data.
 */
const App = () => {
  const [authState, setAuthState] = useState("roleSelection");
  const [currentUser, setCurrentUser] = useState(null);
  const [currentCounterUser, setCurrentCounterUser] = useState(null);
  const [isForgotPasswordOpen, setForgotPasswordOpen] = useState(false);
  const [isInitializing, setIsInitializing] = useState(true);
  const [resetTokenStore, setResetTokenStore] = useState("");

  // Check for existing active sessions on page load
  useEffect(() => {
    const initializeAuth = () => {
      // Check Admin Session
      const adminSession = localStorage.getItem("ro_plant_admin_session");
      if (adminSession) {
        try {
          const user = JSON.parse(adminSession);
          setCurrentUser(user);
          setAuthState("loggedIn");
          setIsInitializing(false);
          return;
        } catch (e) {
          localStorage.removeItem("ro_plant_admin_session");
        }
      }

      // Check Counter Session
      const counterSession = localStorage.getItem("ro_plant_counter_session");
      if (counterSession) {
        try {
          const sessionData = JSON.parse(counterSession);
          // Verify session hasn't expired (8-hour limit)
          if (sessionData.expiresAt && Date.now() < sessionData.expiresAt) {
            setCurrentCounterUser(sessionData.user);
            setAuthState("counterView");
            setIsInitializing(false);
            return;
          } else {
            localStorage.removeItem("ro_plant_counter_session");
          }
        } catch (e) {
          localStorage.removeItem("ro_plant_counter_session");
        }
      }

      setAuthState("roleSelection");
      setIsInitializing(false);
    };

    initializeAuth();
  }, []);

  // ========== AUTHENTICATION HANDLERS ==========

  // Triggered by Login.jsx after successful API call to /auth/login
  const handleAdminLogin = (backendUser) => {
    localStorage.setItem("ro_plant_admin_session", JSON.stringify(backendUser));
    setCurrentUser(backendUser);
    setAuthState("loggedIn");
  };

  // Triggered by CounterLoginNew.jsx after successful API call to /auth/login
  const handleCounterLogin = (backendUser) => {
    const sessionData = {
      user: backendUser,
      expiresAt: Date.now() + 8 * 60 * 60 * 1000, // 8 hours
    };
    localStorage.setItem(
      "ro_plant_counter_session",
      JSON.stringify(sessionData),
    );
    setCurrentCounterUser(backendUser);
    setAuthState("counterView");
  };

  // Triggered by CounterSignup.jsx after successful API call to /auth/signup
  const handleCounterSignup = (backendUser) => {
    handleCounterLogin(backendUser); // Auto-login after signup
  };

  const handleCounterResetPassword = (backendUser) => {
    handleCounterLogin(backendUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("ro_plant_admin_session");
    localStorage.removeItem("ro_plant_counter_session");
    setCurrentUser(null);
    setCurrentCounterUser(null);
    setAuthState("roleSelection");
  };

  const handleSelectRole = (role) => {
    setAuthState(role === "admin" ? "adminLogin" : "counterLogin");
  };

  // Prevent flicker while checking localStorage
  if (isInitializing) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-lightblue">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
      </div>
    );
  }

  const renderContent = () => {
    switch (authState) {
      case "roleSelection":
        return <RoleSelection onSelectRole={handleSelectRole} />;
      case "adminLogin":
        // Pass the handler down so Login.jsx can provide the MongoDB user object
        return (
          <Login
            onLogin={handleAdminLogin}
            // showSignup={() => setAuthState("adminSignup")}
            onForgotPassword={() => setForgotPasswordOpen(true)}
          />
        );
      // case "adminSignup":
      //   return (
      //     <Signup
      //       onSignup={() => setAuthState("adminLogin")}
      //       showLogin={() => setAuthState("adminLogin")}
      //     />
      //   );
      case "counterLogin":
        return (
          <CounterLoginNew
            onLogin={handleCounterLogin}
            onSignup={() => setAuthState("counterSignup")}
            onForgotPassword={() => setAuthState("counterForgotPassword")}
          />
        );
      case "counterSignup":
        return (
          <CounterSignup
            onSignup={handleCounterSignup}
            onLogin={() => setAuthState("counterLogin")}
          />
        );
      case "counterForgotPassword":
        return (
          <CounterForgotPassword
            onBack={() => setAuthState("counterLogin")}
            onSuccess={(token) => {
              setResetTokenStore(token);
              setAuthState("counterResetPassword");
            }}
          />
        );
      case "counterResetPassword":
        return (
          <CounterResetPassword
            onBack={() => setAuthState("counterLogin")}
            onSuccess={handleCounterResetPassword}
            initialToken={resetTokenStore} // Pass it into the reset screen!
          />
        );
      case "loggedIn":
        return currentUser ? (
          <Dashboard user={currentUser} onLogout={handleLogout} />
        ) : (
          <RoleSelection onSelectRole={handleSelectRole} />
        );
      case "counterView":
        return currentCounterUser ? (
          <CounterView user={currentCounterUser} onLogout={handleLogout} />
        ) : (
          <RoleSelection onSelectRole={handleSelectRole} />
        );
      default:
        return <RoleSelection onSelectRole={handleSelectRole} />;
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg text-brand-text-primary font-sans antialiased">
      <Toaster position="top-center" reverseOrder={false} />
      {renderContent()}
      <ForgotPasswordModal
        isOpen={isForgotPasswordOpen}
        onClose={() => setForgotPasswordOpen(false)}
      />
    </div>
  );
};

export default App;
