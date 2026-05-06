import React from 'react';
import { Outlet } from 'react-router-dom';
import { MobileBottomNav } from '../Student/MobileBottomNav';

export const StudentLayout = () => {
    return (
        <div className="min-h-screen bg-background">
            <Outlet />
            <MobileBottomNav />
        </div>
    );
};
