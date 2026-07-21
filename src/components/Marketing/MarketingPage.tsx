import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import { DatabaseService } from '../../services/database';
import { MarketingPageData } from '../../services/db/marketingService';
import { MotionDiv, HoverLift, STAGGER_CHILDREN_VARIANTS, SLIDE_UP_VARIANTS } from '../ui/MotionPrimitives';
import { AppLogo } from '../Logo/AppLogo';
import { cn } from '../../lib/utils';

export const MarketingPage: React.FC = () => {
    const navigate = useNavigate();
    const [data, setData] = useState<MarketingPageData | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'ongoing' | 'expired'>('ongoing');
    const { isDarkMode, toggleDarkMode } = useTheme();

    useEffect(() => {
        DatabaseService.getMarketingData()
            .then(setData)
            .catch(console.error)
            .finally(() => setLoading(false));
    }, []);

    const ongoingRoadmaps = (data?.roadmaps || [])
        .map((r) => ({
            ...r,
            batches: r.batches.filter((b) => b.status === 'active'),
        }))
        .filter((r) => r.batches.length > 0);

    const expiredRoadmaps = (data?.roadmaps || [])
        .map((r) => ({
            ...r,
            batches: r.batches.filter((b) => b.status === 'completed' || b.status === 'cancelled'),
        }))
        .filter((r) => r.batches.length > 0);

    const displayRoadmaps = activeTab === 'ongoing' ? ongoingRoadmaps : expiredRoadmaps;

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="w-10 h-10 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground">
            <nav className="fixed top-0 w-full z-50 bg-card border-b border-border shadow-nav">
                <div className="mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-10 max-w-content">
                    <button onClick={() => navigate('/')} className="bg-transparent border-none cursor-pointer p-0">
                        <AppLogo layout="full" />
                    </button>

                    <div className="flex items-center gap-3">
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center justify-center w-9 h-9 rounded-full bg-muted text-muted-foreground hover:text-foreground hover:bg-accent border border-border transition-colors"
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        <button
                            onClick={() => navigate('/login')}
                            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors bg-transparent border-none cursor-pointer"
                        >
                            Sign In
                        </button>

                        <button
                            onClick={() => navigate('/signup')}
                            className="bg-primary text-primary-foreground rounded-full border-none px-5 py-2.5 text-sm font-semibold cursor-pointer hover:bg-primary/90 hover:-translate-y-px hover:shadow-btn-hover transition-all duration-180"
                        >
                            Join Now
                        </button>
                    </div>
                </div>
            </nav>

            <section className="pt-32 pb-20 px-4 text-center">
                <div className="mx-auto max-w-content">
                    <MotionDiv variants={SLIDE_UP_VARIANTS}>
                        <span className="inline-block px-3.5 py-1 bg-accent text-accent-foreground border border-border rounded-full text-xs font-semibold tracking-wide uppercase mb-6">
                            Cohort roadmaps · Guided by mentors
                        </span>

                        <h1 className="text-[clamp(2.25rem,6vw,3.5rem)] font-extrabold leading-tight tracking-tight text-foreground mb-5">
                            Master Your Career with<br />
                            <span className="text-primary">Expert-led Roadmaps</span>
                        </h1>

                        <p className="text-base text-muted-foreground max-w-lg mx-auto mb-9 leading-relaxed">
                            Choose from a variety of roadmaps, get mentored by industry experts,
                            and join a community of passionate learners.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            <button
                                onClick={() => document.getElementById('roadmaps')?.scrollIntoView({ behavior: 'smooth' })}
                                className="inline-flex items-center gap-2 bg-primary text-primary-foreground rounded-full border-none px-7 py-4 text-sm font-semibold cursor-pointer hover:bg-primary/90 hover:-translate-y-px hover:shadow-btn-hover transition-all duration-180"
                            >
                                View Roadmaps <ArrowRight size={16} />
                            </button>

                            <button
                                onClick={() => document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' })}
                                className="bg-transparent text-foreground rounded-full border border-border px-7 py-3.5 text-sm font-medium cursor-pointer hover:bg-muted transition-colors"
                            >
                                Meet Mentors
                            </button>
                        </div>
                    </MotionDiv>
                </div>
            </section>

            <section id="roadmaps" className="py-20 px-4 bg-card">
                <div className="mx-auto max-w-content">
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 className="text-[28px] font-bold text-foreground mb-1.5">Available Roadmaps</h2>
                            <p className="text-sm text-muted-foreground">Structured learning paths designed for success.</p>
                        </div>

                        <div className="flex p-1 bg-muted rounded-[10px] gap-1">
                            {(['ongoing', 'expired'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    className={cn(
                                        'px-4 py-2 rounded-[10px] text-[13px] font-medium transition-colors border-none cursor-pointer',
                                        activeTab === tab
                                            ? 'bg-card text-primary shadow-nav'
                                            : 'bg-transparent text-muted-foreground'
                                    )}
                                >
                                    {tab === 'ongoing' ? 'Upcoming & Ongoing' : 'Past Batches'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <MotionDiv variants={STAGGER_CHILDREN_VARIANTS} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayRoadmaps.length === 0 ? (
                            <p className="col-span-full text-center text-sm text-muted-foreground py-12">
                                {activeTab === 'ongoing'
                                    ? 'No upcoming or ongoing batches right now.'
                                    : 'No past batches to show yet.'}
                            </p>
                        ) : null}
                        {displayRoadmaps.map((roadmap) => (
                            <HoverLift key={roadmap.id}>
                                <div className="h-full flex flex-col bg-card border border-border rounded-2xl overflow-hidden">
                                    <div className="p-4 flex-1">
                                        <div className="flex justify-between items-start mb-3">
                                            <span className="px-2.5 py-0.5 rounded-full bg-accent text-accent-foreground text-[11px] font-semibold">
                                                {roadmap.category}
                                            </span>
                                            <span className="text-[11px] text-muted-foreground">
                                                {roadmap.difficulty_level} · {roadmap.total_weeks}w
                                            </span>
                                        </div>

                                        <h3 className="text-[15px] font-semibold text-foreground mb-1.5 leading-snug">
                                            {roadmap.title}
                                        </h3>
                                        <p className="text-[13px] text-muted-foreground leading-relaxed line-clamp-2">
                                            {roadmap.description}
                                        </p>

                                        <div className="mt-4 flex flex-col gap-2">
                                            {roadmap.batches.map(batch => (
                                                <div key={batch.id} className="p-2.5 bg-muted rounded-[10px]">
                                                    <div className="flex justify-between items-center mb-2">
                                                        <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                                                            {batch.name}
                                                        </span>
                                                        <span className={cn(
                                                            'px-2 py-0.5 rounded-full text-[10px] font-semibold',
                                                            batch.status === 'active'
                                                                ? 'bg-accent text-accent-foreground'
                                                                : 'bg-muted text-muted-foreground'
                                                        )}>
                                                            {batch.status === 'active' ? 'Ongoing' : 'Completed'}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <div className="flex mr-1">
                                                            {batch.mentors.slice(0, 3).map(mentor => (
                                                                <img
                                                                    key={mentor.id}
                                                                    src={mentor.profile_picture_url || `https://ui-avatars.com/api/?name=${mentor.first_name}+${mentor.last_name}&background=D0FAD0&color=086347`}
                                                                    className="w-7 h-7 rounded-full object-cover border-2 border-card -ml-1.5 first:ml-0"
                                                                    title={`${mentor.first_name} ${mentor.last_name}`}
                                                                    alt={mentor.first_name}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                                                            <Users size={11} /> {batch.current_students}/{batch.max_students} · {new Date(batch.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="px-4 py-3 border-t border-border">
                                        <button
                                            onClick={() => navigate('/signup')}
                                            className="w-full py-3 bg-primary text-primary-foreground rounded-full border-none text-[13px] font-semibold cursor-pointer hover:bg-primary/90 hover:-translate-y-px transition-all duration-180"
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

            <section id="mentors" className="py-20 px-4 bg-background">
                <div className="mx-auto max-w-content">
                    <div className="text-center mb-14">
                        <h2 className="text-[28px] font-bold text-foreground mb-2">Guided by Industry Experts</h2>
                        <p className="text-sm text-muted-foreground">
                            Learn from professionals working at top global companies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {(data?.mentors.length ?? 0) === 0 ? (
                            <p className="col-span-full text-center text-sm text-muted-foreground py-8">
                                Mentor profiles will appear here once assigned to cohorts.
                            </p>
                        ) : null}
                        {data?.mentors.map((mentor) => (
                            <HoverLift key={mentor.id}>
                                <div className="bg-card border border-border rounded-2xl p-6 text-center">
                                    <img
                                        src={mentor.profile_picture_url || `https://ui-avatars.com/api/?name=${mentor.first_name}+${mentor.last_name}&background=D0FAD0&color=086347`}
                                        alt={mentor.first_name}
                                        className="w-20 h-20 rounded-full object-cover mx-auto mb-3 border-[3px] border-accent"
                                    />
                                    <h3 className="text-[15px] font-semibold text-foreground mb-0.5">
                                        {mentor.first_name} {mentor.last_name}
                                    </h3>
                                    <p className="text-xs text-primary font-medium mb-0.5">
                                        {mentor.mentor_profiles?.[0]?.designation || 'Expert Mentor'}
                                    </p>
                                    <p className="text-[11px] text-muted-foreground uppercase tracking-wide mb-4">
                                        {mentor.mentor_profiles?.[0]?.organization || '10 Minute School'}
                                    </p>

                                    <div className="border-t border-border pt-3.5">
                                        <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-widest mb-2">
                                            Mentoring in
                                        </p>
                                        <div className="flex flex-wrap justify-center gap-1.5">
                                            {mentor.roadmaps.slice(0, 2).map(r => (
                                                <span key={r.id} className="text-[10px] px-2 py-0.5 bg-muted text-muted-foreground rounded-md">
                                                    {r.title}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </HoverLift>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 px-4 bg-muted border-y border-border">
                <div className="mx-auto max-w-content">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: `${data?.roadmaps.length || 0}+`, label: 'Specialized Roadmaps' },
                            { value: `${data?.mentors.length || 0}+`, label: 'Expert Mentors' },
                            { value: `${(data?.stats.activeBatches ?? 0).toLocaleString()}+`, label: 'Active Batches' },
                            { value: `${Math.round(data?.stats.avgCompletionRate ?? 0)}%`, label: 'Avg completion (active learners)' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <div className="text-4xl font-extrabold text-primary tracking-tight">{stat.value}</div>
                                <div className="text-sm text-muted-foreground font-medium mt-1.5">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="bg-card border-t border-border py-10 px-4">
                <div className="mx-auto max-w-content flex flex-col md:flex-row justify-between items-center gap-6">
                    <AppLogo layout="full" />
                    <p className="text-sm text-muted-foreground">© 2026 10 Minute School. All rights reserved.</p>
                    {[
                        { label: 'Privacy Policy', url: import.meta.env.VITE_PRIVACY_POLICY_URL as string | undefined },
                        { label: 'Terms of Service', url: import.meta.env.VITE_TERMS_OF_SERVICE_URL as string | undefined },
                    ].filter((link) => link.url).length > 0 && (
                        <div className="flex gap-6">
                            {[
                                { label: 'Privacy Policy', url: import.meta.env.VITE_PRIVACY_POLICY_URL as string | undefined },
                                { label: 'Terms of Service', url: import.meta.env.VITE_TERMS_OF_SERVICE_URL as string | undefined },
                            ]
                                .filter((link) => link.url)
                                .map((link) => (
                                    <a
                                        key={link.label}
                                        href={link.url}
                                        className="text-sm text-muted-foreground hover:text-primary no-underline transition-colors"
                                    >
                                        {link.label}
                                    </a>
                                ))}
                        </div>
                    )}
                </div>
            </footer>
        </div>
    );
};
