'use client'
import React, { useState, useEffect, useCallback } from 'react'
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

interface AdminUserRow {
    _id: string;
    fullName: string;
    email: string;
    provider: string;
    createdAt?: string;
}

const Admin = () => {
    // const [loading, setLoading] = useState(true);
    const [formData, setFormData] = useState({
        fullName: '',
        email: '',
        password: '',
        retypePassword: '',
        referrerEmail: ''
    });
    const [agreedToTerms, setAgreedToTerms] = useState(false);
    const [agreedToMarketing, setAgreedToMarketing] = useState(false);
    const [showModal, setShowModal] = useState(false);

    const [error, setError] = useState('');
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
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

        setLoading(true);

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
                // localStorage.setItem('token', data.token);
                // Redirect to dashboard
                // router.push('/dashboard');
                setShowModal(false);
            } else {
                const errorData = await response.json();
                setError(errorData.message || 'Signup failed');
                console.error('Signup failed:', errorData);
            }
        } catch (error) {
            setError('Network error. Please try again.');
            console.error('Signup error:', error);
        } finally {
            setLoading(false);
        }
    };
    const [userData, setUserData] = useState<UserData | null>(null);
    const [loading, setLoading] = useState(true);
    const [users, setUsers] = useState<AdminUserRow[]>([]);
    const [usersLoading, setUsersLoading] = useState<boolean>(false);
    const { data: session } = useSession();
    const router = useRouter();

    const handleLogout = () => {
        localStorage.removeItem('token');
        if (session) {
            signOut({ callbackUrl: '/' });
        } else {
            window.location.href = '/';
        }
    };
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
                // localStorage.removeItem('token');
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

    const fetchAllUsers = useCallback(async () => {
        try {
            setUsersLoading(true);
            const token = localStorage.getItem('token');
            if (!token) return;
            const res = await fetch('/api/users', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const json = await res.json();
                setUsers(json.data || []);
            } else if (res.status === 401) {
                router.push('/login');
            }
        } catch (e) {
            console.error('Failed to fetch users', e);
        } finally {
            setUsersLoading(false);
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
                fetchAllUsers();
            } else {
                fetchUserData();
            }
        } else if (token) {
            fetchUserData();
            fetchAllUsers();
        } else {
            router.push('/login');
            return;
        }
    }, [session, router, fetchUserData, fetchAllUsers]);



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
        <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-blue-50">
            {/* ---------- HEADER ---------- */}
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

            {/* ---------- MAIN CONTENT ---------- */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Welcome Section */}
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
                                <p className="text-gray-600 font-medium">Here are your analytics !!</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* ---------- USER SECTION ---------- */}
                <div className="bg-white/80 backdrop-blur-md rounded-2xl shadow-lg p-6">
                    <div className="flex justify-between items-center mb-4">
                        <h3 className="text-2xl font-semibold text-gray-800">Users</h3>
                        <button
                            onClick={() => setShowModal(true)}
                            className="bg-gradient-to-r from-orange-500 to-orange-600 text-white px-5 py-2 rounded-lg shadow hover:shadow-md hover:scale-105 transition-all duration-200"
                        >
                            + Add User
                        </button>
                    </div>

                    {/* Users Count + Table */}
                    <p className="text-black mb-3">Total Users: <span className="font-semibold text-orange-600">{usersLoading ? '...' : users.length}</span></p>
                    <table className="min-w-full bg-white rounded-lg overflow-hidden text-black">
                        <thead className="bg-orange-100 text-black">
                            <tr>
                                <th className="py-2 px-4 text-left">Name</th>
                                <th className="py-2 px-4 text-left">Email</th>
                                <th className="py-2 px-4 text-left">Provider</th>
                            </tr>
                        </thead>
                        <tbody>
                            {usersLoading && (
                                <tr>
                                    <td className="py-3 px-4" colSpan={3}>Loading users...</td>
                                </tr>
                            )}
                            {!usersLoading && users.length === 0 && (
                                <tr>
                                    <td className="py-3 px-4" colSpan={3}>No users found.</td>
                                </tr>
                            )}
                            {!usersLoading && users.map(u => (
                                <tr key={u._id} className="border-b">
                                    <td className="py-2 px-4">{u.fullName}</td>
                                    <td className="py-2 px-4">{u.email}</td>
                                    <td className="py-2 px-4 capitalize">{u.provider}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </main>

            {/* ---------- POPUP MODAL FORM ---------- */}
            {showModal && (
                <div className=" text-black fixed inset-0 flex items-center justify-center bg-transparent bg-opacity-40 backdrop-blur-sm z-50">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative animate-fadeIn">
                        <button
                            onClick={() => setShowModal(false)}
                            className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
                        >
                            ✕
                        </button>
                        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Add User</h2>

                        {/* ✅ Using your existing handleSignup logic */}
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
                                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
                                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
                                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-300 focus:outline-none"
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
                                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                    required
                                />
                            </div>
                            <div>
                                <input
                                    type="email"
                                    name="referrerEmail"
                                    placeholder="Referrer’s Email (optional)"
                                    value={formData.referrerEmail}
                                    onChange={handleInputChange}
                                    className="w-full px-4 py-3 rounded-lg border focus:ring-2 focus:ring-orange-300 focus:outline-none"
                                />
                            </div>

                            <div className="space-y-3 text-sm text-gray-600">
                                <label className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <span>
                                        Agree to our{" "}
                                        <a href="/privacy-policy" className="underline hover:no-underline">Privacy Policy</a> and{" "}
                                        <a href="/terms-of-service" className="underline hover:no-underline">Terms of Service</a>.
                                    </span>
                                </label>
                                <label className="flex items-start space-x-3">
                                    <input
                                        type="checkbox"
                                        checked={agreedToMarketing}
                                        onChange={(e) => setAgreedToMarketing(e.target.checked)}
                                        className="mt-1 w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                                    />
                                    <span>Receive updates and marketing emails.</span>
                                </label>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold transition-colors disabled:opacity-50 mt-6"
                            >
                                {loading ? "CREATING USER..." : "CREATE USER"}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );

}

export default Admin