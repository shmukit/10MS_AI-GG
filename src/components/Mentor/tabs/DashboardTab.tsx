import React, { useState } from 'react';
import { Users, BookOpen, Bell, Plus, Layers } from 'lucide-react';
import { Batch, Student } from '../../../types/mentor';
import { LiveSessionList } from '../../Dashboard/LiveSessionList';
import { ScheduleSessionModal } from '../ScheduleSessionModal';
import { EmptyState } from '../../ui/EmptyState';
import { Button } from '../../ui/Button';

interface DashboardTabProps {
    stats: {
        totalStudents: number;
        totalBatches: number;
        totalRoadmapTasks: number;
        totalNotices: number;
    };
    batches: Batch[];
    students: Student[];
    selectedBatch: string;
    onManageBatch?: () => void;
}

export const DashboardTab: React.FC<DashboardTabProps> = ({
    stats,
    batches,
    students,
    selectedBatch,
    onManageBatch,
}) => {
    const [isSchedulingSession, setIsSchedulingSession] = useState(false);
    const [refreshSessionsTrigger, setRefreshSessionsTrigger] = useState(0);

    return (
        <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 rounded-xl border border-border bg-card transition-colors duration-200">
                    <div className="flex items-center gap-3">
                        <Users className="w-8 h-8 text-primary" />
                        <div>
                            <p className="text-2xl font-bold text-foreground transition-colors duration-200">{stats.totalStudents}</p>
                            <p className="text-sm text-muted-foreground transition-colors duration-200">Total Students</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card transition-colors duration-200">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                        <div>
                            <p className="text-2xl font-bold text-foreground transition-colors duration-200">{stats.totalBatches}</p>
                            <p className="text-sm text-muted-foreground transition-colors duration-200">Total Batches</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card transition-colors duration-200">
                    <div className="flex items-center gap-3">
                        <BookOpen className="w-8 h-8 text-muted-foreground" />
                        <div>
                            <p className="text-2xl font-bold text-foreground transition-colors duration-200">{stats.totalRoadmapTasks}</p>
                            <p className="text-sm text-muted-foreground transition-colors duration-200">Roadmap Tasks</p>
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-xl border border-border bg-card transition-colors duration-200">
                    <div className="flex items-center gap-3">
                        <Bell className="w-8 h-8 text-muted-foreground" />
                        <div>
                            <p className="text-2xl font-bold text-foreground transition-colors duration-200">{stats.totalNotices}</p>
                            <p className="text-sm text-muted-foreground transition-colors duration-200">Total Notices</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Live Class Management */}
            <div className="rounded-xl p-6 border border-border bg-card mb-8 transition-colors duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-foreground transition-colors duration-200">
                        Live Class Management
                    </h3>
                    <Button size="sm" onClick={() => setIsSchedulingSession(true)}>
                        <Plus className="w-4 h-4" />
                        Schedule Class
                    </Button>
                </div>
                <LiveSessionList batchId={selectedBatch} key={refreshSessionsTrigger} />
            </div>

            {/* Batch-Roadmap Management Table */}
            <div className="rounded-xl p-6 border border-border bg-card mb-8 transition-colors duration-200">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold text-foreground transition-colors duration-200">
                        Batch & Roadmap Management
                    </h3>
                </div>

                {batches.length === 0 ? (
                    <EmptyState
                        icon={Layers}
                        title="No batches yet"
                        description="Create a batch in Batch & Students to assign roadmaps and manage learners."
                        actionLabel="Manage batch"
                        onAction={onManageBatch}
                    />
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-border transition-colors duration-200">
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground transition-colors duration-200">
                                        Batch Name
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground transition-colors duration-200">
                                        Assigned Roadmap
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground transition-colors duration-200">
                                        Students
                                    </th>
                                    <th className="text-left py-3 px-4 font-medium text-muted-foreground transition-colors duration-200">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {batches.map((batch: Batch) => (
                                    <tr key={batch.id} className="border-b border-border transition-colors duration-200">
                                        <td className="py-3 px-4 text-foreground transition-colors duration-200">
                                            {batch.name}
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground transition-colors duration-200">
                                            {batch.roadmapName}
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground transition-colors duration-200">
                                            {students.filter((s: Student) => s.batchId === batch.id).length} students
                                        </td>
                                        <td className="py-3 px-4">
                                            <Button
                                                variant="link"
                                                size="sm"
                                                className="h-auto px-0"
                                                onClick={onManageBatch}
                                            >
                                                Manage batch
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <ScheduleSessionModal
                isOpen={isSchedulingSession}
                onClose={() => setIsSchedulingSession(false)}
                batchId={selectedBatch}
                onSessionCreated={() => {
                    setIsSchedulingSession(false);
                    setRefreshSessionsTrigger(prev => prev + 1);
                }}
            />
        </div>
    );
};
