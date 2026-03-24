import { Department } from "./types";

export const DEFAULT_DEPARTMENTS: Department[] = [
  {
    id: "mfg-qa",
    name: "Manufacturing QA",
    description: "Quality assurance for production lines",
    projectsPerYear: 12,
    bomsPerProject: 4,
    modulesPerBom: 8,
    color: "#2563eb",
  },
  {
    id: "rnd",
    name: "R&D / Product Development",
    description: "New product development and testing",
    projectsPerYear: 6,
    bomsPerProject: 8,
    modulesPerBom: 8,
    color: "#7c3aed",
  },
  {
    id: "reliability",
    name: "Reliability Engineering",
    description: "Long-term reliability and durability testing",
    projectsPerYear: 4,
    bomsPerProject: 6,
    modulesPerBom: 10,
    color: "#059669",
  },
  {
    id: "certification",
    name: "Certification & Compliance",
    description: "Standards compliance and certification testing",
    projectsPerYear: 8,
    bomsPerProject: 3,
    modulesPerBom: 8,
    color: "#d97706",
  },
  {
    id: "third-party",
    name: "Third-Party Testing Lab",
    description: "External testing services for clients",
    projectsPerYear: 20,
    bomsPerProject: 2,
    modulesPerBom: 6,
    color: "#dc2626",
  },
];
