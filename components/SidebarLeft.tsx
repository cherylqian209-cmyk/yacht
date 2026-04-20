'use client';

import { Project, ProjectStatus } from '@/types/project';

const steps: ProjectStatus[] = ['generated', 'editing', 'testing', 'tested', 'deploying', 'deployed', 'verifying', 'verified', 'done'];

interface SidebarLeftProps {
  goal: string;
  setGoal: (goal: string) => void;
  onGenerate: () => void;
  project?: Project;
}

export function SidebarLeft({ goal, setGoal, onGenerate, project }: SidebarLeftProps) {
  return (
    <aside className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Goal</h2>
        <textarea
          className="mt-2 h-24 w-full rounded-lg border border-slate-300 p-3 text-sm outline-none focus:border-slate-500"
          placeholder="Describe the product + growth goal"
          value={goal}
          onChange={(e) => setGoal(e.target.value)}
        />
        <button className="mt-3 w-full rounded-lg bg-slate-900 px-4 py-2 text-sm font-medium text-white hover:bg-slate-700" onClick={onGenerate}>
          Generate Waitlist Page
        </button>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Progress</h3>
        <ol className="mt-2 space-y-1 text-sm">
          {steps.map((step) => (
            <li key={step} className={project?.status === step ? 'font-semibold text-slate-900' : 'text-slate-500'}>
              {step}
            </li>
          ))}
        </ol>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Actions Taken</h3>
        <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
          {project?.actions.map((action, idx) => <li key={`${action}-${idx}`}>{action}</li>) ?? <li>No actions yet.</li>}
        </ul>

        <h3 className="mt-4 text-sm font-semibold uppercase tracking-wide text-slate-500">System Messages</h3>
        <ul className="mt-2 space-y-1 text-sm text-slate-600">
          {project?.systemMessages.map((message, idx) => <li key={`${message}-${idx}`}>• {message}</li>) ?? <li>No messages yet.</li>}
        </ul>
      </div>
    </aside>
  );
}
