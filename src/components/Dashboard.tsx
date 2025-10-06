'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserData {
  fullName: string;
  email: string;
  provider?: string;
  interviewsAttended?: number;
  currentPlan?: string;
  triggersUsed?: number;
  triggersLimit?: number;
}

// Modern icons as React components
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const LightningIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

const RocketIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
  </svg>
);

export default function Dashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  const fetchUserData = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/auth/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUserData({
          ...data.data,
          interviewsAttended: 12,
          currentPlan: 'Starter Plan',
          triggersUsed: 15,
          triggersLimit: 40
        });
      } else if (response.status === 401) {
        console.error('Authentication failed, redirecting to login');
        localStorage.removeItem('token');
        router.push('/login');
        return;
      } else {
        console.error('Error fetching user data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  }, [router]);

  useEffect(() => {
    if (session === undefined) {
      return;
    }

    const token = localStorage.getItem('token');
    
    if (session?.user) {
      if (session.user.jwt && !token) {
        localStorage.setItem('token', session.user.jwt);
      }
      
      if (session.user.name && session.user.email) {
        setUserData({
          fullName: session.user.name,
          email: session.user.email,
          provider: session.user.provider || 'google',
          interviewsAttended: 12,
          currentPlan: 'Starter Plan',
          triggersUsed: 15,
          triggersLimit: 40
        });
        setLoading(false);
      } else {
        fetchUserData();
      }
    } else if (token) {
      fetchUserData();
    } else {
      router.push('/login');
      return;
    }
  }, [session, router, fetchUserData]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    if (session) {
      signOut({ callbackUrl: '/' });
    } else {
      window.location.href = '/';
    }
  };

  const handleEditProfile = () => {
    router.push('/profile/edit');
  };

  const handleLaunchConsole = () => {
    router.push('/console');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-4 border-orange-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-orange-600 mx-auto absolute top-0"></div>
          </div>
          <p className="mt-6 text-lg text-gray-700 font-medium">Loading your dashboard...</p>
          <div className="mt-2 flex justify-center space-x-1">
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Modern Header with glassmorphism effect */}
      <header className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-3">
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

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-10 space-y-6 lg:space-y-0">
          <div className="space-y-2">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                <span className="text-white text-xl">👋</span>
              </div>
              <div>
                <h2 className="text-4xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent">
                  Welcome back, {userData?.fullName?.split(' ')[0] || 'User'}!
                </h2>
                <p className="text-gray-600 font-medium">Ready to ace your next interview?</p>
              </div>
            </div>
          </div>
          <button
            onClick={handleLaunchConsole}
            className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-xl hover:shadow-orange-200 hover:scale-105 flex items-center space-x-3 border border-orange-400"
          >
            <RocketIcon />
            <span>Launch Stealth Console</span>
            <div className="w-2 h-2 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </button>
        </div>

        {/* Modern Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {/* Interviews Attended Card */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-gradient-to-r from-orange-400 to-orange-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-orange-200 transition-all duration-300">
                  <UserIcon />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Interviews Attended</p>
                  <p className="text-4xl font-bold text-gray-900 mt-1">{userData?.interviewsAttended || 12}</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-orange-50 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <UserIcon />
              </div>
            </div>
            <div className="mt-4 flex items-center text-green-600 text-sm font-medium">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
              +12% from last month
            </div>
          </div>

          {/* Current Plan Card */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-gradient-to-r from-yellow-400 to-yellow-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-yellow-200 transition-all duration-300">
                  <StarIcon />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Current Plan</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{userData?.currentPlan || 'Starter Plan'}</p>
                </div>
              </div>
              <div className="w-16 h-16 bg-yellow-50 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <StarIcon />
              </div>
            </div>
            <div className="mt-4 flex items-center text-blue-600 text-sm font-medium">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
              Active subscription
            </div>
          </div>

          {/* Triggers Used Card */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-105 hover:bg-white/80">
            <div className="flex items-start justify-between">
              <div className="space-y-3">
                <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                  <LightningIcon />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-600 uppercase tracking-wide">Triggers Used</p>
                  <p className="text-4xl font-bold text-gray-900 mt-1">
                    {userData?.triggersUsed || 15}<span className="text-xl text-gray-500">/{userData?.triggersLimit || 40}</span>
                  </p>
                </div>
              </div>
              <div className="w-16 h-16 bg-blue-50 rounded-full flex items-center justify-center opacity-20 group-hover:opacity-40 transition-opacity duration-300">
                <LightningIcon />
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                <span>Usage</span>
                <span>{Math.round(((userData?.triggersUsed || 15) / (userData?.triggersLimit || 40)) * 100)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-blue-400 to-blue-500 h-2 rounded-full transition-all duration-500"
                  style={{ width: `${((userData?.triggersUsed || 15) / (userData?.triggersLimit || 40)) * 100}%` }}
                ></div>
              </div>
            </div>
          </div>
        </div>

        {/* Modern Weekly Activity Chart */}
        <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl mb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
                <ChartIcon />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">Weekly Activity</h3>
                <p className="text-gray-600">Your interview preparation progress</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">This week</p>
              <p className="text-2xl font-bold text-gray-900">28 hrs</p>
            </div>
          </div>
          
          <div className="grid grid-cols-7 gap-6">
            {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day, index) => {
              const height = Math.random() * 60 + 20;
              const isToday = index === new Date().getDay() - 1;
              return (
                <div key={day} className="flex flex-col items-center space-y-3 group">
                  <span className={`text-sm font-medium ${isToday ? 'text-orange-600' : 'text-gray-500'}`}>
                    {day}
                  </span>
                  <div className="h-32 w-8 bg-gray-100 rounded-full flex items-end p-1 relative overflow-hidden">
                    <div 
                      className={`w-full rounded-full transition-all duration-1000 ease-out ${
                        isToday 
                          ? 'bg-gradient-to-t from-orange-500 to-orange-400 shadow-lg' 
                          : 'bg-gradient-to-t from-gray-300 to-gray-200'
                      } group-hover:shadow-lg`}
                      style={{ 
                        height: `${height}%`,
                        animationDelay: `${index * 100}ms`
                      }}
                    ></div>
                    {isToday && (
                      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                    )}
                  </div>
                  <span className="text-xs text-gray-400 font-medium">
                    {Math.round(height / 10)}h
                  </span>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 flex items-center justify-center space-x-8 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-orange-400 rounded-full"></div>
              <span className="text-gray-600">Today</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-gradient-to-r from-gray-300 to-gray-200 rounded-full"></div>
              <span className="text-gray-600">Other days</span>
            </div>
          </div>
        </div>

        {/* Modern Action Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Profile Management Card */}
          <div className="group bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl hover:shadow-2xl transition-all duration-300">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Profile Management</h3>
                <p className="text-gray-600">Customize your interview experience</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <button
                onClick={handleEditProfile}
                className="w-full group bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-blue-200 hover:scale-105 flex items-center justify-between"
              >
                <span>Edit Profile</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
              
              <button
                onClick={() => router.push('/interview/history')}
                className="w-full group bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white px-6 py-4 rounded-2xl font-semibold transition-all duration-300 hover:shadow-lg hover:shadow-gray-300 hover:scale-105 flex items-center justify-between"
              >
                <span>View Interview History</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

          {/* Quick Stats Card */}
          <div className="bg-white/70 backdrop-blur-sm rounded-3xl p-8 border border-white/20 shadow-xl">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900">Quick Stats</h3>
                <p className="text-gray-600">Your performance at a glance</p>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✓</span>
                  </div>
                  <span className="font-medium text-gray-900">Success Rate</span>
                </div>
                <span className="text-xl font-bold text-green-600">85%</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">⏱</span>
                  </div>
                  <span className="font-medium text-gray-900">Avg. Duration</span>
                </div>
                <span className="text-xl font-bold text-blue-600">45m</span>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-purple-50 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">🎯</span>
                  </div>
                  <span className="font-medium text-gray-900">Streak</span>
                </div>
                <span className="text-xl font-bold text-purple-600">7 days</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-lg">B</span>
              </div>
              <h3 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                BUZZER.IO
              </h3>
            </div>
            <p className="text-gray-600 max-w-md mx-auto">
              Empowering your interview success with AI-driven insights and personalized preparation tools.
            </p>
            <div className="flex items-center justify-center space-x-6 pt-4">
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
              <span className="text-sm text-gray-500 font-medium">Powered by AI Intelligence</span>
              <span className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
