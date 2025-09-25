'use client';

import { useState } from 'react';

interface InterviewHistoryProps {
  onNavigateToProfile?: () => void;
}

export default function InterviewHistory({ onNavigateToProfile }: InterviewHistoryProps) {
  const [scenario, setScenario] = useState('');
  const [fromDate, setFromDate] = useState('2025-09-24');
  const [toDate, setToDate] = useState('2025-09-24');
  const [keyword, setKeyword] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleSearch = () => {
    // TODO: Implement search functionality
    console.log('Searching with filters:', { scenario, fromDate, toDate, keyword });
  };

  const handleClear = () => {
    setScenario('');
    setFromDate('2025-09-24');
    setToDate('2025-09-24');
    setKeyword('');
  };

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
      <header className="bg-orange-600 text-white px-4 md:px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4 md:space-x-8">
            <h1 className="text-xl md:text-2xl font-bold">Buzzer™</h1>
            <nav className="hidden md:flex space-x-6 text-sm">
              <a href="#" className="hover:underline">Blog</a>
              <a href="#" className="hover:underline">Pricing</a>
              <a href="#" className="hover:underline">Contact</a>
              <a href="#" className="hover:underline font-semibold">Dashboard</a>
              <a href="#" className="hover:underline">Console</a>
              <a href="#" className="hover:underline">Log out</a>
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
              className="flex-1 px-4 py-3 text-sm text-gray-600 hover:bg-gray-100"
              onClick={onNavigateToProfile}
            >
              Profile
            </button>
            <button className="flex-1 px-4 py-3 text-sm font-medium bg-orange-600 text-white">
              Interview History
            </button>
          </div>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 bg-white shadow-sm">
          <div className="p-4">
            <div className="space-y-2">
              <div 
                className="text-gray-600 px-3 py-2 text-sm hover:bg-gray-100 rounded cursor-pointer"
                onClick={onNavigateToProfile}
              >
                Profile
              </div>
              <div className="bg-orange-600 text-white px-3 py-2 rounded text-sm font-medium">
                Interview History
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-8">
          {/* Filter Section */}
          <div className="bg-orange-100 rounded-lg p-4 md:p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
              {/* Scenario Dropdown */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scenario</label>
                <select 
                  value={scenario}
                  onChange={(e) => setScenario(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="">Select one...</option>
                  <option value="technical">Technical Interview</option>
                  <option value="behavioral">Behavioral Interview</option>
                  <option value="coding">Coding Interview</option>
                  <option value="system-design">System Design</option>
                </select>
              </div>

              {/* From Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                <input
                  type="date"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* To Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                <input
                  type="date"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>

              {/* Keyword */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Keyword</label>
                <input
                  type="text"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  placeholder="Enter keyword..."
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-500"
                />
              </div>
            </div>

            {/* Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
              <button
                onClick={handleSearch}
                className="bg-orange-600 text-white px-6 py-2 rounded-md hover:bg-orange-700 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <span>Search</span>
              </button>
              <button
                onClick={handleClear}
                className="bg-white text-orange-600 border border-orange-600 px-6 py-2 rounded-md hover:bg-orange-50 transition-colors flex items-center justify-center space-x-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 6l16 0M4 6v12a2 2 0 002 2h12a2 2 0 002-2V6M10 11v6M14 11v6M5 6l1-2h12l1 2" />
                </svg>
                <span>Clear</span>
              </button>
            </div>
          </div>

          {/* Results Section */}
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            {/* Search Results Header */}
            <div className="bg-gray-100 px-4 md:px-6 py-3 border-b">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600">Searched Result:</span>
                <span className="text-lg font-semibold text-orange-600">0</span>
              </div>
            </div>

            {/* Table Header - Desktop */}
            <div className="hidden md:block bg-orange-600 text-white">
              <div className="grid grid-cols-7 gap-4 px-6 py-3 text-sm font-medium">
                <div>No</div>
                <div>Scheduled Time</div>
                <div>Scenario</div>
                <div>Company</div>
                <div>Position</div>
                <div>Meeting Status</div>
                <div className="text-center">
                  <svg className="w-4 h-4 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Empty State */}
            <div className="px-4 md:px-6 py-8 md:py-12 text-center text-gray-500">
              <div className="mb-4">
                <svg className="w-12 md:w-16 h-12 md:h-16 mx-auto text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p className="text-base md:text-lg font-medium mb-2">No interview history found</p>
              <p className="text-sm">Start scheduling interviews to see your history here.</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}