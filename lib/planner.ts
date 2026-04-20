import { Project, ProjectStatus, TestResult } from '@/types/project';

export function nextPlannerStatus(project: Project): ProjectStatus {
  switch (project.status) {
    case 'generated':
      return 'editing';
    case 'editing':
      return 'testing';
    case 'tested':
      return project.testResults?.passed ? 'deploying' : 'editing';
    case 'deployed':
      return 'verifying';
    case 'verified':
      return 'done';
    default:
      return project.status;
  }
}

export function plannerMessage(status: ProjectStatus, result?: TestResult): string {
  if (status === 'editing') return 'Planner moved project to editing. Customize copy and CTA before testing.';
  if (status === 'testing') return 'Planner started test run for CTA and signup flow.';
  if (status === 'deploying') return 'Planner approved deployment because tests passed.';
  if (status === 'verifying') return 'Planner is verifying the deployed page with the same test checks.';
  if (status === 'done') return 'Planner completed the loop: generated, edited, tested, deployed, and verified.';
  if (status === 'tested' && result && !result.passed) return 'Tests failed. Planner returned to editing.';
  return `Planner status updated to ${status}.`;
}
