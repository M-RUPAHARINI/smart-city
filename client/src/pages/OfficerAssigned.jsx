import React, { useEffect, useState } from 'react';
import API, { updateComplaintStatus, SERVER_URL } from '../services/api';
import { ClipboardList, Clock, Truck, CheckCircle, MapPin, Calendar, Inbox } from 'lucide-react';
import Badge from '../components/common/Badge';
import { DashboardSkeleton } from '../components/common/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const OfficerAssigned = () => {
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);

    const getAssignedComplaints = async () => {
        try {
            const { data } = await API.get('/complaints/officer');
            // Mock filtering logic since backend returns all for officer
            // In a real app, 'Assigned' would be a specific status
            setComplaints(data.filter(c => c.status === 'Assigned' || c.status === 'In Progress'));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getAssignedComplaints();
    }, []);

    const handleUpdate = async (id, status) => {
        try {
            await updateComplaintStatus(id, { status });
            getAssignedComplaints();
        } catch (err) {
            alert('Update failed');
        }
    };

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-accent font-bold text-sm uppercase tracking-widest mb-2">
                        <ClipboardList size={16} />
                        Priority Queue
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Active Assignments</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Tasks currently requiring field intervention.</p>
                </div>
            </div>

            <div className="grid gap-6">
                {complaints.length === 0 ? (
                    <div className="card-premium py-24 text-center">
                        <Inbox size={48} className="mx-auto text-slate-200 mb-4" />
                        <h4 className="text-slate-400 font-bold italic">No active assignments in your queue.</h4>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 gap-6">
                        <AnimatePresence>
                            {complaints.map((c, idx) => (
                                <motion.div
                                    key={c._id}
                                    initial={{ opacity: 0, scale: 0.95 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: idx * 0.05 }}
                                    className="card-premium h-full flex flex-col justify-between"
                                >
                                    <div className="space-y-4">
                                        <div className="flex justify-between items-start">
                                            <Badge variant={c.status === 'In Progress' ? 'warning' : 'info'}>{c.status}</Badge>
                                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Ref: #{c._id.substring(c._id.length - 6).toUpperCase()}</span>
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2">{c.title}</h3>
                                            {c.image && (
                                                <div className="mb-4 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 h-40 cursor-pointer hover:border-primary/50 transition-colors" onClick={() => window.open(c.image.startsWith('http') ? c.image : `${SERVER_URL}${c.image}`, '_blank')}>
                                                    <img
                                                        src={c.image.startsWith('http') ? c.image : `${SERVER_URL}${c.image}`}
                                                        alt="Evidence"
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                            )}
                                            <div className="flex items-center gap-3 text-xs font-bold text-slate-500">
                                                <div className="flex items-center gap-1"><MapPin size={12} /> {c.location}</div>
                                                <div className="flex items-center gap-1"><Calendar size={12} /> {new Date(c.createdAt).toLocaleDateString()}</div>
                                            </div>
                                        </div>
                                        <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
                                            {c.description}
                                        </p>
                                    </div>

                                    <div className="mt-8 flex gap-3">
                                        {c.status === 'Assigned' && (
                                            <button
                                                onClick={() => handleUpdate(c._id, 'In Progress')}
                                                className="btn btn-primary flex-1 py-3"
                                            >
                                                <Truck size={18} /> Accept & Start
                                            </button>
                                        )}
                                        {c.status === 'In Progress' && (
                                            <div className="flex-1 relative">
                                                <input
                                                    type="file"
                                                    id={`assigned-proof-${c._id}`}
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
                                                                getAssignedComplaints();
                                                                alert('Assignment resolved with proof!');
                                                            } catch (err) {
                                                                alert('Resolution failed');
                                                            }
                                                        }
                                                    }}
                                                />
                                                <button
                                                    onClick={() => document.getElementById(`assigned-proof-${c._id}`).click()}
                                                    className="btn border-2 border-accent text-accent hover:bg-accent hover:text-white w-full py-3 transition-all"
                                                >
                                                    <CheckCircle size={18} /> Mark Resolved with Proof
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OfficerAssigned;
