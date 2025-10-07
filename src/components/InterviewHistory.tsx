'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface Interview {
  _id: string;
  userId: string;
  scenario: string;
  meetingUrl: string;
  isDesktopCall: boolean;
  liveCoding: boolean;
  aiInterview: boolean;
  position: string;
  company: string;
  meetingLanguage: string;
  translationLanguage: string;
  resume: string;
  createdAt: string;
  __v: number;
}

interface InterviewHistoryProps {
  onNavigateToProfile?: () => void;
}

export default function InterviewHistory({ onNavigateToProfile }: InterviewHistoryProps) {
  const [scenario, setScenario] = useState('');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [keyword, setKeyword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [interviews, setInterviews] = useState<Interview[]>([]);
  const [filteredInterviews, setFilteredInterviews] = useState<Interview[]>([]);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
    const router = useRouter();

  useEffect(() => {
    const fetchInterviews = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const response = await fetch('/api/interview', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        if (!response.ok) {
          console.error('Failed to load interviews');
          return;
        }

        const result = await response.json();
        if (result.success) {
          setInterviews(result.data);
          setFilteredInterviews(result.data);
        }
      } catch (error) {
        console.error('Error loading interviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchInterviews();
  }, []);

  const handleSearch = () => {
    let filtered = [...interviews];

    if (scenario) {
      filtered = filtered.filter(interview =>
        interview.scenario.toLowerCase().includes(scenario.toLowerCase())
      );
    }

    if (fromDate) {
      const from = new Date(fromDate);
      from.setHours(0, 0, 0, 0);
      filtered = filtered.filter(interview =>
        new Date(interview.createdAt) >= from
      );
    }

    if (toDate) {
      const to = new Date(toDate);
      to.setHours(23, 59, 59, 999);
      filtered = filtered.filter(interview =>
        new Date(interview.createdAt) <= to
      );
    }

    if (keyword) {
      const k = keyword.toLowerCase();
      filtered = filtered.filter(interview =>
        interview.position.toLowerCase().includes(k) ||
        interview.company.toLowerCase().includes(k) ||
        interview.scenario.toLowerCase().includes(k)
      );
    }

    setFilteredInterviews(filtered);
  };

  const handleClear = () => {
    setScenario('');
    setFromDate('');
    setToDate('');
    setKeyword('');
    setFilteredInterviews(interviews);
  };
  const handleLogout = () => {
    localStorage.removeItem('token');
    if (session) {
      signOut({ callbackUrl: '/' });
    } else {
      window.location.href = '/';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 right-0 bg-[#cb4b0b] text-white p-4">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-xl font-bold">Buzzer™</h1>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-white text-2xl"
              >
                ×
              </button>
            </div>
            <nav className="space-y-4">
              <a href="#" className="block py-2 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Blog</a>
              <a href="#" className="block py-2 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Pricing</a>
              <a href="#" className="block py-2 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Contact</a>
              <a href="#" className="block py-2 hover:underline font-semibold" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</a>
              <a href="#" className="block py-2 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Console</a>
              <button
                onClick={() => {
                  // Handle logout - you might want to pass this as a prop
                  setIsMobileMenuOpen(false);
                }}
                className="block py-2 hover:underline text-left w-full"
              >
                Log out
              </button>
            </nav>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
              <button
                onClick={() => router.push('/dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back</span>
              </button>
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  BUZZER.IO
                </h1>
                <p className="text-xs text-gray-500 font-medium">Interview Intelligence Platform</p>
              </div>
            </div>
            <nav className="hidden md:flex items-center space-x-6">
              <a href="/console" className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium hover:scale-105">
                Console
              </a>
              <a href="#" className="text-gray-600 hover:text-orange-600 transition-all duration-200 font-medium hover:scale-105">
                PLD
              </a>
              <div className="h-6 w-px bg-gray-300"></div>
              <button
                onClick={handleLogout}
                className="bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-6 py-2.5 rounded-xl font-medium transition-all duration-200 hover:shadow-md hover:scale-105 border border-gray-200"
              >
                Logout
              </button>
            </nav>
          </div>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Filter Section */}

          <div className="bg-orange-50/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 mb-6 shadow-sm border border-orange-100 w-full">
            <div className="flex flex-col lg:flex-row items-start lg:items-end justify-between gap-4 lg:gap-6 w-full">

              {/* Left Side — Filters */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 flex-grow w-full">
                {/* Scenario Dropdown */}
                <div className="w-full">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Scenario
                  </label>
                  <select
                    value={scenario}
                    onChange={(e) => setScenario(e.target.value)}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition"
                  >
                    <option value="">Select one...</option>
                    <option value="technical">Technical Interview</option>
                    <option value="behavioral">Behavioral Interview</option>
                    <option value="coding">Coding Interview</option>
                    <option value="system-design">System Design</option>
                  </select>
                </div>
              </div>

              {/* Right Side — Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto lg:w-auto">
                <button
                  onClick={handleSearch}
                  className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-2.5 rounded-lg shadow-md hover:from-orange-700 hover:to-orange-800 transition-all flex items-center justify-center gap-2 w-full sm:w-auto"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                  <span className="font-medium">Search</span>
                </button>

                <button
                  onClick={handleClear}
                  className="bg-white text-orange-600 border border-orange-500 px-6 py-2.5 rounded-lg hover:bg-orange-50 transition-all flex items-center justify-center gap-2 shadow-sm w-full sm:w-auto"
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 6h16M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M10 11v6M14 11v6M5 6l1-2h12l1 2"
                    />
                  </svg>
                  <span className="font-medium">Clear</span>
                </button>
              </div>
            </div>
          </div>



          {/* Results Section */}
          <div className="min-h-screen bg-orange-50/70 backdrop-blur-sm rounded-2xl py-10 px-4 sm:px-6 lg:px-8 border border-orange-100">
            <div className="w-full mx-auto space-y-6">
              {/* Header */}
              <div className="bg-white/70 backdrop-blur-sm border border-white/20 rounded-3xl shadow-xl p-6 flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                    Interview History
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    Review your scheduled interviews and access meeting links
                  </p>
                </div>
                <div className="flex items-center space-x-2 bg-gradient-to-r from-orange-100 to-orange-200 px-4 py-2 rounded-full shadow-sm">
                  <span className="text-sm text-gray-700 font-medium">Results:</span>
                  <span className="text-xl font-bold text-orange-600">{filteredInterviews.length}</span>
                </div>
              </div>

              {/* Table or Message */}
              <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-white/20 shadow-xl overflow-hidden transition-all duration-300">
                {loading ? (
                  <div className="py-16 text-center text-gray-500">Loading interviews...</div>
                ) : filteredInterviews.length === 0 ? (
                  <div className="py-16 text-center">
                    <div className="w-20 h-20 bg-gradient-to-r from-orange-100 to-orange-200 rounded-full mx-auto flex items-center justify-center mb-6">
                      <svg
                        className="w-10 h-10 text-orange-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>
                    <p className="text-lg font-semibold text-gray-700 mb-2">
                      No interview history found
                    </p>
                    <p className="text-gray-500 text-sm">
                      Start scheduling interviews to see them appear here.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Table Header */}
                    <div className="hidden md:grid grid-cols-7 gap-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white text-sm font-semibold">
                      <div>No</div>
                      <div>Scheduled Time</div>
                      <div>Scenario</div>
                      <div>Company</div>
                      <div>Position</div>
                      <div>Status</div>
                      <div className="text-center">
                        <svg
                          className="w-4 h-4 mx-auto"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                        </svg>
                      </div>
                    </div>

                    {/* Table Rows */}
                    <div className="divide-y divide-gray-100">
                      {filteredInterviews.map((interview, index) => (
                        <div
                          key={interview._id}
                          className="grid grid-cols-7 gap-4 px-6 py-4 text-sm text-gray-700 hover:bg-orange-50/60 transition-colors duration-200"
                        >
                          <div className="font-medium">{index + 1}</div>
                          <div className="text-gray-600">
                            {new Date(interview.createdAt).toLocaleString()}
                          </div>
                          <div>{interview.scenario}</div>
                          <div>{interview.company}</div>
                          <div>{interview.position}</div>
                          <div>
                            <span className="bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
                              Scheduled
                            </span>
                          </div>
                          <div className="text-center">
                            <button
                              onClick={() => window.open(interview.meetingUrl, "_blank")}
                              className="group p-2 rounded-lg hover:bg-orange-100 transition-all duration-200"
                              title="Open Meeting"
                            >
                              <svg
                                className="w-5 h-5 text-orange-600 group-hover:text-orange-700"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth={2}
                                  d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                                />
                              </svg>
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>



        </main>
      </div>
    </div>
  );
}