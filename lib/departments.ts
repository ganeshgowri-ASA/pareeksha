import { Department } from './types';

const COLORS = ['#2563eb', '#7c3aed', '#059669', '#d97706', '#dc2626', '#0891b2', '#be185d'];

export const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'mfg_qa',
    name: 'Manufacturing QA',
    description: 'Quality assurance for production line changes and supplier qualification',
    projectsPerYear: 12,
    bomsPerProject: 4,
    modulesPerBom: 8,
    defaultProjectsPerYear: 12,
    defaultBomsPerProject: 4,
    defaultModulesPerBom: 8,
    standardId: 'IEC',
    color: COLORS[0],
  },
  {
    id: 'rnd',
    name: 'R&D / Product Development',
    description: 'New product development, prototype testing, and design validation',
    projectsPerYear: 6,
    bomsPerProject: 8,
    modulesPerBom: 10,
    defaultProjectsPerYear: 6,
    defaultBomsPerProject: 8,
    defaultModulesPerBom: 10,
    standardId: 'IEC',
    color: COLORS[1],
  },
  {
    id: 'reliability',
    name: 'Reliability Engineering',
    description: 'Extended reliability testing, accelerated aging, and failure analysis',
    projectsPerYear: 4,
    bomsPerProject: 3,
    modulesPerBom: 12,
    defaultProjectsPerYear: 4,
    defaultBomsPerProject: 3,
    defaultModulesPerBom: 12,
    standardId: 'MNRE',
    color: COLORS[2],
  },
  {
    id: 'certification',
    name: 'Certification & Compliance',
    description: 'Regulatory certification, type approval, and compliance verification',
    projectsPerYear: 8,
    bomsPerProject: 2,
    modulesPerBom: 8,
    defaultProjectsPerYear: 8,
    defaultBomsPerProject: 2,
    defaultModulesPerBom: 8,
    standardId: 'MNRE',
    color: COLORS[3],
  },
  {
    id: 'third_party',
    name: '3rd-Party Testing Lab',
    description: 'Independent testing services for external clients and audits',
    projectsPerYear: 20,
    bomsPerProject: 2,
    modulesPerBom: 6,
    defaultProjectsPerYear: 20,
    defaultBomsPerProject: 2,
    defaultModulesPerBom: 6,
    standardId: 'IEC',
    color: COLORS[4],
  },
];

export function getDepartment(id: string): Department | undefined {
  return DEFAULT_DEPARTMENTS.find((d) => d.id === id);
}
