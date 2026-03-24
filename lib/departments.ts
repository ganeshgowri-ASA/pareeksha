import { Department } from './types';

export const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: 'mfg_qa',
    name: 'Manufacturing QA',
    description: 'Quality assurance for production line changes and supplier qualification',
    defaultProjectsPerYear: 12,
    defaultBomsPerProject: 4,
    defaultModulesPerBom: 8,
    standardId: 'IEC_61215',
  },
  {
    id: 'rnd',
    name: 'R&D / Product Development',
    description: 'New product development, prototype testing, and design validation',
    defaultProjectsPerYear: 6,
    defaultBomsPerProject: 8,
    defaultModulesPerBom: 10,
    standardId: 'IEC_61215',
  },
  {
    id: 'reliability',
    name: 'Reliability Engineering',
    description: 'Extended reliability testing, accelerated aging, and failure analysis',
    defaultProjectsPerYear: 4,
    defaultBomsPerProject: 3,
    defaultModulesPerBom: 12,
    standardId: 'MNRE_ALMM',
  },
  {
    id: 'certification',
    name: 'Certification & Compliance',
    description: 'Regulatory certification, type approval, and compliance verification',
    defaultProjectsPerYear: 8,
    defaultBomsPerProject: 2,
    defaultModulesPerBom: 8,
    standardId: 'MNRE_ALMM',
  },
  {
    id: 'third_party',
    name: '3rd-Party Testing Lab',
    description: 'Independent testing services for external clients and audits',
    defaultProjectsPerYear: 20,
    defaultBomsPerProject: 2,
    defaultModulesPerBom: 6,
    standardId: 'IEC_61215',
  },
];

export function getDepartment(id: string): Department | undefined {
  return DEFAULT_DEPARTMENTS.find((d) => d.id === id);
}
