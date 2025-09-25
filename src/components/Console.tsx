'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function Console() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showLoginForm, setShowLoginForm] = useState(false);
  const router = useRouter();

  const handleGoogleLogin = async () => {
    try {
      await signIn('google', { callbackUrl: '/dashboard' });
    } catch (error) {
      console.error('Google login error:', error);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Login successful:', data);
        localStorage.setItem('token', data.token);
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        if (errorData.message === 'Invalid credentials') {
          setError('Invalid email or password. Please check your credentials or register if you haven\'t created an account yet.');
        } else {
          setError(errorData.message || 'Login failed');
        }
        console.error('Login failed:', errorData);
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleWebsiteLogin = () => {
    setShowLoginForm(true);
  };

  const handleSignUp = () => {
    router.push('/signup');
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Console Interface */}
      <div className="w-1/2 p-8 flex flex-col justify-center">
        <div className="max-w-sm">
          {/* Buzzer Logo */}
          <div className="mb-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-orange-500 rounded flex items-center justify-center">
                <span className="text-white text-xl font-bold">N</span>
              </div>
              <span className="text-gray-600 text-sm">4.7.1</span>
            </div>
            <h1 className="text-xl font-normal text-gray-800 mt-2">Buzzer</h1>
          </div>

          {!showLoginForm ? (
            <>
              {/* Welcome Section */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Welcome</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  to the world&apos;s leading stealth AI copilot for your online meetings!
                </p>
              </div>

              {/* Login Button */}
              <div className="mb-6">
                <button 
                  onClick={handleWebsiteLogin}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                  Login by Website
                </button>
              </div>

              {/* Sign up Link */}
              <div className="text-center">
                <span className="text-gray-600 text-sm">Do not have an account? </span>
                <button 
                  onClick={handleSignUp}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium underline"
                >
                  Sign up
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Login Form */}
              <div className="mb-8">
                <h2 className="text-2xl font-semibold text-gray-900 mb-2">Login</h2>
                <p className="text-gray-600 text-sm leading-relaxed">
                  Sign in to your account to continue
                </p>
              </div>

              {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <form onSubmit={handleLogin} className="space-y-4 mb-6">
                <div>
                  <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <div>
                  <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    required
                  />
                </div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-orange-500 hover:bg-orange-600 disabled:bg-orange-300 text-white py-3 px-4 rounded-md font-medium transition-colors"
                >
                  {isLoading ? 'Logging in...' : 'Login'}
                </button>
              </form>

              {/* Google Login Button */}
              <div className="mb-6">
                <button
                  onClick={handleGoogleLogin}
                  className="w-full bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 py-3 px-4 rounded-md font-medium transition-colors flex items-center justify-center space-x-2"
                >
                  <span>Continue with Google</span>
                </button>
              </div>

              {/* Back to Welcome */}
              <div className="text-center">
                <button 
                  onClick={() => setShowLoginForm(false)}
                  className="text-gray-600 hover:text-gray-800 text-sm underline"
                >
                  ← Back to Welcome
                </button>
              </div>

              {/* Sign up Link */}
              <div className="text-center mt-4">
                <span className="text-gray-600 text-sm">Do not have an account? </span>
                <button 
                  onClick={handleSignUp}
                  className="text-orange-500 hover:text-orange-600 text-sm font-medium underline"
                >
                  Sign up
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-orange-100"></div>
        <div className="relative h-full flex items-center justify-center p-8">
          {/* Professional woman image placeholder */}
          <div className="relative">
            <div className="w-80 h-96 bg-gradient-to-b from-gray-200 to-gray-300 rounded-lg shadow-lg flex items-end justify-center overflow-hidden">
              {/* Office background elements */}
              <div className="absolute top-8 left-8 w-12 h-16 bg-gray-400 opacity-30 rounded"></div>
              <div className="absolute top-12 right-12 w-8 h-12 bg-gray-400 opacity-20 rounded"></div>
              <div className="absolute top-20 left-16 w-6 h-8 bg-gray-400 opacity-25 rounded"></div>
              
              {/* Person silhouette */}
              <div className="w-48 h-64 bg-gray-600 rounded-t-full opacity-60 mb-0"></div>
            </div>
            
            {/* Orange badge */}
            <div className="absolute bottom-16 right-8 w-12 h-12 bg-orange-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white text-xl font-bold">N</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}