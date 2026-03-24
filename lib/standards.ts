import { Standard } from './types';

export const STANDARDS: Standard[] = [
  {
    id: 'IEC_61215',
    name: 'IEC 61215/61730',
    code: 'IEC',
    testProfiles: [
      { id: 'iec-dh', chamberType: 'DH', durationHrs: 1050, modulesRequired: 4, standard: 'IEC_61215' },
      { id: 'iec-tc', chamberType: 'TC', durationHrs: 1600, modulesRequired: 4, standard: 'IEC_61215' },
      { id: 'iec-hf', chamberType: 'HF', durationHrs: 500, modulesRequired: 4, standard: 'IEC_61215' },
      { id: 'iec-uv', chamberType: 'UV', durationHrs: 120, modulesRequired: 2, standard: 'IEC_61215' },
      { id: 'iec-pid', chamberType: 'PID', durationHrs: 108, modulesRequired: 4, standard: 'IEC_61215' },
      { id: 'iec-hail', chamberType: 'Hail', durationHrs: 2, modulesRequired: 2, standard: 'IEC_61215' },
      { id: 'iec-ml', chamberType: 'ML', durationHrs: 24, modulesRequired: 2, standard: 'IEC_61215' },
      { id: 'iec-bdt', chamberType: 'BDT', durationHrs: 4, modulesRequired: 4, standard: 'IEC_61215' },
    ],
  },
  {
    id: 'MNRE_ALMM',
    name: 'MNRE ALMM',
    code: 'MNRE',
    testProfiles: [
      { id: 'mnre-dh', chamberType: 'DH', durationHrs: 2100, modulesRequired: 4, standard: 'MNRE_ALMM' },
      { id: 'mnre-tc', chamberType: 'TC', durationHrs: 3200, modulesRequired: 4, standard: 'MNRE_ALMM' },
      { id: 'mnre-hf', chamberType: 'HF', durationHrs: 1000, modulesRequired: 4, standard: 'MNRE_ALMM' },
      { id: 'mnre-uv', chamberType: 'UV', durationHrs: 480, modulesRequired: 2, standard: 'MNRE_ALMM' },
      { id: 'mnre-pid', chamberType: 'PID', durationHrs: 108, modulesRequired: 4, standard: 'MNRE_ALMM' },
      { id: 'mnre-hail', chamberType: 'Hail', durationHrs: 2, modulesRequired: 2, standard: 'MNRE_ALMM' },
      { id: 'mnre-ml', chamberType: 'ML', durationHrs: 24, modulesRequired: 2, standard: 'MNRE_ALMM' },
      { id: 'mnre-sm', chamberType: 'SM', durationHrs: 96, modulesRequired: 4, standard: 'MNRE_ALMM' },
      { id: 'mnre-bdt', chamberType: 'BDT', durationHrs: 4, modulesRequired: 4, standard: 'MNRE_ALMM' },
    ],
  },
  {
    id: 'REC',
    name: 'REC (Regional/Export)',
    code: 'REC',
    testProfiles: [
      { id: 'rec-dh', chamberType: 'DH', durationHrs: 3150, modulesRequired: 6, standard: 'REC' },
      { id: 'rec-tc', chamberType: 'TC', durationHrs: 4800, modulesRequired: 6, standard: 'REC' },
      { id: 'rec-hf', chamberType: 'HF', durationHrs: 2000, modulesRequired: 6, standard: 'REC' },
      { id: 'rec-uv', chamberType: 'UV', durationHrs: 480, modulesRequired: 2, standard: 'REC' },
      { id: 'rec-pid', chamberType: 'PID', durationHrs: 288, modulesRequired: 4, standard: 'REC' },
      { id: 'rec-sm', chamberType: 'SM', durationHrs: 96, modulesRequired: 4, standard: 'REC' },
      { id: 'rec-ml', chamberType: 'ML', durationHrs: 24, modulesRequired: 2, standard: 'REC' },
      { id: 'rec-hail', chamberType: 'Hail', durationHrs: 2, modulesRequired: 2, standard: 'REC' },
      { id: 'rec-bdt', chamberType: 'BDT', durationHrs: 4, modulesRequired: 4, standard: 'REC' },
      { id: 'rec-ip', chamberType: 'IP', durationHrs: 24, modulesRequired: 2, standard: 'REC' },
    ],
  },
];

export function getStandardById(id: string): Standard | undefined {
  return STANDARDS.find((s) => s.id === id);
}
