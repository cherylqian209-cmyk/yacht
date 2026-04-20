'use client';

import { useMemo, useState } from 'react';
import { Canvas } from '@/components/Canvas';
import { SidebarLeft } from '@/components/SidebarLeft';
import { SidebarRight } from '@/components/SidebarRight';
import { generateWaitlistPage } from '@/lib/build';
import { deployProject } from '@/lib/deploy';
import { nextPlannerStatus, plannerMessage } from '@/lib/planner';
import { testProject } from '@/lib/test';
import { ComponentNode, Project } from '@/types/project';

function mapComponents(nodes: ComponentNode[], cb: (node: ComponentNode) => ComponentNode): ComponentNode[] {
  return nodes.map((node) => {
    const updated = cb(node);
    return {
      ...updated,
      children: updated.children ? mapComponents(updated.children, cb) : undefined
    };
  });
}

function findNode(nodes: ComponentNode[], id?: string): ComponentNode | undefined {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
}

export function WorkspaceLayout() {
  const [goal, setGoal] = useState('');
  const [project, setProject] = useState<Project>();
  const [selectedId, setSelectedId] = useState<string>();
  const [emailValue, setEmailValue] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const selectedNode = useMemo(() => (project ? findNode(project.components, selectedId) : undefined), [project, selectedId]);
  const selectedText = selectedNode?.props.text ?? '';

  const patchProject = (updater: (prev: Project) => Project) => {
    setProject((prev) => (prev ? updater(prev) : prev));
  };

  const onGenerate = () => {
    const generated = generateWaitlistPage(goal);
    const status = nextPlannerStatus(generated);
    setProject({
      ...generated,
      status,
      actions: [...generated.actions, 'Planner advanced project to editing'],
      systemMessages: [...generated.systemMessages, plannerMessage(status)]
    });
    setSelectedId(undefined);
    setEmailValue('');
    setSubmitted(false);
  };

  const onTextChange = (id: string, text: string) => {
    patchProject((prev) => ({
      ...prev,
      status: 'editing',
      components: mapComponents(prev.components, (node) =>
        node.id === id ? { ...node, props: { ...node.props, text } } : node
      )
    }));
  };

  const onRunTest = () => {
    patchProject((prev) => {
      const testing = { ...prev, status: 'testing' as const };
      const result = testProject(testing, emailValue || 'demo@example.com');
      const nextStatus = 'tested' as const;
      return {
        ...testing,
        status: nextStatus,
        testResults: result,
        actions: [...testing.actions, 'Ran test engine for CTA + signup flow'],
        systemMessages: [...testing.systemMessages, plannerMessage(nextStatus, result)]
      };
    });
  };

  const onDeploy = () => {
    patchProject((prev) => {
      const deploying = { ...prev, status: 'deploying' as const };
      const deployResult = deployProject(deploying);
      const status = 'deployed' as const;
      return {
        ...deploying,
        status,
        deployedUrl: deployResult.deployedUrl,
        actions: [...deploying.actions, deployResult.action],
        systemMessages: [...deploying.systemMessages, plannerMessage(status)]
      };
    });
  };

  const onVerify = () => {
    patchProject((prev) => {
      const verifying = { ...prev, status: 'verifying' as const };
      const verification = testProject(verifying, emailValue || 'demo@example.com');
      const status = verification.passed ? 'verified' : 'editing';
      const doneStatus = verification.passed ? 'done' : status;
      return {
        ...verifying,
        status: doneStatus,
        testResults: verification,
        actions: [
          ...verifying.actions,
          verification.passed ? 'Verified deployed page checks pass' : 'Verification failed; returned to editing'
        ],
        systemMessages: [...verifying.systemMessages, plannerMessage(status, verification), ...(verification.passed ? [plannerMessage('done')] : [])]
      };
    });
  };

  const onSubmit = () => {
    setSubmitted(true);
  };

  return (
    <div className="grid h-screen grid-cols-[300px_1fr_320px] gap-4 p-4">
      <SidebarLeft goal={goal} setGoal={setGoal} onGenerate={onGenerate} project={project} />
      <Canvas
        project={project}
        selectedId={selectedId}
        onSelect={setSelectedId}
        onTextChange={onTextChange}
        emailValue={emailValue}
        onEmailChange={setEmailValue}
        submitted={submitted}
        onSubmit={onSubmit}
      />
      <SidebarRight
        project={project}
        selectedId={selectedId}
        selectedText={selectedText}
        onSelectedTextChange={(value) => selectedId && onTextChange(selectedId, value)}
        onRunTest={onRunTest}
        onDeploy={onDeploy}
        onVerify={onVerify}
      />
    </div>
  );
}
