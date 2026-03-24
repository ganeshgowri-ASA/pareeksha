import { Department } from "./types";

export const DEFAULT_DEPARTMENTS: Department[] = [
  { id: "mfg-qa", name: "Manufacturing QA", projectsPerYear: 12, bomsPerProject: 4, modulesPerTest: 8 },
  { id: "rnd", name: "R&D / Product Development", projectsPerYear: 6, bomsPerProject: 8, modulesPerTest: 10 },
  { id: "reliability", name: "Reliability Engineering", projectsPerYear: 4, bomsPerProject: 3, modulesPerTest: 8 },
  { id: "cert", name: "Certification & Compliance", projectsPerYear: 8, bomsPerProject: 2, modulesPerTest: 8 },
  { id: "thirdparty", name: "Third-Party Testing Lab", projectsPerYear: 20, bomsPerProject: 5, modulesPerTest: 10 },
];
