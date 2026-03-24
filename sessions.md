# sessions.md - Claude Code IDE Session Launch Prompts

Open 3 Claude Code IDE terminals. Clone the repo in each, checkout a branch, and paste the prompt.

## Pre-requisite (run in each terminal)
```bash
git clone https://github.com/ganeshgowri-ASA/pareeksha.git
cd pareeksha
```

---

## SESSION A: NEETI (Foundation + Data Layer)

```bash
git checkout -b feat/neeti-foundation
```

### Prompt to paste in Claude Code:
```
You are working on the Pareeksha project - a chamber quantity estimation app. Read CLAUDE.md and agents.md first.

You are SESSION A (NEETI). Your job: create the entire foundation and data layer.

Create these files:

1. package.json with: next@14.2.5, react@18, recharts, lucide-react, zustand, clsx, tailwind-merge, typescript, tailwindcss, postcss, autoprefixer

2. tsconfig.json with strict mode, paths alias "@/*" -> "./*"

3. next.config.js (standalone output)

4. tailwind.config.ts with content paths for app/ and components/, custom colors: primary (blue-600), accent (emerald-500), surface (slate-50/900)

5. postcss.config.js

6. app/globals.css with @tailwind directives and CSS variables for --primary, --accent, --surface, --text

7. lib/types.ts with interfaces:
   - ChamberType { id, name, category, slotsFS, slotsMM, variants: {name, durationHrs, cycles}[] }
   - BoMComponent { id, name, category }
   - ChangeType { id, name, testsRequired: string[] }
   - TestProfile { id, chamberType, durationHrs, modulesRequired, standard }
   - Department { id, name, projectsPerYear, bomsPerProject, modulesPerBom }
   - Standard { id, name, code, testProfiles: TestProfile[] }
   - CalculationInput { departments, bomChanges, standard, realizationRate }
   - CalculationResult { chamberType, chambersNeeded, utilizationPct, totalTestHrs, bottleneck }

8. lib/chambers.ts - Complete chamber definitions:
   - DH: slots=20, DH1000=1050hrs, DH2000=2100hrs, DH3000=3150hrs
   - TC: slots=20, TC50=500hrs, TC200=1600hrs, TC400=3200hrs, TC600=4800hrs
   - HF: slotsFS=10/slotsMM=20, HF10=500hrs, HF20=1000hrs, HF40=2000hrs
   - PID: slots=20, PID108=108hrs, PID288=288hrs
   - UV: slots=2, UV15=120hrs, UV60=480hrs
   - SaltMist: slots=4, SM=96hrs
   - MechLoad: slots=1, ML=24hrs
   - Hail: slots=1, Hail=2hrs
   - BDT: slots=5, BDT=4hrs
   - IPTest: slots=2, IP=24hrs

9. lib/standards.ts - Three standard profiles:
   - IEC_61215: requires DH1000, TC200, HF10, UV15, PID96
   - MNRE_ALMM: requires DH2000, TC400, HF20, UV60, PID108, LID, LeTID, PAN
   - REC: requires DH3000, TC600, HF40, UV60, PID288, SaltMist, Sand, MechLoad
   Each maps BoM change types to required test sequences.

10. lib/departments.ts - 5 generic departments:
    - Manufacturing QA: 12 projects/yr, 8 BoMs, 4 modules
    - R&D: 6 projects/yr, 15 BoMs, 6 modules
    - Reliability: 4 projects/yr, 10 BoMs, 8 modules
    - Certification: 8 projects/yr, 5 BoMs, 4 modules
    - Third-Party Lab: 20 projects/yr, 3 BoMs, 4 modules

11. lib/formulas.ts with functions:
    - calcTestHours(bomChanges, standard) -> totalHrs per chamber type
    - calcChambersNeeded(testHrs, chamberType, realizationRate=0.65) -> number
    - calcUtilization(testHrs, chambers, slots) -> percentage
    - calcYearlyCapacity(chambers, slots, workHrsPerYear=7200) -> moduleSlotHrs
    - calcAllDepartments(departments, bomChanges, standard) -> CalculationResult[]

12. lib/store.ts - Zustand store with:
    - selectedStandard, departments[], bomChanges[], results[]
    - actions: setStandard, addDepartment, updateDepartment, removeDepartment, setBomChanges, calculateAll

13. lib/utils.ts - cn() helper using clsx+twMerge, formatNumber, exportToCSV

After creating all files, run: npm install && npm run build
Fix any TypeScript or build errors until build succeeds.
Then: git add . && git commit -m "feat(neeti): foundation + data layer + calculation engine" && git push origin feat/neeti-foundation
```

