"use client";

import { Task } from "../types/Task";
import { parseISO, isBefore, isAfter, startOfDay, endOfDay } from "date-fns";

export default function StatsSummary({ tasks }: { tasks: Task[] }) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.status === "done").length;

  const now = new Date();
  const overdue = tasks.filter((t) => {
    const due = parseISO(t.due_date);
    return isBefore(due, now) && t.status !== "done";
  }).length;

  const dueToday = tasks.filter((t) => {
    const due = parseISO(t.due_date);
    return isAfter(due, startOfDay(now)) && isBefore(due, endOfDay(now));
  }).length;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
      <KPI label="Total" value={total} />
      <KPI label="Completed" value={completed} />
      <KPI label="Overdue" value={overdue} />
      <KPI label="Due Today" value={dueToday} />
    </div>
  );
}

function KPI({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
      <div className="text-xs text-white/60">{label}</div>
      <div className="mt-1 text-2xl font-semibold tracking-tight">{value}</div>
      <div className="mt-2 h-1.5 w-full rounded-full bg-white/5 overflow-hidden">
        <div
          className="h-full rounded-full bg-white/20"
          style={{ width: `${Math.min(100, value * 12)}%` }}
        />
      </div>
    </div>
  );
}
