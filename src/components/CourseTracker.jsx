import React, { useState, useEffect } from 'react';

const cn = (...classes) => classes.filter(Boolean).join(' ');

// Change this to your desired password
const SITE_PASSWORD = 'umgc2026';

const CourseTracker = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [selectedWeek, setSelectedWeek] = useState(3);
  const [activeTab, setActiveTab] = useState('schedule');
  const [expandedCourse, setExpandedCourse] = useState(null);

  // Check if already authenticated on mount
  useEffect(() => {
    const auth = localStorage.getItem('umgc-tracker-auth');
    if (auth === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

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
      <div className="min-h-dvh bg-neutral-950 text-neutral-100 font-mono flex items-center justify-center">
        <div className="max-w-xs w-full px-4">
          <div className="text-center mb-8">
            <h1 className="text-xs text-neutral-500 uppercase tracking-widest mb-1">UMGC Spring 2026</h1>
            <p className="text-2xl font-bold tracking-tight">Course Tracker</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
                className="w-full bg-neutral-900 border border-neutral-800 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-neutral-600 placeholder-neutral-600"
                autoFocus
              />
            </div>
            {error && (
              <p className="text-rose-400 text-xs text-center">{error}</p>
            )}
            <button
              type="submit"
              className="w-full bg-neutral-100 text-neutral-900 rounded-lg py-3 text-sm font-medium hover:bg-neutral-200 transition-colors"
            >
              Enter
            </button>
          </form>
          <p className="text-[10px] text-neutral-700 text-center mt-6">
            Private access only
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
      color: 'bg-sky-500',
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
      color: 'bg-emerald-500',
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
      color: 'bg-violet-500',
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
      { course: 'IFSM 301', name: 'Week 3 Discussion (REPLY)', pts: 20, status: 'upcoming', due: 'Tue Jan 28' },
      { course: 'IFSM 370', name: 'Project 1: Interview', pts: 140, status: 'upcoming', due: 'Mon Jan 27' },
    ]},
    4: { dates: 'Jan 28 - Feb 3', assignments: [
      { course: 'IFSM 304', name: 'Paper B', pts: 230, status: 'upcoming', due: 'Mon Feb 3' },
      { course: 'IFSM 301', name: 'IT Strategic Plan Pt 2', pts: 200, status: 'upcoming', due: 'Mon Feb 3' },
      { course: 'IFSM 370', name: 'Week 4 Discussion', pts: 40, status: 'upcoming', due: 'Post Fri, Reply Tue' },
      { course: 'IFSM 301', name: 'Week 4 Discussion (REPLY)', pts: 20, status: 'upcoming' },
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

  const getStatusColor = (status) => {
    switch (status) {
      case 'graded': return 'text-emerald-400';
      case 'submitted': return 'text-sky-400';
      case 'done': return 'text-emerald-400';
      case 'due': return 'text-amber-400';
      case 'upcoming': return 'text-neutral-500';
      default: return 'text-neutral-400';
    }
  };

  const getStatusText = (status, score) => {
    switch (status) {
      case 'graded': return score || '✓';
      case 'submitted': return 'awaiting grade';
      case 'done': return '✓';
      case 'due': return '⚠️ DUE';
      case 'upcoming': return '○';
      default: return '○';
    }
  };

  const ChevronIcon = ({ open }) => (
    <svg className={cn('size-4 transition-transform duration-200', open && 'rotate-180')} fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
    </svg>
  );

  return (
    <div className="min-h-dvh bg-neutral-950 text-neutral-100 font-mono">
      <div className="max-w-lg mx-auto px-4 py-6">

        {/* Header */}
        <header className="mb-6">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-xs text-neutral-500 uppercase tracking-widest mb-1">UMGC Spring 2026</h1>
              <p className="text-2xl font-bold tracking-tight">Course Tracker</p>
              <p className="text-xs text-neutral-600 mt-1">Updated: Jan 24, 2026</p>
            </div>
            <button
              onClick={handleLogout}
              className="text-[10px] text-neutral-600 hover:text-neutral-400 transition-colors uppercase tracking-wider"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Overall Grade Cards */}
        <div className="grid grid-cols-3 gap-2 mb-6">
          {Object.entries(courses).map(([code, info]) => (
            <div key={code} className="bg-neutral-900 rounded-lg p-3 text-center">
              <div className={cn('size-2 rounded-full mx-auto mb-2', info.color)} />
              <p className="text-[10px] text-neutral-500 uppercase tracking-wider">{code.split(' ')[1]}</p>
              <p className="text-xl font-bold">{info.currentGrade}%</p>
            </div>
          ))}
        </div>

        {/* Week Selector */}
        <div className="flex gap-1 mb-6 overflow-x-auto pb-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((week) => (
            <button
              key={week}
              onClick={() => setSelectedWeek(week)}
              className={cn(
                'w-10 h-10 rounded-lg text-sm font-medium transition-all flex-shrink-0 flex items-center justify-center',
                selectedWeek === week
                  ? 'bg-neutral-100 text-neutral-900'
                  : week === 3
                    ? 'bg-amber-500/20 text-amber-400 border border-amber-500/50'
                    : (week === 4 || week === 5 || week === 6)
                      ? 'bg-rose-500/10 text-rose-400 border border-rose-500/30'
                      : 'bg-neutral-900 text-neutral-400 hover:bg-neutral-800'
              )}
            >
              {week}
            </button>
          ))}
        </div>

        {/* Week Info */}
        <div className="mb-4">
          <p className="text-xs text-neutral-500">
            Week {selectedWeek} · {weeklySchedule[selectedWeek]?.dates}
            {selectedWeek === 3 && <span className="text-amber-400 ml-2">← Current</span>}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-neutral-800 pb-2">
          {['schedule', 'grades', 'courses'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-3 py-1.5 text-xs uppercase tracking-wider rounded transition-colors',
                activeTab === tab
                  ? 'bg-neutral-800 text-neutral-100'
                  : 'text-neutral-500 hover:text-neutral-300'
              )}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Schedule Tab */}
        {activeTab === 'schedule' && (
          <div className="space-y-2">
            {weeklySchedule[selectedWeek]?.assignments.length === 0 ? (
              <p className="text-neutral-500 text-sm py-8 text-center">No assignments this week</p>
            ) : (
              weeklySchedule[selectedWeek]?.assignments.map((item, i) => (
                <div
                  key={i}
                  className={cn(
                    'rounded-lg p-3 flex items-center justify-between',
                    item.status === 'due' ? 'bg-amber-500/10 border border-amber-500/30' : 'bg-neutral-900'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div className={cn('size-2 rounded-full', courses[item.course].color)} />
                    <div>
                      <p className="text-sm">{item.name}</p>
                      <p className="text-xs text-neutral-500">
                        {item.course} · {item.pts} pts
                        {item.due ? <span className={item.status === 'due' ? 'text-amber-400' : ''}> · {item.due}</span> : ''}
                      </p>
                      {item.note && <p className="text-xs text-violet-400 mt-0.5">{item.note}</p>}
                    </div>
                  </div>
                  <span className={cn('text-xs font-medium', getStatusColor(item.status))}>
                    {getStatusText(item.status, item.score)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Grades Tab */}
        {activeTab === 'grades' && (
          <div className="space-y-4">
            {Object.entries(courses).map(([code, courseInfo]) => (
              <div key={code} className="bg-neutral-900 rounded-lg p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <div className={cn('size-2 rounded-full', courseInfo.color)} />
                    <span className="text-sm font-medium">{code}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-lg font-bold">{courseInfo.currentGrade}%</span>
                    <p className="text-[10px] text-neutral-500">{courseInfo.earned}/{courseInfo.possible} pts</p>
                  </div>
                </div>
                <div className="space-y-1">
                  {grades[code].items.slice(0, 6).map((item, i) => (
                    <div key={i} className="flex justify-between text-xs">
                      <span className="text-neutral-400 flex-1">{item.name}</span>
                      <span className={cn('ml-2', getStatusColor(item.status))}>
                        {item.score !== undefined ? `${item.score}/${item.max}` : getStatusText(item.status)}
                      </span>
                    </div>
                  ))}
                  {grades[code].items.length > 6 && (
                    <p className="text-[10px] text-neutral-600 mt-2">+{grades[code].items.length - 6} more items</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Courses Tab */}
        {activeTab === 'courses' && (
          <div className="space-y-2">
            {Object.entries(courses).map(([code, info]) => {
              const isOpen = expandedCourse === code;
              return (
                <div key={code} className="bg-neutral-900 rounded-lg overflow-hidden">
                  <button
                    onClick={() => setExpandedCourse(isOpen ? null : code)}
                    className="w-full flex items-center justify-between p-3 hover:bg-neutral-800/50 transition-colors"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn('size-2 rounded-full', info.color)} />
                      <div className="text-left">
                        <p className="text-sm font-medium">{code}</p>
                        <p className="text-xs text-neutral-500">{info.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold">{info.currentGrade}%</span>
                      <ChevronIcon open={isOpen} />
                    </div>
                  </button>
                  {isOpen && (
                    <div className="border-t border-neutral-800 p-3 space-y-3">
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-0.5">Professor</p>
                        <p className="text-sm text-neutral-200">{info.prof}</p>
                        <p className="text-xs text-neutral-500">{info.email}</p>
                      </div>
                      <div>
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-0.5">Focus</p>
                        <p className="text-sm text-neutral-300">{info.focus}</p>
                      </div>
                      <div className="bg-violet-500/10 border border-violet-500/30 rounded-lg p-2.5">
                        <p className="text-[10px] text-violet-400 uppercase tracking-wider mb-1">Discussion Schedule</p>
                        <p className="text-xs text-violet-300">{info.discussionInfo}</p>
                      </div>
                      <div className="bg-neutral-800/50 rounded-lg p-2.5">
                        <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-1.5">Key Notes</p>
                        <ul className="space-y-1">
                          {info.keyNotes.map((n, i) => (
                            <li key={i} className="text-xs text-neutral-400">• {n}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Success Alert */}
        {selectedWeek === 3 && (
          <div className="mt-6 bg-emerald-500/10 border border-emerald-500/30 rounded-lg p-3">
            <p className="text-xs text-emerald-400 font-medium">✅ SUBMITTED</p>
            <p className="text-sm text-emerald-200 mt-1">IT Strategic Plan Part 1 (140 pts)</p>
            <p className="text-xs text-emerald-400/70 mt-1">IFSM 301 · Awaiting grade</p>
          </div>
        )}

        {/* Heavy Weeks Warning */}
        {(selectedWeek === 4 || selectedWeek === 5 || selectedWeek === 6) && (
          <div className="mt-6 bg-rose-500/10 border border-rose-500/30 rounded-lg p-3">
            <p className="text-xs text-rose-400 font-medium">⚠️ Heavy Week</p>
            <p className="text-xs text-rose-400/70 mt-1">
              {selectedWeek === 4 && 'Paper B (230) + IT Plan Pt2 (200) = 430 pts'}
              {selectedWeek === 5 && 'Paper C (230) + VPN Project (140) + HOST Week 5 Discussion = 390 pts'}
              {selectedWeek === 6 && 'CIO Memo (250) + Case Study (160) = 410 pts'}
            </p>
          </div>
        )}

        {/* Discussion Reminder */}
        <div className="mt-4 bg-neutral-900 rounded-lg p-3">
          <p className="text-[10px] text-neutral-500 uppercase tracking-wider mb-2">Discussion Tips</p>
          <ul className="space-y-1 text-xs text-neutral-400">
            <li>• <span className="text-emerald-400">HOST:</span> Post main + reply to 2+ classmates</li>
            <li>• <span className="text-sky-400">REPLY:</span> Reply to 3+ classmates' threads</li>
            <li>• <span className="text-violet-400">IFSM 370:</span> Post Fri + 2 replies by Tue</li>
          </ul>
        </div>

        {/* Footer */}
        <footer className="mt-10 text-center">
          <p className="text-[10px] text-neutral-600 uppercase tracking-wider">
            Late: 10%/day · Max 5 days · Due 11:59 PM EST
          </p>
        </footer>
      </div>
    </div>
  );
};

export default CourseTracker;
