
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { validatePasswordChange, generatePasswordStrengthText } from '@/lib/password-utils';
import { canChangePassword } from '@/lib/test-utils';

// Modern icons as React components
const UserIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const MailIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

const BrainIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
  </svg>
);

const DocumentIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const ShieldIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
  </svg>
);

const StarIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
  </svg>
);

const SparklesIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
  </svg>
);

interface UserData {
  fullName: string;
  email: string;
  provider?: string;
  skills?: string[];
  bio?: string;
  phone?: string;
  location?: string;
}

export default function EditProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  
  // Form states
  const [fullName, setFullName] = useState('');
  const [bio, setBio] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [skills, setSkills] = useState<string[]>([]);
  const [newSkill, setNewSkill] = useState('');
  const [resume, setResume] = useState<File | null>(null);
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState<{ type: 'success' | 'error' | null; text: string }>({ type: null, text: '' });
  
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
        setUserData(data.data);
        setFullName(data.data.fullName || '');
        setBio(data.data.bio || '');
        setPhone(data.data.phone || '');
        setLocation(data.data.location || '');
        setSkills(data.data.skills || []);
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
          provider: session.user.provider || 'google'
        });
        setFullName(session.user.name || '');
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

  const handleAddSkill = () => {
    if (newSkill.trim() && !skills.includes(newSkill.trim())) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(skills.filter(skill => skill !== skillToRemove));
  };

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setResume(file);
    } else {
      alert('Please select a PDF file for your resume.');
    }
  };

  const handleProfileSave = async () => {
    setSaving(true);
    setMessage({ type: null, text: '' });

    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const formData = new FormData();
      formData.append('fullName', fullName);
      formData.append('bio', bio);
      formData.append('phone', phone);
      formData.append('location', location);
      formData.append('skills', JSON.stringify(skills));
      
      if (resume) {
        formData.append('resume', resume);
      }

      const response = await fetch('/api/auth/update-profile', {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setUserData(data.data);
        setMessage({ type: 'success', text: 'Profile updated successfully!' });
      } else {
        const error = await response.json();
        setMessage({ type: 'error', text: error.message || 'Failed to update profile' });
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({ type: 'error', text: 'Failed to update profile' });
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordUpdate = async () => {
    setPasswordMessage({ type: null, text: '' });

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

      console.log('Attempting password change...');
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
      console.log('Password change response:', response.status, data);

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
      setPasswordMessage({ type: 'error', text: 'Network error. Please check your connection and try again.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-20 w-20 border-4 border-orange-200 mx-auto"></div>
            <div className="animate-spin rounded-full h-20 w-20 border-t-4 border-orange-600 mx-auto absolute top-0"></div>
          </div>
          <p className="mt-8 text-xl text-black font-medium">Preparing your profile...</p>
          <div className="mt-4 flex justify-center space-x-1">
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce"></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
      {/* Modern Header with floating effect */}
      <header className="bg-white/90 backdrop-blur-xl shadow-xl border-b border-white/20 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => router.push('/dashboard')}
                className="group flex items-center space-x-2 text-gray-600 hover:text-orange-600 transition-all duration-200 hover:scale-105"
              >
                <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                <span className="font-medium">Back to Dashboard</span>
              </button>
              <div className="h-8 w-px bg-gray-300 mx-2"></div>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl flex items-center justify-center shadow-lg">
                  <span className="text-white font-bold text-lg">B</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                    BUZZER.IO
                  </h1>
                  <p className="text-xs text-gray-500 font-medium">Profile Manager</p>
                </div>
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
      <div className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-orange-100/50 to-blue-100/50"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-500 rounded-full flex items-center justify-center shadow-2xl animate-pulse">
                <UserIcon />
              </div>
            </div>
            <h1 className="text-5xl font-bold bg-gradient-to-r from-gray-900 via-orange-700 to-gray-900 bg-clip-text text-transparent mb-4">
              Customize Your Profile
            </h1>
            <p className="text-xl text-black max-w-2xl mx-auto leading-relaxed">
              Make your profile shine with personal details, showcase your skills, and let your personality come through.
            </p>
            <div className="mt-8 flex justify-center space-x-4">
              <div className="flex items-center space-x-2 text-orange-600">
                <SparklesIcon />
                <span className="text-sm font-medium">Professional</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <StarIcon />
                <span className="text-sm font-medium">Personalized</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <ShieldIcon />
                <span className="text-sm font-medium">Secure</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Success/Error Messages */}
        {message.type && (
          <div className={`mb-8 p-6 rounded-2xl border-2 ${
            message.type === 'success' 
              ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800' 
              : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800'
          } shadow-lg`}>
            <div className="flex items-center space-x-3">
              {message.type === 'success' ? (
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
              ) : (
                <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                  <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
              )}
              <span className="text-lg font-semibold">{message.text}</span>
            </div>
          </div>
        )}

        {/* Profile Information Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-blue-400 to-blue-500 rounded-2xl flex items-center justify-center shadow-lg">
              <UserIcon />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Personal Information</h3>
              <p className="text-black">Let's get to know you better</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-black mb-3">
                <UserIcon />
                <span>Full Name</span>
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 text-lg text-black"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-black mb-3">
                <MailIcon />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                value={userData?.email || ''}
                disabled
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 bg-gray-100/50 text-gray-500 text-lg cursor-not-allowed"
                placeholder="Your email address"
              />
              <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-black mb-3">
                <PhoneIcon />
                <span>Phone Number</span>
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 text-lg text-black"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div className="space-y-2">
              <label className="flex items-center space-x-2 text-sm font-semibold text-black mb-3">
                <LocationIcon />
                <span>Location</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 text-lg text-black"
                placeholder="City, Country"
              />
            </div>
          </div>
          
          <div className="mt-8">
            <label className="flex items-center space-x-2 text-sm font-semibold text-black mb-3">
              <BrainIcon />
              <span>About You</span>
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={5}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-orange-100 focus:border-orange-400 transition-all duration-200 text-lg text-black resize-none"
              placeholder="Tell us about yourself, your interests, and what makes you unique..."
            />
          </div>
        </div>

        {/* Skills Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-purple-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-lg">
              <StarIcon />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Your Skills</h3>
              <p className="text-black">Showcase your expertise and talents</p>
            </div>
          </div>
          
          {skills.length > 0 && (
            <div className="mb-8">
              <div className="flex flex-wrap gap-3">
                {skills.map((skill, index) => (
                  <div
                    key={index}
                    className="group relative inline-flex items-center px-6 py-3 rounded-2xl text-sm font-medium bg-gradient-to-r from-orange-100 to-orange-200 text-orange-800 hover:from-orange-200 hover:to-orange-300 transition-all duration-200 hover:scale-105 shadow-md"
                  >
                    <span className="mr-2">{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="w-6 h-6 rounded-full bg-orange-500 text-white hover:bg-orange-600 transition-colors flex items-center justify-center text-xs font-bold"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="space-y-4">
            <label className="flex items-center space-x-2 text-sm font-semibold text-black">
              <SparklesIcon />
              <span>Add New Skill</span>
            </label>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <input
                  type="text"
                  value={newSkill}
                  onChange={(e) => setNewSkill(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleAddSkill()}
                  placeholder="Enter a skill (e.g., JavaScript, Leadership, Design...)"
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-purple-100 focus:border-purple-400 transition-all duration-200 text-lg text-black"
                />
              </div>
              <button
                onClick={handleAddSkill}
                disabled={!newSkill.trim()}
                className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none"
              >
                Add Skill
              </button>
            </div>
          </div>
        </div>

        {/* Resume Section */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-green-400 to-green-500 rounded-2xl flex items-center justify-center shadow-lg">
              <DocumentIcon />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Your Resume</h3>
              <p className="text-black">Share your professional document</p>
            </div>
          </div>
          
          <div className="group border-2 border-dashed border-gray-300 hover:border-green-400 rounded-3xl p-12 text-center transition-all duration-300 hover:bg-green-50/50">
            <div className="w-20 h-20 mx-auto mb-6 bg-gradient-to-r from-green-100 to-green-200 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
              <DocumentIcon />
            </div>
            
            {resume ? (
              <div className="space-y-4">
                <div className="w-16 h-16 mx-auto bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="text-xl font-semibold text-green-700">{resume.name}</h4>
                <p className="text-green-600">Ready to upload!</p>
              </div>
            ) : (
              <div className="space-y-4">
                <h4 className="text-xl font-semibold text-black">Upload Your Resume</h4>
                <p className="text-black max-w-sm mx-auto">
                  Choose a PDF file to showcase your professional experience
                </p>
                <div className="flex items-center justify-center space-x-4 text-sm text-gray-400">
                  <span>PDF only</span>
                  <span>•</span>
                  <span>Max 10MB</span>
                </div>
              </div>
            )}
            
            <input
              id="resume-upload"
              type="file"
              accept=".pdf"
              onChange={handleResumeChange}
              className="hidden"
            />
            
            <button
              onClick={() => document.getElementById('resume-upload')?.click()}
              className="mt-8 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 flex items-center space-x-2 mx-auto"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
              <span>{resume ? 'Change File' : 'Choose File'}</span>
            </button>
          </div>
        </div>

        {/* Password Change Section - Always visible */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/20 p-8 mb-12 hover:shadow-3xl transition-all duration-300">
          <div className="flex items-center space-x-4 mb-8">
            <div className="w-14 h-14 bg-gradient-to-r from-red-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <ShieldIcon />
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900">Security Settings</h3>
              <p className="text-black">Keep your account secure</p>
            </div>
          </div>

          {canChangePassword(userData) ? (
            <div>
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-2xl">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-blue-800">Password Change</p>
                    <p className="text-sm text-blue-600">Update your password to keep your account secure</p>
                  </div>
                </div>
              </div>

              {passwordMessage.type && (
                <div className={`mb-6 p-4 rounded-2xl border-2 ${
                  passwordMessage.type === 'success' 
                    ? 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200 text-green-800' 
                    : 'bg-gradient-to-r from-red-50 to-pink-50 border-red-200 text-red-800'
                } shadow-lg`}>
                  <div className="flex items-center space-x-3">
                    {passwordMessage.type === 'success' ? (
                      <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      </div>
                    ) : (
                      <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                      </div>
                    )}
                    <span className="text-lg font-semibold">{passwordMessage.text}</span>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">Current Password</label>
                  <input
                    type="password"
                    placeholder="Enter your current password"
                    value={currentPassword}
                    onChange={(e) => {
                      setCurrentPassword(e.target.value);
                      if (passwordMessage.type) setPasswordMessage({ type: null, text: '' });
                    }}
                    disabled={passwordLoading}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-black mb-3">New Password</label>
                  <input
                    type="password"
                    placeholder="Create a strong password"
                    value={newPassword}
                    onChange={(e) => {
                      setNewPassword(e.target.value);
                      if (passwordMessage.type) setPasswordMessage({ type: null, text: '' });
                    }}
                    disabled={passwordLoading}
                    className="w-full border-2 border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
                  />
                  {newPassword && (
                    <div className="mt-3 flex items-center space-x-2">
                      <span className="text-sm text-black">Strength:</span>
                      <div className={`px-3 py-1 rounded-full text-xs font-bold ${
                        generatePasswordStrengthText(newPassword) === 'Weak' ? 'bg-red-100 text-red-700' :
                        generatePasswordStrengthText(newPassword) === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        {generatePasswordStrengthText(newPassword)}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="lg:col-span-2">
                  <label className="block text-sm font-semibold text-black mb-3">Confirm New Password</label>
                  <input
                    type="password"
                    placeholder="Confirm your new password"
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      if (passwordMessage.type) setPasswordMessage({ type: null, text: '' });
                    }}
                    disabled={passwordLoading}
                    className="w-full max-w-md border-2 border-gray-200 rounded-2xl px-4 py-4 focus:outline-none focus:ring-4 focus:ring-red-100 focus:border-red-400 transition-all duration-200 text-lg disabled:bg-gray-100 disabled:cursor-not-allowed text-black"
                  />
                </div>
              </div>
              
              <div className="mt-8 flex justify-start">
                <button
                  onClick={handlePasswordUpdate}
                  disabled={passwordLoading || !currentPassword || !newPassword || !confirmPassword}
                  className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center space-x-2"
                >
                  {passwordLoading ? (
                    <>
                      <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Updating Password...</span>
                    </>
                  ) : (
                    <>
                      <ShieldIcon />
                      <span>Update Password</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-8 h-8 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-black mb-2">OAuth Account Security</h4>
              <p className="text-black max-w-md mx-auto mb-4">
                Password changes are managed through your OAuth provider. Your account is secured by {userData?.provider === 'google' ? 'Google' : 'your OAuth provider'}.
              </p>
              <div className="flex items-center justify-center space-x-2 text-green-600">
                <ShieldIcon />
                <span className="text-sm font-medium">Your account is secure</span>
              </div>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="bg-white/60 backdrop-blur-sm rounded-3xl shadow-lg border border-white/20 p-8 mb-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Ready to Save?</h3>
            <p className="text-black">Your changes will be applied immediately</p>
          </div>
          
          <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="group bg-gradient-to-r from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 text-gray-700 px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:shadow-lg hover:scale-105 border border-gray-300 flex items-center space-x-2"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Cancel Changes</span>
            </button>
            
            <button
              onClick={handleProfileSave}
              disabled={saving}
              className="group bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 disabled:from-gray-300 disabled:to-gray-400 text-white px-8 py-4 rounded-2xl font-semibold transition-all duration-200 hover:shadow-xl hover:shadow-orange-200 hover:scale-105 disabled:cursor-not-allowed disabled:hover:scale-100 disabled:hover:shadow-none flex items-center space-x-2 min-w-[200px] justify-center"
            >
            {saving ? (
              <>
                <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Saving Changes...</span>
              </>
            ) : (
              <>
                <SparklesIcon />
                <span>Save Profile</span>
              </>
            )}
            </button>
          </div>
        </div>
      </main>

      {/* Modern Footer */}
      <footer className="bg-white/50 backdrop-blur-sm border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-white font-bold text-xl">B</span>
              </div>
              <div>
                <h3 className="text-3xl font-bold bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                  BUZZER.IO
                </h3>
                <p className="text-sm text-black font-medium">Profile Manager</p>
              </div>
            </div>
            
            <div className="max-w-2xl mx-auto">
              <p className="text-lg text-black leading-relaxed">
                Craft your professional identity with our intuitive profile management system. 
                Showcase your skills, upload your resume, and take control of your digital presence.
              </p>
            </div>
            
            <div className="flex items-center justify-center space-x-8 pt-8">
              <div className="flex items-center space-x-2 text-orange-600">
                <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Secure & Private</span>
              </div>
              <div className="flex items-center space-x-2 text-blue-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">Real-time Updates</span>
              </div>
              <div className="flex items-center space-x-2 text-green-600">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium">AI-Powered</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}