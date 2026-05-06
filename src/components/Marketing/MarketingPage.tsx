import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Users,
    BookOpen,
    Calendar,
    ArrowRight,
    CheckCircle,
    Clock,
    User as UserIcon,
    ChevronRight,
    Monitor,
    Layout,
    Star,
    Sun,
    Moon
} from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import { DatabaseService } from '../../services/database';
import { MarketingPageData, RoadmapMarketingData } from '../../services/db/marketingService';
import {
    MotionDiv,
    HoverScale,
    HoverLift,
    STAGGER_CHILDREN_VARIANTS,
    SLIDE_UP_VARIANTS,
    cn
} from '../ui/MotionPrimitives';
import { SheSTEMLogo } from '../Logo/SheSTEMLogo';

export const MarketingPage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<MarketingPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ongoing' | 'expired'>('ongoing');
    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const marketingData = await DatabaseService.getMarketingData();
                console.log('Marketing data fetched:', marketingData);
                setData(marketingData);
            } catch (error) {
                console.error('Error fetching marketing data:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const ongoingRoadmaps = data?.roadmaps.filter(r =>
        r.batches.length === 0 || r.batches.some(b => b.status === 'active')
    ) || [];

    const expiredRoadmaps = data?.roadmaps.filter(r =>
        r.batches.some(b => b.status === 'completed') && !r.batches.some(b => b.status === 'active')
    ) || [];

    const displayRoadmaps = activeTab === 'ongoing' ? ongoingRoadmaps : expiredRoadmaps;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-zinc-950">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-transparent dark:bg-gradient-to-br dark:from-[#0f172a] dark:via-[#2e1065] dark:to-[#0f172a] text-gray-900 dark:text-gray-100 selection:bg-blue-100 dark:selection:bg-blue-900/30">
            <div className="bg-gray-50/50 dark:bg-transparent min-h-screen">
                {/* Navigation */}
                <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md border-b border-gray-200 dark:border-zinc-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16 items-center">
                            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate('/')}>
                                <SheSTEMLogo className="scale-90" />
                            </div>
                            <div className="flex items-center gap-4">
                                <button
                                    onClick={toggleDarkMode}
                                    className="p-2 rounded-lg bg-gray-100 dark:bg-zinc-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-zinc-700 transition-colors"
                                    title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                >
                                    {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                                </button>
                                <button
                                    onClick={() => navigate('/login')}
                                    className="text-sm font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                                >
                                    Sign In
                                </button>
                                <HoverScale>
                                    <button
                                        onClick={() => navigate('/signup')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-shadow shadow-lg shadow-blue-500/20"
                                    >
                                        Join Now
                                    </button>
                                </HoverScale>
                            </div>
                        </div>
                    </div>
                </nav>

                {/* Hero Section */}
                <section className="pt-32 pb-20 px-4">
                    <div className="max-w-7xl mx-auto text-center">
                        <MotionDiv variants={SLIDE_UP_VARIANTS}>
                            <span className="px-3 py-1 text-xs font-semibold tracking-wider text-blue-600 uppercase bg-blue-100 dark:bg-blue-900/30 dark:text-blue-400 rounded-full">
                                Empowering Women in STEM
                            </span>
                            <h1 className="mt-6 text-4xl md:text-6xl font-extrabold tracking-tight">
                                Master Your Career with <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Expert-led Roadmaps</span>
                            </h1>
                            <p className="mt-6 text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
                                Choose from a variety of roadmaps, get mentored by industry experts, and join a community of passionate learners.
                            </p>
                            <div className="mt-10 flex flex-col sm:flex-row justify-center gap-4">
                                <HoverScale>
                                    <button
                                        onClick={() => document.getElementById('roadmaps')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="px-8 py-4 bg-gradient-to-r from-[#8B5CF6] to-[#2563eb] text-white font-bold rounded-2xl hover:shadow-xl transition-all shadow-lg flex items-center gap-2 group transform hover:scale-[1.05]"
                                    >
                                        View Roadmaps <ArrowRight className="w-4 h-4" />
                                    </button>
                                </HoverScale>
                                <HoverScale>
                                    <button
                                        onClick={() => document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' })}
                                        className="w-full sm:w-auto px-8 py-3 bg-white dark:bg-zinc-800 border border-gray-200 dark:border-zinc-700 rounded-xl font-semibold hover:bg-gray-50 dark:hover:bg-zinc-700 transition-colors"
                                    >
                                        Meet Mentors
                                    </button>
                                </HoverScale>
                            </div>
                        </MotionDiv>
                    </div>
                </section>

                {/* Roadmaps Section */}
                <section className="py-20 bg-white dark:bg-zinc-900" id="roadmaps">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                            <div>
                                <h2 className="text-3xl font-bold">Available Roadmaps</h2>
                                <p className="mt-2 text-gray-600 dark:text-gray-400">Structured learning paths designed for success.</p>
                            </div>

                            <div className="flex p-1 bg-gray-100 dark:bg-zinc-800 rounded-xl w-fit">
                                <button
                                    onClick={() => setActiveTab('ongoing')}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        activeTab === 'ongoing' ? "bg-white dark:bg-zinc-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                    )}
                                >
                                    Upcoming & Ongoing
                                </button>
                                <button
                                    onClick={() => setActiveTab('expired')}
                                    className={cn(
                                        "px-4 py-2 rounded-lg text-sm font-medium transition-all",
                                        activeTab === 'expired' ? "bg-white dark:bg-zinc-700 shadow-sm text-blue-600 dark:text-blue-400" : "text-gray-500 hover:text-gray-700 dark:text-gray-400"
                                    )}
                                >
                                    Past Batches
                                </button>
                            </div>
                        </div>

                        <MotionDiv
                            variants={STAGGER_CHILDREN_VARIANTS}
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
                        >
                            {displayRoadmaps.map((roadmap) => (
                                <HoverLift key={roadmap.id} className="group">
                                    <div className="h-full flex flex-col bg-gray-50 dark:bg-white/5 border border-gray-100 dark:border-white/10 rounded-2xl overflow-hidden group-hover:border-[var(--primary-accent)]/50 transition-colors">
                                        <div className="p-6 flex-1">
                                            <div className="flex justify-between items-start mb-4">
                                                <span className="px-2.5 py-0.5 text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-full">
                                                    {roadmap.category}
                                                </span>
                                                <div className="flex items-center text-xs text-gray-500 truncate max-w-[150px]">
                                                    <span className="mr-1 capitalize">{roadmap.difficulty_level}</span>
                                                    <span>• {roadmap.total_weeks} Weeks</span>
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                                {roadmap.title}
                                            </h3>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {roadmap.description}
                                            </p>

                                            <div className="mt-6 space-y-4">
                                                {roadmap.batches.map(batch => (
                                                    <div key={batch.id} className="p-3 bg-white dark:bg-white/5 rounded-xl border border-gray-50 dark:border-white/5">
                                                        <div className="flex justify-between items-center mb-2">
                                                            <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">{batch.name}</span>
                                                            <span className={cn(
                                                                "text-[10px] px-2 py-0.5 rounded-full font-medium",
                                                                batch.status === 'active' ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300" : "bg-gray-100 dark:bg-zinc-700 text-gray-600 dark:text-gray-400"
                                                            )}>
                                                                {batch.status === 'active' ? 'Ongoing' : 'Completed'}
                                                            </span>
                                                        </div>

                                                        <div className="flex items-center gap-3">
                                                            <div className="flex -space-x-2">
                                                                {batch.mentors.slice(0, 3).map(mentor => (
                                                                    <img
                                                                        key={mentor.id}
                                                                        src={mentor.profile_picture_url || `https://ui-avatars.com/api/?name=${mentor.first_name}+${mentor.last_name}&background=random`}
                                                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 object-cover"
                                                                        title={`${mentor.first_name} ${mentor.last_name}`}
                                                                    />
                                                                ))}
                                                                {batch.mentors.length > 3 && (
                                                                    <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-gray-100 dark:bg-zinc-700 flex items-center justify-center text-[10px] font-bold">
                                                                        +{batch.mentors.length - 3}
                                                                    </div>
                                                                )}
                                                            </div>
                                                            <div className="text-[11px] text-gray-500">
                                                                <span className="block font-medium dark:text-gray-300">
                                                                    {batch.mentors.map(m => m.first_name).join(', ')}
                                                                </span>
                                                                <div className="flex items-center gap-2 mt-0.5">
                                                                    <span className="flex items-center gap-0.5"><Users className="w-3 h-3" /> {batch.current_students}/{batch.max_students} Seats</span>
                                                                    <span>• {new Date(batch.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}</span>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gray-100 dark:bg-zinc-800/80 border-t border-gray-200 dark:border-zinc-700">
                                            <button
                                                onClick={() => navigate('/signup')}
                                                className="w-full py-3 bg-gradient-to-r from-[#8B5CF6] to-[#2563eb] hover:from-[#7c3aed] hover:to-[#1d4ed8] text-white font-bold rounded-xl text-sm transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02]"
                                            >
                                                Join Roadmap
                                            </button>
                                        </div>
                                    </div>
                                </HoverLift>
                            ))}
                        </MotionDiv>
                    </div>
                </section>

                {/* Mentors Section */}
                <section className="py-20 bg-gray-50 dark:bg-zinc-950" id="mentors">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl font-bold">Guided by Industry Experts</h2>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">Learn from professionals working at top global companies.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {data?.mentors.map((mentor) => (
                                <HoverLift key={mentor.id}>
                                    <div className="bg-white dark:bg-zinc-900 p-6 rounded-2xl border border-gray-200 dark:border-zinc-800 text-center">
                                        <div className="relative inline-block">
                                            <img
                                                src={mentor.profile_picture_url || `https://ui-avatars.com/api/?name=${mentor.first_name}+${mentor.last_name}&background=random`}
                                                alt={mentor.first_name}
                                                className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-100 dark:border-blue-900/30 object-cover"
                                            />
                                            {mentor.mentor_profiles?.[0]?.expertise_areas?.[0] && (
                                                <div className="absolute -bottom-1 -right-1 bg-blue-600 text-white p-1 rounded-full border-2 border-white dark:border-zinc-900">
                                                    <Star className="w-3 h-3 fill-current" />
                                                </div>
                                            )}
                                        </div>
                                        <h3 className="font-bold text-lg">{mentor.first_name} {mentor.last_name}</h3>
                                        <p className="text-sm text-blue-600 dark:text-blue-400 font-medium lowercase">
                                            {mentor.mentor_profiles?.[0]?.designation || 'Expert Mentor'}
                                        </p>
                                        <p className="mt-2 text-xs text-gray-500 uppercase tracking-wide">
                                            {mentor.mentor_profiles?.[0]?.organization || '10 Minute School'}
                                        </p>

                                        <div className="mt-6 pt-6 border-t border-gray-100 dark:border-zinc-800">
                                            <p className="text-[10px] font-semibold text-gray-400 uppercase tracking-widest mb-3">Mentoring in</p>
                                            <div className="flex flex-wrap justify-center gap-2">
                                                {mentor.roadmaps.slice(0, 2).map(r => (
                                                    <span key={r.id} className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md">
                                                        {r.title}
                                                    </span>
                                                ))}
                                                {mentor.roadmaps.length > 2 && (
                                                    <span className="text-[10px] px-2 py-1 bg-gray-100 dark:bg-zinc-800 rounded-md">
                                                        +{mentor.roadmaps.length - 2} more
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </HoverLift>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-20 bg-gradient-to-r from-[#8B5CF6] to-[#1E3A8A] text-white overflow-hidden relative">
                    {/* Refined Hero visual accents as per instruction */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 overflow-hidden pointer-events-none">
                        <div className="absolute top-[10%] left-[10%] w-[30%] h-[40%] bg-blue-600/10 dark:bg-[#8B5CF6]/20 blur-[120px] rounded-full" />
                        <div className="absolute bottom-[10%] right-[10%] w-[30%] h-[40%] bg-purple-600/10 dark:bg-[#1E3A8A]/20 blur-[120px] rounded-full" />
                    </div>

                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                            <div>
                                <div className="text-4xl font-bold">{data?.roadmaps.length || 0}+</div>
                                <div className="text-blue-100 text-sm mt-2">Specialized Roadmaps</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold">{data?.mentors.length || 0}+</div>
                                <div className="text-blue-100 text-sm mt-2">Expert mentors</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold">2,500+</div>
                                <div className="text-blue-100 text-sm mt-2">Active learners</div>
                            </div>
                            <div>
                                <div className="text-4xl font-bold">95%</div>
                                <div className="text-blue-100 text-sm mt-2">Success rate</div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Footer */}
                <footer className="bg-white dark:bg-zinc-900 border-t border-gray-200 dark:border-zinc-800 py-12 px-4">
                    <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
                        <div className="flex items-center gap-2">
                            <SheSTEMLogo />
                        </div>
                        <p className="text-sm text-gray-500">© 2026 10 Minute School. All rights reserved.</p>
                        <div className="flex gap-6">
                            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Privacy Policy</a>
                            <a href="#" className="text-sm text-gray-500 hover:text-blue-600 transition-colors">Terms of Service</a>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};
