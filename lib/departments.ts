import { Department } from './types';

export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'mfg-qa', name: 'Manufacturing QA', projectsPerYear: 12, bomsPerProject: 8, modulesPerBom: 4 },
  { id: 'rnd', name: 'R&D / Product Development', projectsPerYear: 6, bomsPerProject: 15, modulesPerBom: 6 },
  { id: 'reliability', name: 'Reliability Engineering', projectsPerYear: 4, bomsPerProject: 10, modulesPerBom: 8 },
  { id: 'certification', name: 'Certification & Compliance', projectsPerYear: 8, bomsPerProject: 5, modulesPerBom: 4 },
  { id: 'tpl', name: 'Third-Party Testing Lab', projectsPerYear: 20, bomsPerProject: 3, modulesPerBom: 4 },
];
