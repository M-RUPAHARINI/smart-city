import React from 'react';

const Skeleton = ({ className }) => {
    return (
        <div
            className={`animate-pulse bg-slate-200 dark:bg-slate-700 rounded-xl ${className}`}
        />
    );
};

export const DashboardSkeleton = () => (
    <div className="space-y-8">
        <div className="flex justify-between items-end">
            <div className="space-y-2">
                <Skeleton className="h-8 w-48" />
                <Skeleton className="h-4 w-64" />
            </div>
            <Skeleton className="h-12 w-40" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
            <Skeleton className="h-32 w-full" />
        </div>
        <div className="grid lg:grid-cols-3 gap-8">
            <Skeleton className="lg:col-span-2 h-[400px] w-full" />
            <Skeleton className="h-[400px] w-full" />
        </div>
    </div>
);

export const CardSkeleton = () => (
    <div className="card-premium space-y-4">
        <div className="flex gap-4">
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-8 w-full" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex justify-end pt-4">
            <Skeleton className="h-10 w-24" />
        </div>
    </div>
);

export default Skeleton;
