"use client";

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import { useAuth } from '../../components/AuthProvider';
import TaskForm from '../../components/TaskForm';
import TaskList from '../../components/TaskList';
import StatsSummary from '../../components/StatsSummary';
import type { Task } from '../../types/Task';

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If user is null, they're unauthenticated so redirect to login.
    if (user === null) {
      router.replace('/login');
    } else if (user) {
      // fetch tasks once user is defined.
      fetchTasks();
    }
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('tasks')
      .select('*')
      .eq('user_id', user?.id)
      .order('due_date', { ascending: true });
    if (error) {
      console.error('Error fetching tasks', error);
    } else {
      setTasks(data as Task[]);
    }
    setLoading(false);
  };

  const handleTaskCreated = (task: Task) => {
    setTasks((prev) => [...prev, task]);
  };

  const handleTaskUpdated = (task: Task) => {
    setTasks((prev) => prev.map((t) => (t.id === task.id ? task : t)));
  };

  const handleTaskDeleted = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace('/login');
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Loading...</div>;
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold mb-4">Dashboard</h1>
        <button onClick={handleLogout} className="bg-red-500 text-white px-3 py-1 rounded">
          Logout
        </button>
      </div>
      <StatsSummary tasks={tasks} />
      {user && <TaskForm userId={user.id} onTaskCreated={handleTaskCreated} />}
      <TaskList tasks={tasks} onTaskUpdated={handleTaskUpdated} onTaskDeleted={handleTaskDeleted} />
    </div>
  );
}