"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Task } from '../types/Task';

interface Props {
  userId: string;
  onTaskCreated: (task: Task) => void;
}

/**
 * TaskForm allows the user to create new tasks. When a task is created
 * successfully, it invokes onTaskCreated with the new task so the parent
 * component can update its local state.
 */
export default function TaskForm({ userId, onTaskCreated }: Props) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');
  const [dueDate, setDueDate] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    if (!title || !dueDate) {
      setError('Title and due date are required.');
      setLoading(false);
      return;
    }
    const { data, error } = await supabase
      .from('tasks')
      .insert({
        user_id: userId,
        title,
        description,
        status: 'todo',
        priority,
        due_date: dueDate,
      })
      .select()
      .single();
    if (error || !data) {
      setError(error?.message ?? 'Error creating task');
    } else {
      onTaskCreated(data as Task);
      setTitle('');
      setDescription('');
      setPriority('medium');
      setDueDate('');
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow mb-6 space-y-4">
      <h2 className="text-lg font-semibold">Create Task</h2>
      {error && <div className="text-red-500 text-sm">{error}</div>}
      <div className="space-y-2">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description"
          className="w-full p-2 border rounded h-20 dark:bg-gray-700"
        />
        <select
          value={priority}
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="w-full p-2 border rounded dark:bg-gray-700"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? 'Creating...' : 'Add Task'}
      </button>
    </form>
  );
}