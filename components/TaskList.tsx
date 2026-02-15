"use client";

import { useState, useMemo } from 'react';
import { Task } from '../types/Task';
import TaskItem from './TaskItem';

interface Props {
  tasks: Task[];
  onTaskUpdated: (task: Task) => void;
  onTaskDeleted: (id: string) => void;
}

/**
 * TaskList renders a list of tasks with simple filters for status, priority and title search.
 * It delegates individual task updates and deletions to TaskItem.
 */
export default function TaskList({ tasks, onTaskUpdated, onTaskDeleted }: Props) {
  const [statusFilter, setStatusFilter] = useState<string>('');
  const [priorityFilter, setPriorityFilter] = useState<string>('');
  const [search, setSearch] = useState('');

  const filtered = useMemo(() => {
    return tasks.filter((t) => {
      const matchesStatus = statusFilter ? t.status === statusFilter : true;
      const matchesPriority = priorityFilter ? t.priority === priorityFilter : true;
      const matchesSearch = t.title.toLowerCase().includes(search.toLowerCase());
      return matchesStatus && matchesPriority && matchesSearch;
    });
  }, [tasks, statusFilter, priorityFilter, search]);

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <div className="flex flex-col md:flex-row md:items-center md:space-x-4 space-y-2 md:space-y-0 mb-4">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="todo">To Do</option>
          <option value="in_progress">In Progress</option>
          <option value="done">Done</option>
        </select>
        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
          className="p-2 border rounded dark:bg-gray-700"
        >
          <option value="">All Priorities</option>
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title"
          className="flex-grow p-2 border rounded dark:bg-gray-700"
        />
      </div>
      {filtered.length === 0 ? (
        <div className="text-center text-gray-500 dark:text-gray-400">No tasks found.</div>
      ) : (
        <ul className="space-y-2">
          {filtered.map((task) => (
            <TaskItem
              key={task.id}
              task={task}
              onUpdated={onTaskUpdated}
              onDeleted={onTaskDeleted}
            />
          ))}
        </ul>
      )}
    </div>
  );
}