import React, { useState, useEffect } from 'react';
import { fetchAdminComplaints } from '../services/api';
import { Search, Filter, MoreVertical, ClipboardList, Calendar, MapPin, User, ChevronRight } from 'lucide-react';
import Badge from '../components/common/Badge';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const AdminComplaints = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const loadData = async () => {
            try {
                const { data } = await fetchAdminComplaints();
                setComplaints(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
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

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.createdBy?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = filterStatus === 'All' || c.status === filterStatus;
        return matchesSearch && matchesStatus;
    });

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                        <ClipboardList size={16} />
                        Data Management
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Grievance Archives</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Comprehensive view of all municipal service requests.</p>
                </div>
            </div>

            <div className="card-premium overflow-hidden !p-0">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="flex items-center gap-4 w-full md:w-auto">
                        <div className="relative flex-1 md:w-80">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                            <input
                                type="text"
                                placeholder="Search by citizen or title..."
                                className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <select
                            className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 dark:text-slate-300 outline-none focus:ring-4 focus:ring-primary/10"
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                        >
                            <option value="All">All Status</option>
                            <option value="Submitted">Submitted</option>
                            <option value="Assigned">Assigned</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Resolved">Resolved</option>
                        </select>
                    </div>
                    <div className="text-xs font-black uppercase tracking-widest text-slate-400">
                        Showing {filteredComplaints.length} Records
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="px-6 py-4">Reference</th>
                                <th className="px-6 py-4">Incident Details</th>
                                <th className="px-6 py-4">Citizen</th>
                                <th className="px-6 py-4">Status & Priority</th>
                                <th className="px-6 py-4">Date Reported</th>
                                <th className="px-6 py-4 text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            <AnimatePresence>
                                {filteredComplaints.map((c, idx) => (
                                    <motion.tr
                                        key={c._id}
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        transition={{ delay: idx * 0.02 }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                                    >
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold font-mono text-slate-400">#{c._id.substring(c._id.length - 8).toUpperCase()}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{c.title}</p>
                                                <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-tighter text-primary">
                                                    <MapPin size={10} /> {c.location}
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500">
                                                    <User size={14} />
                                                </div>
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{c.createdBy?.name || 'Anonymous'}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col gap-1.5">
                                                <Badge variant={getStatusVariant(c.status)} className="w-fit">{c.status}</Badge>
                                                <span className={`text-[9px] font-black uppercase tracking-widest ${c.priority === 'Emergency' ? 'text-danger' : 'text-slate-400'}`}>
                                                    {c.priority || 'Routine'} Priority
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
                                                <Calendar size={14} />
                                                {new Date(c.createdAt).toLocaleDateString()}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/citizen/complaints/${c._id}`}
                                                className="inline-flex items-center gap-1 text-primary font-bold text-xs hover:underline"
                                            >
                                                View <ChevronRight size={14} />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))}
                            </AnimatePresence>
                        </tbody>
                    </table>
                </div>

                {filteredComplaints.length === 0 && (
                    <div className="py-24 text-center">
                        <ClipboardList size={48} className="mx-auto text-slate-200 mb-4" />
                        <h4 className="text-slate-400 font-bold italic">No records found matching your current filters.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AdminComplaints;
