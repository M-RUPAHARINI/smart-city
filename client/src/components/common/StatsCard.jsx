import React from 'react';
import { motion } from 'framer-motion';

const StatsCard = ({ title, value, icon: Icon, color, trend, trendValue }) => {
    const colorMap = {
        blue: 'bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400',
        green: 'bg-green-50 text-green-600 dark:bg-green-900/20 dark:text-green-400',
        amber: 'bg-amber-50 text-amber-600 dark:bg-amber-900/20 dark:text-amber-400',
        red: 'bg-red-50 text-red-600 dark:bg-red-900/20 dark:text-red-400',
        slate: 'bg-slate-50 text-slate-600 dark:bg-slate-900/20 dark:text-slate-400',
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="card-premium flex flex-col gap-4"
        >
            <div className="flex justify-between items-start">
                <div className={`p-3 rounded-xl ${colorMap[color] || colorMap.blue}`}>
                    {Icon && <Icon size={24} />}
                </div>
                {trend && (
                    <span className={`text-xs font-bold px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {trend === 'up' ? '↑' : '↓'} {trendValue}%
                    </span>
                )}
            </div>
            <div>
                <h3 className="text-slate-500 dark:text-slate-400 text-sm font-medium uppercase tracking-wider">{title}</h3>
                <p className="text-3xl font-bold mt-1 text-slate-900 dark:text-white">{value}</p>
            </div>
        </motion.div>
    );
};

export default StatsCard;
