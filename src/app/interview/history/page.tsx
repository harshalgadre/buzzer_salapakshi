'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import InterviewHistory from '@/components/InterviewHistory';

export default function InterviewHistoryPage() {
  const [loading, setLoading] = useState(true);
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session === undefined) {
      return;
    }

    const token = localStorage.getItem('token');
    
    if (!session?.user && !token) {
      router.push('/login');
      return;
    }
    
    setLoading(false);
  }, [session, router]);

  const handleNavigateToProfile = () => {
    router.push('/dashboard');
  };

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

  return <InterviewHistory onNavigateToProfile={handleNavigateToProfile} />;
}