import React, { useEffect, useState } from 'react';
import { fetchComplaints } from '../services/api';
import Badge from '../components/common/Badge';
import {
    Search,
    Filter,
    Calendar,
    ArrowRight,
    Download,
    FileText,
    Clock,
    CheckCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ComplaintHistory = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');

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

    const filteredComplaints = complaints.filter(c =>
        c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.category.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const downloadLog = () => {
        const headers = ['Title', 'Category', 'Department', 'Status', 'Submitted', 'Resolved'];
        const rows = complaints.map(c => [
            c.title,
            c.category,
            c.assignedDepartment || 'Pending',
            c.status,
            new Date(c.createdAt).toLocaleDateString(),
            c.status === 'Resolved' ? new Date(c.updatedAt).toLocaleDateString() : '-'
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "my-grievance-history.csv");
        document.body.appendChild(link);
        link.click();
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Grievance History</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">A complete archival record of all your reported issues.</p>
                </div>
                <button
                    onClick={downloadLog}
                    className="btn btn-ghost border border-slate-200 dark:border-slate-800 flex items-center gap-2"
                >
                    <Download size={18} />
                    Export Log
                </button>
            </div>

            <div className="card-premium !p-0 overflow-hidden">
                <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                        <input
                            type="text"
                            placeholder="Search history by title or category..."
                            className="input-premium pl-12 py-2.5 text-sm"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50 dark:bg-slate-900 border-b border-slate-100 dark:border-slate-800">
                            <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">Title & Category</th>
                                <th className="px-6 py-4">Department</th>
                                <th className="px-6 py-4">Submitted</th>
                                <th className="px-6 py-4">Resolved</th>
                                <th className="px-6 py-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800">
                            {filteredComplaints.length === 0 ? (
                                <tr>
                                    <td colSpan="6" className="px-6 py-12 text-center text-slate-400 italic">No historical records found.</td>
                                </tr>
                            ) : (
                                filteredComplaints.map((c, idx) => (
                                    <motion.tr
                                        key={c._id}
                                        initial={{ opacity: 0, y: 5 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: idx * 0.05 }}
                                        className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors"
                                    >
                                        <td className="px-6 py-4">
                                            <Badge variant={getStatusVariant(c.status)}>{c.status}</Badge>
                                        </td>
                                        <td className="px-6 py-4">
                                            <p className="text-sm font-bold text-slate-900 dark:text-white">{c.title}</p>
                                            <p className="text-[10px] font-black uppercase text-primary tracking-tighter mt-0.5">{c.category}</p>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="text-xs font-bold text-slate-600 dark:text-slate-400">
                                                {c.assignedDepartment || '---'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-col">
                                                <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                                                    {new Date(c.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="text-[10px] text-slate-400">
                                                    {new Date(c.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {c.status === 'Resolved' ? (
                                                <div className="flex flex-col">
                                                    <span className="text-xs font-bold text-green-600 dark:text-green-400">
                                                        {new Date(c.updatedAt).toLocaleDateString()}
                                                    </span>
                                                    <span className="text-[10px] text-slate-400">
                                                        {new Date(c.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-xs text-slate-300">In Progress</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <Link
                                                to={`/citizen/complaints/${c._id}`}
                                                className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-widest text-primary hover:underline hover:gap-2 transition-all"
                                            >
                                                Details
                                                <ArrowRight size={14} />
                                            </Link>
                                        </td>
                                    </motion.tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default ComplaintHistory;
