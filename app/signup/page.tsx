"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function SignUpPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });
    if (error) {
      setError(error.message);
    } else {
      // If email confirmation is required, supabase returns user null. We'll still
      // navigate to dashboard to trigger redirect logic in root page.
      router.push('/');
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4 text-center">Sign Up</h1>
        <form onSubmit={handleSignUp} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full p-2 border rounded dark:bg-gray-700"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full p-2 bg-blue-600 text-white rounded disabled:opacity-50"
          >
            {loading ? 'Signing up...' : 'Create Account'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <p className="mt-4 text-center text-sm">
          Already have an account?{' '}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}