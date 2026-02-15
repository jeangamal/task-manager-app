"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '../components/AuthProvider';

/**
 * The root page automatically redirects the user based on their auth status.
 * Authenticated users go to the dashboard, otherwise to the login page.
 */
export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (user) {
      router.replace('/dashboard');
    } else if (user === null) {
      router.replace('/login');
    }
  }, [user, router]);

  return (
    <div className="flex items-center justify-center h-screen">Loading...</div>
  );
}