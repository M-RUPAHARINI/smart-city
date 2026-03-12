import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    LayoutDashboard,
    FilePlus,
    ListTodo,
    History,
    Bell,
    User,
    Settings,
    Users,
    BarChart3,
    Map as MapIcon,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    ClipboardList
} from 'lucide-react';

const Sidebar = ({ role }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);

    const citizenLinks = [
        { title: 'Dashboard', icon: LayoutDashboard, path: '/citizen/dashboard' },
        { title: 'Submit Complaint', icon: FilePlus, path: '/citizen/new-complaint' },
        { title: 'My Complaints', icon: ListTodo, path: '/citizen/tracking' },
        { title: 'Complaint History', icon: History, path: '/citizen/history' },
    ];

    const adminLinks = [
        { title: 'Dashboard', icon: ShieldCheck, path: '/admin/dashboard' },
        { title: 'All Complaints', icon: ClipboardList, path: '/admin/complaints' },
        { title: 'Departments', icon: Users, path: '/admin/departments' },
        { title: 'Analytics', icon: BarChart3, path: '/admin/analytics' },
    ];

    const officerLinks = [
        { title: 'Dashboard', icon: ListTodo, path: '/officer/dashboard' },
        { title: 'Assigned Complaints', icon: ClipboardList, path: '/officer/assigned' },
        { title: 'Resolved History', icon: History, path: '/officer/history' },
    ];

    let activeLinks = citizenLinks;
    if (role === 'admin') activeLinks = adminLinks;
    else if (role === 'officer') activeLinks = officerLinks;

    const NavItem = ({ link }) => (
        <NavLink
            to={link.path}
            className={({ isActive }) => `
        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
        ${isActive
                    ? 'bg-primary text-white shadow-lg shadow-primary/20'
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-primary'}
      `}
        >
            <link.icon size={22} className={isCollapsed ? 'mx-auto' : ''} />
            {!isCollapsed && <span className="font-semibold text-sm">{link.title}</span>}
        </NavLink>
    );

    return (
        <aside
            className={`
        bg-surface dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 
        transition-all duration-300 h-screen sticky top-0 z-50 flex flex-col p-4
        ${isCollapsed ? 'w-20' : 'w-72'}
      `}
        >
            <div className="flex items-center justify-between mb-8 px-2">
                {!isCollapsed && (
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                            <span className="text-white font-black text-xl">P</span>
                        </div>
                        <span className="font-bold text-lg dark:text-white">SmartCity <span className="text-primary italic">CRM</span></span>
                    </div>
                )}
                <button
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-primary transition-colors"
                >
                    {isCollapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
                </button>
            </div>

            <nav className="flex-1 space-y-2">
                <div className="mb-4">
                    {!isCollapsed && <p className="px-4 text-[11px] font-black uppercase tracking-widest text-slate-400 mb-2">Main Menu</p>}
                    {activeLinks.map((link, idx) => (
                        <NavItem key={idx} link={link} />
                    ))}
                </div>
            </nav>

            <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
                {!isCollapsed && (
                    <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                            SC
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="font-bold text-sm truncate dark:text-white">Command Center</p>
                            <p className="text-xs text-slate-500 truncate lowercase">v1.2.4-stable</p>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
};

export default Sidebar;
