import { Department } from './types';

export const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'mfg_qa',
    name: 'Manufacturing QA',
    shortName: 'Mfg QA',
    description: 'Quality assurance for manufacturing operations, incoming material testing, and process qualification',
    defaultProjects: 5,
    defaultBomsPerProject: 3,
    defaultModulesPerBom: 8,
  },
  {
    id: 'rnd',
    name: 'R&D / Product Development',
    shortName: 'R&D',
    description: 'New product development, prototype testing, and material evaluation',
    defaultProjects: 3,
    defaultBomsPerProject: 5,
    defaultModulesPerBom: 8,
  },
  {
    id: 'reliability',
    name: 'Reliability Engineering',
    shortName: 'Reliability',
    description: 'Extended reliability testing, accelerated aging, and lifetime prediction',
    defaultProjects: 2,
    defaultBomsPerProject: 2,
    defaultModulesPerBom: 8,
  },
  {
    id: 'certification',
    name: 'Certification & Compliance',
    shortName: 'Certification',
    description: 'Type approval, certification testing per IEC/MNRE/REC standards',
    defaultProjects: 4,
    defaultBomsPerProject: 4,
    defaultModulesPerBom: 8,
  },
  {
    id: 'third_party',
    name: 'Third-Party Testing Lab',
    shortName: '3P Lab',
    description: 'Independent testing laboratory services for external clients',
    defaultProjects: 10,
    defaultBomsPerProject: 2,
    defaultModulesPerBom: 8,
  },
];

export function getDepartmentById(id: string): Department | undefined {
  return DEFAULT_DEPARTMENTS.find((d) => d.id === id);
}
