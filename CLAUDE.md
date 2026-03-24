# CLAUDE.md - Pareeksha Project Instructions

## Project Overview
Pareeksha (Sanskrit: Examination/Qualification Testing) is a generic environmental chamber quantity estimation web app for manufacturing units and 3rd-party labs. It calculates chamber requirements based on BoM (Bill of Material) changes per IEC 61215, MNRE ALMM, and REC standards.

## Tech Stack
- Next.js 14 (App Router) + TypeScript
- Tailwind CSS + Custom components (no Shadcn dependency)
- Recharts for data visualization
- Lucide React for icons
- Zustand for state management
- Deploy: Vercel

## Project Structure
```
pareeksha/
  app/
    layout.tsx          # Root layout with sidebar nav
    page.tsx            # Dashboard with summary tiles
    globals.css         # Tailwind + custom styles
    bom-matrix/
      page.tsx          # BoM Change Matrix page
    calculator/
      page.tsx          # Chamber Calculator page
    reliability/
      page.tsx          # Reliability Planner page
    departments/
      page.tsx          # Department Manager page
    standards/
      page.tsx          # Standards Configurator page
    export/
      page.tsx          # Export/Report page
  components/
    sidebar.tsx         # Navigation sidebar
    dashboard-cards.tsx # Summary tiles
    bom-change-matrix.tsx
    chamber-calculator.tsx
    reliability-planner.tsx
    department-manager.tsx
    standards-config.tsx
    chart-widgets.tsx   # Recharts wrappers
  lib/
    standards.ts        # IEC/MNRE/REC test definitions
    chambers.ts         # Chamber types, slots, durations
    formulas.ts         # Calculation engine
    departments.ts      # Generic department definitions
    store.ts            # Zustand global state
    types.ts            # TypeScript interfaces
  public/
    favicon.ico
```

## Core Domain Logic

### Chamber Types
- DH (Damp Heat): DH1000/2000/3000 - 20 slots/chamber
- TC (Thermal Cycling): TC50/200/400/600 - 20 slots/chamber
- HF (Humidity Freeze): HF10/20/40 - 10 FS slots or 20 MM slots
- PID: PID108/288 - 20 slots/chamber
- UV: UV15/60 - 2 slots/chamber
- Salt Mist, Sand Dust, Mechanical Load, Hail, etc.

### Chamber Calculation Formula
```
Chambers = (Projects x BoMs x Modules x TestHrs) / (Slots x WorkHrs x RealisationRate)
```
Where:
- WorkHrs = 7200 hrs/year (300 days x 24 hrs)
- RealisationRate = 0.65 (65% default)
- Slots = chamber capacity (varies by type)

### BoM Components
Glass, Encapsulant, Cell, Frame, Junction Box, Backsheet, Foil, Wafer, Ribbon, Sealant, Potting

### Change Types
- New Supplier
- Material Change
- New Factory/Line
- Design Change
- BOM Upgrade
- Requalification

### Generic Departments
1. Manufacturing QA
2. R&D / Product Development
3. Reliability Engineering
4. Certification & Compliance
5. Third-Party Testing Lab

### Standards Profiles
- IEC 61215/61730 (International)
- MNRE ALMM (India - mandatory)
- REC (Regional/Export)
- Custom (user-defined)

## Development Commands
```bash
npm install
npm run dev      # Development server
npm run build    # Production build
npm run lint     # Linting
```

## Key Rules
1. All components must be client-side rendered ('use client') where state is used
2. Use TypeScript strict mode
3. All calculations must match the formula above
4. Chamber types and test mappings must be configurable
5. Export functionality must support CSV and print-friendly views
6. Mobile-responsive design required
7. No external UI library dependencies beyond what's listed
8. All test data from IEC 61215 sequence tables must be accurate
