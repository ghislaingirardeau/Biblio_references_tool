import type { References } from './references';
import type { Tags } from './tags';

export interface Project {
  id: string;
  label: string;
  created_at: number;
  references: References;
  onEdited: boolean;
  tags: Tags;
}

export interface Projects {
  projects: Project[];
}
