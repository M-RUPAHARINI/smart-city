import React from 'react';
import { useAuth } from '../../context/AuthContext';
import ThemeToggle from '../common/ThemeToggle';
import { Search, Bell, LogOut, ChevronDown } from 'lucide-react';

const Header = () => {
    const { user, logout } = useAuth();

    return (
        <header className="h-16 sticky top-0 bg-surface/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 z-40 px-6 flex items-center justify-between">
            <div className="flex-1"></div>

            <div className="flex items-center gap-4">
                <ThemeToggle />

                <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:block text-right">
                        <p className="text-sm font-bold dark:text-white leading-tight">{user?.name}</p>
                        <p className="text-[10px] font-black uppercase tracking-tighter text-primary">{user?.role}</p>
                    </div>
                    <div className="group relative">
                        <button className="flex items-center gap-1 group">
                            <div className="w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center font-black shadow-lg shadow-primary/20">
                                {user?.name?.[0].toUpperCase()}
                            </div>
                            <ChevronDown size={14} className="text-slate-400 group-hover:text-primary transition-colors" />
                        </button>

                        <div className="absolute right-0 mt-2 w-48 bg-surface dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-premium opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 p-2 transform origin-top-right group-hover:translate-y-0 translate-y-2">
                            <button
                                onClick={logout}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm font-semibold text-danger hover:bg-red-50 dark:hover:bg-red-900/10 rounded-xl transition-colors"
                            >
                                <LogOut size={18} />
                                Sign Out
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
