import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Users, BookOpen, Layers, ArrowRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Skeleton } from '../ui/Skeleton';

export const AdminDashboard: React.FC = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        activeBatches: 0,
        totalRoadmaps: 0
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                setLoading(true);
                const { count: usersCount } = await supabase
                    .from('users')
                    .select('id', { count: 'exact', head: true });

                const { count: batchesCount } = await supabase
                    .from('batches')
                    .select('*', { count: 'exact', head: true })
                    .eq('status', 'active');

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
            } finally {
                setLoading(false);
            }
        };

        fetchStats();
    }, []);

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loading ? (
                    <>
                        <Skeleton className="h-28 rounded-xl" />
                        <Skeleton className="h-28 rounded-xl" />
                        <Skeleton className="h-28 rounded-xl" />
                    </>
                ) : (
                    <>
                        <div className="bg-card p-6 rounded-xl border border-border">
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
                        <div className="bg-card p-6 rounded-xl border border-border">
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
                        <div className="bg-card p-6 rounded-xl border border-border">
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
                    </>
                )}
            </div>

            <div className="bg-card rounded-xl border border-border p-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-lg font-semibold text-foreground">User Management</h2>
                    <p className="text-sm text-muted-foreground mt-1">
                        Manage students, mentors, and administrators on the dedicated users page.
                    </p>
                </div>
                <Link
                    to="/admin/users"
                    className="inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-sm font-medium bg-accent text-accent-foreground border border-primary/30 hover:bg-accent/80 transition-colors"
                >
                    Open users
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </div>
    );
};
