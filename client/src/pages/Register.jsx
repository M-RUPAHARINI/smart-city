import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { register as registerApi } from '../services/api';
import { UserPlus, Mail, Lock, User, Briefcase, ShieldCheck, ArrowRight, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'citizen'
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const { loginUser } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await registerApi(formData);
            loginUser(data);
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please verify your details.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[90vh] flex items-center justify-center p-6 bg-slate-50 dark:bg-slate-950">
            <div className="max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center">

                {/* Information Side */}
                <div className="hidden lg:flex flex-col space-y-8">
                    <div className="flex items-center gap-3 text-primary font-black text-2xl">
                        <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center">
                            <ShieldCheck size={24} />
                        </div>
                        PS-CRM Portal
                    </div>
                    <h2 className="text-5xl font-black text-slate-900 dark:text-white leading-tight">
                        Join the Smart City <br />
                        <span className="text-primary italic">Citizen Network.</span>
                    </h2>
                    <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                        Create your Public ID to start reporting issues, tracking infrastructure progress, and engaging with municipal departments in real-time.
                    </p>

                    <div className="space-y-4 pt-6">
                        {[
                            "Verified access to all municipal services.",
                            "Real-time status updates on your reports.",
                            "Centralized dashboard for all your grievances."
                        ].map((text, i) => (
                            <div key={i} className="flex items-center gap-3 font-bold text-slate-600 dark:text-slate-400">
                                <CheckCircle size={18} className="text-accent" />
                                {text}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Side */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md mx-auto"
                >
                    <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-10 border border-slate-100 dark:border-slate-800">
                        <div className="lg:hidden flex items-center justify-center gap-2 mb-10">
                            <ShieldCheck className="text-primary" size={24} />
                            <span className="font-black text-xl text-slate-900 dark:text-white">PS-CRM</span>
                        </div>

                        <div className="mb-8 text-center lg:text-left">
                            <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">Create ID</h1>
                            <p className="text-slate-500 font-medium">Register your unique civic profile.</p>
                        </div>

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 text-red-600 dark:text-red-400 rounded-2xl text-sm font-medium">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Legal Full Name</label>
                                    <div className="relative">
                                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            className="input-premium pl-12"
                                            placeholder="Enter your name"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Primary Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="email"
                                            className="input-premium pl-12"
                                            placeholder="yourname@example.com"
                                            required
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Secure Password</label>
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

                                <div>
                                    <label className="block text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Identity Perspective</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <select
                                            className="input-premium pl-12 appearance-none bg-white dark:bg-slate-800"
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                        >
                                            <option value="citizen">Citizen Representative</option>
                                            <option value="officer">Department Officer</option>
                                            <option value="admin">System Controller</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full btn btn-primary py-4 text-lg mt-6"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="animate-spin" size={20} />
                                        Creating Profile...
                                    </>
                                ) : (
                                    <>
                                        Register Public ID <ArrowRight size={20} />
                                    </>
                                )}
                            </button>
                        </form>

                        <div className="mt-8 pt-8 border-t border-slate-50 dark:border-slate-800 text-center">
                            <p className="text-slate-500 font-medium">
                                Already registered? <Link to="/login" className="text-primary font-bold hover:underline">Sign into portal</Link>
                            </p>
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Register;