---

## SESSION B: SHILPA (UI Components + Pages)

```bash
git checkout -b feat/shilpa-ui
```

### Prompt to paste in Claude Code:
```
You are working on the Pareeksha project. Read CLAUDE.md and agents.md first.

You are SESSION B (SHILPA). Your job: create all UI components and pages.

IMPORTANT: Session A (Neeti) is building the data layer in parallel. You need to create stub versions of the lib/ files you depend on, OR wait for Session A to merge first. For now, create your own minimal versions of lib/types.ts, lib/store.ts, lib/chambers.ts, lib/standards.ts, lib/departments.ts, lib/formulas.ts with the same interfaces but simplified implementations so your UI compiles.

Create these files:

1. app/layout.tsx - Root layout:
   - Import globals.css
   - Sidebar on the left (collapsible on mobile)
   - Header bar with app title "Pareeksha" and subtitle
   - Main content area with padding
   - Use Inter font from next/font/google

2. components/sidebar.tsx:
   - Navigation links: Dashboard(/), BoM Matrix(/bom-matrix), Calculator(/calculator), Reliability(/reliability), Departments(/departments), Standards(/standards), Export(/export)
   - Lucide icons for each: LayoutDashboard, Grid3x3, Calculator, Shield, Building2, BookOpen, Download
   - Active route highlighting
   - Collapsible on mobile with hamburger

3. app/page.tsx - Dashboard:
   - 4 summary cards: Total Chambers Needed, Avg Utilization %, Bottleneck Chamber, Active Projects
   - Bar chart showing chambers needed by type (Recharts BarChart)
   - Pie chart showing test hours distribution by department
   - Quick links to other pages

4. components/dashboard-cards.tsx:
   - StatCard component with icon, title, value, change indicator
   - Color-coded: blue for count, green for utilization, red for bottleneck, purple for projects

5. app/bom-matrix/page.tsx + components/bom-change-matrix.tsx:
   - Grid: rows = BoM components (Glass, Encapsulant, Cell, Frame, JB, Backsheet, Foil, Wafer, Ribbon, Sealant, Potting)
   - Columns = Change types (New Supplier, Material Change, New Factory, Design Change, BOM Upgrade, Requalification)
   - Checkbox at each intersection
   - When checked, shows required tests for that combination based on selected standard
   - Summary row at bottom showing total test count per change type

6. app/calculator/page.tsx + components/chamber-calculator.tsx:
   - Input section: Number of projects, BoMs per project, Modules per BoM, Realization rate (slider 50-90%)
   - Standard selector dropdown
   - Calculate button
   - Results table: Chamber Type | Test Duration | Slots | Chambers Needed | Utilization %
   - Total row at bottom

7. app/reliability/page.tsx + components/reliability-planner.tsx:
   - Matrix of 22 test types (rows) vs parameters (columns)
   - Columns: Test Name, Chamber Type, Duration (hrs), Modules Required, Full-Size Slots, Mini-Module Slots, Annual Demand, Chambers Needed
   - Editable cells for Annual Demand
   - Auto-calculate Chambers Needed
   - Summary: Total FS chambers, Total MM chambers

8. app/departments/page.tsx + components/department-manager.tsx:
   - Card for each department showing: name, projects/yr, BoMs/project, modules/BoM
   - Edit button to modify values
   - Add new department button
   - Delete department with confirmation
   - Total projects across all departments

9. app/standards/page.tsx + components/standards-config.tsx:
   - 3 tabs: IEC 61215, MNRE ALMM, REC
   - Each tab shows the test sequence table for that standard
   - Editable test parameters
   - "Custom" tab for user-defined test profiles
   - Save/Reset buttons

10. app/export/page.tsx:
    - Summary table of all calculation results
    - Export as CSV button
    - Print-friendly view button
    - Standard comparison table

Design requirements:
- Tailwind CSS only, no external UI libraries
- Color scheme: slate backgrounds, blue-600 primary, emerald-500 accent
- Rounded corners (rounded-xl), subtle shadows
- All forms use 'use client' directive
- Responsive: sidebar collapses on mobile, tables scroll horizontally

After creating all files, run: npm install && npm run build
Fix all errors until build succeeds.
Then: git add . && git commit -m "feat(shilpa): UI components + all pages" && git push origin feat/shilpa-ui
```

