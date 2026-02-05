import React, { useState, useEffect, useRef } from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Change this to your desired password
const SITE_PASSWORD = 'umgc2026';

// Animated gradient background
const AnimatedBackground = () => (
  <div className="fixed inset-0 -z-10 overflow-hidden">
    <div className="absolute inset-0 bg-[#0a0a0f]" />
    <div className="absolute top-0 -left-40 w-80 h-80 bg-purple-500/20 rounded-full blur-[120px] animate-pulse" />
    <div className="absolute bottom-0 -right-40 w-80 h-80 bg-blue-500/20 rounded-full blur-[120px] animate-pulse" style={{ animationDelay: '1s' }} />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-[150px] animate-pulse" style={{ animationDelay: '2s' }} />
  </div>
);

// Circular progress component
const CircularProgress = ({ percentage, color, size = 80, strokeWidth = 6 }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg className="transform -rotate-90" width={size} height={size}>
        <circle
          className="text-white/5"
          strokeWidth={strokeWidth}
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
        />
        <circle
          className={color}
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          stroke="currentColor"
          fill="transparent"
          r={radius}
          cx={size / 2}
          cy={size / 2}
          style={{ transition: 'stroke-dashoffset 0.8s ease-out' }}
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-lg font-bold text-white">{percentage}%</span>
      </div>
    </div>
  );
};

// Glass card component
const GlassCard = ({ children, className = '', hover = true, ...props }) => (
  <div
    className={cn(
      'backdrop-blur-xl bg-white/[0.03] border border-white/[0.05] rounded-2xl',
      hover && 'hover:bg-white/[0.05] hover:border-white/[0.1] transition-all duration-300',
      className
    )}
    {...props}
  >
    {children}
  </div>
);

// Animated number component
const AnimatedNumber = ({ value, duration = 1000 }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTime;
    const startValue = displayValue;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setDisplayValue(Math.floor(startValue + (value - startValue) * progress));
      if (progress < 1) requestAnimationFrame(animate);
    };

    requestAnimationFrame(animate);
  }, [value]);

  return <span>{displayValue}</span>;
};

// Status badge component
const StatusBadge = ({ status, score }) => {
  const config = {
    graded: { bg: 'bg-emerald-500/20', text: 'text-emerald-400', border: 'border-emerald-500/30' },
    submitted: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
    upcoming: { bg: 'bg-neutral-500/20', text: 'text-neutral-400', border: 'border-neutral-500/30' },
    due: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
  };

  const { bg, text, border } = config[status] || config.upcoming;

  const label = {
    graded: score || 'Graded',
    submitted: 'Pending',
    upcoming: 'Upcoming',
    due: 'Due Soon',
  }[status] || status;

  return (
    <span className={cn('px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full border', bg, text, border)}>
      {label}
    </span>
  );
};

