import React, { useEffect, useState } from 'react';
import API, { updateComplaintStatus, SERVER_URL } from '../services/api';
import {
    ClipboardCheck,
    CheckCircle,
    Clock,
    Truck,
    AlertCircle,
    BarChart3,
    Inbox,
    ArrowRight,
    MoreVertical,
    Calendar,
    MapPin,
    TrendingUp
} from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import Badge from '../components/common/Badge';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const OfficerPanel = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
    });

    const getOfficerComplaints = async () => {
        try {
            const { data } = await API.get('/complaints/officer');
            setComplaints(data);

            const s = {
                total: data.length,
                resolved: data.filter(c => c.status === 'Resolved').length,
                pending: data.filter(c => c.status !== 'Resolved').length,
            };
            setStats(s);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getOfficerComplaints();
    }, []);

    const handleUpdate = async (id, status) => {
        try {
            await updateComplaintStatus(id, { status });
            getOfficerComplaints();
        } catch (err) {
            alert('Update failed');
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Emergency': return 'bg-red-500';
            case 'High': return 'bg-orange-500';
            case 'Medium': return 'bg-amber-500';
            default: return 'bg-blue-500';
        }
    };

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8">
            {/* Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest mb-2">
                        <ClipboardCheck size={16} />
                        Field Operations
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Officer Task Queue</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and resolve active grievances assigned to your jurisdiction.</p>
                </div>
                <div className="flex items-center gap-3">
                    <div className="px-4 py-2 bg-accent/10 text-accent rounded-xl text-xs font-black uppercase tracking-widest border border-accent/20">
                        Live Dispatch Active
                    </div>
                </div>
            </div>

            {/* Performance Snapshot */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard
                    title="Active Assignments"
                    value={stats.pending}
                    icon={Clock}
                    color="amber"
                />
                <StatsCard
                    title="Resolved Tasks"
                    value={stats.resolved}
                    icon={CheckCircle}
                    color="green"
                />
                <StatsCard
                    title="Success Rate"
                    value={stats.total > 0 ? `${Math.round((stats.resolved / stats.total) * 100)}%` : '0%'}
                    icon={BarChart3}
                    color="blue"
                />
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Task List */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Inbox size={20} className="text-primary" />
                            Workload Inbox
                        </h2>
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">{stats.pending} Tasks Pending</span>
                    </div>

                    <div className="space-y-4">
                        {complaints.length === 0 ? (
                            <div className="card-premium py-20 text-center flex flex-col items-center">
                                <Inbox size={48} className="text-slate-200 mb-4" />
                                <p className="text-slate-400 font-bold">Queue is empty. No active assignments.</p>
                            </div>
                        ) : (
                            <AnimatePresence>
                                {complaints.map((c, idx) => (
                                    <motion.div
                                        key={c._id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="card-premium group relative overflow-hidden"
                                    >
                                        <div className={`absolute top-0 left-0 w-1.5 h-full ${getPriorityColor(c.priority || 'Medium')}`} />

                                        <div className="flex flex-col md:flex-row justify-between gap-6 ml-2">
                                            <div className="flex-1 space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <Badge variant={c.status === 'Resolved' ? 'success' : 'warning'}>{c.status}</Badge>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{c.category}</span>
                                                    <div className="h-1 w-1 rounded-full bg-slate-300" />
                                                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                                                        <MapPin size={10} /> {c.location}
                                                    </span>
                                                </div>

                                                <h3 className="text-xl font-black text-slate-900 dark:text-white">{c.title}</h3>
                                                {c.image && (
                                                    <div className="my-3 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 max-h-48 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => window.open(c.image.startsWith('http') ? c.image : `${SERVER_URL}${c.image}`, '_blank')}>
                                                        <img
                                                            src={c.image.startsWith('http') ? c.image : `${SERVER_URL}${c.image}`}
                                                            alt="Complaint Evidence"
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>
                                                )}
                                                <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                                    {c.description}
                                                </p>

                                                <div className="flex items-center gap-4 pt-2">
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                                        <Calendar size={12} /> Assiged: {new Date(c.updatedAt || c.createdAt).toLocaleDateString()}
                                                    </div>
                                                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-slate-400">
                                                        <Clock size={12} /> Ref: #{c._id.substring(c._id.length - 6).toUpperCase()}
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2 min-w-[200px] justify-center">
                                                {c.status !== 'Resolved' && (
                                                    <>
                                                        <button
                                                            onClick={() => handleUpdate(c._id, 'In Progress')}
                                                            disabled={c.status === 'In Progress'}
                                                            className={`btn w-full py-3 ${c.status === 'In Progress' ? 'bg-slate-100 dark:bg-slate-800 text-slate-400 cursor-not-allowed' : 'btn-primary'}`}
                                                        >
                                                            <Truck size={18} />
                                                            {c.status === 'In Progress' ? 'In Progress' : 'Start Resolution'}
                                                        </button>

                                                        <div className="relative">
                                                            <input
                                                                type="file"
                                                                id={`officer-proof-${c._id}`}
                                                                className="hidden"
                                                                accept="image/*"
                                                                onChange={async (e) => {
                                                                    const file = e.target.files[0];
                                                                    if (file) {
                                                                        const formData = new FormData();
                                                                        formData.append('status', 'Resolved');
                                                                        formData.append('image', file);
                                                                        try {
                                                                            await updateComplaintStatus(c._id, formData);
                                                                            getOfficerComplaints();
                                                                            alert('Ticket closed with resolution proof!');
                                                                        } catch (err) {
                                                                            alert('Resolution failed');
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => document.getElementById(`officer-proof-${c._id}`).click()}
                                                                className="btn w-full py-3 border-2 border-accent text-accent hover:bg-accent hover:text-white transition-all shadow-lg shadow-accent/5"
                                                            >
                                                                <CheckCircle size={18} />
                                                                Upload Proof & Close
                                                            </button>
                                                        </div>
                                                    </>
                                                )}
                                                {c.status === 'Resolved' && (
                                                    <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-xl text-center">
                                                        <p className="text-green-600 dark:text-green-400 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2">
                                                            <CheckCircle size={14} /> Completed
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        )}
                    </div>
                </div>

                {/* Right Sidebar */}
                <div className="space-y-6">
                    <div className="card-premium">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-6 flex items-center gap-2">
                            <AlertCircle size={18} className="text-primary" />
                            Incident Priority Map
                        </h3>
                        <div className="space-y-4">
                            {[
                                { label: 'Emergency', color: 'bg-red-500', count: complaints.filter(c => c.priority === 'Emergency').length },
                                { label: 'High Priority', color: 'bg-orange-500', count: complaints.filter(c => c.priority === 'High').length },
                                { label: 'Routine', color: 'bg-blue-500', count: complaints.filter(c => c.priority === 'Low' || !c.priority || c.priority === 'Medium').length },
                            ].map((item, i) => (
                                <div key={i} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className={`w-2 h-2 rounded-full ${item.color}`} />
                                        <span className="text-sm font-bold text-slate-600 dark:text-slate-400">{item.label}</span>
                                    </div>
                                    <span className="text-sm font-black text-slate-900 dark:text-white">{item.count}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="card-premium bg-slate-900 text-white border-none">
                        <h3 className="text-lg font-black mb-2 italic">Officer Code of Ethics</h3>
                        <p className="text-slate-400 text-xs leading-relaxed mb-6">
                            Maintain transparency, ensure citizen safety, and respond to grievances within the 24-hour SLA.
                        </p>
                        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
                            <div className="flex items-center gap-3 mb-2">
                                <TrendingUp size={16} className="text-accent" />
                                <span className="text-xs font-black uppercase tracking-widest">Active Efficiency</span>
                            </div>
                            <p className="text-2xl font-black">94.2%</p>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default OfficerPanel;
