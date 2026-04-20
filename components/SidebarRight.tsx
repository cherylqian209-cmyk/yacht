'use client';

import { Project } from '@/types/project';

interface SidebarRightProps {
  project?: Project;
  selectedId?: string;
  selectedText: string;
  onSelectedTextChange: (value: string) => void;
  onRunTest: () => void;
  onDeploy: () => void | Promise<void>;
  onVerify: () => void | Promise<void>;
}

export function SidebarRight({
  project,
  selectedId,
  selectedText,
  onSelectedTextChange,
  onRunTest,
  onDeploy,
  onVerify
}: SidebarRightProps) {
  return (
    <aside className="flex h-full flex-col gap-4 rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
      <div>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Editable Properties</h2>
        <p className="mt-2 text-xs text-slate-500">Selected element: {selectedId ?? 'none'}</p>
        <label className="mt-2 block text-xs font-medium text-slate-600">Text</label>
        <input
          className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2 text-sm outline-none focus:border-slate-500"
          value={selectedText}
          onChange={(e) => onSelectedTextChange(e.target.value)}
          disabled={!selectedId}
        />
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Generated Assets</h3>
        <ul className="mt-2 text-sm text-slate-600">
          <li>• Hero section</li>
          <li>• Headline + subtext</li>
          <li>• Waitlist form + CTA</li>
        </ul>
      </div>

      <div>
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Status Controls</h3>
        <div className="mt-2 grid gap-2">
          <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100" onClick={onRunTest} disabled={!project}>
            Run Test
          </button>
          <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100" onClick={onDeploy} disabled={!project || !project.testResults?.passed}>
            Deploy
          </button>
          <button className="rounded-lg border border-slate-300 px-3 py-2 text-sm hover:bg-slate-100" onClick={onVerify} disabled={!project || !project.deployedUrl}>
            Verify
          </button>
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-auto">
        <h3 className="text-sm font-semibold uppercase tracking-wide text-slate-500">Results + Logs</h3>
        {!project ? (
          <p className="mt-2 text-sm text-slate-500">No project yet.</p>
        ) : (
          <div className="mt-2 space-y-2 text-sm text-slate-600">
            <p>Status: <span className="font-semibold text-slate-900">{project.status}</span></p>
            <p>Deploy URL: {project.deployedUrl ?? 'Not deployed'}</p>
            <p>Test: {project.testResults ? (project.testResults.passed ? 'Pass' : 'Fail') : 'Not run'}</p>
            {project.testResults?.issues.length ? (
              <ul className="list-disc pl-5">
                {project.testResults.issues.map((issue) => <li key={issue}>{issue}</li>)}
              </ul>
            ) : null}

            <div className="border-t border-slate-200 pt-2">
              <p>
                Browser Verify:{' '}
                <span className="font-semibold text-slate-900">
                  {project.browserVerification ? (project.browserVerification.passed ? 'Pass' : 'Fail') : 'Not run'}
                </span>
              </p>
              {project.browserVerification?.issues.length ? (
                <ul className="mt-1 list-disc pl-5">
                  {project.browserVerification.issues.map((issue) => <li key={issue}>{issue}</li>)}
                </ul>
              ) : null}
              {project.browserVerification?.screenshotPath ? (
                <p className="mt-1 break-all">
                  Screenshot: <a className="text-blue-600 underline" href={project.browserVerification.screenshotPath} target="_blank" rel="noreferrer">{project.browserVerification.screenshotPath}</a>
                </p>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