const CourseTracker = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(5);
  const [activeTab, setActiveTab] = useState('schedule');
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedItems, setCompletedItems] = useState({});
  const [startedItems, setStartedItems] = useState({});

  // Current week for semester progress
  const CURRENT_WEEK = 5;
  const TOTAL_WEEKS = 8;
  const semesterProgress = Math.round((CURRENT_WEEK / TOTAL_WEEKS) * 100);

  useEffect(() => {
    const auth = localStorage.getItem('umgc-tracker-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
    // Load completed/started items from localStorage
    const savedCompleted = localStorage.getItem('umgc-tracker-completed');
    const savedStarted = localStorage.getItem('umgc-tracker-started');
    if (savedCompleted) setCompletedItems(JSON.parse(savedCompleted));
    if (savedStarted) setStartedItems(JSON.parse(savedStarted));
    setTimeout(() => setIsLoading(false), 500);
  }, []);

  // Toggle item completion
  const toggleComplete = (itemKey) => {
    const newCompleted = { ...completedItems, [itemKey]: !completedItems[itemKey] };
    if (!completedItems[itemKey]) {
      // If marking complete, also remove from started
      const newStarted = { ...startedItems };
      delete newStarted[itemKey];
      setStartedItems(newStarted);
      localStorage.setItem('umgc-tracker-started', JSON.stringify(newStarted));
    }
    setCompletedItems(newCompleted);
    localStorage.setItem('umgc-tracker-completed', JSON.stringify(newCompleted));
  };

  // Toggle item started
  const toggleStarted = (itemKey) => {
    if (completedItems[itemKey]) return; // Can't start if already complete
    const newStarted = { ...startedItems, [itemKey]: !startedItems[itemKey] };
    setStartedItems(newStarted);
    localStorage.setItem('umgc-tracker-started', JSON.stringify(newStarted));
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === SITE_PASSWORD) {
      setIsAuthenticated(true);
      localStorage.setItem('umgc-tracker-auth', 'true');
      setError('');
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('umgc-tracker-auth');
  };

  // Login Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-dvh bg-[#0a0a0f] text-white font-sans flex items-center justify-center relative overflow-hidden">
        <AnimatedBackground />
        <div className="max-w-sm lg:max-w-md w-full px-6 relative z-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 mb-6">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-xs text-neutral-400 uppercase tracking-widest">Spring 2026</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
              Course Tracker
            </h1>
            <p className="text-neutral-500 text-sm mt-2">University of Maryland Global Campus</p>
          </div>

          <GlassCard className="p-6" hover={false}>
            <form onSubmit={handleLogin} className="space-y-4">
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-white/30 focus:ring-2 focus:ring-white/10 placeholder-neutral-600 transition-all"
                  autoFocus
                />
              </div>
              {error && (
                <div className="flex items-center gap-2 text-rose-400 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  {error}
                </div>
              )}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-white to-neutral-200 text-neutral-900 rounded-xl py-3.5 text-sm font-semibold hover:opacity-90 transition-all active:scale-[0.98]"
              >
                Unlock Dashboard
              </button>
            </form>
          </GlassCard>

          <p className="text-[10px] text-neutral-600 text-center mt-8 uppercase tracking-widest">
            Private Access Only
          </p>
        </div>
      </div>
    );
  }

  const courses = {
    'IFSM 304': {
      name: 'Ethics in IT',
      prof: 'Steve Barrett',
      email: 'steve.barrett@faculty.umgc.edu',
      color: 'text-sky-400',
      bgColor: 'bg-sky-500',
      gradient: 'from-sky-500 to-blue-600',
      currentGrade: 99,
      earned: 99,
      possible: 100,
      focus: 'Ethical decision-making frameworks in IT environments',
      discussionInfo: 'Groups rotate hosting · Check your group assignment',
      keyNotes: [
        'Papers use Kidder\'s Nine-Step Framework + Module 1 approaches',
        'APA format required, in-text citations for ALL claims',
        'Late penalty: 10%/day up to 5 days'
      ]
    },
    'IFSM 301': {
      name: 'Foundations of MIS',
      prof: 'Stephany Head',
      email: 'stephany.head@faculty.umgc.edu',
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500',
      gradient: 'from-emerald-500 to-teal-600',
      currentGrade: 85,
      earned: 34,
      possible: 40,
      focus: 'IT strategic planning using GG Freightways case study',
      discussionInfo: 'Group 1: HOST Weeks 1 & 5 · REPLY Weeks 2,3,4,6,7,8',
      keyNotes: [
        'ALL assignments use GG Freightways case study',
        'HOST weeks: Post main + reply to 2+ classmates',
        'REPLY weeks: Reply to 3+ classmates\' threads',
        'CIO Memo is highest-weighted (250 pts)'
      ]
    },
    'IFSM 370': {
      name: 'Telecommunications',
      prof: 'Paul Henry',
      email: 'paul.henry@faculty.umgc.edu',
      color: 'text-violet-400',
      bgColor: 'bg-violet-500',
      gradient: 'from-violet-500 to-purple-600',
      currentGrade: 94,
      earned: 228,
      possible: 240,
      focus: 'Network infrastructure, protocols, and security',
      discussionInfo: 'Weeks 2, 4, 5, 7 · Post Fri + 2 replies by Tue',
      keyNotes: [
        'Discussions: 40 pts each (Weeks 2, 4, 5, 7)',
        'Initial post by Friday, 2+ replies by Tuesday',
        'Quiz opens Wednesday each week',
        '4 Projects: Interview, VPN, Case Study, Final'
      ]
    }
  };

  const grades = {
    'IFSM 304': {
      items: [
        { name: 'Current Events', status: 'graded', score: 59, max: 60 },
        { name: 'Paper A', status: 'submitted', max: 180 },
        { name: 'Week 1 Discussion', status: 'graded', score: 20, max: 20 },
        { name: 'Week 2 Discussion', status: 'graded', score: 20, max: 20 },
        { name: 'Paper B', status: 'upcoming', max: 230, due: 'Feb 3' },
        { name: 'Paper C', status: 'upcoming', max: 230, due: 'Feb 10' },
        { name: 'Presentation D', status: 'upcoming', max: 140, due: 'Feb 24' },
      ]
    },
    'IFSM 301': {
      items: [
        { name: 'Week 1 Discussion (HOST)', status: 'graded', score: 16, max: 20, note: 'Needed more replies' },
        { name: 'Week 2 Discussion (REPLY)', status: 'graded', score: 18, max: 20, note: 'Needed 3+ replies' },
        { name: 'Week 3 Discussion (REPLY)', status: 'upcoming', max: 20 },
        { name: 'IT Strategic Plan Pt 1', status: 'submitted', max: 140, due: 'Jan 24' },
        { name: 'IT Strategic Plan Pt 2', status: 'upcoming', max: 200, due: 'Feb 3' },
        { name: 'Week 5 Discussion (HOST)', status: 'upcoming', max: 20 },
        { name: 'CIO Organization Memo', status: 'upcoming', max: 250, due: 'Feb 17' },
        { name: 'IT Decision Paper', status: 'upcoming', max: 250, due: 'Mar 3' },
      ]
    },
    'IFSM 370': {
      items: [
        { name: 'Quiz 1', status: 'graded', score: 43, max: 50 },
        { name: 'Quiz 2', status: 'graded', score: 50, max: 50 },
        { name: 'Week 2 Discussion', status: 'graded', score: 40, max: 40 },
        { name: 'Week 4 Discussion', status: 'upcoming', max: 40 },
        { name: 'Week 5 Discussion', status: 'upcoming', max: 40 },
        { name: 'Quiz 3', status: 'graded', score: 45, max: 50 },
        { name: 'Quiz 4', status: 'graded', score: 50, max: 50 },
        { name: 'Week 7 Discussion', status: 'upcoming', max: 40 },
        { name: 'Project 1: Interview', status: 'upcoming', max: 140, due: 'Jan 27' },
        { name: 'Project 2: VPN', status: 'upcoming', max: 140, due: 'Feb 10' },
        { name: 'Project 3: Case Study', status: 'upcoming', max: 160, due: 'Feb 17' },
        { name: 'Project 4: Final', status: 'upcoming', max: 200, due: 'Mar 3' },
      ]
    }
  };

  const weeklySchedule = {
    1: { dates: 'Jan 7-13', assignments: [
      { course: 'IFSM 304', name: 'Current Events', pts: 60, status: 'graded', score: '59/60' },
      { course: 'IFSM 301', name: 'Week 1 Discussion (HOST)', pts: 20, status: 'graded', score: '16/20' },
      { course: 'IFSM 304', name: 'Week 1 Discussion', pts: 20, status: 'graded', score: '20/20' },
    ]},
    2: { dates: 'Jan 14-20', assignments: [
      { course: 'IFSM 304', name: 'Paper A', pts: 180, status: 'submitted' },
      { course: 'IFSM 370', name: 'Quiz 1', pts: 50, status: 'graded', score: '43/50' },
      { course: 'IFSM 370', name: 'Quiz 2', pts: 50, status: 'graded', score: '50/50' },
      { course: 'IFSM 370', name: 'Week 2 Discussion', pts: 40, status: 'graded', score: '40/40' },
      { course: 'IFSM 304', name: 'Week 2 Discussion', pts: 20, status: 'graded', score: '20/20' },
      { course: 'IFSM 301', name: 'Week 2 Discussion (REPLY)', pts: 20, status: 'graded', score: '18/20' },
    ]},
    3: { dates: 'Jan 21-27', assignments: [
      { course: 'IFSM 301', name: 'IT Strategic Plan Pt 1', pts: 140, status: 'submitted', due: 'Fri Jan 24' },
      { course: 'IFSM 301', name: 'Week 3 Discussion (REPLY)', pts: 20, status: 'graded', score: '20/20', due: 'Tue Jan 28' },
      { course: 'IFSM 370', name: 'Project 1: Interview', pts: 140, status: 'submitted', due: 'Mon Jan 27' },
    ]},
    4: { dates: 'Jan 28 - Feb 3', assignments: [
      { course: 'IFSM 304', name: 'Paper B', pts: 230, status: 'submitted', due: 'Mon Feb 3' },
      { course: 'IFSM 301', name: 'IT Strategic Plan Pt 2', pts: 200, status: 'submitted', due: 'Mon Feb 3' },
      { course: 'IFSM 370', name: 'Week 4 Discussion', pts: 40, status: 'graded', score: '40/40', due: 'Post Fri, Reply Tue' },
      { course: 'IFSM 301', name: 'Week 4 Discussion (REPLY)', pts: 20, status: 'graded', score: '20/20' },
      { course: 'IFSM 304', name: 'Week 4 Discussion', pts: 20, status: 'graded', score: '20/20' },
    ]},
    5: { dates: 'Feb 4-10', assignments: [
      { course: 'IFSM 304', name: 'Paper C', pts: 230, status: 'upcoming', due: 'Mon Feb 10' },
      { course: 'IFSM 370', name: 'Project 2: VPN', pts: 140, status: 'upcoming', due: 'Mon Feb 10' },
      { course: 'IFSM 370', name: 'Week 5 Discussion', pts: 40, status: 'upcoming', due: 'Post Fri, Reply Tue' },
      { course: 'IFSM 370', name: 'Quiz 3', pts: 50, status: 'graded', score: '45/50' },
      { course: 'IFSM 301', name: 'Week 5 Discussion (HOST)', pts: 20, status: 'upcoming', note: 'You HOST this week!' },
    ]},
    6: { dates: 'Feb 11-17', assignments: [
      { course: 'IFSM 301', name: 'CIO Organization Memo', pts: 250, status: 'upcoming', due: 'Mon Feb 17' },
      { course: 'IFSM 370', name: 'Project 3: Case Study', pts: 160, status: 'upcoming', due: 'Mon Feb 17' },
      { course: 'IFSM 301', name: 'Week 6 Discussion (REPLY)', pts: 20, status: 'upcoming' },
    ]},
    7: { dates: 'Feb 18-24', assignments: [
      { course: 'IFSM 304', name: 'Presentation D', pts: 140, status: 'upcoming', due: 'Mon Feb 24' },
      { course: 'IFSM 301', name: 'IT Decision Paper', pts: 250, status: 'upcoming', due: 'Mon Feb 24' },
      { course: 'IFSM 370', name: 'Week 7 Discussion', pts: 40, status: 'upcoming', due: 'Post Fri, Reply Tue' },
      { course: 'IFSM 370', name: 'Quiz 4', pts: 50, status: 'graded', score: '50/50' },
      { course: 'IFSM 301', name: 'Week 7 Discussion (REPLY)', pts: 20, status: 'upcoming' },
    ]},
    8: { dates: 'Feb 25 - Mar 3', assignments: [
      { course: 'IFSM 370', name: 'Project 4: Final', pts: 200, status: 'upcoming', due: 'Mon Mar 3' },
      { course: 'IFSM 301', name: 'Week 8 Discussion (REPLY)', pts: 20, status: 'upcoming' },
    ]},
  };

  const tabs = [
    { id: 'schedule', label: 'Schedule', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    )},
    { id: 'grades', label: 'Grades', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    )},
    { id: 'courses', label: 'Courses', icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    )},
  ];

  const ChevronIcon = ({ open }) => (
    <svg className={cn('size-5 transition-transform duration-300', open && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 9l-7 7-7-7" />
    </svg>
  );

  // Calculate overall GPA
  const overallGrade = Math.round(
    Object.values(courses).reduce((acc, c) => acc + c.currentGrade, 0) / Object.keys(courses).length
  );

  return (
    <div className="min-h-dvh bg-[#0a0a0f] text-white font-sans relative">
      <AnimatedBackground />

      <div className="max-w-lg lg:max-w-5xl xl:max-w-6xl mx-auto px-4 lg:px-8 py-6 relative z-10">
        {/* Header */}
        <header className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-[10px] text-neutral-400 uppercase tracking-widest">Week 5 of 8</span>
              </div>
              <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-white via-white to-neutral-400 bg-clip-text text-transparent">
                Course Tracker
              </h1>
              <p className="text-neutral-500 text-sm mt-1">UMGC Spring 2026</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-all"
              title="Logout"
            >
              <svg className="w-4 h-4 text-neutral-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </button>
          </div>
        </header>

        {/* Semester Progress Bar */}
        <GlassCard className="p-4 mb-4" hover={false}>
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-neutral-500 uppercase tracking-wider">Semester Progress</p>
            <p className="text-xs text-neutral-400">Week {CURRENT_WEEK} of {TOTAL_WEEKS}</p>
          </div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 transition-all duration-1000"
              style={{ width: `${semesterProgress}%` }}
            />
          </div>
          <div className="flex justify-between mt-2">
            <p className="text-xs text-neutral-500">{semesterProgress}% complete</p>
            <p className="text-xs text-neutral-500">{TOTAL_WEEKS - CURRENT_WEEK} weeks remaining</p>
          </div>
        </GlassCard>

        {/* Due Soon Alert */}
        {(() => {
          // Get all upcoming assignments from current week
          const dueSoonItems = weeklySchedule[5]?.assignments.filter(
            a => a.status === 'upcoming' && !completedItems[`${a.course}-${a.name}`]
          ) || [];

          if (dueSoonItems.length === 0) return null;

          return (
            <GlassCard className="p-4 mb-4 border-amber-500/30 bg-amber-500/5" hover={false}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-amber-400">Due This Week</p>
                  <div className="mt-2 space-y-1">
                    {dueSoonItems.slice(0, 3).map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-xs text-amber-200/80">{item.name}</span>
                        <span className="text-xs text-amber-400/60">{item.course} · {item.pts} pts</span>
                      </div>
                    ))}
                    {dueSoonItems.length > 3 && (
                      <p className="text-xs text-amber-400/50">+{dueSoonItems.length - 3} more</p>
                    )}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })()}

        {/* Overall Progress */}
        <GlassCard className="p-5 mb-6" hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-neutral-500 uppercase tracking-wider mb-1">Overall Progress</p>
              <p className="text-4xl font-bold">{overallGrade}%</p>
              <p className="text-xs text-neutral-500 mt-1">Semester Average</p>
            </div>
            <div className="flex gap-3">
              {Object.entries(courses).map(([code, info]) => (
                <CircularProgress
                  key={code}
                  percentage={info.currentGrade}
                  color={info.color}
                  size={56}
                  strokeWidth={4}
                />
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Week Selector */}
        <div className="mb-6">
          <p className="text-xs text-neutral-500 uppercase tracking-wider mb-3">Select Week</p>
          <div className="flex gap-2 lg:gap-3">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => {
              const isCurrent = week === 5;
              const isHeavy = [4, 5, 6].includes(week);
              const isSelected = selectedWeek === week;

              return (
                <button
                  key={week}
                  onClick={() => setSelectedWeek(week)}
                  className={cn(
                    'flex-1 h-12 rounded-xl text-sm font-medium transition-all duration-300 relative overflow-hidden',
                    isSelected
                      ? 'bg-white text-neutral-900 shadow-lg shadow-white/20'
                      : isCurrent
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/40'
                        : isHeavy
                          ? 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          : 'bg-white/5 text-neutral-400 border border-white/5 hover:bg-white/10'
                  )}
                >
                  {week}
                  {isCurrent && !isSelected && (
                    <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Week Info Banner */}
        <GlassCard className="p-4 mb-6" hover={false}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium">Week {selectedWeek}</p>
              <p className="text-xs text-neutral-500">{weeklySchedule[selectedWeek]?.dates}</p>
            </div>
            {selectedWeek === 5 && (
              <span className="px-3 py-1 bg-amber-500/20 text-amber-400 text-xs font-medium rounded-full border border-amber-500/30">
                Current Week
              </span>
            )}
            {[4, 5, 6].includes(selectedWeek) && (
              <span className="px-3 py-1 bg-rose-500/20 text-rose-400 text-xs font-medium rounded-full border border-rose-500/30">
                Heavy Week
              </span>
            )}
          </div>
        </GlassCard>

        {/* Tabs */}
        <div className="flex gap-2 mb-6 p-1 bg-white/5 rounded-xl">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-xs font-medium uppercase tracking-wider transition-all duration-300',
                activeTab === tab.id
                  ? 'bg-white text-neutral-900'
                  : 'text-neutral-500 hover:text-white'
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            {Object.entries(courses).map(([code, courseInfo]) => {
              const courseAssignments = weeklySchedule[selectedWeek]?.assignments.filter(a => a.course === code) || [];

              return (
                <GlassCard key={code} className="p-4" hover={false}>
                  <div className="flex items-center gap-3 mb-4 pb-3 border-b border-white/10">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', courseInfo.gradient)}>
                      <span className="text-sm font-bold text-white">{code.split(' ')[1]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{code}</p>
                      <p className="text-xs text-neutral-500">{courseInfo.name}</p>
                    </div>
                  </div>

                  {courseAssignments.length === 0 ? (
                    <p className="text-sm text-neutral-500 text-center py-4">No assignments this week</p>
                  ) : (
                    <div className="space-y-3">
                      {courseAssignments.map((item, i) => {
                        const itemKey = `${item.course}-${item.name}`;
                        const isCompleted = completedItems[itemKey];
                        const isStarted = startedItems[itemKey];
                        const isActionable = item.status === 'upcoming' || item.status === 'due';

                        return (
                          <div
                            key={i}
                            className={cn(
                              'p-3 rounded-xl bg-white/5 border border-white/5 transition-all',
                              item.status === 'due' && 'border-amber-500/30 bg-amber-500/5',
                              isCompleted && 'opacity-50 border-emerald-500/30 bg-emerald-500/5',
                              isStarted && !isCompleted && 'border-blue-500/30 bg-blue-500/5'
                            )}
                          >
                            <div className="flex items-start gap-3">
                              {/* Checkbox area */}
                              {isActionable && (
                                <div className="flex flex-col gap-1 pt-0.5">
                                  <button
                                    onClick={() => toggleComplete(itemKey)}
                                    className={cn(
                                      'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                                      isCompleted
                                        ? 'bg-emerald-500 border-emerald-500'
                                        : 'border-white/20 hover:border-emerald-500/50'
                                    )}
                                    title={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                                  >
                                    {isCompleted && (
                                      <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                      </svg>
                                    )}
                                  </button>
                                  {!isCompleted && (
                                    <button
                                      onClick={() => toggleStarted(itemKey)}
                                      className={cn(
                                        'w-5 h-5 rounded border-2 flex items-center justify-center transition-all',
                                        isStarted
                                          ? 'bg-blue-500 border-blue-500'
                                          : 'border-white/20 hover:border-blue-500/50'
                                      )}
                                      title={isStarted ? 'Mark not started' : 'Mark as started'}
                                    >
                                      {isStarted && (
                                        <div className="w-2 h-2 rounded-full bg-white" />
                                      )}
                                    </button>
                                  )}
                                </div>
                              )}

                              <div className="flex-1">
                                <div className="flex items-start justify-between gap-2">
                                  <div>
                                    <p className={cn('text-sm font-medium', isCompleted && 'line-through text-neutral-500')}>
                                      {item.name}
                                    </p>
                                    <div className="flex items-center gap-2 mt-1">
                                      <span className="text-xs text-neutral-500">{item.pts} pts</span>
                                      {item.due && (
                                        <>
                                          <span className="text-neutral-600">·</span>
                                          <span className="text-xs text-neutral-400">{item.due}</span>
                                        </>
                                      )}
                                    </div>
                                    {item.note && (
                                      <p className="text-xs text-violet-400 mt-2 flex items-center gap-1">
                                        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {item.note}
                                      </p>
                                    )}
                                  </div>
                                  {isCompleted ? (
                                    <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full border bg-emerald-500/20 text-emerald-400 border-emerald-500/30">
                                      Done
                                    </span>
                                  ) : isStarted ? (
                                    <span className="px-2.5 py-1 text-[10px] font-medium uppercase tracking-wider rounded-full border bg-blue-500/20 text-blue-400 border-blue-500/30">
                                      In Progress
                                    </span>
                                  ) : (
                                    <StatusBadge status={item.status} score={item.score} />
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div className="space-y-4 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
            {Object.entries(courses).map(([code, courseInfo]) => (
              <GlassCard key={code} className="p-5" hover={false}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={cn('w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center', courseInfo.gradient)}>
                      <span className="text-sm font-bold text-white">{code.split(' ')[1]}</span>
                    </div>
                    <div>
                      <p className="font-medium">{code}</p>
                      <p className="text-xs text-neutral-500">{courseInfo.name}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold">{courseInfo.currentGrade}%</p>
                    <p className="text-[10px] text-neutral-500">{courseInfo.earned}/{courseInfo.possible} pts</p>
                  </div>
                </div>

                {/* Progress bar */}
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-4">
                  <div
                    className={cn('h-full rounded-full bg-gradient-to-r transition-all duration-1000', courseInfo.gradient)}
                    style={{ width: `${courseInfo.currentGrade}%` }}
                  />
                </div>

                <div className="space-y-2">
                  {grades[code].items.slice(0, 5).map((item, i) => (
                    <div key={i} className="flex items-center justify-between py-1.5 border-b border-white/5 last:border-0">
                      <span className="text-sm text-neutral-400">{item.name}</span>
                      <StatusBadge
                        status={item.status}
                        score={item.score !== undefined ? `${item.score}/${item.max}` : undefined}
                      />
                    </div>
                  ))}
                  {grades[code].items.length > 5 && (
                    <p className="text-xs text-neutral-600 pt-2">+{grades[code].items.length - 5} more items</p>
                  )}
                </div>
              </GlassCard>
            ))}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-3 lg:grid lg:grid-cols-3 lg:gap-4 lg:space-y-0">
            {Object.entries(courses).map(([code, info]) => {
              const isOpen = expandedCourse === code;
              return (
                <GlassCard key={code} className="overflow-hidden" hover={false}>
                  <button
                    onClick={() => setExpandedCourse(isOpen ? null : code)}
                    className="w-full flex items-center justify-between p-4 hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className={cn('w-12 h-12 rounded-xl bg-gradient-to-br flex items-center justify-center', info.gradient)}>
                        <span className="text-lg font-bold text-white">{code.split(' ')[1]}</span>
                      </div>
                      <div className="text-left">
                        <p className="font-medium">{code}</p>
                        <p className="text-sm text-neutral-500">{info.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-xl font-bold">{info.currentGrade}%</span>
                      <ChevronIcon open={isOpen} />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="border-t border-white/5 p-4 space-y-4 animate-in slide-in-from-top-2 duration-300">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Professor</p>
                          <p className="text-sm font-medium">{info.prof}</p>
                          <p className="text-xs text-neutral-500">{info.email}</p>
                        </div>
                        <div>
                          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Points</p>
                          <p className="text-sm font-medium">{info.earned} / {info.possible}</p>
                          <p className="text-xs text-neutral-500">earned</p>
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1">Focus</p>
                        <p className="text-sm text-neutral-300">{info.focus}</p>
                      </div>

                      <div className="bg-violet-500/10 border border-violet-500/20 rounded-xl p-3">
                        <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                          <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          Discussion Schedule
                        </p>
                        <p className="text-xs text-violet-300">{info.discussionInfo}</p>
                      </div>

                      <div className="bg-white/5 rounded-xl p-3">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Key Notes</p>
                        <ul className="space-y-1.5">
                          {info.keyNotes.map((n, i) => (
                            <li key={i} className="text-xs text-neutral-400 flex items-start gap-2">
                              <span className="text-neutral-600 mt-0.5">•</span>
                              {n}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </GlassCard>
              );
            })}
          </div>
        )}

        {/* Submitted Items Alert */}
        {activeTab === 'schedule' && (() => {
          const submittedItems = weeklySchedule[selectedWeek]?.assignments.filter(a => a.status === 'submitted') || [];
          if (submittedItems.length === 0) return null;

          return (
            <GlassCard className="mt-6 p-4 border-emerald-500/20 bg-emerald-500/5" hover={false}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-500/20 flex items-center justify-center flex-shrink-0">
                  <svg className="w-4 h-4 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-emerald-400">Submitted · Awaiting Grade</p>
                  <div className="mt-2 space-y-1">
                    {submittedItems.map((item, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <span className="text-sm text-emerald-200/80">{item.name}</span>
                        <span className="text-xs text-emerald-400/60">{item.course} · {item.pts} pts</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          );
        })()}

        {[4, 5, 6].includes(selectedWeek) && activeTab === 'schedule' && (
          <GlassCard className="mt-6 p-4 border-rose-500/20 bg-rose-500/5" hover={false}>
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 rounded-lg bg-rose-500/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-rose-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-rose-400">Heavy Week Ahead</p>
                <p className="text-xs text-rose-400/70 mt-1">
                  {selectedWeek === 4 && 'Paper B (230) + IT Plan Pt2 (200) = 430 pts'}
                  {selectedWeek === 5 && 'Paper C (230) + VPN Project (140) + HOST Discussion = 390 pts'}
                  {selectedWeek === 6 && 'CIO Memo (250) + Case Study (160) = 410 pts'}
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* Discussion Tips */}
        <GlassCard className="mt-6 p-4" hover={false}>
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-3 flex items-center gap-2">
            <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
            </svg>
            Discussion Tips
          </p>
          <div className="grid grid-cols-1 gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="w-14 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-center text-[10px] font-medium">HOST</span>
              <span className="text-neutral-400">Post main + reply to 2+ classmates</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-14 px-2 py-0.5 bg-sky-500/20 text-sky-400 rounded text-center text-[10px] font-medium">REPLY</span>
              <span className="text-neutral-400">Reply to 3+ classmates' threads</span>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="w-14 px-2 py-0.5 bg-violet-500/20 text-violet-400 rounded text-center text-[10px] font-medium">370</span>
              <span className="text-neutral-400">Post Fri + 2 replies by Tue</span>
            </div>
          </div>
        </GlassCard>

        {/* Footer */}
        <footer className="mt-10 text-center pb-6">
          <p className="text-[10px] text-neutral-600 uppercase tracking-widest">
            Late: 10%/day · Max 5 days · Due 11:59 PM EST
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CourseTracker;
