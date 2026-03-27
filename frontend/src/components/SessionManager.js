import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const SessionManager = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [sessionWarning, setSessionWarning] = useState(false);
  const [sessionTimeLeft, setSessionTimeLeft] = useState(0);

  useEffect(() => {
    const checkSession = () => {
      const isAuth = authService.isAuthenticated();
      const isLoginPage = location.pathname === '/login';

      if (!isAuth && !isLoginPage) {
        navigate('/login');
      }
    };

    checkSession();
    const interval = setInterval(checkSession, 60000);
    return () => clearInterval(interval);
  }, [navigate, location]);

  useEffect(() => {
    const warningInterval = setInterval(() => {
      const timeRemaining = authService.getSessionTimeRemaining();
      setSessionTimeLeft(timeRemaining);

      if (timeRemaining === 5 && authService.isAuthenticated()) {
        setSessionWarning(true);
      }

      if (timeRemaining === 0 && authService.isAuthenticated()) {
        authService.logout();
        navigate('/login');
      }
    }, 60000);

    return () => clearInterval(warningInterval);
  }, [navigate]);

  const handleExtendSession = () => {
    authService.refreshSession();
    setSessionWarning(false);
    setSessionTimeLeft(30 * 24 * 60);
  };

  return (
    <>
      {children}

      {sessionWarning && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-lg border border-slate-700 p-6 max-w-sm">
            <h3 className="text-lg font-bold text-white mb-2">Session Expiring Soon</h3>
            <p className="text-slate-300 mb-4">
              Your session will expire in {sessionTimeLeft} minutes. Would you like to continue?
            </p>
            <div className="flex gap-3">
              <button
                onClick={handleExtendSession}
                className="flex-1 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-semibold py-2 rounded-lg transition-all"
              >
                Continue Session
              </button>
              <button
                onClick={() => {
                  authService.logout();
                  navigate('/login');
                }}
                className="flex-1 bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-2 rounded-lg transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SessionManager;
