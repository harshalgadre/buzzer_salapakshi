'use client';

import { useState, useEffect } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import InterviewHistory from './InterviewHistory';
import { validatePasswordChange, generatePasswordStrengthText } from '@/lib/password-utils';
import { canChangePassword } from '@/lib/test-utils';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newName, setNewName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [userData, setUserData] = useState<{ fullName: string; email: string; provider?: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect if session is still loading
    if (session === undefined) {
      return;
    }

    const token = localStorage.getItem('token');
    
    // Check for NextAuth session first
    if (session?.user) {
      // If NextAuth session exists, store JWT token for API compatibility
      if (session.user.jwt && !token) {
        localStorage.setItem('token', session.user.jwt);
      }
      
      // Set user data from session if available
      if (session.user.name && session.user.email) {
        setUserData({
          fullName: session.user.name,
          email: session.user.email,
          provider: session.user.provider || 'google'
        });
        setNewName(session.user.name);
        setLoading(false);
      } else {
        fetchUserData();
      }
    } else if (token) {
      // Fallback to token-based auth (local login)
      fetchUserData();
    } else {
      // No authentication found, redirect to login
      router.push('/login');
      return;
    }
  }, [session, router]);

  const fetchUserData = async () => {
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
        setUserData(data.data);
        setNewName(data.data.fullName);
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
  };

  const handleNameSave = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ fullName: newName }),
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
        alert('Name updated successfully!');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to update name');
      }
    } catch (error) {
      console.error('Error updating name:', error);
      alert('Failed to update name');
    }
  };

  const handlePasswordUpdate = async () => {
    // Clear previous messages
    setPasswordMessage({ type: null, text: '' });

    // Validation using utility function
    const validation = validatePasswordChange(currentPassword, newPassword, confirmPassword);
    if (!validation.isValid) {
      setPasswordMessage({ type: 'error', text: validation.errors[0] });
      return;
    }

    setPasswordLoading(true);

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        setPasswordMessage({ type: 'error', text: 'Authentication token not found. Please log in again.' });
        return;
      }

      const response = await fetch('/api/auth/change-password', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          currentPassword,
          newPassword,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setPasswordMessage({ type: 'success', text: 'Password updated successfully!' });
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordMessage({ type: 'error', text: data.message || 'Failed to update password' });
      }
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordMessage({ type: 'error', text: 'Network error. Please try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    // If there's a NextAuth session, sign out from it too
    if (session) {
      signOut({ callbackUrl: '/' });
    } else {
      // For local login, just redirect
      window.location.href = '/';
    }
  };

  // If Interview History is selected, show the InterviewHistory component
  if (activeTab === 'interview-history') {
    return <InterviewHistory onNavigateToProfile={() => setActiveTab('profile')} />;
  }

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="absolute top-0 left-0 right-0 bg-orange-600 text-white p-4">
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
              <a href="#" className="block py-2 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</a>
              <a href="/console" className="block py-2 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Console</a>
              <button
                onClick={() => {
                  handleLogout();
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
      <header className="bg-orange-600 text-white px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 md:space-x-8">
            <h1 className="text-xl md:text-2xl font-bold">Buzzer™</h1>
            {/* Desktop Navigation */}
            <nav className="hidden md:flex space-x-6 text-sm">
              <a href="#" className="hover:underline">Blog</a>
              <a href="#" className="hover:underline">Pricing</a>
              <a href="#" className="hover:underline">Contact</a>
              <a href="#" className="hover:underline">Dashboard</a>
              <a href="/console" className="hover:underline">Console</a>
              <button
                onClick={handleLogout}
                className="hover:underline bg-transparent border-none text-white cursor-pointer"
              >
                Log out
              </button>
            </nav>
          </div>
          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden text-white text-xl focus:outline-none"
            aria-label="Toggle mobile menu"
          >
            <div className="w-6 h-6 flex flex-col justify-center items-center">
              <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1' : '-translate-y-1'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-opacity duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`block w-5 h-0.5 bg-white transition-transform duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1' : 'translate-y-1'}`}></span>
            </div>
          </button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row">
        {/* Mobile Tab Navigation */}
        <div className="md:hidden bg-white border-b border-gray-200">
          <div className="flex">
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'profile' 
                  ? 'bg-orange-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('profile')}
            >
              Profile
            </button>
            <button
              className={`flex-1 px-4 py-3 text-sm font-medium ${
                activeTab === 'interview-history' 
                  ? 'bg-orange-600 text-white' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
              onClick={() => setActiveTab('interview-history')}
            >
              Interview History
            </button>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-sm">
          <div className="p-4">
            <div className="space-y-2">
              <div 
                className={`px-3 py-2 rounded text-sm font-medium cursor-pointer ${
                  activeTab === 'profile' 
                    ? 'bg-orange-600 text-white' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('profile')}
              >
                Profile
              </div>
              <div 
                className={`px-3 py-2 rounded text-sm cursor-pointer ${
                  activeTab === 'interview-history' 
                    ? 'bg-orange-600 text-white font-medium' 
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
                onClick={() => setActiveTab('interview-history')}
              >
                Interview History
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Welcome Section */}
          <div className="mb-6 md:mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-black mb-4 flex items-center">
              <span className="mr-2">👋</span>
              Welcome, {loading ? '...' : userData ? userData.fullName.split(' ')[0] : 'User'}!
            </h2>
          </div>

          {/* Change Name Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-medium text-black mb-4">Change Name</h3>
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black"
              />
              <button
                onClick={handleNameSave}
                className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors w-full md:w-auto"
              >
                SAVE
              </button>
            </div>
          </div>

          {/* Change Password Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-medium text-black mb-4">Change Password</h3>
            {!canChangePassword(userData) ? (
              <div className="text-sm text-gray-600 bg-blue-50 border border-blue-200 rounded-md p-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-blue-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Password change is not available for Google accounts. You can manage your password through your Google account settings.
                </div>
              </div>
            ) : (
              <div className="space-y-4 max-w-full md:max-w-md">
                {/* Success/Error Message */}
                {passwordMessage.type && (
                  <div className={`p-3 rounded-md text-sm ${
                    passwordMessage.type === 'success' 
                      ? 'bg-green-50 border border-green-200 text-green-800' 
                      : 'bg-red-50 border border-red-200 text-red-800'
                  }`}>
                    <div className="flex items-center">
                      {passwordMessage.type === 'success' ? (
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      )}
                      {passwordMessage.text}
                    </div>
                  </div>
                )}

                <input
                  type="password"
                  placeholder="Current Password"
                  value={currentPassword}
                  onChange={(e) => {
                    setCurrentPassword(e.target.value);
                    if (passwordMessage.type) setPasswordMessage({ type: null, text: '' });
                  }}
                  disabled={passwordLoading}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <div>
                  <input
                    type="password"
                    placeholder="New Password (min. 6 characters)"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordMessage.type) setPasswordMessage({ type: null, text: '' });
                    }}
                    disabled={passwordLoading}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                  />
                  {newPassword && (
                    <div className="mt-1 text-sm">
                      <span className="text-gray-600">Strength: </span>
                      <span className={`font-medium ${
                        generatePasswordStrengthText(newPassword) === 'Weak' ? 'text-red-600' :
                        generatePasswordStrengthText(newPassword) === 'Medium' ? 'text-yellow-600' :
                        'text-green-600'
                      }`}>
                        {generatePasswordStrengthText(newPassword)}
                      </span>
                    </div>
                  )}
                </div>
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  value={confirmPassword}
                  onChange={(e) => {
                    setConfirmPassword(e.target.value);
                    if (passwordMessage.type) setPasswordMessage({ type: null, text: '' });
                  }}
                  disabled={passwordLoading}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500 text-black disabled:bg-gray-100 disabled:cursor-not-allowed"
                />
                <button
                  onClick={handlePasswordUpdate}
                  disabled={passwordLoading}
                  className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors w-full md:w-auto disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {passwordLoading ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating...
                    </>
                  ) : (
                    'UPDATE PASSWORD'
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Referral Relationship Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-medium text-black mb-4">Referral Relationship</h3>
            <div className="space-y-2 text-sm text-black">
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-medium">Your Referrer:</span>
                <span className="md:ml-2 text-black break-all">neelix4info@gmail.com</span>
              </div>
              <div>
                <span className="font-medium">Your Referees:</span>
                <span className="ml-2 text-black">0</span>
              </div>
            </div>
          </div>

          {/* Activity & Usage Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-medium text-black mb-4">Activity & Usage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between md:block">
                  <span className="font-medium text-black">Total Interviews:</span>
                  <span className="md:ml-2 text-black">0</span>
                </div>
                <div className="flex justify-between md:block">
                  <span className="font-medium text-black">Total Hints:</span>
                  <span className="md:ml-2 text-black">0</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col md:block">
                  <span className="font-medium text-black">Monthly Interview Count:</span>
                  <span className="md:ml-2 text-black">0 / Limit 20</span>
                </div>
                <div className="flex flex-col md:block">
                  <span className="font-medium text-black">Monthly Coding Interview Count:</span>
                  <span className="md:ml-2 text-black">0 / Limit 20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Subscription Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">Billing & Subscription</h3>
            <div className="space-y-2 text-sm text-black">
              <div className="flex justify-between md:block">
                <span className="font-medium">Credit Balance:</span>
                <span className="md:ml-2">$200</span>
              </div>
              <div className="flex justify-between md:block">
                <span className="font-medium">Valid Plan:</span>
                <span className="md:ml-2">Starter</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}