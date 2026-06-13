import React from 'react';
import { useTheme, PALETTE_OPTIONS } from '../../lib/ThemeContext';
import { Moon, Sun, Map, Users, TrendingUp, Bell } from 'lucide-react';
import { Button } from '../ui/Button';
import { Card, CardSm, CardAlert, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../ui/Card';
import { AppLogo } from '../Logo/AppLogo';

type PreviewMode = 'light' | 'dark';

const SectionTitle: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <h2 className="text-lg font-semibold text-foreground mb-4">{children}</h2>
);

const Swatch: React.FC<{ label: string; className: string; border?: boolean }> = ({ label, className, border }) => (
  <div className="flex flex-col gap-1.5">
    <div className={`h-12 rounded-lg ${border ? 'border border-border' : ''} ${className}`} />
    <span className="text-[11px] text-muted-foreground">{label}</span>
  </div>
);

const PreviewPanel: React.FC<{ mode: PreviewMode; title: string }> = ({ mode, title }) => {
  const isDark = mode === 'dark';

  return (
    <div
      className={`rounded-2xl border border-border overflow-hidden ${isDark ? 'dark bg-background text-foreground' : 'bg-background text-foreground'}`}
      data-theme-preview={mode}
    >
      <div className={`px-4 py-3 border-b border-border flex items-center justify-between ${isDark ? 'dark bg-card' : 'bg-card'}`}>
        <span className="text-sm font-medium">{title}</span>
        <span className="text-xs text-muted-foreground capitalize">{mode} mode</span>
      </div>

      <div className={`p-6 space-y-8 ${isDark ? 'dark' : ''}`}>
        {/* Logos */}
        <section>
          <SectionTitle>Brand</SectionTitle>
          <div className={`rounded-xl border border-border p-6 ${isDark ? 'bg-card' : 'bg-card'}`}>
            <AppLogo layout="full" surface={isDark ? 'header-dark' : 'light'} />
          </div>
        </section>

        {/* Color tokens */}
        <section>
          <SectionTitle>Surfaces &amp; borders</SectionTitle>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Swatch label="Background" className="bg-background" border />
            <Swatch label="Card" className="bg-card" border />
            <Swatch label="Muted" className="bg-muted" border />
            <Swatch label="Accent tint" className="bg-accent" border />
            <Swatch label="Primary" className="bg-primary" />
            <Swatch label="Border" className="bg-border" />
            <Swatch label="Destructive" className="bg-destructive" />
            <Swatch label="Accent soft" className="bg-[var(--accent-soft)]" border />
          </div>
        </section>

        {/* Typography */}
        <section>
          <SectionTitle>Typography</SectionTitle>
          <div className="space-y-2">
            <p className="text-2xl font-bold text-foreground">Display heading</p>
            <p className="text-lg font-semibold text-foreground">Section title</p>
            <p className="text-[15px] font-semibold text-foreground">Card title</p>
            <p className="text-sm text-foreground">Body text — primary content at 14px.</p>
            <p className="text-sm text-muted-foreground">Secondary text — captions and metadata.</p>
            <p className="text-xs text-muted-foreground">Tertiary — timestamps, labels.</p>
          </div>
        </section>

        {/* Buttons */}
        <section>
          <SectionTitle>Buttons</SectionTitle>
          <div className="flex flex-wrap gap-3">
            <Button variant="default">Primary CTA</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="default" disabled>Disabled</Button>
            <Button variant="default" isLoading>Loading</Button>
          </div>
        </section>

        {/* Cards */}
        <section>
          <SectionTitle>Cards</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle>Flat card at rest</CardTitle>
                <CardDescription>Hairline border, no shadow until hover.</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">Neutral surface with restrained green accent only on actions.</p>
              </CardContent>
              <CardFooter>
                <Button variant="outline" size="sm">Learn more</Button>
              </CardFooter>
            </Card>
            <CardSm className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Small list card</p>
                <p className="text-xs text-muted-foreground">Compact row item</p>
              </div>
            </CardSm>
          </div>
          <CardAlert className="mt-4 dark:border-red-900/50 dark:bg-red-950/30">
            <p className="text-sm text-destructive font-medium">Alert card — errors only</p>
            <p className="text-xs text-muted-foreground mt-1">Used for validation and system errors.</p>
          </CardAlert>
        </section>

        {/* Inputs */}
        <section>
          <SectionTitle>Inputs</SectionTitle>
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Default</label>
              <input
                type="text"
                placeholder="Enter email"
                className="w-full h-11 px-3 rounded-xl border border-input bg-background text-foreground text-sm placeholder:text-muted-foreground focus:outline-none focus:border-primary focus:ring-[3px] focus:ring-primary/15"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-muted-foreground mb-1.5 block">Error</label>
              <input
                type="text"
                defaultValue="invalid@"
                className="w-full h-11 px-3 rounded-xl border-2 border-destructive bg-background text-foreground text-sm focus:outline-none"
              />
              <p className="text-xs text-destructive mt-1">Please enter a valid email.</p>
            </div>
          </div>
        </section>

        {/* Badges & chips */}
        <section>
          <SectionTitle>Badges &amp; chips</SectionTitle>
          <div className="flex flex-wrap gap-2">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary text-primary-foreground">Active</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-accent text-accent-foreground border border-border">Selected</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-muted text-muted-foreground border border-border">Default</span>
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-destructive/10 text-destructive border border-destructive/20">Error</span>
          </div>
        </section>

        {/* Example dashboard block */}
        <section>
          <SectionTitle>Example dashboard layout</SectionTitle>
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border bg-card flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-foreground">Welcome back</p>
                <p className="text-xs text-muted-foreground">Your learning progress</p>
              </div>
              <button type="button" className="w-9 h-9 rounded-full border border-border bg-background flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
                <Bell className="w-4 h-4" />
              </button>
            </div>
            <div className="p-4 space-y-4 bg-background">
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Streak', value: '12 days' },
                  { label: 'Tasks', value: '8/10' },
                  { label: 'Rank', value: '#4' },
                ].map((stat) => (
                  <div key={stat.label} className="rounded-xl border border-border bg-card p-3">
                    <p className="text-[11px] text-muted-foreground">{stat.label}</p>
                    <p className="text-lg font-semibold text-foreground mt-0.5">{stat.value}</p>
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-3">
                <button type="button" className="rounded-xl border border-border bg-card p-4 text-center hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="w-10 h-10 rounded-lg bg-muted mx-auto mb-2 flex items-center justify-center group-hover:bg-accent transition-colors">
                    <Map className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Roadmap</span>
                </button>
                <button type="button" className="rounded-xl border border-border bg-card p-4 text-center hover:shadow-hover hover:-translate-y-0.5 transition-all duration-200 group">
                  <div className="w-10 h-10 rounded-lg bg-muted mx-auto mb-2 flex items-center justify-center group-hover:bg-accent transition-colors">
                    <Users className="w-5 h-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium text-foreground">Community</span>
                </button>
              </div>
              <div className="rounded-xl border border-border bg-card divide-y divide-border">
                {['Complete Week 3 tasks', 'Join live session', 'Review mentor feedback'].map((task) => (
                  <div key={task} className="px-4 py-3 flex items-center justify-between">
                    <span className="text-sm text-foreground">{task}</span>
                    <span className="w-2 h-2 rounded-full bg-primary" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export const StyleLabPage: React.FC = () => {
  const { isDarkMode, toggleDarkMode, palette, setPalette } = useTheme();
  const active = PALETTE_OPTIONS.find((p) => p.id === palette);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
        <div className="max-w-content mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-xl font-bold text-foreground">Style Lab</h1>
            <p className="text-sm text-muted-foreground">Design system preview — not linked in navigation</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleDarkMode}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              Toggle app theme
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-content mx-auto px-4 py-8">
        <div className="mb-8 space-y-6">
          <p className="text-sm text-muted-foreground max-w-2xl">
            Restrained 10MS green on neutral surfaces. Pick a palette below — it applies <strong className="text-foreground">app-wide instantly</strong> (dashboard, roadmap, etc.). Toggle light/dark to compare. Hard-refresh if colors look stale.
          </p>

          <section className="rounded-xl border border-border bg-card p-4 md:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Neutral palette</p>
                <p className="font-semibold text-foreground">{active?.label ?? palette}</p>
                <p className="text-xs text-muted-foreground mt-1">{active?.hint}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {PALETTE_OPTIONS.map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() => setPalette(option.id)}
                    className={`rounded-full border px-3 py-1.5 text-xs font-medium transition-colors ${
                      palette === option.id
                        ? 'border-primary bg-accent text-accent-foreground'
                        : 'border-border bg-background text-foreground hover:bg-muted'
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <PreviewPanel mode="light" title="Light theme" />
          <div className="dark">
            <PreviewPanel mode="dark" title="Dark theme" />
          </div>
        </div>
      </main>
    </div>
  );
};
