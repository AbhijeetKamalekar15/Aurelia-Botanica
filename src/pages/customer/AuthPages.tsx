import React, { useState } from 'react';
import { Shield, Sparkles, KeyRound, Mail, Lock, User as UserIcon, Phone, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface AuthPagesProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onSuccess: (isAdmin: boolean) => void;
  onNavigateHome: () => void;
}

export const AuthPages: React.FC<AuthPagesProps> = ({
  initialMode = 'login',
  onSuccess,
  onNavigateHome,
}) => {
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset'>(initialMode);
  const { login, register, forgotPassword, resetPassword, isAdmin } = useAuth();
  const { showToast } = useToast();

  // Form Fields
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [loading, setLoading] = useState(false);

  // Quick dev prefill helper
  const handleQuickFill = (role: 'admin' | 'customer') => {
    if (role === 'admin') {
      setEmail('admin@aurelia.com');
      setPassword('Admin@12345');
    } else {
      setEmail('customer@aurelia.com');
      setPassword('Customer@12345');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (mode === 'login') {
        await login(email, password);
        const adminCheck = email.toLowerCase().includes('admin');
        onSuccess(adminCheck);
      } else if (mode === 'register') {
        await register(name, email, password, phone);
        onSuccess(false);
      } else if (mode === 'forgot') {
        const token = await forgotPassword(email);
        setResetToken(token);
        setMode('reset');
        showToast(`Reset token generated: ${token}`, 'info');
      } else if (mode === 'reset') {
        await resetPassword(resetToken, newPassword);
        setMode('login');
        setPassword(newPassword);
      }
    } catch (err) {
      // Error toasted in context
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 sm:p-10 rounded-2xl border border-[#261E1E]/10 shadow-lg space-y-6">
        {/* Brand header */}
        <div className="text-center space-y-2">
          <button
            onClick={onNavigateHome}
            className="font-serif-luxury text-2xl font-bold tracking-[0.18em] text-[#4A1525] uppercase"
          >
            Aurelia Botanica
          </button>
          <h2 className="font-serif-luxury text-xl font-semibold text-[#261E1E]">
            {mode === 'login' && 'Patron Sign In'}
            {mode === 'register' && 'Register Atelier Profile'}
            {mode === 'forgot' && 'Reset Account Password'}
            {mode === 'reset' && 'Create New Password'}
          </h2>
          <p className="text-xs text-zinc-500">
            {mode === 'login' && 'Access order history, saved addresses, and express COD checkout.'}
            {mode === 'register' && 'Join our botanical circle for seamless Cash on Delivery ordering.'}
            {mode === 'forgot' && 'Enter your email to receive recovery instructions.'}
            {mode === 'reset' && 'Provide your reset verification token and choose a new password.'}
          </p>
        </div>

        {/* Development Quick-Fill Shortcut Buttons */}
        {mode === 'login' && (
          <div className="p-3 bg-[#F8EBEF] border border-[#C77D8D]/30 rounded-lg text-xs space-y-2">
            <span className="text-[10px] font-bold text-[#4A1525] uppercase tracking-wider block">
              Development Quick-Fill Logins:
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => handleQuickFill('admin')}
                className="flex-1 py-1.5 px-2 bg-white text-[#4A1525] border border-[#4A1525]/30 rounded text-[11px] font-semibold hover:bg-[#4A1525] hover:text-white transition-colors"
              >
                Admin (Admin@12345)
              </button>
              <button
                type="button"
                onClick={() => handleQuickFill('customer')}
                className="flex-1 py-1.5 px-2 bg-white text-[#261E1E] border border-[#261E1E]/20 rounded text-[11px] font-semibold hover:bg-[#261E1E] hover:text-white transition-colors"
              >
                Customer (Customer@12345)
              </button>
            </div>
          </div>
        )}

        {/* The Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-[#261E1E] block mb-1">Full Name *</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Elena Vance"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 pl-9 focus:outline-none focus:border-[#4A1525]"
                />
                <UserIcon className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register' || mode === 'forgot') && (
            <div>
              <label className="text-xs font-semibold text-[#261E1E] block mb-1">Email Address *</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 pl-9 focus:outline-none focus:border-[#4A1525]"
                />
                <Mail className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {mode === 'register' && (
            <div>
              <label className="text-xs font-semibold text-[#261E1E] block mb-1">Telephone (For COD)</label>
              <div className="relative">
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+1 (555) 018-8421"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 pl-9 focus:outline-none focus:border-[#4A1525]"
                />
                <Phone className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {(mode === 'login' || mode === 'register') && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-semibold text-[#261E1E]">Password *</label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setMode('forgot')}
                    className="text-[11px] text-[#4A1525] hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 pl-9 focus:outline-none focus:border-[#4A1525]"
                />
                <Lock className="w-4 h-4 text-zinc-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          {mode === 'reset' && (
            <>
              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">Verification Token *</label>
                <input
                  type="text"
                  required
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="aur-reset-..."
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3 font-mono"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-[#261E1E] block mb-1">New Password *</label>
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full text-xs bg-[#FBF9F5] border border-[#261E1E]/15 rounded-md p-3"
                />
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-[#4A1525] hover:bg-[#360D19] text-white text-xs font-semibold uppercase tracking-wider rounded-md transition-colors shadow-sm flex items-center justify-center gap-2"
          >
            {loading ? (
              <span>Authenticating...</span>
            ) : (
              <>
                <span>
                  {mode === 'login' && 'Sign In to Account'}
                  {mode === 'register' && 'Create Patron Account'}
                  {mode === 'forgot' && 'Send Reset Code'}
                  {mode === 'reset' && 'Save New Password'}
                </span>
                <ArrowRight className="w-4 h-4 text-[#C5A059]" />
              </>
            )}
          </button>
        </form>

        {/* Toggle between Login and Register */}
        <div className="pt-2 text-center text-xs text-zinc-500 border-t border-[#261E1E]/10">
          {mode === 'login' ? (
            <p>
              New to Aurelia Botanica?{' '}
              <button
                type="button"
                onClick={() => setMode('register')}
                className="text-[#4A1525] font-semibold hover:underline"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p>
              Already have an atelier profile?{' '}
              <button
                type="button"
                onClick={() => setMode('login')}
                className="text-[#4A1525] font-semibold hover:underline"
              >
                Sign in
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
