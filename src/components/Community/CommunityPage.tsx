import React, { useState, useEffect } from 'react';
import { ArrowLeft, Users, MessageCircle, Phone, Mail, Filter, AlertCircle } from 'lucide-react';
import { DatabaseService, Batch, User } from '../../services/database';
import { useAuth } from '../../lib/useAuth';
import { posthog } from '../../lib/posthog';
import { Avatar } from '../ui/Avatar';
import { EmptyState } from '../ui/EmptyState';

interface Student {
  id: string;
  name: string;
  institute: string;
  year: string;
  subject: string;
  degree: string;
  email: string;
  completedWeeks: number;
  progressPercentage: number;
}

interface CommunityPageProps {
  onBack: () => void;
}

export const CommunityPage: React.FC<CommunityPageProps> = ({ onBack }) => {
  const { user, databaseUserId } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [mentors, setMentors] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<'name' | 'completion'>('name');

  const getUserDisplayName = () =>
    user?.user_metadata?.first_name ||
    user?.user_metadata?.full_name ||
    user?.email?.split('@')[0] ||
    'Student';

  useEffect(() => {
    const fetchStudents = async () => {
      if (!user?.id) return;

      try {
        setLoading(true);
        setError(null);

        posthog?.capture('community_view', {
          user_id: databaseUserId,
          viewed_at: new Date().toISOString(),
        });

        posthog?.capture('$pageview', {
          page: 'community',
          user_id: databaseUserId,
        });

        if (!databaseUserId) {
          setError('User not authenticated');
          return;
        }

        const batchData = await DatabaseService.getStudentBatch(databaseUserId);
        if (!batchData) {
          setError('No batch found for user');
          return;
        }

        setBatch(batchData);

        const [batchStudents, mentorsData] = await Promise.all([
          DatabaseService.getStudentsByBatch(batchData.id, databaseUserId),
          DatabaseService.getMentors(batchData.id),
        ]);

        setMentors(mentorsData);

        const transformedStudents: Student[] = batchStudents.map((student) => ({
          id: student.id,
          name: `${student.first_name} ${student.last_name}`.trim(),
          institute: student.profile?.institute || 'Unknown',
          year: student.profile?.year || 'Unknown',
          subject: student.profile?.subject || 'Unknown',
          degree: student.profile?.degree || 'Unknown',
          email: student.email,
          completedWeeks: student.progress?.completed_weeks || 0,
          progressPercentage: student.progress?.progress_percentage || 0,
        }));

        setStudents(transformedStudents);
      } catch (err) {
        console.error('Error fetching students:', err);
        setError('Failed to load community data');
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, [user?.id, databaseUserId]);

  const sortedStudents = [...students].sort((a, b) => {
    if (sortBy === 'name') {
      return a.name.localeCompare(b.name);
    }
    const progressDiff = b.progressPercentage - a.progressPercentage;
    if (progressDiff !== 0) return progressDiff;
    return b.completedWeeks - a.completedWeeks;
  });

  const handleWhatsAppClick = () => {
    if (!batch?.whatsapp_link) return;
    posthog?.capture('whatsapp_group_clicked', {
      user_id: databaseUserId,
      group_type: 'community',
      clicked_at: new Date().toISOString(),
    });
    window.open(batch.whatsapp_link, '_blank');
  };

  const handleDiscordClick = () => {
    if (!batch?.discord_link) return;
    window.open(batch.discord_link, '_blank');
  };

  const handleEmergencyContact = () => {
    if (!batch?.emergency_contact) return;
    posthog?.capture('student_contact_clicked', {
      user_id: databaseUserId,
      contact_type: 'phone',
      contact_number: batch.emergency_contact,
      contact_purpose: 'emergency',
      clicked_at: new Date().toISOString(),
    });
    window.open(`tel:${batch.emergency_contact}`, '_self');
  };

  const mentorLabel =
    mentors.length > 0
      ? mentors.map((m) => `${m.first_name} ${m.last_name}`.trim()).join(', ')
      : 'Not assigned';

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-200">
      {/* Header */}
      <div className="border-b border-border bg-card h-16 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-primary-foreground font-bold text-xs">10MS</span>
              </div>
              <h1 className="text-xl font-bold text-foreground">10MS SheSTEM</h1>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">{getUserDisplayName()}</span>
              <Avatar name={getUserDisplayName()} size="sm" />
            </div>
          </div>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="border-b border-border bg-card h-16 transition-colors duration-200">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Dashboard</span>
          </button>

          <h1 className="text-2xl font-bold text-foreground">Community</h1>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        {error && !loading && (
          <div className="rounded-xl border border-destructive/30 bg-destructive/10 p-6 mb-8">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-destructive shrink-0" />
              <div>
                <h3 className="font-medium text-foreground">Error Loading Community</h3>
                <p className="text-sm text-muted-foreground">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!error && (
          <>
            {/* Group Info Section */}
            <div className="rounded-xl p-6 border border-border bg-card mb-8 transition-colors duration-200">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-3 mb-4">
                    <Users className="w-6 h-6 text-primary" />
                    <h2 className="text-xl font-bold text-foreground">
                      {batch?.name || 'Your Cohort'}
                    </h2>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="w-4 h-4" />
                      <span>
                        <strong className="text-foreground">Students:</strong> {students.length} members
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span className="w-4 h-4 flex items-center justify-center">👨‍🏫</span>
                      <span>
                        <strong className="text-foreground">Mentor:</strong> {mentorLabel}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-3 gap-3">
                    {batch?.whatsapp_link && (
                      <button
                        onClick={handleWhatsAppClick}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors bg-green-600 hover:bg-green-700 text-white"
                      >
                        <MessageCircle className="w-3 h-3" />
                        WhatsApp
                      </button>
                    )}

                    {batch?.discord_link && (
                      <button
                        onClick={handleDiscordClick}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors bg-primary hover:bg-primary/90 text-primary-foreground"
                      >
                        <MessageCircle className="w-3 h-3" />
                        Discord
                      </button>
                    )}

                    {batch?.emergency_contact && (
                      <button
                        onClick={handleEmergencyContact}
                        className="flex items-center justify-center gap-1 py-2 px-2 rounded-lg text-xs font-medium transition-colors bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                      >
                        <Phone className="w-3 h-3" />
                        Emergency
                      </button>
                    )}

                    {!batch?.whatsapp_link && !batch?.discord_link && !batch?.emergency_contact && (
                      <p className="col-span-3 text-sm text-muted-foreground italic">
                        No community links available yet
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Students List */}
            <div className="rounded-xl p-6 border border-border bg-card transition-colors duration-200">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-bold text-foreground">Group Members</h3>

                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4 text-muted-foreground" />
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as 'name' | 'completion')}
                    className="px-3 py-1 rounded-lg border border-border bg-background text-sm text-foreground"
                  >
                    <option value="name">Sort by Name</option>
                    <option value="completion">Sort by Progress</option>
                  </select>
                </div>
              </div>

              {loading && (
                <div className="flex items-center justify-center py-12">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2" />
                    <p className="text-sm text-muted-foreground">Loading community...</p>
                  </div>
                </div>
              )}

              {!loading && sortedStudents.length === 0 && (
                <EmptyState
                  icon={Users}
                  title="No classmates yet"
                  description="Group members will appear here once others join your batch."
                />
              )}

              {!loading && sortedStudents.length > 0 && (
                <div className="space-y-4">
                  {sortedStudents.map((student) => (
                    <div
                      key={student.id}
                      className="p-4 rounded-lg border border-border bg-muted/50 transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <Avatar name={student.name} size="lg" />

                          <div className="flex-1">
                            <h4 className="font-semibold text-foreground">{student.name}</h4>
                            <div className="text-sm text-muted-foreground">
                              {student.degree} {student.subject} • {student.year}
                            </div>
                            <div className="text-sm text-muted-foreground">{student.institute}</div>
                          </div>

                          <a
                            href={`mailto:${student.email}`}
                            onClick={() => {
                              posthog?.capture('student_contact_clicked', {
                                user_id: databaseUserId,
                                contact_type: 'email',
                                student_email: student.email,
                                student_name: student.name,
                                clicked_at: new Date().toISOString(),
                              });
                            }}
                            className="p-2 rounded-lg transition-colors text-muted-foreground hover:bg-muted hover:text-foreground"
                          >
                            <Mail className="w-4 h-4" />
                          </a>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="text-center">
                            <div className="text-sm font-medium text-foreground">
                              Week {student.completedWeeks}/6
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {student.progressPercentage}% Complete
                            </div>
                            <div className="progress-track mt-1 h-2 w-20 rounded-full">
                              <div
                                className="progress-fill h-2 rounded-full transition-all duration-300"
                                style={{ width: `${student.progressPercentage}%` }}
                              />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};
