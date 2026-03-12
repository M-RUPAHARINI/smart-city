import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import { useAuth } from '../../context/AuthContext';

const OfficerLayout = () => {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background dark:bg-slate-950">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                    <p className="text-slate-500 font-medium animate-pulse">Initializing Officer Panel...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== 'officer') {
        return <Navigate to="/login" />;
    }

    return (
        <div className="flex min-h-screen bg-background dark:bg-slate-950">
            <Sidebar role="officer" />
            <div className="flex-1 flex flex-col min-w-0">
                <Header />
                <main className="flex-1 p-6 md:p-8">
                    <div className="max-w-7xl mx-auto bounce-in">
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default OfficerLayout;
