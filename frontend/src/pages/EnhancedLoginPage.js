import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Phone, User, Eye, EyeOff, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import authService from '../services/authService';

const EnhancedLoginPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState('email'); // email, otp, register
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(0);
  const [isNewUser, setIsNewUser] = useState(false);
  const [showResendOption, setShowResendOption] = useState(false);

  // Check if already logged in
  useEffect(() => {
    if (authService.isAuthenticated()) {
      navigate('/dashboard');
    }

    // Load remembered email
    const remembered = authService.getRememberedEmail();
    if (remembered) {
      setEmail(remembered);
      setRememberMe(true);
    }
  }, [navigate]);

  // OTP Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer(t => t - 1), 1000);
    } else if (timer === 0 && step === 'otp') {
      setShowResendOption(true);
    }
    return () => clearInterval(interval);
  }, [timer, step]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleRequestOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    try {
      const response = await authService.requestOTP(email);
      
      if (response.success) {
        setSuccess('OTP sent to your email. Valid for 10 minutes.');
        setStep('otp');
        setTimer(600);
        setShowResendOption(false);
        setOtp('');
      }
    } catch (err) {
      setError(err.message || 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!otp || otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    try {
      if (isNewUser) {
        if (!name || !phone || !password) {
          setError('Please fill in all fields');
          setLoading(false);
          return;
        }

        if (password !== confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        if (password.length < 6) {
          setError('Password must be at least 6 characters');
          setLoading(false);
          return;
        }

        const response = await authService.verifyRegistration(email, otp, name, phone, password);
        
        if (response.success) {
          setSuccess('Registration successful! Redirecting...');
          if (rememberMe) {
            authService.setRememberMe(email);
          }
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      } else {
        const response = await authService.verifyOTP(email, otp);
        
        if (response.success) {
          setSuccess('Login successful! Redirecting...');
          if (rememberMe) {
            authService.setRememberMe(email);
          } else {
            authService.clearRememberMe();
          }
          setTimeout(() => navigate('/dashboard'), 1500);
        }
      }
    } catch (err) {
      setError(err.message || 'Failed to verify OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setError('');
    setSuccess('');
    setLoading(true);
    try {
      const response = await authService.requestOTP(email);
      if (response.success) {
        setSuccess('OTP resent to your email');
        setTimer(600);
        setShowResendOption(false);
        setOtp('');
      }
    } catch (err) {
      setError(err.message || 'Failed to resend OTP');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleUserType = () => {
    setIsNewUser(!isNewUser);
    setError('');
    setSuccess('');
    setStep('email');
    setOtp('');
    setName('');
    setPhone('');
    setPassword('');
    setConfirmPassword('');
  };

  const handleBackToEmail = () => {
    setStep('email');
    setOtp('');
    setError('');
    setSuccess('');
    setShowResendOption(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl border border-slate-700 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-cyan-600 p-8 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="text-5xl mb-3"
            >
              🌍
            </motion.div>
            <h1 className="text-3xl font-bold text-white mb-2">GeoGuard</h1>
            <p className="text-blue-100">Disaster Intelligence Platform</p>
          </div>

          {/* Content */}
          <div className="p-8">
            {/* Alerts */}
            {error && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 p-4 bg-red-500/20 border border-red-500/50 rounded-lg flex items-start gap-3"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
                <p className="text-red-200 text-sm">{error}</p>
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4 p-4 bg-green-500/20 border border-green-500/50 rounded-lg flex items-start gap-3"
              >
                <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0 mt-0.5" />
                <p className="text-green-200 text-sm">{success}</p>
              </motion.div>
            )}

            {/* Email Step */}
            {step === 'email' && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleRequestOTP}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="your@email.com"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {loading ? 'Sending OTP...' : 'Send OTP'}
                </button>

                {/* Toggle User Type */}
                <div className="text-center pt-4 border-t border-slate-700">
                  <p className="text-slate-400 text-sm mb-3">
                    {isNewUser ? 'Already have an account?' : 'New to GeoGuard?'}
                  </p>
                  <button
                    type="button"
                    onClick={handleToggleUserType}
                    className="text-blue-400 hover:text-blue-300 font-semibold text-sm transition-colors"
                  >
                    {isNewUser ? 'Login Instead' : 'Create Account'}
                  </button>
                </div>
              </motion.form>
            )}

            {/* OTP Step */}
            {step === 'otp' && !isNewUser && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleVerifyOTP}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Enter OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    placeholder="000000"
                    maxLength="6"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-center text-2xl tracking-widest focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-slate-400 text-xs">
                      Check your email for the OTP
                    </p>
                    <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
                      <Clock className="w-4 h-4" />
                      {timer > 0 ? formatTime(timer) : 'Expired'}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || timer === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {loading ? 'Verifying...' : 'Verify OTP'}
                </button>

                {showResendOption && (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-3 rounded-lg transition-all"
                  >
                    Resend OTP
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-3 rounded-lg transition-all"
                >
                  Back
                </button>

                {/* Remember Me */}
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="w-4 h-4 rounded bg-slate-700 border-slate-600 text-blue-600 focus:ring-2 focus:ring-blue-500"
                  />
                  <span className="text-slate-400 text-sm">Remember this email</span>
                </label>
              </motion.form>
            )}

            {/* Registration Step */}
            {step === 'otp' && isNewUser && (
              <motion.form
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                onSubmit={handleVerifyOTP}
                className="space-y-4"
              >
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="John Doe"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      disabled={loading}
                      className="w-full pl-10 pr-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="w-full pl-10 pr-10 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3 text-slate-500 hover:text-slate-400"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 w-5 h-5 text-slate-500" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="••••••••"
                      disabled={loading}
                      className="w-full pl-10 pr-10 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-2">
                    Verify OTP
                  </label>
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.slice(0, 6))}
                    placeholder="000000"
                    maxLength="6"
                    disabled={loading}
                    className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-500 text-center text-2xl tracking-widest focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 transition-all"
                  />
                  <div className="flex items-center justify-between mt-3">
                    <p className="text-slate-400 text-xs">
                      Check your email for the OTP
                    </p>
                    <div className="flex items-center gap-1 text-blue-400 text-sm font-semibold">
                      <Clock className="w-4 h-4" />
                      {timer > 0 ? formatTime(timer) : 'Expired'}
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={loading || timer === 0}
                  className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-all"
                >
                  {loading ? 'Creating Account...' : 'Create Account'}
                </button>

                {showResendOption && (
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-3 rounded-lg transition-all"
                  >
                    Resend OTP
                  </button>
                )}

                <button
                  type="button"
                  onClick={handleBackToEmail}
                  className="w-full bg-slate-700 hover:bg-slate-600 text-slate-300 font-semibold py-3 rounded-lg transition-all"
                >
                  Back
                </button>
              </motion.form>
            )}
          </div>

          {/* Footer */}
          <div className="bg-slate-800/50 border-t border-slate-700 px-8 py-4 text-center">
            <p className="text-slate-400 text-xs">
              🔒 Secure OTP-based authentication • Session valid for 30 days
            </p>
          </div>
        </div>

        {/* Info Box */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-6 p-4 bg-blue-500/10 border border-blue-500/30 rounded-lg"
        >
          <p className="text-blue-200 text-xs text-center">
            ✓ No password needed for login • ✓ OTP sent to your email • ✓ Stay logged in for 30 days
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EnhancedLoginPage;
