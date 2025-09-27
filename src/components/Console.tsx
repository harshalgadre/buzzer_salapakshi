'use client';

import { useState } from 'react';
import Image from 'next/image';

export default function Console() {

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-red-600 px-4 py-2 text-center text-sm">
        You should login Ntro.io first.
        <span className="float-right space-x-4">
          <button className="underline hover:no-underline">Log In</button>
          <button className="underline hover:no-underline">Sign Up</button>
        </span>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Left Content */}
        <div className="flex-1 p-8">
          {/* Logo */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">🍯</span>
              </div>
              <h1 className="text-2xl font-bold text-orange-500">Stealth Console</h1>
            </div>
          </div>

          {/* Status */}
          <div className="mb-8">
            <div className="flex items-center space-x-2 text-lg">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="font-medium">Started meeting :</span>
              <span className="text-gray-300">No started interview.</span>
            </div>
          </div>

          {/* How to connect section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 flex items-center">
              🚀 How to connect the meeting?
            </h2>
            
            <div className="space-y-3 text-sm text-gray-300">
              <div className="flex items-start space-x-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">1</span>
                <span>Click our Chrome extension icon in the meeting page, before &ldquo;Ask to Join&rdquo;.</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">2</span>
                <span>Click &ldquo;Connect&rdquo; from our extension page.</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">3</span>
                <span>Select &ldquo;Entire Screen&rdquo; and click &ldquo;Share&rdquo;.</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="bg-orange-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">4</span>
                <div className="flex flex-col">
                  <span>(🔥NOTE! ) Hide the screen-sharing widget.</span>
                  <div className="mt-2">
                    <Image
                      src="/api/placeholder/300/60"
                      alt="Screen sharing widget"
                      width={300}
                      height={60}
                      className="border border-orange-500 rounded"
                      style={{backgroundColor: '#1a1a1a', padding: '8px'}}
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex items-start space-x-3">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">5</span>
                <span>Now ready to go. Ask to join!</span>
              </div>
            </div>
          </div>

          {/* Command Options */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">⚡</span>
              </div>
              <div>
                <span className="text-orange-400 font-medium">Code</span>
                <span className="text-gray-300 ml-2">: Get the best code solution.</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-orange-400 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">💬</span>
              </div>
              <div>
                <span className="text-orange-400 font-medium">Explain</span>
                <span className="text-gray-300 ml-2">: Crack &ldquo;How to modify this code to use Array?&rdquo;-like sudden questions.</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-orange-400 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">❓</span>
              </div>
              <div>
                <span className="text-orange-400 font-medium">Help Me</span>
                <span className="text-gray-300 ml-2">: Trigger AI hint to crush tricky interview question.</span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 bg-gray-800 rounded-lg hover:bg-gray-700 transition-colors cursor-pointer">
              <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
                <span className="text-white text-sm font-bold">📱</span>
              </div>
              <div>
                <span className="text-blue-400 font-medium">Screen</span>
                <span className="text-gray-300 ml-2">: Shoot one by one, for over-single-screen or multi-file code task.</span>
              </div>
            </div>
          </div>

          {/* Shortcut Keys */}
          <div className="mt-8">
            <p className="text-sm text-gray-400">
              + Shortcut Keys are remotely available even in the coding page.
            </p>
          </div>
        </div>

        {/* Right Sidebar */}
        <div className="w-20 bg-gray-800 flex flex-col items-center py-8">
          {/* Top Tools Section */}
          <div className="flex flex-col space-y-12 mb-auto">
            {/* Bullet Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="flex flex-col space-y-1">
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
                <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
              </div>
              <span className="text-xs text-gray-400 font-medium">Bullet</span>
            </div>

            {/* Detail Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-10 bg-gray-600 rounded-lg flex items-center justify-center">
                <div className="flex flex-col space-y-1">
                  <div className="w-6 h-1 bg-gray-400 rounded"></div>
                  <div className="w-4 h-1 bg-gray-400 rounded"></div>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-medium">Detail</span>
            </div>

            {/* Transcript Section */}
            <div className="flex flex-col items-center space-y-3">
              <div className="w-12 h-10 bg-gray-600 rounded-lg flex items-center justify-center relative">
                <div className="flex flex-col space-y-1">
                  <div className="w-6 h-1 bg-gray-400 rounded"></div>
                  <div className="w-4 h-1 bg-gray-400 rounded"></div>
                  <div className="w-5 h-1 bg-gray-400 rounded"></div>
                </div>
                <div className="absolute -right-1 -top-1 w-4 h-6 bg-gray-500 rounded-sm flex items-center justify-center">
                  <div className="w-2 h-3 bg-gray-400 rounded-full"></div>
                </div>
              </div>
              <span className="text-xs text-gray-400 font-medium">Transcript</span>
            </div>
          </div>

          {/* Action Buttons Section */}
          <div className="flex flex-col space-y-4 mt-12">
            {/* Code Button */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex flex-col items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
              <div className="text-white text-lg font-bold mb-1">{'</>'}</div>
              <div className="text-white text-xs font-medium">Code</div>
              <div className="text-yellow-200 text-xs">Cmd + .</div>
            </div>

            {/* Explain Button */}
            <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-600 rounded-2xl flex flex-col items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
              <div className="text-white text-lg font-bold mb-1">💬</div>
              <div className="text-white text-xs font-medium">Explain</div>
              <div className="text-yellow-200 text-xs">Cmd + ,</div>
            </div>

            {/* Screen Button */}
            <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex flex-col items-center justify-center shadow-lg cursor-pointer hover:scale-105 transition-transform">
              <div className="text-white text-lg font-bold mb-1">📷</div>
              <div className="text-white text-xs font-medium">Screen</div>
              <div className="text-blue-200 text-xs">Cmd+Insert</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}