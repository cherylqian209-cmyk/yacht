import { Project } from '@/types/project';

export function deployProject(project: Project): { deployedUrl: string; action: string } {
  const deployedUrl = `/deployed/${project.id}`;
  return {
    deployedUrl,
    action: `Project deployed to ${deployedUrl}`
  };
}
