'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    retypePassword: '',
    referrerEmail: ''
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [agreedToMarketing, setAgreedToMarketing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGoogleSignup = async () => {
    // TODO: Implement Google OAuth
    console.log('Google signup clicked');
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.retypePassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('Please agree to the Terms of Service and Privacy Policy');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          password: formData.password,
          confirmPassword: formData.retypePassword,
          referrerEmail: formData.referrerEmail || undefined
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Signup successful:', data);
        // Store token in localStorage
        localStorage.setItem('token', data.token);
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Signup failed');
        console.error('Signup failed:', errorData);
      }
    } catch (error) {
      setError('Network error. Please try again.');
      console.error('Signup error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      {/* Left Side - Signup Form */}
      <div className="flex-1 bg-[#FF751F] flex flex-col justify-center items-center px-6 md:px-12 py-8 lg:py-0 min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">
              Buzzer<sup className="text-lg">™</sup>
            </h1>
            <h2 className="text-white text-xl md:text-2xl font-semibold">
              Join Us Free!
            </h2>
          </div>

          {/* Google Signup Button */}
          <button
            onClick={handleGoogleSignup}
            className="w-full bg-white text-gray-700 py-3 px-4 rounded-lg mb-6 flex items-center justify-center space-x-3 hover:bg-gray-50 transition-colors font-medium"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-white border-opacity-30"></div>
            <span className="px-4 text-white text-sm">Or</span>
            <div className="flex-1 border-t border-white border-opacity-30"></div>
          </div>

          {/* Signup Form */}
          <form onSubmit={handleSignup} className="space-y-4">
            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            )}
            <div>
              <input
                type="text"
                name="fullName"
                placeholder="Full Name"
                value={formData.fullName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="password"
                name="retypePassword"
                placeholder="Retype Password"
                value={formData.retypePassword}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-300 focus:outline-none"
                required
              />
            </div>

            <div>
              <input
                type="email"
                name="referrerEmail"
                placeholder="Referrer's Sign-up Email"
                value={formData.referrerEmail}
                onChange={handleInputChange}
                className="w-full px-4 py-3 rounded-lg border-0 focus:ring-2 focus:ring-orange-300 focus:outline-none"
              />
            </div>

            {/* Checkboxes */}
            <div className="space-y-3 text-white text-sm">
              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={(e) => setAgreedToTerms(e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                />
                <span>
                  Joining our services means you agree to the{" "}
                  <a href="/privacy-policy" className="underline hover:no-underline">
                    Privacy Policy
                  </a>{" "}
                  and{" "}
                  <a href="/terms-of-service" className="underline hover:no-underline">
                    Terms of Service
                  </a>
                  .
                </span>
              </label>

              <label className="flex items-start space-x-3">
                <input
                  type="checkbox"
                  checked={agreedToMarketing}
                  onChange={(e) => setAgreedToMarketing(e.target.checked)}
                  className="mt-1 w-4 h-4 text-orange-600 bg-white border-gray-300 rounded focus:ring-orange-500"
                />
                <span>
                  We may keep you informed via email about our products & services.
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-orange-700 hover:bg-orange-800 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 mt-6"
            >
              {isLoading ? "CREATING ACCOUNT..." : "GET STARTED NOW"}
            </button>
          </form>

          {/* Footer Link */}
          <div className="text-center mt-6">
            <p className="text-white text-sm">
              Already joined?{" "}
              <a href="/login" className="underline hover:no-underline">
                Sign in here
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Mobile Referral Section */}
      <div className="lg:hidden bg-slate-700 px-6 py-10 text-white min-h-[40vh] flex items-center">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            Refer a friend,<br />Earn rewards!
          </h2>
          <p className="text-orange-400 text-base md:text-lg mb-6 font-medium">
            Get one month extension for every successful referral.
          </p>
          <div className="text-left space-y-3 text-sm md:text-base">
            <p>Invite your friends to join our platform.</p>
            <p>
              When they subscribe to a paid plan, you&apos;ll receive one month
              Standard Plan extension.
            </p>
            <p>Share the love and enjoy the benefits together!</p>
          </div>
        </div>
      </div>

      {/* Desktop Referral Section */}
      <div className="hidden lg:flex flex-1 bg-slate-700 flex-col justify-center items-center px-12 text-white min-h-screen">
        <div className="max-w-md text-center">
          <h2 className="text-4xl font-bold mb-6">
            Refer a friend,<br />Earn rewards!
          </h2>
          <p className="text-orange-400 text-lg mb-8 font-medium">
            Get one month extension for every successful referral.
          </p>
          <div className="text-left space-y-4">
            <p>Invite your friends to join our platform.</p>
            <p>
              When they subscribe to a paid plan, you&apos;ll receive one month of
              Standard Plan extension.
            </p>
            <p>Share the love and enjoy the benefits together!</p>
          </div>
        </div>
      </div>
    </div>

  );
}