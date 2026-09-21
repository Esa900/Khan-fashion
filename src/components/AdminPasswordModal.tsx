import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X, AlertCircle } from 'lucide-react';
import { useStore } from '../context/StoreContext';

interface AdminPasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const AdminPasswordModal: React.FC<AdminPasswordModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin } = useStore();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    setTimeout(() => {
      const isValid = loginAdmin(password.trim());
      if (isValid) {
        setPassword('');
        setError('');
        onSuccess();
      } else {
        setError('ভুল পাসওয়ার্ড! সঠিক অ্যাডমিন পাসওয়ার্ড দিন (ESA006##)');
      }
      setIsSubmitting(false);
    }, 200);
  };

  return (
    <div
      id="admin-password-overlay"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in"
    >
      <div
        id="admin-password-card"
        className="relative w-full max-w-md overflow-hidden bg-white border border-stone-200 rounded-2xl shadow-2xl transition-all"
      >
        {/* Header decoration */}
        <div className="bg-gradient-to-r from-amber-700 via-amber-800 to-stone-900 p-6 text-white text-center relative">
          <button
            id="close-admin-password-btn"
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          
          <div className="w-14 h-14 mx-auto mb-3 bg-amber-500/20 border border-amber-400/30 rounded-2xl flex items-center justify-center text-amber-300">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <h2 className="text-xl font-bold tracking-tight text-white flex items-center justify-center gap-1.5">
            Khan Fashion 😊 অ্যাডমিন প্যানেল
          </h2>
          <p className="text-xs text-amber-200/90 mt-1">
            নিরাপত্তা যাচাইকরণের জন্য সিকিউরিটি পাসওয়ার্ড প্রদান করুন
          </p>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-stone-600 mb-2">
              সিকিউরিটি পাসওয়ার্ড (Security Password)
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-stone-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                id="admin-password-input"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (error) setError('');
                }}
                placeholder="পাসওয়ার্ড লিখুন..."
                autoFocus
                required
                className="w-full pl-10 pr-12 py-3 bg-stone-50 border border-stone-300 rounded-xl text-stone-900 text-sm focus:ring-2 focus:ring-amber-600 focus:border-amber-600 outline-none transition-all font-mono"
              />
              <button
                type="button"
                id="toggle-password-visibility-btn"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-stone-400 hover:text-stone-700 transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            
            <div className="mt-2 flex items-center justify-between text-xs">
              <span className="text-stone-500 font-mono">
                ডিফল্ট পাসওয়ার্ড: <span className="font-semibold text-amber-800 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">ESA006##</span>
              </span>
              <button
                type="button"
                onClick={() => setPassword('ESA006##')}
                className="text-amber-700 hover:text-amber-900 font-medium underline underline-offset-2"
              >
                অটো ফিল
              </button>
            </div>
          </div>

          {error && (
            <div
              id="admin-password-error"
              className="flex items-center gap-2 p-3 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl text-xs"
            >
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="pt-2 flex gap-3">
            <button
              type="button"
              id="cancel-admin-auth-btn"
              onClick={onClose}
              className="flex-1 py-2.5 px-4 rounded-xl border border-stone-200 text-stone-700 text-sm font-medium hover:bg-stone-50 transition-colors"
            >
              ফিরে যান
            </button>
            <button
              type="submit"
              id="submit-admin-auth-btn"
              disabled={isSubmitting || !password.trim()}
              className="flex-1 py-2.5 px-4 rounded-xl bg-amber-700 hover:bg-amber-800 disabled:opacity-50 text-white text-sm font-medium shadow-md hover:shadow-lg transition-all"
            >
              {isSubmitting ? 'যাচাই হচ্ছে...' : 'লগইন করুন'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
