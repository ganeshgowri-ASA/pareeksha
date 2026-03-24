# agents.md - Parallel Claude Code Session Definitions

## Architecture: Srishti Workflow (3 Parallel Sessions)

All 3 sessions work on the SAME repository: `ganeshgowri-ASA/pareeksha`
Each session operates on its own feature branch, then merges to `main`.

---

## Session A: NEETI (Foundation + Data Layer)
**Branch**: `feat/neeti-foundation`
**Role**: Project scaffolding, configuration, data models, calculation engine

### Files to Create:
- `package.json` - Dependencies (next, react, recharts, lucide-react, zustand, clsx, tailwind-merge)
- `tsconfig.json` - TypeScript strict config with path aliases
- `next.config.js` - Next.js 14 config
- `tailwind.config.ts` - Tailwind with custom colors (slate/blue/emerald theme)
- `postcss.config.js` - PostCSS config
- `app/globals.css` - Tailwind directives + custom CSS variables
- `lib/types.ts` - All TypeScript interfaces (Chamber, BoMComponent, TestProfile, Department, Standard, CalculationResult)
- `lib/chambers.ts` - Chamber definitions (DH, TC, HF, PID, UV, SaltMist, Sand, MechLoad, Hail) with slots, durations
- `lib/standards.ts` - IEC 61215, MNRE ALMM, REC test sequence mappings
- `lib/departments.ts` - 5 generic departments with default project loads
- `lib/formulas.ts` - Calculation engine: chamberCount, utilizationRate, yearlyCapacity, testHoursPerBoM
- `lib/store.ts` - Zustand store for global state (selected standard, departments, BoM changes, results)
- `lib/utils.ts` - cn() helper, formatNumber, exportCSV utilities

### Success Criteria:
- `npm run build` passes with zero errors
- All TypeScript types compile cleanly
- Formulas return correct values for sample inputs
- Store hydrates and persists state

---

## Session B: SHILPA (UI Components + Pages)
**Branch**: `feat/shilpa-ui`
**Role**: All React components, page layouts, navigation, responsive design

### Depends On: Session A (types, store, data)
### Files to Create:
- `app/layout.tsx` - Root layout with sidebar, header, dark/light theme
- `app/page.tsx` - Dashboard with summary cards (total chambers, utilization, bottlenecks)
- `app/bom-matrix/page.tsx` - BoM Change Matrix page
- `app/calculator/page.tsx` - Chamber Calculator page  
- `app/reliability/page.tsx` - Reliability Planner (22-test matrix)
- `app/departments/page.tsx` - Department Manager page
- `app/standards/page.tsx` - Standards Configurator page
- `app/export/page.tsx` - Export/Report page
- `components/sidebar.tsx` - Navigation sidebar with route links + icons
- `components/dashboard-cards.tsx` - Summary tile components
- `components/bom-change-matrix.tsx` - Interactive BoM x ChangeType grid
- `components/chamber-calculator.tsx` - Input form + results table
- `components/reliability-planner.tsx` - 22-test matrix with chamber demand
- `components/department-manager.tsx` - Department CRUD with project allocation
- `components/standards-config.tsx` - Standard selector with test profile editor

### Success Criteria:
- All pages render without errors
- Sidebar navigation works across all routes
- Mobile responsive (tested at 375px, 768px, 1024px)
- Forms calculate and display results in real-time
- Dashboard charts render with Recharts

---

## Session C: DARSHANA (Charts, Export, Polish)
**Branch**: `feat/darshana-viz`
**Role**: Data visualization, export functionality, final integration, Vercel deploy

### Depends On: Session A + B
### Files to Create:
- `components/chart-widgets.tsx` - Bar/Pie/Radar charts for chamber distribution
- `components/gantt-schedule.tsx` - Yearly test schedule visualization
- `components/utilization-gauge.tsx` - Chamber utilization gauge component
- `components/export-panel.tsx` - CSV export + print-friendly view
- `components/comparison-table.tsx` - Side-by-side standard comparison
- `app/favicon.ico` - App icon
- `public/og-image.png` - Open Graph image
- `.github/workflows/deploy.yml` - CI/CD (optional)
- `vercel.json` - Vercel configuration

### Success Criteria:
- All charts render with real calculation data
- CSV export downloads correctly formatted file
- Print view is clean and professional
- Vercel deployment succeeds
- Lighthouse score > 85 for performance
- All 6 pages fully functional end-to-end

---

## Merge Order
1. Session A (Neeti) merges to `main` first
2. Session B (Shilpa) rebases on `main`, then merges
3. Session C (Darshana) rebases on `main`, then merges
4. Final integration test on `main`

## Conflict Resolution
- Session A owns: `lib/`, `package.json`, config files
- Session B owns: `app/`, `components/` (except chart-widgets)
- Session C owns: `components/chart-widgets.tsx`, `components/export-panel.tsx`, `vercel.json`
