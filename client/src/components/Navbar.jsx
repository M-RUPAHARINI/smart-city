import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldCheck, User, LogOut, Menu } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-white border-b border-slate-100 py-4 px-6 md:px-12 flex justify-between items-center sticky top-0 z-50">
            <Link to="/" className="flex items-center space-x-2">
                <div className="bg-primary p-2 rounded-lg">
                    <ShieldCheck className="text-white" size={24} />
                </div>
                <span className="text-xl font-bold text-primary tracking-tight">PS-CRM</span>
            </Link>

            <div className="hidden md:flex items-center space-x-8">
                <Link to="/" className="text-slate-600 hover:text-primary font-medium">Home</Link>
                {user ? (
                    <>
                        <Link to={user.role === 'admin' ? '/admin' : user.role === 'officer' ? '/officer' : '/dashboard'} className="text-slate-600 hover:text-primary font-medium">Dashboard</Link>
                        <div className="flex items-center space-x-4 border-l pl-8 border-slate-200">
                            <div className="flex items-center space-x-2">
                                <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-primary">
                                    <User size={18} />
                                </div>
                                <span className="text-sm font-semibold">{user.name}</span>
                            </div>
                            <button onClick={logout} className="text-slate-500 hover:text-red-500 transition-colors">
                                <LogOut size={20} />
                            </button>
                        </div>
                    </>
                ) : (
                    <div className="flex items-center space-x-4">
                        <Link to="/login" className="text-slate-600 hover:text-primary font-medium">Login</Link>
                        <Link to="/register" className="btn btn-primary">Register</Link>
                    </div>
                )}
            </div>

            <button className="md:hidden text-slate-600">
                <Menu />
            </button>
        </nav>
    );
};

export default Navbar;
