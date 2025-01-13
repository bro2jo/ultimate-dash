import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mail, 
  Lock, 
  AlertCircle, 
  Loader2, 
  ArrowRight,
  CheckCircle 
} from 'lucide-react';

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [isResetPassword, setIsResetPassword] = useState(false);
  const navigate = useNavigate();
  const { login, signup, loginWithGoogle, resetPassword } = useAuth();

  // Function to handle user-friendly error messages
  const getErrorMessage = useCallback((error) => {
    switch (error.code) {
      case 'auth/invalid-credential':
        return 'Invalid email or password. Please check your credentials and try again.';
      case 'auth/wrong-password':
        return 'Incorrect password. Please try again.';
      case 'auth/user-not-found':
        return 'No account found with this email.';
      case 'auth/email-already-in-use':
        return 'An account already exists with this email.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Please try again later.';
      case 'auth/network-request-failed':
        return 'Network error. Please check your internet connection and try again.';
      case 'auth/popup-closed-by-user':
        return 'Sign in was cancelled. Please try again.';
      case 'auth/cancelled-popup-request':
        return 'Sign in process was interrupted. Please try again.';
      case 'auth/operation-not-allowed':
        return 'This sign in method is not enabled. Please try another method.';
      case 'auth/user-disabled':
        return 'This account has been disabled. Please contact support for assistance.';
      default:
        return error.message || 'An error occurred. Please try again.';
    }
}, []);

  const clearMessages = useCallback(() => {
    setError('');
    setSuccessMessage('');
  }, []);

  const resetForm = useCallback(() => {
    setEmail('');
    setPassword('');
    clearMessages();
  }, [clearMessages]);

  const handleAuthModeChange = useCallback((mode) => {
    if (mode === 'reset') {
      setIsResetPassword(true);
      setIsLogin(true);
    } else {
      setIsResetPassword(false);
      setIsLogin(mode === 'login');
    }
    clearMessages();
  }, [clearMessages]);

  async function handleSubmit(e) {
    e.preventDefault();
    clearMessages();
    setLoading(true);

    try {
      if (isResetPassword) {
        await resetPassword(email);
        setSuccessMessage('Password reset email sent! Please check your inbox.');
        setIsResetPassword(false);
      } else if (isLogin) {
        await login(email, password);
        resetForm();
        navigate('/');
      } else {
        await signup(email, password);
        resetForm();
        navigate('/');
      }
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogleLogin() {
    clearMessages();
    setLoading(true);

    try {
      await loginWithGoogle();
      resetForm();
      navigate('/');
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand Section */}
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            <div className="w-16 h-16 mx-auto mb-4 flex items-center justify-center">
              <img src="/favicon.svg" alt="Logo" className="w-full h-full" />
            </div>
          </motion.div>
          <h2 className="text-2xl md:text-3xl font-bold text-white">
            {isResetPassword 
              ? 'Reset Password'
              : isLogin 
                ? 'Welcome back' 
                : 'Create your account'}
          </h2>
          <p className="mt-2 text-gray-400 text-sm">
            {isResetPassword
              ? 'Enter your email and we will send you reset instructions.'
              : isLogin 
                ? 'Great to see you again! Please enter your details.'
                : 'Start your performance tracking journey today.'}
          </p>
        </div>

        {/* Main Form */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-gray-800/50 backdrop-blur-xl rounded-2xl p-6 md:p-8 shadow-xl border border-gray-700/50"
        >
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/50 flex items-center gap-2"
              >
                <AlertCircle className="h-4 w-4 text-red-500 flex-shrink-0" />
                <p className="text-sm text-red-500">{error}</p>
              </motion.div>
            )}
            {successMessage && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/50 flex items-center gap-2"
              >
                <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                <p className="text-sm text-emerald-500">{successMessage}</p>
              </motion.div>
            )}
          </AnimatePresence>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1">
              <label htmlFor="email" className="text-sm font-medium text-gray-300">
                Email
              </label>
              <div className="relative">
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                  placeholder="you@example.com"
                />
                <Mail className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              </div>
            </div>

            {!isResetPassword && (
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label htmlFor="password" className="text-sm font-medium text-gray-300">
                    Password
                  </label>
                  {isLogin && (
                    <button
                      type="button"
                      onClick={() => handleAuthModeChange('reset')}
                      className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
                    >
                      Forgot password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <input
                    id="password"
                    type="password"
                    required={!isResetPassword}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-lg bg-gray-900/50 border border-gray-700 text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors"
                    placeholder="••••••••"
                  />
                  <Lock className="absolute right-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-2.5 rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {isResetPassword 
                    ? 'Send reset instructions' 
                    : isLogin 
                      ? 'Sign in' 
                      : 'Create account'}
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>

          {!isResetPassword && (
            <>
              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-700"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-gray-800/50 text-gray-400">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleLogin}
                  disabled={loading}
                  className="mt-4 w-full flex items-center justify-center gap-3 px-4 py-2.5 border border-gray-700 rounded-lg text-gray-300 hover:bg-gray-700/50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500"
                >
                  <svg className="h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M12.545,10.239v3.821h5.445c-0.712,2.315-2.647,3.972-5.445,3.972c-3.332,0-6.033-2.701-6.033-6.032s2.701-6.032,6.033-6.032c1.498,0,2.866,0.549,3.921,1.453l2.814-2.814C17.503,2.988,15.139,2,12.545,2C7.021,2,2.543,6.477,2.543,12s4.478,10,10.002,10c8.396,0,10.249-7.85,9.426-11.748L12.545,10.239z"
                    />
                  </svg>
                  Google
                </button>
              </div>
            </>
          )}

          <div className="mt-6 text-center space-y-3">
            {!isResetPassword && (
              <button
                onClick={() => handleAuthModeChange(isLogin ? 'signup' : 'login')}
                className="text-sm text-emerald-400 hover:text-emerald-300 transition-colors"
              >
                {isLogin ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            )}
            {isResetPassword && (
              <button
                onClick={() => handleAuthModeChange('login')}
                className="block w-full text-sm text-gray-400 hover:text-gray-300 transition-colors"
              >
                Return to login
              </button>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}