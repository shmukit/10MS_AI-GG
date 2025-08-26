import React, { useState, useEffect } from 'react';
import { Moon, Sun, User } from 'lucide-react';
import { LoginPage } from './components/Auth/LoginPage';
import { ProfilePage } from './components/Profile/ProfilePage';
import { MentorDashboard } from './components/Mentor/MentorDashboard';
import { RoadmapInterface } from './components/Roadmap/RoadmapInterface';
import { CommunityPage } from './components/Community/CommunityPage';
import { NoticeBoard } from './components/NoticeBoard/NoticeBoard';
import { ConfirmationModal } from './components/ConfirmationModal/ConfirmationModal';
import { AuthProvider, useAuthContext } from './lib';
import { supabase } from './lib/supabase';

function AppContent() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState<'student' | 'mentor'>('student');
  const [showRoadmap, setShowRoadmap] = useState(false);
  const [showCommunity, setShowCommunity] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showMentorDashboard, setShowMentorDashboard] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Test database connection
  useEffect(() => {
    const testConnection = async () => {
      try {
        console.log('Testing Supabase connection...');
        const { data, error } = await supabase.from('users').select('count').limit(1);
        if (error) {
          console.error('Database connection failed:', error);
        } else {
          console.log('✅ Database connection successful!');
        }
      } catch (err) {
        console.error('Connection test error:', err);
      }
    };
    
    testConnection();
  }, []);

  const handleLogin = (role: 'student' | 'mentor') => {
    setUserRole(role);
    setIsLoggedIn(true);
    if (role === 'mentor') {
      setShowMentorDashboard(true);
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setShowRoadmap(false);
    setShowCommunity(false);
    setShowProfile(false);
    setShowMentorDashboard(false);
  };

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle('dark');
  };

  const handleMarkAsDone = () => {
    setShowConfirmation(true);
  };

  const handleConfirmTask = () => {
    // Handle task completion logic here
    console.log('Task marked as completed');
    setShowConfirmation(false);
  };

  // Show login page if not logged in
  if (!isLoggedIn) {
    return <LoginPage onLogin={handleLogin} isDarkMode={isDarkMode} />;
  }

  // Show mentor dashboard if mentor is logged in
  if (userRole === 'mentor' && showMentorDashboard) {
    return (
      <MentorDashboard 
        onBack={() => setShowMentorDashboard(false)} 
        onLogout={handleLogout}
        onProfile={() => setShowProfile(true)}
        isDarkMode={isDarkMode} 
        toggleDarkMode={toggleDarkMode} 
      />
    );
  }

  // Show profile page
  if (showProfile) {
    return <ProfilePage onBack={() => setShowProfile(false)} userRole={userRole} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
  }

  // Show roadmap page
  if (showRoadmap) {
    return <RoadmapInterface onBack={() => setShowRoadmap(false)} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
  }

  // Show community page
  if (showCommunity) {
    return <CommunityPage onBack={() => setShowCommunity(false)} isDarkMode={isDarkMode} toggleDarkMode={toggleDarkMode} />;
  }

  // Main dashboard
  return (
    <div className={`min-h-screen transition-colors duration-200 ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-100'}`}>
      {/* Header */}
      <div className={`border-b h-16 transition-colors duration-200 ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xs">10MS</span>
              </div>
              <h1 className={`text-xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>10MS SheSTEM</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={toggleDarkMode}
                className={`p-2 rounded-lg transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 text-yellow-400 hover:bg-gray-600' 
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <div className="flex items-center gap-2">
                <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Amira K.</span>
                <button
                  onClick={() => setShowProfile(true)}
                  className="w-8 h-8 bg-gray-300 rounded-full hover:bg-gray-400 transition-colors"
                ></button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Welcome Section */}
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
              <div>
                <h2 className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Good afternoon, Amira</h2>
                <p className={`transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>Revenue Cycle Management Specialist, Augmedix Roadmap</p>
              </div>
            </div>

            {/* Navigation Cards */}
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={() => setShowRoadmap(true)}
                className={`border rounded-xl p-4 text-center transition-colors group ${
                  isDarkMode 
                    ? 'bg-green-900/20 border-green-800 hover:bg-green-900/30' 
                    : 'bg-green-50 border-green-200 hover:bg-green-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-blue-500 group-hover:bg-blue-600' 
                    : 'bg-blue-600 group-hover:bg-blue-700'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 13l-6-3" />
                  </svg>
                </div>
                <span className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Roadmap</span>
              </button>

              <button
                onClick={() => setShowCommunity(true)}
                className={`border rounded-xl p-4 text-center transition-colors group ${
                  isDarkMode 
                    ? 'bg-green-900/20 border-green-800 hover:bg-green-900/30' 
                    : 'bg-green-50 border-green-200 hover:bg-green-100'
                }`}
              >
                <div className={`w-12 h-12 rounded-xl mx-auto mb-3 flex items-center justify-center transition-colors ${
                  isDarkMode 
                    ? 'bg-purple-500 group-hover:bg-purple-600' 
                    : 'bg-purple-600 group-hover:bg-purple-700'
                }`}>
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <span className={`text-sm font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Community</span>
              </button>
            </div>

            {/* This Week's Tasks */}
            {/* Tasks Section - Side by Side */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* This Week's Tasks */}
              <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <h3 className={`text-lg font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>This Week's Tasks</h3>
                <div className="mb-4">
                  <p className={`mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-300' : 'text-gray-700'}`}>AI suggests: "Watch a 7-min video on Python loops and write 2 examples."</p>
                  <span className="inline-flex items-center gap-1 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded">
                    ⚡ AI-generated
                  </span>
                </div>
                
                <div className={`rounded-lg p-4 mb-4 transition-colors duration-200 ${
                  isDarkMode ? 'bg-green-900/20' : 'bg-green-50'
                }`}>
                  <div className="flex justify-between items-start mb-2">
                    <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Create two loop examples in your notes</h4>
                    <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Due</span>
                  </div>
                </div>

                <button 
                  onClick={handleMarkAsDone}
                  className={`w-full py-3 px-4 rounded-xl font-medium transition-colors ${
                    isDarkMode 
                      ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  ✓ Mark as Done
                </button>
              </div>

              {/* Upcoming Tasks */}
              <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
                isDarkMode 
                  ? 'bg-gray-800 border-gray-700' 
                  : 'bg-white border-gray-200'
              }`}>
                <div className="flex justify-between items-center mb-4">
                  <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Upcoming</h3>
                  <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>This week</span>
                </div>
                
                <div className="space-y-3">
                  <div className={`rounded-lg p-4 border transition-colors duration-200 ${
                    isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📝</span>
                        <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Submit Milestone 2 quiz</h4>
                      </div>
                      <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Week 2</span>
                    </div>
                  </div>

                  <div className={`rounded-lg p-4 border transition-colors duration-200 ${
                    isDarkMode ? 'bg-green-900/20 border-green-800' : 'bg-green-50 border-green-200'
                  }`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm">📝</span>
                        <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Peer review: Project proposal</h4>
                      </div>
                      <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>Week 2</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* Roadmap Section */}
            <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`text-lg font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Roadmap</h3>
                <div className="flex gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm transition-colors duration-200 ${
                    isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-700'
                  }`}>All</span>
                  <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">Active</span>
                  <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">Completed</span>
                </div>
              </div>

              <div className="space-y-3">
                <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-green-900/20 border-green-800' 
                    : 'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div>
                      <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Milestone 2 • Python Basics</h4>
                    </div>
                  </div>
                  <span className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>4/8</span>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-blue-900/20 border-blue-800' 
                    : 'bg-blue-50 border-blue-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">⚡</span>
                    </div>
                    <div>
                      <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Experiment • Build a number guesser</h4>
                    </div>
                  </div>
                  <span className="text-sm text-gray-600 bg-blue-100 px-2 py-1 rounded">Exercise</span>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-lg border transition-colors duration-200 ${
                  isDarkMode 
                    ? 'bg-gray-700 border-gray-600' 
                    : 'bg-gray-50 border-gray-200'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 border-2 rounded-full transition-colors duration-200 ${
                      isDarkMode ? 'border-gray-500' : 'border-gray-300'
                    }`}></div>
                    <div>
                      <h4 className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Reading • Variables and Types</h4>
                    </div>
                  </div>
                  <span className={`text-sm px-2 py-1 rounded transition-colors duration-200 ${
                    isDarkMode ? 'text-gray-300 bg-gray-600' : 'text-gray-600 bg-gray-100'
                  }`}>Resource</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Days Streaks */}
            <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex justify-between items-center mb-4">
                <h3 className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Week Streaks</h3>
                <div className={`flex items-center gap-4 text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Done</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-red-500 rounded-full flex items-center justify-center">
                      <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <span>Incomplete</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <div className="w-3 h-3 bg-blue-500 rounded-full border-2 border-blue-300"></div>
                    <span>Current</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                {['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'].map((week, index) => (
                  <div key={week} className="text-center">
                    <div className={`text-xs mb-2 transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>{week}</div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center relative ${
                      index < 2 ? 'bg-green-100' :
                      index === 2 ? 'bg-blue-100 border-2 border-blue-500' :
                      index === 5 ? 'bg-red-100' :
                      isDarkMode ? 'bg-gray-700' : 'bg-gray-100'
                    }`}>
                      {index < 2 && (
                        <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      )}
                      {index === 2 && <div className="w-3 h-3 bg-blue-500 rounded-full" />}
                      {index === 5 && (
                        <svg className="w-4 h-4 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice Board */}
            <NoticeBoard isDarkMode={isDarkMode} />

            {/* Next Zoom Call */}
            <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className={`font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Next Zoom Call</h3>
                  <p className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Mentor: Uttam Deb</p>
                </div>
              </div>
              
              <div className="mb-4">
                <div className={`text-2xl font-bold transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Thu, 3:30 PM</div>
                <div className={`text-sm transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>September 12, 2025</div>
              </div>

              <button className={`w-full py-3 px-4 rounded-xl font-medium transition-colors flex items-center justify-center gap-2 ${
                isDarkMode 
                  ? 'bg-blue-500 hover:bg-blue-600 text-white' 
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              }`}>
                📹 Join Zoom
              </button>
            </div>

            {/* Mentors */}
            <div className={`rounded-xl p-6 shadow-sm border transition-colors duration-200 ${
              isDarkMode 
                ? 'bg-gray-800 border-gray-700' 
                : 'bg-white border-gray-200'
            }`}>
              <h3 className={`font-bold mb-4 transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Mentors</h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                    <div>
                      <div className={`font-medium transition-colors duration-200 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>Uttam Deb</div>
                      <div className={`text-xs transition-colors duration-200 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>Senior BI Executive, 10 Minute School</div>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
                    }`}>Python</span>
                    <span className={`text-xs px-2 py-1 rounded transition-colors duration-200 ${
                      isDarkMode ? 'text-gray-300 bg-gray-700' : 'text-gray-600 bg-gray-100'
                    }`}>SQL</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        <ConfirmationModal
          isOpen={showConfirmation}
          onClose={() => setShowConfirmation(false)}
          onConfirm={handleConfirmTask}
          title="Confirm Task Completion"
          message="Are you sure you have completed this task? Please double-check before confirming as this will mark the task as done and update your progress."
          isDarkMode={isDarkMode}
        />
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;