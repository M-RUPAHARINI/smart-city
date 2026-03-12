import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchComplaints, SERVER_URL } from '../services/api';
import Badge from '../components/common/Badge';
import {
    ArrowLeft,
    Clock,
    MapPin,
    Tag,
    CheckCircle,
    Building2,
    Calendar,
    AlertCircle,
    User
} from 'lucide-react';
import { motion } from 'framer-motion';

const ComplaintDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [complaint, setComplaint] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const getComplaintDetails = async () => {
            try {
                const { data } = await fetchComplaints();
                const found = data.find(c => c._id === id);
                setComplaint(found);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        getComplaintDetails();
    }, [id]);

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Resolved': return 'success';
            case 'Submitted': return 'info';
            case 'In Progress': return 'warning';
            case 'Assigned': return 'warning';
            default: return 'neutral';
        }
    };

    if (loading) return (
        <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
    );

    if (!complaint) {
        return (
            <div className="text-center py-20">
                <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Grievance not found</h2>
                <button onClick={() => navigate(-1)} className="text-primary mt-4 inline-block font-bold">Back to previous page</button>
            </div>
        );
    }

    const timelineEvents = [
        {
            status: 'Submitted',
            title: 'Grievance Registered',
            description: 'Your complaint has been successfully received by the central system.',
            date: complaint.createdAt,
            icon: Clock,
            color: 'text-blue-500',
            bg: 'bg-blue-50 dark:bg-blue-900/20'
        },
        {
            status: 'Assigned',
            title: 'Department Assigned',
            description: complaint.assignedDepartment
                ? `Assigned to ${complaint.assignedDepartment} department for verification.`
                : 'Searching for the appropriate department to handle this issue.',
            date: complaint.updatedAt && complaint.status !== 'Submitted' ? complaint.updatedAt : null,
            icon: Building2,
            color: 'text-amber-500',
            bg: 'bg-amber-50 dark:bg-amber-900/20'
        },
        {
            status: 'In Progress',
            title: 'Work in Progress',
            description: 'An officer has been dispatched to investigate and resolve the issue.',
            date: complaint.status === 'In Progress' || complaint.status === 'Resolved' ? complaint.updatedAt : null,
            icon: AlertCircle,
            color: 'text-orange-500',
            bg: 'bg-orange-50 dark:bg-orange-900/20'
        },
        {
            status: 'Resolved',
            title: 'Issue Resolved',
            description: 'The problem has been addressed. Quality check is complete.',
            date: complaint.status === 'Resolved' ? complaint.updatedAt : null,
            icon: CheckCircle,
            color: 'text-green-500',
            bg: 'bg-green-50 dark:bg-green-900/20'
        }
    ];

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="flex items-center gap-4">
                <button onClick={() => navigate(-1)} className="p-3 rounded-2xl bg-surface dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-primary transition-all">
                    <ArrowLeft size={20} />
                </button>
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">ID: {complaint._id.substring(complaint._id.length - 8).toUpperCase()}</span>
                        <Badge variant={getStatusVariant(complaint.status)}>{complaint.status}</Badge>
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">{complaint.title}</h1>
                </div>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
                <div className="md:col-span-2 card-premium">
                    <h2 className="text-xl font-bold mb-8 flex items-center gap-3">
                        <Clock className="text-primary" />
                        Progress Timeline
                    </h2>

                    <div className="relative space-y-8 before:absolute before:inset-0 before:ml-5 before:h-full before:w-0.5 before:-translate-x-px before:bg-gradient-to-b before:from-slate-200 before:via-slate-200 before:to-transparent dark:before:from-slate-700 dark:before:via-slate-700">
                        {timelineEvents.map((event, idx) => {
                            const isCompleted = event.date !== null;
                            return (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="relative flex items-start gap-6"
                                >
                                    <div className={`mt-1 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-4 border-white dark:border-slate-900 shadow-sm z-10 transition-colors ${isCompleted ? event.bg : 'bg-slate-100 dark:bg-slate-800'}`}>
                                        <event.icon size={20} className={isCompleted ? event.color : 'text-slate-300'} />
                                    </div>
                                    <div className={`flex flex-col gap-1 pb-4 flex-1 ${idx !== timelineEvents.length - 1 ? 'border-b border-slate-50 dark:border-slate-800' : ''}`}>
                                        <div className="flex items-center justify-between gap-4">
                                            <h3 className={`font-bold transition-colors ${isCompleted ? 'text-slate-900 dark:text-white' : 'text-slate-400'}`}>
                                                {event.title}
                                            </h3>
                                            {isCompleted && (
                                                <span className="text-[10px] font-black uppercase tracking-tighter text-slate-400 flex items-center gap-1">
                                                    <Calendar size={10} />
                                                    {new Date(event.date).toLocaleDateString()}
                                                </span>
                                            )}
                                        </div>
                                        <p className={`text-sm leading-relaxed transition-colors ${isCompleted ? 'text-slate-500 dark:text-slate-400' : 'text-slate-300 dark:text-slate-600'}`}>
                                            {event.description}
                                        </p>
                                    </div>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="card-premium">
                        <h3 className="font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                            <Tag size={18} className="text-primary" />
                            Ticket Context
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Category</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{complaint.category}</p>
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Department</p>
                                <p className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1">{complaint.assignedDepartment || 'Pending Assignment'}</p>
                            </div>
                            <div className="pt-4 border-t border-slate-50 dark:border-slate-800">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 flex items-center gap-1 mb-2">
                                    <MapPin size={10} />
                                    Location
                                </p>
                                <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{complaint.location}</p>
                            </div>
                        </div>
                    </div>

                    <div className="card-premium overflow-hidden p-0">
                        {complaint.image ? (
                            <div className="space-y-3 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Initial Evidence</p>
                                <img
                                    src={complaint.image.startsWith('http') ? complaint.image : `${SERVER_URL}${complaint.image}`}
                                    alt="Evidence"
                                    className="w-full h-auto object-contain rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 cursor-pointer"
                                    onClick={() => window.open(complaint.image.startsWith('http') ? complaint.image : `${SERVER_URL}${complaint.image}`, '_blank')}
                                />
                            </div>
                        ) : (
                            <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/50">
                                <AlertCircle size={32} className="mx-auto text-slate-200 mb-2" />
                                <p className="text-xs font-bold text-slate-400 italic">No visual evidence provided.</p>
                            </div>
                        )}
                    </div>

                    {complaint.resolutionProof && (
                        <div className="card-premium overflow-hidden p-0 border-green-500/20 bg-green-500/5">
                            <div className="space-y-3 p-4">
                                <p className="text-[10px] font-black uppercase tracking-widest text-green-600 mb-2">Resolution Proof</p>
                                <img
                                    src={complaint.resolutionProof.startsWith('http') ? complaint.resolutionProof : `${SERVER_URL}${complaint.resolutionProof}`}
                                    alt="Resolution Proof"
                                    className="w-full h-auto object-contain rounded-xl shadow-sm border border-green-100 dark:border-green-900/20 cursor-pointer"
                                    onClick={() => window.open(complaint.resolutionProof.startsWith('http') ? complaint.resolutionProof : `${SERVER_URL}${complaint.resolutionProof}`, '_blank')}
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ComplaintDetail;
