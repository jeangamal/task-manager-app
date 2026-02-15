"use client";

import { Task } from '../types/Task';
import { parseISO, isBefore, isAfter, startOfDay, endOfDay } from 'date-fns';

interface Props {
  tasks: Task[];
}

/**
 * StatsSummary displays aggregate metrics about the user's tasks.
 * It shows total tasks, completed tasks, overdue tasks, and tasks due today.
 */
export default function StatsSummary({ tasks }: Props) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === 'done').length;
  const now = new Date();
  const overdue = tasks.filter((t) => {
    const due = parseISO(t.due_date);
    return isBefore(due, now) && t.status !== 'done';
  }).length;
  const dueToday = tasks.filter((t) => {
    const due = parseISO(t.due_date);
    return isAfter(due, startOfDay(now)) && isBefore(due, endOfDay(now));
  }).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 my-4">
      <StatCard label="Total Tasks" value={total} />
      <StatCard label="Completed" value={completed} />
      <StatCard label="Overdue" value={overdue} />
      <StatCard label="Due Today" value={dueToday} />
    </div>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="p-4 bg-white rounded-lg shadow text-center dark:bg-gray-800">
      <div className="text-sm text-gray-500 dark:text-gray-400">{label}</div>
      <div className="text-2xl font-bold mt-1">{value}</div>
    </div>
  );
}