import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { login as loginApi } from '../services/api';
import { LogIn, Mail, Lock, AlertCircle, ArrowRight, ShieldCheck, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { loginUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const { data } = await loginApi(formData);
      loginUser(data);
      // Backend redirect logic usually handles this, but we can nudge it
    } catch (err) {
      setError(err.response?.data?.message || 'The credentials provided do not match our records.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
      <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">

        {/* Branding Side */}
        <div className="hidden lg:flex flex-col space-y-8">
          <div className="flex items-center gap-3 text-primary font-black text-2xl">
            <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            PS-CRM Command
          </div>
          <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">
            Access the Smart City <br />
            <span className="text-primary italic">Command Portal.</span>
          </h2>
          <p className="text-xl text-slate-500 font-medium max-w-md">
            Your hub for centralized grievance management and city-wide resolution tracking.
          </p>

          <div className="grid grid-cols-2 gap-6 pt-8">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-green-50 text-green-600 flex items-center justify-center mb-4">
                <ShieldCheck size={18} />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Security</p>
              <p className="font-bold text-slate-900 dark:text-white">Active Encryption</p>
            </div>
            <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-100 dark:border-slate-800 shadow-sm">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center mb-4">
                <Loader2 size={18} className="animate-spin" />
              </div>
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-1">Status</p>
              <p className="font-bold text-slate-900 dark:text-white">Systems Nominal</p>
            </div>
          </div>
        </div>

        {/* Form Side */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-full max-w-md mx-auto"
        >
          <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800 relative">
            <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
              <ShieldCheck className="text-primary" size={24} />
              <span className="font-black text-xl">PS-CRM</span>
            </div>

            <div className="mb-10 text-center lg:text-left">
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Sign In</h1>
              <p className="text-slate-500 font-medium">Please enter your authorized credentials.</p>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mb-8 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium flex gap-3"
              >
                <AlertCircle size={18} className="shrink-0" />
                {error}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Email Address</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="email"
                      className="input-premium pl-12"
                      placeholder="officer@smartcity.gov"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Secret Password</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      className="input-premium pl-12"
                      placeholder="••••••••"
                      required
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between py-2">
                <label className="flex items-center gap-2 cursor-pointer group">
                  <input type="checkbox" className="w-4 h-4 rounded border-slate-300 text-primary focus:ring-primary" />
                  <span className="text-sm font-medium text-slate-500 group-hover:text-slate-700">Remember session</span>
                </label>
                <button type="button" className="text-sm font-bold text-primary hover:underline">Reset access</button>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full btn btn-primary py-4 text-lg"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={20} />
                    Authorizing...
                  </>
                ) : (
                  <>
                    Port In <ArrowRight size={20} />
                  </>
                )}
              </button>
            </form>

            <div className="mt-10 pt-10 border-t border-slate-50 dark:border-slate-800 text-center">
              <p className="text-slate-500 font-medium">
                New service member? <Link to="/register" className="text-primary font-bold hover:underline">Create Public ID</Link>
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Login;
