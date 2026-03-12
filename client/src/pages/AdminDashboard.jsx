import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
    fetchDashboardAnalytics,
    fetchAdminComplaints,
    updateComplaintStatus,
    SERVER_URL
} from '../services/api';
import {
    ShieldCheck,
    Download,
    TrendingUp,
    CheckCircle,
    AlertTriangle,
    Building2,
    Map as MapIcon,
    Search,
    Filter,
    MoreVertical
} from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import Badge from '../components/common/Badge';
import { DashboardSkeleton } from '../components/common/Skeleton';
import {
    ResponsiveContainer,
    BarChart,
    CartesianGrid,
    XAxis,
    YAxis,
    Tooltip,
    Bar,
    PieChart,
    Pie,
    Cell
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';

// Fix for default marker icon
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: markerIcon,
    shadowUrl: markerShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const AdminDashboard = () => {
    const [stats, setStats] = useState({
        total: 0,
        resolved: 0,
        pending: 0,
        categories: []
    });
    const [complaints, setComplaints] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('All');

    useEffect(() => {
        const loadData = async () => {
            try {
                const [statsRes, complaintsRes] = await Promise.all([
                    fetchDashboardAnalytics(),
                    fetchAdminComplaints()
                ]);
                setStats(statsRes.data);
                setComplaints(complaintsRes.data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, []);

    const COLORS = ['#1E3A8A', '#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'];

    const getStatusVariant = (status) => {
        switch (status) {
            case 'Resolved': return 'success';
            case 'Submitted': return 'info';
            case 'In Progress': return 'warning';
            case 'Assigned': return 'warning';
            default: return 'neutral';
        }
    };

    const handleAssign = async (id, department) => {
        try {
            await updateComplaintStatus(id, { status: 'Assigned', assignedDepartment: department });
            const { data } = await fetchAdminComplaints();
            setComplaints(data);
        } catch (err) {
            alert('Failed to assign department');
        }
    };

    const downloadCSV = () => {
        const headers = ['ID', 'Title', 'Citizen', 'Category', 'Status', 'Date'];
        const rows = complaints.map(c => [
            c._id,
            c.title,
            c.createdBy?.name || 'Unknown',
            c.category,
            c.status,
            new Date(c.createdAt).toLocaleDateString()
        ]);

        const csvContent = "data:text/csv;charset=utf-8,"
            + headers.join(",") + "\n"
            + rows.map(e => e.join(",")).join("\n");

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "ps-crm-report.csv");
        document.body.appendChild(link);
        link.click();
    };

    const filteredComplaints = complaints.filter(c => {
        const matchesSearch = (c.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
            (c.createdBy?.name || '').toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = filterCategory === 'All' || c.category === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) return <DashboardSkeleton />;

    // Complaints with coordinates for the map
    const mappedComplaints = complaints.filter(c => c.latitude && c.longitude);
    const defaultCenter = mappedComplaints.length > 0
        ? [mappedComplaints[0].latitude, mappedComplaints[0].longitude]
        : [28.6139, 77.2090]; // Delhi as default

    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                        <ShieldCheck size={16} />
                        Command Center
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">City Operations Dashboard</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Real-time monitoring of municipal services and citizen grievances.</p>
                </div>
            </div>

            {/* Top Metrics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatsCard
                    title="Total Complaints"
                    value={stats.total}
                    icon={TrendingUp}
                    color="blue"
                    trend="up"
                    trendValue={8}
                />
                <StatsCard
                    title="Service Resolved"
                    value={stats.resolved}
                    icon={CheckCircle}
                    color="green"
                    trend="up"
                    trendValue={14}
                />
                <StatsCard
                    title="Active Alerts"
                    value={stats.pending}
                    icon={AlertTriangle}
                    color="amber"
                />
                <StatsCard
                    title="Departments"
                    value="12"
                    icon={Building2}
                    color="slate"
                />
            </div>

            {/* Middle Section: Charts & Heatmap */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Category Bar Chart */}
                <div className="lg:col-span-2 card-premium">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <TrendingUp className="text-primary" size={20} />
                            Complaints by Category
                        </h3>
                        <Badge variant="info">Live Feed</Badge>
                    </div>
                    <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats?.categories || []}>
                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#1E3A8A" stopOpacity={1} />
                                        <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.8} />
                                    </linearGradient>
                                </defs>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                                <XAxis
                                    dataKey="_id"
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12, fontWeight: 600 }}
                                />
                                <YAxis
                                    axisLine={false}
                                    tickLine={false}
                                    tick={{ fill: '#64748B', fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: '#F1F5F9' }}
                                    contentStyle={{
                                        backgroundColor: '#fff',
                                        borderRadius: '16px',
                                        border: 'none',
                                        boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
                                    }}
                                />
                                <Bar
                                    dataKey="count"
                                    fill="url(#barGradient)"
                                    radius={[8, 8, 0, 0]}
                                    barSize={45}
                                />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* Status Pie Chart */}
                <div className="card-premium">
                    <h3 className="text-lg font-bold mb-8">Resolution Status</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={[
                                        { name: 'Resolved', value: stats?.resolved || 0 },
                                        { name: 'Active', value: stats?.pending || 0 }
                                    ]}
                                    innerRadius={70}
                                    outerRadius={100}
                                    paddingAngle={8}
                                    dataKey="value"
                                >
                                    <Cell fill="#10B981" />
                                    <Cell fill="#3B82F6" />
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="space-y-4 mt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-accent" />
                                <span className="text-sm font-bold text-slate-600">Resolved</span>
                            </div>
                            <span className="text-sm font-black text-slate-900">{stats?.total ? Math.round((stats.resolved / stats.total) * 100) : 0}%</span>
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full bg-secondary" />
                                <span className="text-sm font-bold text-slate-600">Active</span>
                            </div>
                            <span className="text-sm font-black text-slate-900">{stats?.total ? Math.round((stats.pending / stats.total) * 100) : 0}%</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Section: Management Table & Hotspots */}
            <div className="grid lg:grid-cols-4 gap-8">
                {/* Real-time Mapping */}
                <div className="card-premium h-full flex flex-col">
                    <div className="flex items-center justify-between mb-6 shrink-0">
                        <h3 className="text-lg font-bold flex items-center gap-2">
                            <MapIcon className="text-primary" size={20} />
                            Incident Map
                        </h3>
                        <div className="flex items-center gap-1.5">
                            <div className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Live</span>
                        </div>
                    </div>
                    <div className="flex-1 min-h-[300px] w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 relative z-0 flex items-center justify-center bg-slate-100 dark:bg-slate-800">
                        {/* <MapContainer center={defaultCenter} zoom={11} scrollWheelZoom={false} style={{ height: '300px', width: '100%' }}>
                            <TileLayer
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                            />
                            {mappedComplaints.length > 0 ? (
                                mappedComplaints.map(complaint => (
                                    <Marker key={complaint._id} position={[Number(complaint.latitude), Number(complaint.longitude)]}>
                                        <Popup>
                                            <div className="p-1">
                                                <h4 className="font-bold text-slate-900 text-sm mb-1">{complaint.title}</h4>
                                                <div className="flex flex-col gap-1">
                                                    <Badge variant={getStatusVariant(complaint.status)} className="w-fit text-[10px]">{complaint.status}</Badge>
                                                    <p className="text-[10px] text-slate-500 font-bold uppercase tracking-tight">{complaint.category}</p>
                                                    <p className="text-[10px] text-slate-400 italic">Reported by: {complaint.createdBy?.name || 'Citizen'}</p>
                                                </div>
                                            </div>
                                        </Popup>
                                    </Marker>
                                ))
                            ) : null}
                        </MapContainer> */}
                        <div className="text-center">
                            <MapIcon size={48} className="mx-auto text-slate-300 mb-2" />
                            <p className="text-slate-400 font-bold">Map temporarily disabled for debugging</p>
                        </div>
                    </div>
                    <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                        <p className="text-[10px] text-slate-500 font-medium leading-relaxed">
                            <span className="font-bold text-slate-700 dark:text-slate-300">Observation:</span> High density of reports mapping to residential clusters. Department assignment suggested.
                        </p>
                    </div>
                </div>

                {/* Management Table */}
                <div className="lg:col-span-3 card-premium overflow-hidden !p-0">
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 bg-slate-50/50 dark:bg-slate-900/50">
                        <h3 className="text-lg font-bold">Comprehensive Incident Log</h3>
                        <div className="flex items-center gap-3 w-full md:w-auto">
                            <div className="relative flex-1 md:w-64">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                                <input
                                    type="text"
                                    placeholder="Search by citizen or title..."
                                    className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary/20"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-white transition-colors">
                                <Filter size={18} />
                            </button>
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-slate-50 dark:bg-slate-900">
                                <tr className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                    <th className="px-6 py-4">Ref ID</th>
                                    <th className="px-6 py-4">Incident & Category</th>
                                    <th className="px-6 py-4">Citizen</th>
                                    <th className="px-6 py-4">Status</th>
                                    <th className="px-6 py-4">Allocation</th>
                                    <th className="px-6 py-4"></th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                                <AnimatePresence>
                                    {filteredComplaints.slice(0, 10).map((c, idx) => (
                                        <motion.tr
                                            key={c._id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            transition={{ delay: idx * 0.05 }}
                                            className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors group"
                                        >
                                            <td className="px-6 py-4">
                                                <span className="text-xs font-bold font-mono text-slate-400">#{c._id.substring(c._id.length - 6).toUpperCase()}</span>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col">
                                                    <p className="text-sm font-bold text-slate-900 dark:text-white mb-0.5">{c.title}</p>
                                                    <p className="text-[10px] font-black uppercase tracking-tighter text-primary">{c.category}</p>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center text-[10px] font-bold text-slate-500 uppercase">
                                                        {c.createdBy?.name?.[0] || 'U'}
                                                    </div>
                                                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">{c.createdBy?.name || 'Anonymous'}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                <Badge variant={c.status === 'Resolved' ? 'success' : 'warning'}>
                                                    {c.status}
                                                </Badge>
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-2">
                                                    <select
                                                        className="text-[10px] font-black uppercase tracking-widest border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1.5 focus:outline-primary bg-white dark:bg-slate-800"
                                                        onChange={(e) => handleAssign(c._id, e.target.value)}
                                                        value={c.assignedDepartment || ""}
                                                    >
                                                        <option value="" disabled>Select Dept</option>
                                                        <option value="PWD">PWD</option>
                                                        <option value="Sanitation">Sanitation</option>
                                                        <option value="Electricity">Electricity</option>
                                                        <option value="Water">Water Auth</option>
                                                        <option value="Traffic">Traffic Pol</option>
                                                    </select>

                                                    {c.status !== 'Resolved' && (
                                                        <div className="relative">
                                                            <input
                                                                type="file"
                                                                id={`proof-${c._id}`}
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
                                                                            const { data } = await fetchAdminComplaints();
                                                                            setComplaints(data);
                                                                            alert('Grievance resolved with evidence!');
                                                                        } catch (err) {
                                                                            alert('Resolution failed');
                                                                        }
                                                                    }
                                                                }}
                                                            />
                                                            <button
                                                                onClick={() => document.getElementById(`proof-${c._id}`).click()}
                                                                className="p-1.5 rounded-lg bg-green-500/10 text-green-600 hover:bg-green-500 hover:text-white transition-all"
                                                                title="Resolve with Evidence"
                                                            >
                                                                <CheckCircle size={14} />
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right">
                                                <button className="p-2 h-8 w-8 flex items-center justify-center rounded-lg text-slate-300 hover:text-slate-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
                                                    <MoreVertical size={16} />
                                                </button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                    {filteredComplaints.length === 0 && (
                        <div className="py-20 text-center">
                            <p className="text-slate-400 font-bold italic">No complaints found correlating to search parameters.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
