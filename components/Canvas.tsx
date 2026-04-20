'use client';

import { Project } from '@/types/project';
import { ComponentRenderer } from '@/components/ComponentRenderer';

interface CanvasProps {
  project?: Project;
  selectedId?: string;
  onSelect: (id: string) => void;
  onTextChange: (id: string, text: string) => void;
  emailValue: string;
  onEmailChange: (value: string) => void;
  submitted: boolean;
  onSubmit: () => void;
}

export function Canvas({
  project,
  selectedId,
  onSelect,
  onTextChange,
  emailValue,
  onEmailChange,
  submitted,
  onSubmit
}: CanvasProps) {
  return (
    <div className="h-full rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      {!project ? (
        <div className="flex h-full items-center justify-center text-slate-500">
          Enter a goal and generate a waitlist page to start the Yacht loop.
        </div>
      ) : (
        <div className="mx-auto max-w-4xl pt-6">
          {project.components.map((node) => (
            <ComponentRenderer
              key={node.id}
              node={node}
              selectedId={selectedId}
              onSelect={onSelect}
              onTextChange={onTextChange}
              emailValue={emailValue}
              onEmailChange={onEmailChange}
              submitted={submitted}
              onSubmit={onSubmit}
            />
          ))}
        </div>
      )}
    </div>
  );
}
