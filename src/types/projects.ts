import type { References } from './references';

export interface Project {
  id: string;
  label: string;
  created_at: number;
  references: References;
  onEdited: boolean;
}

export interface Projects {
  projects: Project[];
}
