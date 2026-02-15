"use client";

import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';
import { Task } from '../types/Task';
import clsx from 'clsx';

interface Props {
  task: Task;
  onUpdated: (task: Task) => void;
  onDeleted: (id: string) => void;
}

/**
 * TaskItem represents an individual task with controls to mark complete or delete.
 */
export default function TaskItem({ task, onUpdated, onDeleted }: Props) {
  const [loading, setLoading] = useState(false);

  const toggleStatus = async () => {
    setLoading(true);
    const newStatus = task.status === 'done' ? 'todo' : 'done';
    const { data, error } = await supabase
      .from('tasks')
      .update({ status: newStatus })
      .eq('id', task.id)
      .select()
      .single();
    if (!error && data) {
      onUpdated(data as Task);
    }
    setLoading(false);
  };

  const deleteTask = async () => {
    if (!confirm('Are you sure you want to delete this task?')) return;
    setLoading(true);
    const { error } = await supabase.from('tasks').delete().eq('id', task.id);
    if (!error) {
      onDeleted(task.id);
    }
    setLoading(false);
  };

  return (
    <li className="p-4 border rounded-lg flex flex-col md:flex-row md:items-center md:justify-between bg-gray-50 dark:bg-gray-700">
      <div className="flex-1">
        <h3 className={clsx('font-semibold', {
          'line-through text-gray-400 dark:text-gray-500': task.status === 'done',
        })}
        >
          {task.title}
        </h3>
        {task.description && (
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{task.description}</p>
        )}
        <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          Due: {new Date(task.due_date).toLocaleDateString()} • Priority: {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} • Status: {task.status.replace('_', ' ')}
        </div>
      </div>
      <div className="mt-2 md:mt-0 md:ml-4 flex items-center space-x-2">
        <button
          onClick={toggleStatus}
          disabled={loading}
          className="px-3 py-1 text-sm rounded bg-green-600 text-white disabled:opacity-50"
        >
          {task.status === 'done' ? 'Mark Incomplete' : 'Mark Done'}
        </button>
        <button
          onClick={deleteTask}
          disabled={loading}
          className="px-3 py-1 text-sm rounded bg-red-600 text-white disabled:opacity-50"
        >
          Delete
        </button>
      </div>
    </li>
  );
}