---

## SESSION C: DARSHANA (Charts, Export, Polish)

```bash
git checkout -b feat/darshana-viz
```

### Prompt to paste in Claude Code:
```
You are working on the Pareeksha project. Read CLAUDE.md and agents.md first.

You are SESSION C (DARSHANA). Your job: data visualization, export functionality, and final polish.

IMPORTANT: You depend on Sessions A and B. Create stub/minimal versions of dependencies so your code compiles independently. After A and B merge, you'll rebase.

Create these files:

1. components/chart-widgets.tsx:
   - ChamberBarChart: Recharts BarChart showing chambers needed per type, color-coded by category
   - TestHoursPieChart: Recharts PieChart showing test hours distribution across departments
   - StandardComparisonRadar: Recharts RadarChart comparing test requirements across IEC/MNRE/REC
   - UtilizationBarChart: horizontal bar chart showing utilization % per chamber type
   All charts must be responsive, use Recharts ResponsiveContainer, and have proper legends/tooltips.

2. components/gantt-schedule.tsx:
   - Visual yearly test schedule (simplified Gantt)
   - Rows = chamber types, Columns = months (Jan-Dec)
   - Colored blocks showing when chambers are occupied
   - Based on test duration and annual demand
   - Use div-based rendering (no external Gantt library)

3. components/utilization-gauge.tsx:
   - Circular gauge showing chamber utilization percentage
   - Green (0-65%), Yellow (65-85%), Red (85-100%)
   - SVG-based donut chart
   - Shows current value and label

4. components/export-panel.tsx:
   - Export to CSV function: converts calculation results to CSV string, triggers download
   - Print-friendly view: applies print CSS, hides nav, opens print dialog
   - Summary generator: creates formatted text summary of all results
   - Column selection: user can choose which columns to export

5. components/comparison-table.tsx:
   - Side-by-side comparison of IEC vs MNRE vs REC
   - Rows = test types, Columns = standards
   - Shows required/not-required with checkmarks
   - Highlights differences between standards
   - Total test hours per standard at bottom

6. vercel.json:
   - Framework: nextjs
   - Build command: npm run build
   - Output directory: .next

7. Update app/page.tsx dashboard to integrate ChamberBarChart and TestHoursPieChart
8. Update app/export/page.tsx to integrate ExportPanel and ComparisonTable
9. Update app/reliability/page.tsx to integrate GanttSchedule

Design polish:
- Add loading states with skeleton loaders
- Add empty states with helpful messages
- Smooth transitions (transition-all duration-200)
- Hover effects on interactive elements
- Focus rings for accessibility
- Print stylesheet in globals.css

After creating all files, run: npm install && npm run build
Fix all errors until build succeeds.
Then: git add . && git commit -m "feat(darshana): charts, export, visualization + polish" && git push origin feat/darshana-viz
```

---

## Post-Merge Integration (Session D - any terminal)

```bash
git checkout main
git pull
# Merge Session A first
git merge feat/neeti-foundation
# Then Session B
git merge feat/shilpa-ui
# Then Session C
git merge feat/darshana-viz
# Resolve any conflicts
npm install && npm run build
git push origin main
```

Vercel will auto-deploy from `main` branch.
