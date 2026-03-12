import React, { useEffect, useState } from 'react';
import API from '../services/api';
import { History, CheckCircle, Search, Calendar, MapPin, Archive, Filter } from 'lucide-react';
import Badge from '../components/common/Badge';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { motion } from 'framer-motion';

const OfficerHistory = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const getHistory = async () => {
            try {
                const { data } = await API.get('/complaints/officer');
                setComplaints(data.filter(c => c.status === 'Resolved'));
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getHistory();
    }, []);

    const filtered = complaints.filter(c =>
        (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (c.location || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest mb-2">
                        <History size={16} />
                        Service Record
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Resolved History</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Archive of all completed resolutions and citizen feedback.</p>
                </div>
            </div>

            <div className="card-premium overflow-hidden !p-0">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
                    <div className="relative max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                        <input
                            type="text"
                            placeholder="Find in history..."
                            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-4 focus:ring-primary/10 transition-all font-medium"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Resolution Details</th>
                                <th className="px-6 py-4">Location</th>
                                <th className="px-6 py-4 text-right">Completion Date</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                            {filtered.map((c, idx) => (
                                <motion.tr
                                    key={c._id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: idx * 0.02 }}
                                    className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                >
                                    <td className="px-6 py-4">
                                        <Badge variant="success" className="flex items-center gap-1 w-fit">
                                            <CheckCircle size={10} /> Resolved
                                        </Badge>
                                    </td>
                                    <td className="px-6 py-4">
                                        <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{c.title}</p>
                                        <p className="text-[10px] font-black uppercase tracking-tighter text-slate-400 italic">Reference: #{c._id.substring(c._id.length - 6).toUpperCase()}</p>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                                            <MapPin size={12} className="text-primary" /> {c.location}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex items-center justify-end gap-1.5 text-xs text-slate-400 font-bold">
                                            <Calendar size={14} />
                                            {new Date(c.updatedAt || c.createdAt).toLocaleDateString()}
                                        </div>
                                    </td>
                                </motion.tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {filtered.length === 0 && (
                    <div className="py-24 text-center">
                        <Archive size={48} className="mx-auto text-slate-200 mb-4" />
                        <h4 className="text-slate-400 font-bold italic">History archive is empty or no matches found.</h4>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficerHistory;
