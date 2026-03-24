import { Department } from './types';

export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: 'mfg-qa', name: 'Manufacturing QA', description: 'Quality assurance for manufacturing', color: '#2563eb', projectsPerYear: 12, bomsPerProject: 8, modulesPerBom: 4 },
  { id: 'rnd', name: 'R&D / Product Development', description: 'Research and product development', color: '#7c3aed', projectsPerYear: 6, bomsPerProject: 15, modulesPerBom: 6 },
  { id: 'reliability', name: 'Reliability Engineering', description: 'Reliability testing and analysis', color: '#059669', projectsPerYear: 4, bomsPerProject: 10, modulesPerBom: 8 },
  { id: 'certification', name: 'Certification & Compliance', description: 'Standards certification', color: '#d97706', projectsPerYear: 8, bomsPerProject: 5, modulesPerBom: 4 },
  { id: 'tpl', name: 'Third-Party Testing Lab', description: 'External testing services', color: '#dc2626', projectsPerYear: 20, bomsPerProject: 3, modulesPerBom: 4 },
];
