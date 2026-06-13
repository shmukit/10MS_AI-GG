import React, { useEffect, useState } from 'react';
import { UserList } from './UserManagement/UserList';
import { Users, BookOpen, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeBatches: 0,
        totalRoadmaps: 0
    });

    useEffect(() => {
        const fetchStats = async () => {
            try {
                // Fetch total users
                const { count: usersCount } = await supabase
                    .from('users')
                    .select('id', { count: 'exact', head: true });

                // Fetch active batches
                const { count: batchesCount } = await supabase
                    .from('batches')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'active');

                // Fetch total roadmaps
                const { count: roadmapsCount } = await supabase
                    .from('roadmaps')
                    .select('*', { count: 'exact', head: true });

                setStats({
                    totalUsers: usersCount || 0,
                    activeBatches: batchesCount || 0,
                    totalRoadmaps: roadmapsCount || 0
                });
            } catch (error) {
                console.error('Error fetching admin stats:', error);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                            <Users className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Users</p>
                            <h3 className="text-2xl font-bold text-foreground">{stats.totalUsers}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-primary/10 text-primary rounded-lg">
                            <BookOpen className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Active Batches</p>
                            <h3 className="text-2xl font-bold text-foreground">{stats.activeBatches}</h3>
                        </div>
                    </div>
                </div>
                <div className="bg-card p-6 rounded-xl shadow-sm border border-border">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 rounded-lg">
                            <Layers className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Total Roadmaps</p>
                            <h3 className="text-2xl font-bold text-foreground">{stats.totalRoadmaps}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area */}
            <div className="bg-card rounded-xl shadow-sm border border-border overflow-hidden">
                <div className="p-4 sm:p-6 border-b border-border">
                    <h2 className="text-lg font-semibold text-foreground">User Management</h2>
                    <p className="text-sm text-muted-foreground">Manage students, mentors, and administrators.</p>
                </div>
                <div className="p-4 sm:p-6">
                    <UserList />
                </div>
            </div>
        </div>
    );
};
