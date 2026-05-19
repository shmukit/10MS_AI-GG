import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, ArrowRight, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../lib/ThemeContext';
import { DatabaseService } from '../../services/database';
import { MarketingPageData } from '../../services/db/marketingService';
import { MotionDiv, HoverLift, STAGGER_CHILDREN_VARIANTS, SLIDE_UP_VARIANTS } from '../ui/MotionPrimitives';
import { AppLogo } from '../Logo/AppLogo';

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

    const ongoingRoadmaps  = data?.roadmaps.filter(r => r.batches.length === 0 || r.batches.some(b => b.status === 'active')) || [];
    const expiredRoadmaps  = data?.roadmaps.filter(r => r.batches.some(b => b.status === 'completed') && !r.batches.some(b => b.status === 'active')) || [];
    const displayRoadmaps  = activeTab === 'ongoing' ? ongoingRoadmaps : expiredRoadmaps;

    // 10MS token shortcuts
    const surface     = isDarkMode ? '#0D1117' : '#FFFFFF';
    const cardBg      = isDarkMode ? '#161D27' : '#FFFFFF';
    const border      = isDarkMode ? '#2D3748' : '#E5E7EB';
    const textPrimary = isDarkMode ? '#F9FAFB' : '#111827';
    const textMuted   = isDarkMode ? '#9CA3AF' : '#6B7280';
    const subtleBg    = isDarkMode ? '#1E2A38' : '#F3F4F6';

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ background: surface }}>
                <div
                    className="w-10 h-10 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: '#1CAB55', borderTopColor: 'transparent' }}
                />
            </div>
        );
    }

    return (
        <div style={{ background: surface, color: textPrimary, minHeight: '100vh' }}>

            {/* ── Navigation — solid surface, nav shadow, NO glassmorphism ── */}
            <nav
                className="fixed top-0 w-full z-50"
                style={{
                    background: cardBg,
                    borderBottom: `1px solid ${border}`,
                    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
                }}
            >
                <div className="mx-auto flex justify-between items-center h-16 px-4 sm:px-6 lg:px-10" style={{ maxWidth: 1200 }}>
                    {/* Logo — full co-brand lockup */}
                    <button onClick={() => navigate('/')} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>
                        <AppLogo layout="full" />
                    </button>

                    <div className="flex items-center gap-3">
                        {/* Dark mode toggle */}
                        <button
                            onClick={toggleDarkMode}
                            className="flex items-center justify-center rounded-full transition-colors"
                            style={{ width: 36, height: 36, background: subtleBg, color: textMuted, border: 'none', cursor: 'pointer' }}
                            aria-label={isDarkMode ? 'Switch to light mode' : 'Switch to dark mode'}
                        >
                            {isDarkMode ? <Sun size={16} /> : <Moon size={16} />}
                        </button>

                        {/* Sign In — link style */}
                        <button
                            onClick={() => navigate('/login')}
                            style={{ background: 'none', border: 'none', cursor: 'pointer', color: textMuted, fontSize: 14, fontWeight: 500, fontFamily: 'Inter, sans-serif' }}
                            onMouseEnter={e => e.currentTarget.style.color = '#149353'}
                            onMouseLeave={e => e.currentTarget.style.color = textMuted}
                        >
                            Sign In
                        </button>

                        {/* Join Now — 10MS primary button (pill) */}
                        <button
                            onClick={() => navigate('/signup')}
                            style={{
                                background: '#1CAB55', color: '#FFFFFF',
                                borderRadius: 999, border: 'none',
                                padding: '10px 22px', fontSize: 14, fontWeight: 600,
                                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                                transition: 'background 150ms, transform 180ms, box-shadow 180ms',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = '#17994B'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
                            onMouseLeave={e => { e.currentTarget.style.background = '#1CAB55'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                        >
                            Join Now
                        </button>
                    </div>
                </div>
            </nav>

            {/* ── Hero ── */}
            <section className="pt-32 pb-20 px-4 text-center">
                <div className="mx-auto" style={{ maxWidth: 1200 }}>
                    <MotionDiv variants={SLIDE_UP_VARIANTS}>
                        {/* Dynamic theme-aware Badge chip */}
                        <span style={{
                            display: 'inline-block', padding: '4px 14px',
                            background: isDarkMode ? 'rgba(99,102,241,0.15)' : '#EEF2FF',
                            color: isDarkMode ? '#A5B4FC' : '#4F46E5',
                            borderRadius: 999, fontSize: 12, fontWeight: 600,
                            fontFamily: 'Inter, sans-serif', letterSpacing: '0.04em',
                            textTransform: 'uppercase', marginBottom: 24,
                        }}>
                            Empowering Women in STEM
                        </span>

                        <h1 style={{
                            fontSize: 'clamp(2.25rem, 6vw, 3.5rem)',
                            fontWeight: 800, lineHeight: 1.2,
                            letterSpacing: '-0.02em',
                            color: textPrimary,
                            fontFamily: 'Inter, sans-serif',
                            marginBottom: 20,
                        }}>
                            Master Your Career with<br />
                            <span style={{ color: '#4F46E5' }}>Expert-led Roadmaps</span>
                        </h1>

                        <p style={{ fontSize: 16, color: textMuted, maxWidth: 520, margin: '0 auto 36px', fontFamily: 'Inter, sans-serif', lineHeight: 1.6 }}>
                            Choose from a variety of roadmaps, get mentored by industry experts,
                            and join a community of passionate learners.
                        </p>

                        <div className="flex flex-col sm:flex-row justify-center gap-4">
                            {/* Primary CTA */}
                            <button
                                onClick={() => document.getElementById('roadmaps')?.scrollIntoView({ behavior: 'smooth' })}
                                style={{
                                    display: 'inline-flex', alignItems: 'center', gap: 8,
                                    background: '#1CAB55', color: '#FFFFFF',
                                    borderRadius: 999, border: 'none',
                                    padding: '16px 28px', fontSize: 14, fontWeight: 600,
                                    fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                                    transition: 'background 150ms, transform 180ms, box-shadow 180ms',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = '#17994B'; e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.12)'; }}
                                onMouseLeave={e => { e.currentTarget.style.background = '#1CAB55'; e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
                            >
                                View Roadmaps <ArrowRight size={16} />
                            </button>

                            {/* Ghost CTA */}
                            <button
                                onClick={() => document.getElementById('mentors')?.scrollIntoView({ behavior: 'smooth' })}
                                style={{
                                    background: 'transparent', color: textPrimary,
                                    borderRadius: 999, border: `1.5px solid ${border}`,
                                    padding: '14px 28px', fontSize: 14, fontWeight: 500,
                                    fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                                    transition: 'background 150ms',
                                }}
                                onMouseEnter={e => { e.currentTarget.style.background = subtleBg; }}
                                onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                            >
                                Meet Mentors
                            </button>
                        </div>
                    </MotionDiv>
                </div>
            </section>

            {/* ── Roadmaps ── */}
            <section id="roadmaps" style={{ padding: '80px 16px', background: cardBg }}>
                <div className="mx-auto" style={{ maxWidth: 1200 }}>
                    <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                        <div>
                            <h2 style={{ fontSize: 28, fontWeight: 700, color: textPrimary, fontFamily: 'Inter, sans-serif', marginBottom: 6 }}>
                                Available Roadmaps
                            </h2>
                            <p style={{ fontSize: 14, color: textMuted, fontFamily: 'Inter, sans-serif' }}>
                                Structured learning paths designed for success.
                            </p>
                        </div>

                        {/* Tab chips — 10MS chip spec */}
                        <div style={{ display: 'flex', padding: 4, background: subtleBg, borderRadius: 10, gap: 4 }}>
                            {(['ongoing', 'expired'] as const).map(tab => (
                                <button
                                    key={tab}
                                    onClick={() => setActiveTab(tab)}
                                    style={{
                                        padding: '8px 16px', borderRadius: 10,
                                        border: 'none', cursor: 'pointer',
                                        fontSize: 13, fontWeight: 500,
                                        fontFamily: 'Inter, sans-serif',
                                        transition: 'background 150ms, color 150ms',
                                        background: activeTab === tab ? cardBg : 'transparent',
                                        color: activeTab === tab ? '#149353' : textMuted,
                                        boxShadow: activeTab === tab ? '0 1px 3px rgba(0,0,0,0.08)' : 'none',
                                    }}
                                >
                                    {tab === 'ongoing' ? 'Upcoming & Ongoing' : 'Past Batches'}
                                </button>
                            ))}
                        </div>
                    </div>

                    <MotionDiv variants={STAGGER_CHILDREN_VARIANTS} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayRoadmaps.map((roadmap) => (
                            <HoverLift key={roadmap.id}>
                                {/* Card — flat at rest, border only */}
                                <div style={{
                                    height: '100%', display: 'flex', flexDirection: 'column',
                                    background: cardBg, border: `1px solid ${border}`,
                                    borderRadius: 16, overflow: 'hidden',
                                }}>
                                    <div style={{ padding: 16, flex: 1 }}>
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                                            {/* Category badge — primary-container */}
                                            <span style={{
                                                padding: '3px 10px', borderRadius: 999,
                                                background: '#D0FAD0', color: '#086347',
                                                fontSize: 11, fontWeight: 600,
                                                fontFamily: 'Inter, sans-serif',
                                            }}>
                                                {roadmap.category}
                                            </span>
                                            <span style={{ fontSize: 11, color: textMuted, fontFamily: 'Inter, sans-serif' }}>
                                                {roadmap.difficulty_level} · {roadmap.total_weeks}w
                                            </span>
                                        </div>

                                        <h3 style={{ fontSize: 15, fontWeight: 600, color: textPrimary, fontFamily: 'Inter, sans-serif', marginBottom: 6, lineHeight: 1.4 }}>
                                            {roadmap.title}
                                        </h3>
                                        <p style={{ fontSize: 13, color: textMuted, fontFamily: 'Inter, sans-serif', lineHeight: 1.5, display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                                            {roadmap.description}
                                        </p>

                                        {/* Batches — colored surface, not nested card */}
                                        <div style={{ marginTop: 16, display: 'flex', flexDirection: 'column', gap: 8 }}>
                                            {roadmap.batches.map(batch => (
                                                <div key={batch.id} style={{
                                                    padding: '10px 12px',
                                                    background: subtleBg,
                                                    borderRadius: 10,
                                                }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                                                        <span style={{ fontSize: 11, fontWeight: 600, color: textMuted, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                                            {batch.name}
                                                        </span>
                                                        {/* Status chip */}
                                                        <span style={{
                                                            padding: '2px 8px', borderRadius: 999,
                                                            fontSize: 10, fontWeight: 600,
                                                            fontFamily: 'Inter, sans-serif',
                                                            background: batch.status === 'active' ? '#EAFEF2' : subtleBg,
                                                            color: batch.status === 'active' ? '#086347' : textMuted,
                                                        }}>
                                                            {batch.status === 'active' ? 'Ongoing' : 'Completed'}
                                                        </span>
                                                    </div>
                                                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                                                        <div style={{ display: 'flex', marginRight: 4 }}>
                                                            {batch.mentors.slice(0, 3).map(mentor => (
                                                                <img
                                                                    key={mentor.id}
                                                                    src={mentor.profile_picture_url || `https://ui-avatars.com/api/?name=${mentor.first_name}+${mentor.last_name}&background=D0FAD0&color=086347`}
                                                                    className="w-7 h-7 rounded-full object-cover"
                                                                    style={{ border: `2px solid ${cardBg}`, marginLeft: -6 }}
                                                                    title={`${mentor.first_name} ${mentor.last_name}`}
                                                                    alt={mentor.first_name}
                                                                />
                                                            ))}
                                                        </div>
                                                        <span style={{ fontSize: 11, color: textMuted, fontFamily: 'Inter, sans-serif', display: 'flex', alignItems: 'center', gap: 4 }}>
                                                            <Users size={11} /> {batch.current_students}/{batch.max_students} · {new Date(batch.start_date).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* CTA — primary green pill */}
                                    <div style={{ padding: '12px 16px', borderTop: `1px solid ${border}` }}>
                                        <button
                                            onClick={() => navigate('/signup')}
                                            style={{
                                                width: '100%', padding: '12px',
                                                background: '#1CAB55', color: '#FFFFFF',
                                                borderRadius: 999, border: 'none',
                                                fontSize: 13, fontWeight: 600,
                                                fontFamily: 'Inter, sans-serif', cursor: 'pointer',
                                                transition: 'background 150ms, transform 180ms',
                                            }}
                                            onMouseEnter={e => { e.currentTarget.style.background = '#17994B'; e.currentTarget.style.transform = 'translateY(-1px)'; }}
                                            onMouseLeave={e => { e.currentTarget.style.background = '#1CAB55'; e.currentTarget.style.transform = ''; }}
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

            {/* ── Mentors ── */}
            <section id="mentors" style={{ padding: '80px 16px', background: surface }}>
                <div className="mx-auto" style={{ maxWidth: 1200 }}>
                    <div className="text-center mb-14">
                        <h2 style={{ fontSize: 28, fontWeight: 700, color: textPrimary, fontFamily: 'Inter, sans-serif', marginBottom: 8 }}>
                            Guided by Industry Experts
                        </h2>
                        <p style={{ fontSize: 14, color: textMuted, fontFamily: 'Inter, sans-serif' }}>
                            Learn from professionals working at top global companies.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data?.mentors.map((mentor) => (
                            <HoverLift key={mentor.id}>
                                <div style={{
                                    background: cardBg, border: `1px solid ${border}`,
                                    borderRadius: 16, padding: 24, textAlign: 'center',
                                }}>
                                    <div style={{ position: 'relative', display: 'inline-block', marginBottom: 12 }}>
                                        <img
                                            src={mentor.profile_picture_url || `https://ui-avatars.com/api/?name=${mentor.first_name}+${mentor.last_name}&background=D0FAD0&color=086347`}
                                            alt={mentor.first_name}
                                            className="w-20 h-20 rounded-full object-cover mx-auto"
                                            style={{ border: `3px solid #D0FAD0` }}
                                        />
                                    </div>
                                    <h3 style={{ fontSize: 15, fontWeight: 600, color: textPrimary, fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>
                                        {mentor.first_name} {mentor.last_name}
                                    </h3>
                                    <p style={{ fontSize: 12, color: '#149353', fontWeight: 500, fontFamily: 'Inter, sans-serif', marginBottom: 2 }}>
                                        {mentor.mentor_profiles?.[0]?.designation || 'Expert Mentor'}
                                    </p>
                                    <p style={{ fontSize: 11, color: textMuted, fontFamily: 'Inter, sans-serif', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 16 }}>
                                        {mentor.mentor_profiles?.[0]?.organization || '10 Minute School'}
                                    </p>

                                    <div style={{ borderTop: `1px solid ${border}`, paddingTop: 14 }}>
                                        <p style={{ fontSize: 10, fontWeight: 600, color: textMuted, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8, fontFamily: 'Inter, sans-serif' }}>
                                            Mentoring in
                                        </p>
                                        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6 }}>
                                            {mentor.roadmaps.slice(0, 2).map(r => (
                                                <span key={r.id} style={{
                                                    fontSize: 10, padding: '3px 8px',
                                                    background: subtleBg, color: textMuted,
                                                    borderRadius: 6, fontFamily: 'Inter, sans-serif',
                                                }}>
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

            {/* ── Stats — Premium gradient band from production view ── */}
            <section 
                style={{ 
                    padding: '80px 16px', 
                    background: 'linear-gradient(90deg, #8B5CF6 0%, #2563EB 100%)' 
                }}
            >
                <div className="mx-auto" style={{ maxWidth: 1200 }}>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            { value: `${data?.roadmaps.length || 0}+`, label: 'Specialized Roadmaps' },
                            { value: `${data?.mentors.length || 0}+`, label: 'Expert Mentors' },
                            { value: '2,500+',                         label: 'Active Learners' },
                            { value: '95%',                            label: 'Success Rate' },
                        ].map(stat => (
                            <div key={stat.label}>
                                <div style={{ fontSize: 38, fontWeight: 800, color: '#FFFFFF', fontFamily: 'Inter, sans-serif', letterSpacing: '-0.02em' }}>
                                    {stat.value}
                                </div>
                                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', fontWeight: 500, marginTop: 6, fontFamily: 'Inter, sans-serif' }}>
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── Footer ── */}
            <footer style={{ background: cardBg, borderTop: `1px solid ${border}`, padding: '40px 16px' }}>
                <div className="mx-auto flex flex-col md:flex-row justify-between items-center gap-6" style={{ maxWidth: 1200 }}>
                    <AppLogo layout="full" />
                    <p style={{ fontSize: 13, color: textMuted, fontFamily: 'Inter, sans-serif' }}>
                        © 2026 10 Minute School. All rights reserved.
                    </p>
                    <div style={{ display: 'flex', gap: 24 }}>
                        {['Privacy Policy', 'Terms of Service'].map(link => (
                            <a
                                key={link} href="#"
                                style={{ fontSize: 13, color: textMuted, fontFamily: 'Inter, sans-serif', textDecoration: 'none' }}
                                onMouseEnter={e => e.currentTarget.style.color = '#149353'}
                                onMouseLeave={e => e.currentTarget.style.color = textMuted}
                            >
                                {link}
                            </a>
                        ))}
                    </div>
                </div>
            </footer>
        </div>
    );
};
