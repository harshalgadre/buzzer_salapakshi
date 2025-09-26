'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { status } = useSession();

  // Redirect if already authenticated
  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/');
    }
  }, [status, router]);

  const handleGoogleLogin = async () => {
    try {
      setIsLoading(true);
      setError(''); // Clear any previous errors
      
      const result = await signIn('google', { 
        callbackUrl: '/',
        redirect: true // Let NextAuth handle the redirect
      });
      
      // This code won't run if redirect: true, but keeping for safety
      if (result?.error) {
        setError('Google login failed. Please try again.');
        console.error('Google login error:', result.error);
        setIsLoading(false);
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google login failed. Please try again.');
      setIsLoading(false);
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
        // Store token in localStorage (you might want to use a more secure method)
        localStorage.setItem('token', data.token);
        // Redirect to landing page
        router.push('/');
      } else {
        let errorData;
        try {
          errorData = await response.json();
        } catch (parseError) {
          console.error('Failed to parse error response:', parseError);
          errorData = { message: 'Unknown error occurred' };
        }

        console.error('Login failed - Status:', response.status, 'Data:', errorData);

        if (errorData.message === 'Invalid credentials') {
          setError('Invalid email or password. Please check your credentials or register if you haven\'t created an account yet.');
        } else if (errorData.message) {
          setError(errorData.message);
        } else {
          setError('Login failed. Please try again.');
        }
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Login Form */}
      <div className="flex-1 bg-orange-600 flex flex-col justify-center items-center px-6 md:px-12 py-8 lg:py-0">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 md:mb-12">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">Buzzer<sup className="text-lg">™</sup></h1>
            <h2 className="text-white text-xl md:text-2xl font-semibold">Welcome Back!</h2>
          </div>

          {/* Google Login Button */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg mb-6 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
            )}
            <span>{isLoading ? 'Signing in...' : 'Continue with Google'}</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white border-opacity-30"></div>
            <span className="px-4 text-white text-sm">Or</span>
            <div className="flex-1 border-t border-white border-opacity-30"></div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            
            {/* Test Account Info */}
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded text-sm">
              <strong>Test Account:</strong> Use email <code>test@example.com</code> with password <code>password123</code> to login, or register a new account below.
            </div>
            <div>
              <input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                required
              />
            </div>
            
            <div>
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                required
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-800 hover:bg-orange-900 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50"
            >
              {isLoading ? 'SIGNING IN...' : 'GET STARTED NOW'}
            </button>
          </form>

          {/* Footer Links */}
          <div className="text-center mt-6">
            <p className="text-white text-sm">
              No account yet?{' '}
              <a href="/signup" className="underline hover:no-underline">
                Join here
              </a>
            </p>
            <p className="text-white text-sm mt-2">
              Forgot password?{' '}
              <a href="/forgot-password" className="underline hover:no-underline">
                Reset here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Referral Section - Shows below form on mobile */}
      <div className="lg:hidden bg-slate-700 px-6 py-8 text-white">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Refer a friend,<br />
            Earn rewards!
          </h2>
          
          <p className="text-orange-400 text-base md:text-lg mb-6 font-medium">
            Get one month extension for every successful referral.
          </p>
          
          <div className="text-left space-y-3 text-sm md:text-base">
            <p>
              Invite your friends to join our platform.
            </p>
            <p>
              When they subscribe to a paid plan&lsquo; you&apos;ll receive one month Standard Plan extension.
            </p>
            <p>
              Share the love and enjoy the benefits together!
            </p>
          </div>
        </div>
      </div>

      {/* Desktop Referral Section - Shows as sidebar on desktop */}
      <div className="hidden lg:flex flex-1 bg-slate-700 flex-col justify-center items-center px-12 text-white">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-6">
            Refer a friend,<br />
            Earn rewards!
          </h2>
          
          <p className="text-orange-400 text-lg mb-8 font-medium">
            Get one month extension for every successful referral.
          </p>
          
          <div className="text-left space-y-4">
            <p>
              Invite your friends to join our platform.
            </p>
            <p>
              When they subscribe to a paid plan&lsquo; you&apos;ll receive one month of Standard Plan extension.
            </p>
            <p>
              Share the love and enjoy the benefits together!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}