import React, { useEffect, useState } from 'react';
import { fetchComplaints, SERVER_URL } from '../services/api';
import StatsCard from '../components/common/StatsCard';
import Badge from '../components/common/Badge';
import {
    FileText,
    CheckCircle,
    Clock,
    AlertCircle,
    TrendingUp,
    Plus,
    ArrowRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { DashboardSkeleton } from '../components/common/Skeleton';

const CitizenDashboard = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
        inProgress: 0
    });

    useEffect(() => {
        const getComplaints = async () => {
            try {
                const { data } = await fetchComplaints();
                setComplaints(data);

                const s = {
                    total: data.length,
                    resolved: data.filter(c => c.status === 'Resolved').length,
                    pending: data.filter(c => c.status === 'Submitted').length,
                    inProgress: data.filter(c => ['Assigned', 'In Progress'].includes(c.status)).length
                };
                setStats(s);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getComplaints();
    }, []);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Resolved': return 'success';
            case 'Submitted': return 'info';
            case 'In Progress': return 'warning';
            case 'Assigned': return 'warning';
            default: return 'neutral';
        }
    };

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8">
            <div className="flex justify-between items-end">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Citizen Portal</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Welcome back! Here's an overview of your reports.</p>
                </div>
                <Link to="/citizen/new-complaint" className="btn btn-primary px-6 py-3">
                    <Plus size={20} />
                    New Complaint
                </Link>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Reports"
                    value={stats.total}
                    icon={FileText}
                    color="blue"
                    trend="up"
                    trendValue={12}
                />
                <StatsCard
                    title="Resolved"
                    value={stats.resolved}
                    icon={CheckCircle}
                    color="green"
                />
                <StatsCard
                    title="In Progress"
                    value={stats.inProgress}
                    icon={Clock}
                    color="amber"
                />
                <StatsCard
                    title="Pending"
                    value={stats.pending}
                    icon={AlertCircle}
                    color="slate"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                            <TrendingUp size={20} className="text-primary" />
                            Recent Complaints
                        </h2>
                        <Link to="/citizen/tracking" className="text-primary text-sm font-bold flex items-center gap-1 hover:underline">
                            View All <ArrowRight size={14} />
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {complaints.length === 0 ? (
                            <div className="card-premium py-12 text-center">
                                <p className="text-slate-400 font-medium">No complaints found yet.</p>
                                <Link to="/citizen/new-complaint" className="text-primary font-bold mt-2 inline-block">Submit your first report</Link>
                            </div>
                        ) : (
                            complaints.slice(0, 3).map((complaint, idx) => (
                                <motion.div
                                    key={complaint._id}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="card-premium group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex flex-1 gap-4 items-center">
                                            {complaint.image ? (
                                                <div className="w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-slate-100 dark:border-slate-800">
                                                    <img
                                                        src={complaint.image.startsWith('http') ? complaint.image : `${SERVER_URL}${complaint.image}`}
                                                        alt="Evidence"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            ) : (
                                                <div className="w-16 h-16 rounded-xl bg-slate-50 dark:bg-slate-800 flex items-center justify-center shrink-0 border border-slate-100 dark:border-slate-800 text-slate-300">
                                                    <FileText size={20} />
                                                </div>
                                            )}
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                                                    <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{complaint.category}</span>
                                                </div>
                                                <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">{complaint.title}</h3>
                                                <p className="text-slate-500 dark:text-slate-400 text-sm mt-1 line-clamp-1">{complaint.description}</p>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-4 border-l border-slate-100 dark:border-slate-800 pl-4">
                                            <div className="text-right hidden md:block">
                                                <p className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Submitted On</p>
                                                <p className="text-sm font-bold dark:text-slate-200">{new Date(complaint.createdAt).toLocaleDateString()}</p>
                                            </div>
                                            <Link to={`/citizen/complaints/${complaint._id}`} className="btn btn-ghost p-3 rounded-xl border border-slate-100 dark:border-slate-800">
                                                <ArrowRight size={20} className="text-slate-400 group-hover:text-primary" />
                                            </Link>
                                        </div>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </div>

                {/* Info Sidebar */}
                <div className="space-y-6">
                    <div className="card-premium bg-primary text-white border-none shadow-primary/20">
                        <h3 className="text-xl font-bold mb-2">Citizen Guide</h3>
                        <p className="text-primary-foreground/80 text-sm mb-6 leading-relaxed">
                            Report issues like road damage, garbage, or water supply in just two steps. Our officers respond within 24 hours.
                        </p>
                        <ul className="space-y-4 mb-6">
                            {[
                                'Capture clear evidence',
                                'Provide exact location',
                                'Track in real-time'
                            ].map((text, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm font-medium">
                                    <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center text-[10px]">
                                        {i + 1}
                                    </div>
                                    {text}
                                </li>
                            ))}
                        </ul>
                        <button className="w-full py-3 bg-white text-primary rounded-xl font-bold hover:bg-slate-50 transition-colors">
                            Read Documentation
                        </button>
                    </div>

                    <div className="card-premium">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-lg bg-red-50 text-red-500 dark:bg-red-900/20">
                                <AlertCircle size={20} />
                            </div>
                            <h3 className="font-bold text-slate-900 dark:text-white">Emergency Hotline</h3>
                        </div>
                        <p className="text-3xl font-black text-slate-900 dark:text-white">1912</p>
                        <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mt-2">Available 24/7 for urgent help</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CitizenDashboard;
