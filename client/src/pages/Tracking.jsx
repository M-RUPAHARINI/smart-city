import React, { useEffect, useState } from 'react';
import { fetchComplaints, SERVER_URL } from '../services/api';
import Badge from '../components/common/Badge';
import {
    Search,
    Filter,
    Calendar,
    MapPin,
    ArrowRight,
    MessageSquare,
    Clock,
    Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const Tracking = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState('All');

    useEffect(() => {
        const getComplaints = async () => {
            try {
                const { data } = await fetchComplaints();
                setComplaints(data);
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

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            c._id.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterStatus === 'All' || c.status === filterStatus;
        return matchesSearch && matchesFilter;
    });

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Track Grievances</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Manage and monitor the status of your reported issues.</p>
                </div>
                <Link to="/submit" className="btn btn-primary px-6 py-3">
                    <Plus size={20} />
                    Report New Issue
                </Link>
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col md:flex-row gap-4 items-center">
                <div className="relative flex-1">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                        type="text"
                        placeholder="Search by ID or title..."
                        className="input-premium pl-12 py-3"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex items-center gap-2 bg-surface dark:bg-slate-800 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-700">
                    {['All', 'Submitted', 'In Progress', 'Resolved'].map(status => (
                        <button
                            key={status}
                            onClick={() => setFilterStatus(status)}
                            className={`
                                px-4 py-2 rounded-xl text-sm font-bold transition-all
                                ${filterStatus === status
                                    ? 'bg-primary text-white shadow-md'
                                    : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-700'}
                            `}
                        >
                            {status}
                        </button>
                    ))}
                </div>
            </div>

            {loading ? (
                <div className="grid gap-6">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="card-premium h-32 animate-pulse bg-slate-100 dark:bg-slate-800 border-none"></div>
                    ))}
                </div>
            ) : filteredComplaints.length === 0 ? (
                <div className="card-premium text-center py-20 flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-50 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-300 dark:text-slate-600 mb-6">
                        <Filter size={40} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2">No results found</h3>
                    <p className="text-slate-500 max-w-xs">Adjust your filters or try a different search term to find what you're looking for.</p>
                </div>
            ) : (
                <div className="grid gap-6">
                    <AnimatePresence mode='popLayout'>
                        {filteredComplaints.map((complaint, idx) => (
                            <motion.div
                                key={complaint._id}
                                layout
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{ duration: 0.2 }}
                                className="card-premium hover:border-primary/30 group"
                            >
                                <div className="flex flex-col md:flex-row gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex flex-wrap items-center gap-3">
                                            <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                                            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400">
                                                <Calendar size={12} />
                                                {new Date(complaint.createdAt).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-slate-400">
                                                <Clock size={12} />
                                                {new Date(complaint.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>

                                        <div>
                                            <h3 className="text-2xl font-black text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                                {complaint.title}
                                            </h3>
                                            <div className="flex items-center gap-2 mt-2 text-slate-500 dark:text-slate-400 font-medium italic">
                                                <MapPin size={16} className="text-primary" />
                                                {complaint.location}
                                            </div>
                                        </div>

                                        <p className="text-slate-600 dark:text-slate-400 line-clamp-2 leading-relaxed">
                                            {complaint.description}
                                        </p>
                                    </div>

                                    <div className="flex items-center justify-between md:flex-col md:items-end md:justify-center gap-4 min-w-[120px]">
                                        {complaint.image ? (
                                            <img
                                                src={complaint.image.startsWith('http') ? complaint.image : `${SERVER_URL}${complaint.image}`}
                                                alt="Evidence"
                                                className="w-20 h-16 md:w-32 md:h-20 object-cover rounded-xl border border-slate-100 dark:border-slate-800 shadow-sm cursor-pointer"
                                                onClick={(e) => { e.preventDefault(); window.open(complaint.image.startsWith('http') ? complaint.image : `${SERVER_URL}${complaint.image}`, '_blank'); }}
                                            />
                                        ) : (
                                            <div className="hidden md:block w-32 h-20 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-800 flex items-center justify-center text-slate-300">
                                                No Evidence
                                            </div>
                                        )}
                                        <Link
                                            to={`/citizen/complaints/${complaint._id}`}
                                            className="btn btn-primary rounded-2xl w-full md:w-auto p-4 md:p-3"
                                        >
                                            <span className="md:hidden">Track Status</span>
                                            <ArrowRight size={20} />
                                        </Link>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </AnimatePresence>
                </div>
            )}
        </div>
    );
};

export default Tracking;
