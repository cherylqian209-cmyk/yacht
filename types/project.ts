export type ProjectStatus =
  | 'idle'
  | 'generated'
  | 'editing'
  | 'testing'
  | 'tested'
  | 'deploying'
  | 'deployed'
  | 'verifying'
  | 'verified'
  | 'done';

export type ComponentType = 'section' | 'hero' | 'headline' | 'subtext' | 'form' | 'input' | 'button' | 'image';

export interface ComponentNode {
  id: string;
  type: ComponentType;
  props: {
    text?: string;
    src?: string;
    alt?: string;
    placeholder?: string;
    ctaLabel?: string;
    submittedText?: string;
    styleClass?: string;
    [key: string]: string | boolean | number | undefined;
  };
  children?: ComponentNode[];
}

export interface TestResult {
  passed: boolean;
  issues: string[];
  checkedAt: string;
}

export interface Project {
  id: string;
  goal: string;
  status: ProjectStatus;
  components: ComponentNode[];
  deployedUrl?: string;
  testResults?: TestResult;
  actions: string[];
  systemMessages: string[];
}
