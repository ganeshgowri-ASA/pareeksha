import { Standard, BoMComponent, ChangeType } from './types';

function fullRequalTests(): string[] {
  return ['DH1000', 'TC200', 'HF10', 'UV15', 'MechLoad', 'Hail', 'PID108'];
}

function materialChangeTests(): string[] {
  return ['DH1000', 'TC200', 'HF10'];
}

function minorChangeTests(): string[] {
  return ['DH1000', 'TC50'];
}

function buildBomMappings(
  fullTests: string[],
  materialTests: string[],
  minorTests: string[]
): { component: BoMComponent; changeType: ChangeType; requiredTests: string[] }[] {
  const components: BoMComponent[] = [
    'Glass', 'Encapsulant', 'Cell', 'Frame', 'JunctionBox',
    'Backsheet', 'Foil', 'Wafer', 'Ribbon', 'Sealant', 'Potting',
  ];

  const mappings: { component: BoMComponent; changeType: ChangeType; requiredTests: string[] }[] = [];

  const criticalComponents: BoMComponent[] = ['Cell', 'Encapsulant', 'Backsheet', 'Glass'];

  for (const component of components) {
    const isCritical = criticalComponents.includes(component);

    mappings.push(
      { component, changeType: 'Requalification', requiredTests: fullTests },
      { component, changeType: 'DesignChange', requiredTests: fullTests },
      { component, changeType: 'MaterialChange', requiredTests: isCritical ? fullTests : materialTests },
      { component, changeType: 'NewSupplier', requiredTests: isCritical ? materialTests : minorTests },
      { component, changeType: 'NewFactory', requiredTests: materialTests },
      { component, changeType: 'BOMUpgrade', requiredTests: isCritical ? fullTests : materialTests },
    );
  }

  return mappings;
}

export const IEC_61215: Standard = {
  id: 'IEC_61215',
  name: 'IEC 61215 / 61730',
  shortName: 'IEC',
  description: 'International standard for crystalline silicon PV module design qualification and type approval',
  testProfiles: [
    {
      id: 'iec_full',
      name: 'Full Qualification',
      tests: [
        { chamberId: 'DH1000', quantity: 8 },
        { chamberId: 'TC200', quantity: 8 },
        { chamberId: 'TC50', quantity: 4 },
        { chamberId: 'HF10', quantity: 8 },
        { chamberId: 'UV15', quantity: 4 },
        { chamberId: 'MechLoad', quantity: 8 },
        { chamberId: 'Hail', quantity: 8 },
        { chamberId: 'PID108', quantity: 4 },
        { chamberId: 'BDT', quantity: 4 },
        { chamberId: 'IPTest', quantity: 2 },
      ],
    },
    {
      id: 'iec_retesting',
      name: 'Retesting (Minor Change)',
      tests: [
        { chamberId: 'DH1000', quantity: 4 },
        { chamberId: 'TC200', quantity: 4 },
        { chamberId: 'HF10', quantity: 4 },
      ],
    },
  ],
  bomTestMappings: buildBomMappings(fullRequalTests(), materialChangeTests(), minorChangeTests()),
};

export const MNRE_ALMM: Standard = {
  id: 'MNRE_ALMM',
  name: 'MNRE ALMM',
  shortName: 'ALMM',
  description: 'Approved List of Models and Manufacturers (India mandatory)',
  testProfiles: [
    {
      id: 'almm_full',
      name: 'ALMM Full Qualification',
      tests: [
        { chamberId: 'DH2000', quantity: 8 },
        { chamberId: 'TC400', quantity: 8 },
        { chamberId: 'HF20', quantity: 8 },
        { chamberId: 'UV60', quantity: 4 },
        { chamberId: 'PID288', quantity: 4 },
        { chamberId: 'MechLoad', quantity: 8 },
        { chamberId: 'Hail', quantity: 8 },
        { chamberId: 'SaltMist', quantity: 4 },
        { chamberId: 'SandDust', quantity: 4 },
        { chamberId: 'BDT', quantity: 4 },
      ],
    },
    {
      id: 'almm_retesting',
      name: 'ALMM Retesting',
      tests: [
        { chamberId: 'DH2000', quantity: 4 },
        { chamberId: 'TC400', quantity: 4 },
        { chamberId: 'HF20', quantity: 4 },
        { chamberId: 'PID288', quantity: 2 },
      ],
    },
  ],
  bomTestMappings: buildBomMappings(
    ['DH2000', 'TC400', 'HF20', 'UV60', 'MechLoad', 'Hail', 'PID288', 'SaltMist', 'SandDust'],
    ['DH2000', 'TC400', 'HF20', 'PID288'],
    ['DH2000', 'TC200']
  ),
};

export const REC: Standard = {
  id: 'REC',
  name: 'REC (Regional/Export)',
  shortName: 'REC',
  description: 'Regional certification standard for export markets',
  testProfiles: [
    {
      id: 'rec_full',
      name: 'REC Full Qualification',
      tests: [
        { chamberId: 'DH3000', quantity: 8 },
        { chamberId: 'TC600', quantity: 8 },
        { chamberId: 'HF40', quantity: 8 },
        { chamberId: 'UV60', quantity: 4 },
        { chamberId: 'PID288', quantity: 4 },
        { chamberId: 'MechLoad', quantity: 8 },
        { chamberId: 'Hail', quantity: 8 },
        { chamberId: 'SaltMist', quantity: 4 },
        { chamberId: 'BDT', quantity: 4 },
      ],
    },
  ],
  bomTestMappings: buildBomMappings(
    ['DH3000', 'TC600', 'HF40', 'UV60', 'MechLoad', 'Hail', 'PID288', 'SaltMist'],
    ['DH3000', 'TC600', 'HF40'],
    ['DH3000', 'TC200']
  ),
};

export const ALL_STANDARDS: Standard[] = [IEC_61215, MNRE_ALMM, REC];

export function getStandardById(id: string): Standard | undefined {
  return ALL_STANDARDS.find((s) => s.id === id);
}
