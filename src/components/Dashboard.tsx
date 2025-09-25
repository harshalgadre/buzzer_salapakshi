'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import InterviewHistory from './InterviewHistory';

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('profile');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [newName, setNewName] = useState('Raj');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const router = useRouter();

  const handleNameSave = () => {
    // TODO: Implement name change functionality
    console.log('Saving name:', newName);
  };

  const handlePasswordUpdate = () => {
    // TODO: Implement password change functionality
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    console.log('Updating password');
  };

  const handleLogout = async () => {
    try {
      // Call logout API
      const response = await fetch('/api/auth/logout', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });

      if (response.ok) {
        // Clear token from localStorage
        localStorage.removeItem('token');
        // Redirect to landing page
        router.push('/');
      } else {
        console.error('Logout failed');
        // Still clear token and redirect even if API call fails
        localStorage.removeItem('token');
        router.push('/');
      }
    } catch (error) {
      console.error('Logout error:', error);
      // Clear token and redirect even on error
      localStorage.removeItem('token');
      router.push('/');
    }
  };

  // If Interview History is selected, show the InterviewHistory component
  if (activeTab === 'interview-history') {
    return <InterviewHistory onNavigateToProfile={() => setActiveTab('profile')} />;
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
              <a href="#" className="block py-2 hover:underline" onClick={() => setIsMobileMenuOpen(false)}>Console</a>
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
              <a href="#" className="hover:underline">Console</a>
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 flex items-center">
              <span className="mr-2">👋</span>
              Welcome, Raj!
            </h2>
          </div>

          {/* Change Name Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">Change Name</h3>
            <div className="flex flex-col md:flex-row md:items-center space-y-3 md:space-y-0 md:space-x-4">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                className="border border-gray-300 rounded px-3 py-2 w-full md:w-64 focus:outline-none focus:ring-2 focus:ring-orange-500"
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
            <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">Change Password</h3>
            <div className="space-y-4 max-w-full md:max-w-md">
              <input
                type="password"
                placeholder="Current Password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="password"
                placeholder="New Password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <input
                type="password"
                placeholder="Confirm Password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
              <button
                onClick={handlePasswordUpdate}
                className="bg-orange-600 text-white px-6 py-2 rounded hover:bg-orange-700 transition-colors w-full md:w-auto"
              >
                UPDATE
              </button>
            </div>
          </div>

          {/* Referral Relationship Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">Referral Relationship</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <div className="flex flex-col md:flex-row md:items-center">
                <span className="font-medium">Your Referrer:</span>
                <span className="md:ml-2 text-gray-600 break-all">neelix4info@gmail.com</span>
              </div>
              <div>
                <span className="font-medium">Your Referees:</span>
                <span className="ml-2 text-gray-600">0</span>
              </div>
            </div>
          </div>

          {/* Activity & Usage Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6 md:mb-8">
            <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">Activity & Usage</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 text-sm">
              <div className="space-y-2">
                <div className="flex justify-between md:block">
                  <span className="font-medium text-gray-700">Total Interviews:</span>
                  <span className="md:ml-2 text-gray-600">0</span>
                </div>
                <div className="flex justify-between md:block">
                  <span className="font-medium text-gray-700">Total Hints:</span>
                  <span className="md:ml-2 text-gray-600">0</span>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex flex-col md:block">
                  <span className="font-medium text-gray-700">Monthly Interview Count:</span>
                  <span className="md:ml-2 text-gray-600">0 / Limit 20</span>
                </div>
                <div className="flex flex-col md:block">
                  <span className="font-medium text-gray-700">Monthly Coding Interview Count:</span>
                  <span className="md:ml-2 text-gray-600">0 / Limit 20</span>
                </div>
              </div>
            </div>
          </div>

          {/* Billing & Subscription Section */}
          <div className="bg-white rounded-lg shadow-sm p-4 md:p-6">
            <h3 className="text-base md:text-lg font-medium text-gray-800 mb-4">Billing & Subscription</h3>
            <div className="space-y-2 text-sm text-gray-600">
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