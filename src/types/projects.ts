import type { References } from './references';

export interface Project {
  id: number;
  label: string;
  name: string;
  created_at: number;
  references: References;
}

export interface Projects {
  projects: Project[];
}
