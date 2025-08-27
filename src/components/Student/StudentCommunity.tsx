import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Users, MessageCircle, ExternalLink, AlertCircle, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../lib/useAuth';
import { DatabaseService, Batch, User } from '../../services/database';

export const StudentCommunity: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [batch, setBatch] = useState<Batch | null>(null);
  const [mentors, setMentors] = useState<User[]>([]);
  const [students, setStudents] = useState<User[]>([]);

  useEffect(() => {
    const fetchCommunityData = async () => {
      if (!user?.id) return;
      
      try {
        setLoading(true);
        setError(null);
        
        const batchData = await DatabaseService.getStudentBatch(user.id);
        if (!batchData) {
          setError('You are not assigned to any batch yet');
          return;
        }
        
        setBatch(batchData);
        
        const mentorsData = await DatabaseService.getMentors(batchData.id);
        setMentors(mentorsData);
        
        // For now, we'll set empty students array
        // You'd need to implement getStudentsByBatch in DatabaseService
        setStudents([]);
        
      } catch (err) {
        console.error('Error fetching community data:', err);
        setError('Failed to load community data');
      } finally {
        setLoading(false);
      }
    };

    fetchCommunityData();
  }, [user?.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Loading community...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-red-600" />
              <div>
                <h3 className="text-red-800 font-medium">Error Loading Community</h3>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!batch) {
    return (
      <div className="min-h-screen bg-gray-100 p-6">
        <div className="max-w-6xl mx-auto">
          <button
            onClick={() => navigate('/student/dashboard')}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </button>
          
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 text-yellow-600" />
              <div>
                <h3 className="text-yellow-800 font-medium">No Batch Assignment</h3>
                <p className="text-yellow-600 text-sm">
                  You haven't been assigned to a batch yet. Please contact your administrator.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <button
          onClick={() => navigate('/student/dashboard')}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </button>
        
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Student Community</h1>
        
        {/* Batch Information */}
        <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Users className="w-8 h-8 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">{batch.name}</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{batch.current_students}</div>
              <div className="text-sm text-gray-600">Current Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">{batch.max_students}</div>
              <div className="text-sm text-gray-600">Max Students</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">{batch.status}</div>
              <div className="text-sm text-gray-600">Status</div>
            </div>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
            <Calendar className="w-4 h-4" />
            <span>Started: {new Date(batch.start_date).toLocaleDateString()}</span>
            {batch.end_date && (
              <>
                <span>•</span>
                <span>Ends: {new Date(batch.end_date).toLocaleDateString()}</span>
              </>
            )}
          </div>
        </div>

        {/* Communication Channels */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {batch.whatsapp_link && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
                <h3 className="text-lg font-semibold text-gray-900">WhatsApp Group</h3>
              </div>
              <p className="text-gray-600 mb-4">Join our WhatsApp group for quick updates and discussions.</p>
              <a
                href={batch.whatsapp_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Join Group
              </a>
            </div>
          )}

          {batch.discord_link && (
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <MessageCircle className="w-6 h-6 text-purple-600" />
                <h3 className="text-lg font-semibold text-gray-900">Discord Server</h3>
              </div>
              <p className="text-gray-600 mb-4">Connect with fellow students on our Discord server.</p>
              <a
                href={batch.discord_link}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
              >
                <ExternalLink className="w-4 h-4" />
                Join Server
              </a>
            </div>
          )}
        </div>

        {/* Mentors */}
        {mentors.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Your Mentors</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {mentors.map((mentor) => (
                <div key={mentor.id} className="border rounded-lg p-4">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-12 h-12 bg-gray-300 rounded-full flex items-center justify-center">
                      <Users className="w-6 h-6 text-gray-600" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">
                        {mentor.first_name} {mentor.last_name}
                      </h4>
                      <p className="text-sm text-gray-600">Mentor</p>
                    </div>
                  </div>
                  {batch.emergency_contact && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>Emergency: {batch.emergency_contact}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* No Community Channels Message */}
        {!batch.whatsapp_link && !batch.discord_link && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
            <div className="text-center">
              <MessageCircle className="w-12 h-12 text-yellow-600 mx-auto mb-3 opacity-50" />
              <h3 className="text-yellow-800 font-medium mb-2">No Community Channels Available</h3>
              <p className="text-yellow-600 text-sm">
                Community channels haven't been set up for your batch yet. Please check back later or contact your mentor.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
