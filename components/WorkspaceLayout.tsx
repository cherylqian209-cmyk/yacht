'use client';

import { useMemo, useState } from 'react';
import { Canvas } from '@/components/Canvas';
import { SidebarLeft } from '@/components/SidebarLeft';
import { SidebarRight } from '@/components/SidebarRight';
import { generateWaitlistPage } from '@/lib/build';
import { deployProject } from '@/lib/deploy';
import { nextPlannerStatus, plannerMessage } from '@/lib/planner';
import { testProject } from '@/lib/test';
import { BrowserVerificationResult, ComponentNode, Project } from '@/types/project';

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

  const requestBrowserVerification = async (deployedUrl: string): Promise<BrowserVerificationResult> => {
    const response = await fetch('/api/browser/verify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: deployedUrl,
        sampleEmail: emailValue || 'demo@example.com'
      })
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(body || `Request failed with status ${response.status}`);
    }

    return (await response.json()) as BrowserVerificationResult;
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

  const onDeploy = async () => {
    const currentProject = project;
    if (!currentProject) {
      return;
    }

    const deploying = { ...currentProject, status: 'deploying' as const };
    setProject(deploying);

    const deployResult = deployProject(deploying);
    const deployedProject: Project = {
      ...deploying,
      status: 'deployed',
      deployedUrl: deployResult.deployedUrl,
      actions: [...deploying.actions, deployResult.action],
      systemMessages: [...deploying.systemMessages, plannerMessage('deployed')]
    };
    setProject(deployedProject);

    const verifyingProject: Project = {
      ...deployedProject,
      status: 'verifying',
      actions: [...deployedProject.actions, 'Started browser verification worker after deploy'],
      systemMessages: [...deployedProject.systemMessages, plannerMessage('verifying')]
    };
    setProject(verifyingProject);

    try {
      const verification = await requestBrowserVerification(deployResult.deployedUrl);
      const passed = verification.passed;
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: passed ? 'done' : 'editing',
          browserVerification: verification,
          actions: [
            ...prev.actions,
            passed
              ? 'Browser verification passed for deployed page'
              : 'Browser verification reported issues; returned to editing'
          ],
          systemMessages: [
            ...prev.systemMessages,
            plannerMessage(passed ? 'verified' : 'editing', {
              passed,
              issues: verification.issues,
              checkedAt: verification.checkedAt
            }),
            ...(passed ? [plannerMessage('done')] : [])
          ]
        };
      });
    } catch (error) {
      const issue = error instanceof Error ? error.message : 'Unknown browser verification error';
      setProject((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          status: 'editing',
          browserVerification: {
            passed: false,
            issues: [`Verification endpoint failed: ${issue}`],
            checkedAt: new Date().toISOString()
          },
          actions: [...prev.actions, 'Browser verification endpoint failed; returned to editing'],
          systemMessages: [...prev.systemMessages, plannerMessage('editing')]
        };
      });
    }
  };

  const onVerify = async () => {
    if (!project?.deployedUrl) {
      return;
    }

    patchProject((prev) => ({
      ...prev,
      status: 'verifying',
      actions: [...prev.actions, 'Triggered manual browser verification run']
    }));

    try {
      const verification = await requestBrowserVerification(project.deployedUrl);
      const passed = verification.passed;
      patchProject((prev) => ({
        ...prev,
        status: passed ? 'done' : 'editing',
        browserVerification: verification,
        actions: [
          ...prev.actions,
          passed ? 'Manual browser verification passed' : 'Manual browser verification failed'
        ],
        systemMessages: [
          ...prev.systemMessages,
          plannerMessage(passed ? 'verified' : 'editing', {
            passed,
            issues: verification.issues,
            checkedAt: verification.checkedAt
          }),
          ...(passed ? [plannerMessage('done')] : [])
        ]
      }));
    } catch (error) {
      const issue = error instanceof Error ? error.message : 'Unknown browser verification error';
      patchProject((prev) => ({
        ...prev,
        status: 'editing',
        browserVerification: {
          passed: false,
          issues: [`Manual verification endpoint failed: ${issue}`],
          checkedAt: new Date().toISOString()
        },
        actions: [...prev.actions, 'Manual browser verification request failed']
      }));
    }
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
