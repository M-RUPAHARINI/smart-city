import React from 'react';
import { Building2, Users, CheckCircle, Clock, AlertTriangle, TrendingUp } from 'lucide-react';
import StatsCard from '../components/common/StatsCard';
import Badge from '../components/common/Badge';

const AdminDepartments = () => {
    const departments = [
        { name: 'PWD', lead: 'John Doe', staff: 24, active: 15, resolved: 84, efficiency: '92%' },
        { name: 'Sanitation', lead: 'Jane Smith', staff: 42, active: 22, resolved: 156, efficiency: '88%' },
        { name: 'Electricity', lead: 'Mike Ross', staff: 18, active: 7, resolved: 42, efficiency: '95%' },
        { name: 'Water Auth', lead: 'Sarah Connor', staff: 15, active: 9, resolved: 31, efficiency: '90%' },
        { name: 'Traffic Pol', lead: 'Jim Gordon', staff: 35, active: 12, resolved: 67, efficiency: '84%' },
    ];

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
                <div>
                    <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-widest mb-2">
                        <Building2 size={16} />
                        Organizational Structure
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 dark:text-white">Departmental Metrics</h1>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">Monitoring resolution efficiency across municipal bodies.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatsCard title="Total Staff" value="134" icon={Users} color="blue" />
                <StatsCard title="Avg Efficiency" value="90.5%" icon={TrendingUp} color="green" />
                <StatsCard title="Critical Backlog" value="14" icon={AlertTriangle} color="amber" />
            </div>

            <div className="grid gap-6">
                {departments.map((dept, i) => (dept.name !== "" &&
                    <div key={i} className="card-premium hover:scale-[1.01] transition-all">
                        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                            <div className="flex items-center gap-5 flex-1">
                                <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center font-black text-xl">
                                    {dept.name[0]}
                                </div>
                                <div>
                                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{dept.name}</h3>
                                    <p className="text-sm font-bold text-slate-400">Lead: {dept.lead}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 flex-[2]">
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Active Tasks</p>
                                    <p className="text-lg font-black text-slate-700 dark:text-slate-200">{dept.active}</p>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Total Resolved</p>
                                    <p className="text-lg font-black text-slate-700 dark:text-slate-200">{dept.resolved}</p>
                                </div>
                                <div className="text-center md:text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Efficiency</p>
                                    <div className="flex items-center gap-2">
                                        <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden w-20">
                                            <div className="h-full bg-accent" style={{ width: dept.efficiency }}></div>
                                        </div>
                                        <span className="text-xs font-black text-accent">{dept.efficiency}</span>
                                    </div>
                                </div>
                                <div className="flex items-center justify-center md:justify-end">
                                    <button className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-primary transition-colors">
                                        <TrendingUp size={18} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div >
    );
};

export default AdminDepartments;
