import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, TrendingUp, Activity } from 'lucide-react';
import Badge from '../components/common/Badge';

const AdminAnalytics = () => {
    const timeData = [
        { name: 'Mon', count: 12 },
        { name: 'Tue', count: 19 },
        { name: 'Wed', count: 15 },
        { name: 'Thu', count: 22 },
        { name: 'Fri', count: 30 },
        { name: 'Sat', count: 10 },
        { name: 'Sun', count: 8 },
    ];

    return (
        <div className="space-y-8 pb-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                        <BarChart3 size={16} />
                        Strategic Intelligence
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Trend Analysis</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">In-depth visualization of city-wide grievance patterns.</p>
                </div>
            </div>

            <div className="card-premium h-[450px]">
                <h3 className="text-lg font-bold mb-8 flex items-center gap-2">
                    <Activity className="text-primary" size={20} />
                    Weekly Submission Volume
                </h3>
                <div className="h-[300px] w-full">
                    <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={timeData}>
                            <defs>
                                <linearGradient id="areaColor" x1="0" y1="0" x2="0" y2="1">
                                    <stop offset="5%" stopColor="#1E3A8A" stopOpacity={0.3} />
                                    <stop offset="95%" stopColor="#1E3A8A" stopOpacity={0} />
                                </linearGradient>
                            </defs>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                            <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                            <Tooltip
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            />
                            <Area type="monotone" dataKey="count" stroke="#1E3A8A" fillOpacity={1} fill="url(#areaColor)" strokeWidth={3} />
                        </AreaChart>
                    </ResponsiveContainer>
                </div>
            </div>

            <div className="card-premium">
                <div className="flex items-center justify-between mb-8">
                    <h3 className="text-lg font-bold">Predictive System Status</h3>
                    <Badge variant="success">Optimization Active</Badge>
                </div>
                <div className="grid md:grid-cols-4 gap-8">
                    {[
                        { label: 'Avg Response Time', value: '4.2 hrs', change: '-12%' },
                        { label: 'Citizen Satisfaction', value: '4.8/5', change: '+5%' },
                        { label: 'SLA Adherence', value: '98.4%', change: '+1.2%' },
                        { label: 'Resource Allocation', value: 'Optimal', change: 'Stable' },
                    ].map((m, i) => (
                        <div key={i} className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-slate-100 dark:border-slate-800">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">{m.label}</p>
                            <p className="text-2xl font-black text-slate-900 dark:text-white mb-1">{m.value}</p>
                            <p className="text-[10px] font-bold text-accent">{m.change}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default AdminAnalytics;
