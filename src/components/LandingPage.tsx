'use client';

import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from "next/image";
export default function LandingPage() {
  const { status } = useSession();
  const router = useRouter();

  const isAuthenticated = status === 'authenticated';

  return (
    <div className="min-h-screen bg-[#cb4b0b]">
      {/* Header */}
      <header className="flex justify-between items-center px-4 md:px-12 py-6">
        <div className="flex items-center">
          <h1 className="text-white text-2xl md:text-3xl font-bold">Buzzer<sup className="text-sm">™</sup></h1>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <button className="bg-[#cb4b0b] hover:bg-orange-400 text-white px-6 py-2 rounded-full font-medium transition-colors">
            Try Demo
          </button>
          {isAuthenticated ? (
            <>
              <button
                onClick={() => router.push('/dashboard')}
                className="text-white hover:text-orange-200 transition-colors font-medium"
              >
                Dashboard
              </button>
              <button
                onClick={() => router.push('/console')}
                className="text-white hover:text-orange-200 transition-colors font-medium"
              >
                Console
              </button>
              <button
                onClick={() => signOut({ callbackUrl: '/' })}
                className="text-white hover:text-orange-200 transition-colors font-medium"
              >
                Logout
              </button>
            </>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="text-white hover:text-orange-200 transition-colors font-medium"
            >
              Login
            </button>
          )}
        </nav>

        {/* Mobile Menu Button */}
        <button className="md:hidden text-white p-2">
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </header>

      {/* Main Content */}
      <main className="px-4 md:px-12 py-8 md:py-16">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 items-start">
            {/* Left Column - Text Content */}
            <div className="text-white pt-4 md:pt-8 text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl lg:text-5xl  mb-8 md:mb-12 leading-tight text-[#f7fa8e]"
                  style={{ fontFamily: 'Arial, "Helvetica Neue", Helvetica, sans-serif' }}>
                  Free Online Meeting<br />
                  Copilot for Job Interviews<br />
                  & All
              </h2>

              {/* Feature List */}
              <div className="space-y-3 md:space-y-4 mb-8 md:mb-12 text-sm md:text-lg text-left">
                <div className="flex items-center space-x-3 md:space-x-4">
                  
                  <span><strong>🧑 Job Seekers</strong> in Interviews & Live Coding Challenges</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                  
                  <span><strong>🔍 HR Managers</strong> & Talent Acquisition Specialists</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                 
                  <span><strong>🏡 Remote Employees</strong> in Team Meetings</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                  
                  <span><strong>📝 Consultants</strong> in Phone & Online Meetings</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                 
                  <span><strong>🎧 Customer Supports</strong> & Sales Reps</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                  
                  <span><strong>🤝 Freelancers & Entrepreneurs</strong> in Client Interviews</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                 
                  <span><strong>🎓 Job Candidates & Students</strong> in Online Assessments</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                 
                  <span><strong>🌍 Non-native Speakers</strong> with Language Barriers</span>
                </div>
                <div className="flex items-center space-x-3 md:space-x-4">
                  
                  <span><strong>☕ Small Talkers</strong> for Friendly Chat</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-3 md:gap-4 items-center lg:items-start">
                <button className="w-full md:w-auto border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-medium">
                  Chrome Extension
                </button>
                <button
                  onClick={() => isAuthenticated ? router.push('/console') : router.push('/login')}
                  className="w-full md:w-auto border-2 border-white text-white px-6 py-3 rounded-lg hover:bg-white hover:text-orange-600 transition-colors font-medium"
                >
                  Stealth Console
                </button>
                <button
                  onClick={() => isAuthenticated ? router.push('/dashboard') : router.push('/login')}
                  className="w-full md:w-auto bg-white text-orange-600 px-6 py-3 rounded-lg font-medium hover:bg-orange-50 transition-colors"
                >
                  {isAuthenticated ? 'Go to Dashboard' : 'Try Demo'}
                </button>
              </div>
            </div>
            {/* Right Column - Video/Image */}
            <div className="relative lg:pl-8 pt-8 lg:pt-16 order-first lg:order-last">
              <div className="shadow-2xl overflow-hidden">
                <video
                  src="https://ntro-interview.github.io/assets/videos/Ntro-Gif.webm"
                  autoPlay
                  loop
                  muted
                  className="w-full h-auto object-cover [clip-path:inset(0_7%)]"
                />
              </div>
            </div>
          </div>
          
        </div>
      </main>
          
      {/* Features Section */}
      <section className="px-4 md:px-12 py-12 md:py-16 bg-[#cb4b0b]">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
            {/* Feature 1 */}
            <div className="text-center text-white">
              <div className="w-16 h-16  bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                      src="https://cdn.prod.website-files.com/66c62ca3eae685b96562fa3f/66c62ca3eae685b96562fb9e_school.svg"
                      alt="icon"
                      width={64}
                      height={64}
                      className="icon-image"
                    />
              </div>
              <h3 className="text-lg  text-[#f7fa8e] md:text-xl font-bold mb-3">99.99% of Accuracy</h3>
              <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                Our out-of-the-box approach of speech recognition guarantees the world&apos;s top quality of response.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center text-white">
              <div className="w-16 h-16  bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                      src="https://cdn.prod.website-files.com/66c62ca3eae685b96562fa3f/66c62ca3eae685b96562fbb0_view_in_ar.svg"
                      alt="icon"
                      width={64}
                      height={64}
                      className="icon-image"
                    />
              </div>
              <h3 className="text-lg  text-[#f7fa8e] md:text-xl font-bold mb-3">Literally Instant Hint</h3>
              <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                No need to wait for AI with awkward silence. It responds right when you should speak.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center text-white">
              <div className="w-16 h-16  bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Image
                      src="https://cdn.prod.website-files.com/66c62ca3eae685b96562fa3f/66c62ca3eae685b96562fbaf_sentiment_satisfied.svg"
                      alt="icon"
                      width={64}
                      height={64}
                      className="icon-image"
                    />
              </div>
              <h3 className="text-lg  text-[#f7fa8e] md:text-xl font-bold mb-3">Shocked Pricing</h3>
              <p className="text-xs md:text-sm opacity-90 leading-relaxed">
                Unlike others, we have the most generous forever-free plan. Your success is our win!
              </p>
            </div>
          </div>
        </div>
      </section>
          
      {/* Footer */}
      <footer className="bg-[#cb4b0b] px-4 md:px-12 py-8 md:py-12">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
            {/* Brand */}
            <div className="text-white">
              <h3 className="text-2xl font-bold mb-4">Buzzer<sup className="text-sm">™</sup></h3>
              <p className="text-sm opacity-75 mb-4">©2023 Buzzer™ All rights reserved</p>
              <div className="flex items-center text-sm">
                <span className="opacity-75">Proudly based in</span>
                <span className="ml-2 font-medium">Phoenix, Arizona 🇺🇸</span>
              </div>
            </div>

            {/* Links */}
            <div className="text-white">
              <h4 className="font-bold mb-4">Links</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Chrome Store</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Try Demo</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">About Us</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Blog</a></li>
              </ul>
            </div>

            {/* Follow Us */}
            <div className="text-white">
              <h4 className="font-bold mb-4">Follow Us</h4>
              <ul className="space-y-2 text-sm opacity-75">
                <li className="flex items-center space-x-2">
                  <span></span>
                  <a href="#" className="hover:opacity-100 transition-opacity">Facebook</a>
                </li>
                <li className="flex items-center space-x-2">
                  <span></span>
                  <a href="#" className="hover:opacity-100 transition-opacity">LinkedIn</a>
                </li>
                <li className="flex items-center space-x-2">
                  <span></span>
                  <a href="#" className="hover:opacity-100 transition-opacity">X</a>
                </li>
                <li className="flex items-center space-x-2">
                  <span></span>
                  <a href="#" className="hover:opacity-100 transition-opacity">YouTube</a>
                </li>
                <li className="flex items-center space-x-2">
                  <span></span>
                  <a href="#" className="hover:opacity-100 transition-opacity">Instagram</a>
                </li>
                <li className="flex items-center space-x-2">
                  <span></span>
                  <a href="#" className="hover:opacity-100 transition-opacity">TikTok</a>
                </li>
                <li className="flex items-center space-x-2">
                  <span></span>
                  <a href="#" className="hover:opacity-100 transition-opacity">Discord</a>
                </li>
              </ul>
            </div>

            {/* Support & Account */}
            <div className="text-white">
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-sm opacity-75 mb-6">
                <li><a href="#" className="hover:opacity-100 transition-opacity">Support Desk</a></li>
                <li><a href="#" className="hover:opacity-100 transition-opacity">Contact Us</a></li>
              </ul>
              
              <h4 className="font-bold mb-4">Account</h4>
              <ul className="space-y-2 text-sm opacity-75">
                {isAuthenticated ? (
                  <>
                    <li>
                      <button
                        onClick={() => router.push('/dashboard')}
                        className="hover:opacity-100 transition-opacity"
                      >
                        Dashboard
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => router.push('/console')}
                        className="hover:opacity-100 transition-opacity"
                      >
                        Console
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => signOut({ callbackUrl: '/' })}
                        className="hover:opacity-100 transition-opacity"
                      >
                        Log Out
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li>
                      <button
                        onClick={() => router.push('/login')}
                        className="hover:opacity-100 transition-opacity"
                      >
                        Login
                      </button>
                    </li>
                    <li>
                      <button
                        onClick={() => router.push('/signup')}
                        className="hover:opacity-100 transition-opacity"
                      >
                        Sign Up
                      </button>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}