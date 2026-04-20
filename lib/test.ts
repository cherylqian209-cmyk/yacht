import { ComponentNode, Project, TestResult } from '@/types/project';

function flatten(nodes: ComponentNode[]): ComponentNode[] {
  return nodes.flatMap((node) => [node, ...(node.children ? flatten(node.children) : [])]);
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export function testProject(project: Project, sampleEmail = 'demo@example.com'): TestResult {
  const nodes = flatten(project.components);
  const cta = nodes.find((node) => node.type === 'button');
  const form = nodes.find((node) => node.type === 'form');
  const input = nodes.find((node) => node.type === 'input');

  const issues: string[] = [];

  if (!cta) issues.push('Missing CTA button.');
  if (!form) issues.push('Missing signup form.');
  if (!input) issues.push('Missing email input.');
  if (input && !isValidEmail(sampleEmail)) issues.push('Email input validation failed for sample address.');
  if (cta && !cta.props.submittedText) issues.push('CTA does not have a submission state message.');

  return {
    passed: issues.length === 0,
    issues,
    checkedAt: new Date().toISOString()
  };
}

export { isValidEmail };
