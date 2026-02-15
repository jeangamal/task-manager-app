"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";
import { useAuth } from "../../components/AuthProvider";
import type { Task } from "../../types/Task";
import StatsSummary from "../../components/StatsSummary";
import TaskForm from "../../components/TaskForm";
import TaskList from "../../components/TaskList";

function Shell({
  title,
  onLogout,
  children,
}: {
  title: string;
  onLogout: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_circle_at_20%_0%,rgba(59,130,246,0.10),transparent_40%),radial-gradient(900px_circle_at_80%_10%,rgba(16,185,129,0.10),transparent_45%),linear-gradient(to_bottom,#0b1020, #070a12_40%, #070a12)] text-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-white/60">GRID • Agency OS (MVP)</div>
            <h1 className="text-2xl md:text-3xl font-semibold tracking-tight">
              {title}
            </h1>
          </div>

          <button
            onClick={onLogout}
            className="rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 px-4 py-2 text-sm font-medium transition"
          >
            Logout
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-5">
          {/* Sidebar */}
          <aside className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur">
            <div className="text-xs font-semibold text-white/60 mb-3">
              NAVIGATION
            </div>

            <nav className="space-y-2">
              <NavItem active label="Dashboard" />
              <NavItem label="Accounts (Next)" />
              <NavItem label="Traffic (Next)" />
              <NavItem label="Scoreboard (Next)" />
              <NavItem label="Settings (Later)" />
            </nav>

            <div className="mt-6 rounded-xl border border-white/10 bg-white/5 p-3">
              <div className="text-xs text-white/60">Today’s Focus</div>
              <div className="mt-1 text-sm font-medium">
                Ship tasks + reduce overload.
              </div>
              <div className="mt-2 text-xs text-white/60">
                Next upgrade: Framer-grade cards + AI suggestions.
              </div>
            </div>
          </aside>

          {/* Main */}
          <main className="space-y-5">
            <div className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm text-white/60">Overview</div>
                  <div className="text-base font-semibold">
                    Operations at a glance
                  </div>
                </div>
                <div className="text-xs text-white/60">
                  Real-time from Supabase
                </div>
              </div>

              <div className="mt-4">
                {children}
              </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-[1fr_360px] gap-5">
              <section className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-sm text-white/60">Work</div>
                    <div className="text-base font-semibold">Your tasks</div>
                  </div>
                  <div className="text-xs text-white/60">
                    Filters • Search • Priority
                  </div>
                </div>

                <div className="mt-4">
                  {/* Task list */}
                  {/* We’ll keep your existing TaskList for now */}
                </div>
              </section>

              <aside className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur p-5 space-y-4">
                <div>
                  <div className="text-sm text-white/60">Alerts</div>
                  <div className="text-base font-semibold">
                    What needs attention
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Urgent replies</div>
                  <div className="mt-1 text-sm text-white/70">
                    Coming next: Email/WhatsApp ingestion → auto “unanswered” alerts.
                  </div>
                </div>

                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="text-sm font-semibold">Team load</div>
                  <div className="mt-1 text-sm text-white/70">
                    Coming next: Traffic dashboard + utilization heatmap.
                  </div>
                </div>
              </aside>
            </div>
          </main>
        </div>

        <footer className="mt-10 text-xs text-white/40">
          © {new Date().getFullYear()} The Nest Technologies • GRID
        </footer>
      </div>
    </div>
  );
}

function NavItem({ label, active }: { label: string; active?: boolean }) {
  return (
    <div
      className={[
        "rounded-xl px-3 py-2 text-sm border transition",
        active
          ? "bg-white/10 border-white/15"
          : "bg-transparent border-white/10 hover:bg-white/5",
      ].join(" ")}
    >
      {label}
    </div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user === null) router.replace("/login");
    if (user) fetchTasks();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user]);

  const fetchTasks = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("tasks")
      .select("*")
      .eq("user_id", user?.id)
      .order("due_date", { ascending: true });

    if (!error && data) setTasks(data as Task[]);
    setLoading(false);
  };

  const handleTaskCreated = (task: Task) => setTasks((p) => [...p, task]);
  const handleTaskUpdated = (task: Task) =>
    setTasks((p) => p.map((t) => (t.id === task.id ? task : t)));
  const handleTaskDeleted = (id: string) =>
    setTasks((p) => p.filter((t) => t.id !== id));

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.replace("/login");
  };

  const content = useMemo(() => {
    if (loading) {
      return (
        <div className="py-10 text-center text-white/70">
          Loading your workspace…
        </div>
      );
    }

    return (
      <>
        {/* KPI cards */}
        <div className="mb-4">
          <StatsSummary tasks={tasks} />
        </div>

        {/* Create task */}
        {user && (
          <div className="mb-5">
            <TaskForm userId={user.id} onTaskCreated={handleTaskCreated} />
          </div>
        )}

        {/* Task list */}
        <TaskList
          tasks={tasks}
          onTaskUpdated={handleTaskUpdated}
          onTaskDeleted={handleTaskDeleted}
        />
      </>
    );
  }, [loading, tasks, user]);

  return (
    <Shell title="Dashboard" onLogout={handleLogout}>
      {content}
    </Shell>
  );
}
