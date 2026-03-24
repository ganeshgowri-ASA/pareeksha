"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, RadarChart, Radar, PolarGrid,
  PolarAngleAxis, PolarRadiusAxis,
} from "recharts";
import { useAppStore } from "@/lib/store";
import { calculateAllChambers, totalChambersNeeded } from "@/lib/formulas";
import type { Department } from "@/lib/types";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/toast";

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#be185d"];

export default function DepartmentManager() {
  const { departments, addDepartment, removeDepartment, updateDepartment, calculationInput } = useAppStore();
  const { toast } = useToast();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [draft, setDraft] = useState<Partial<Department>>({});

  const startEdit = (dept: Department) => {
    setEditingId(dept.id);
    setDraft(dept);
  };

  const saveEdit = () => {
    if (editingId && draft.name) {
      updateDepartment(editingId, draft);
      setEditingId(null);
      setDraft({});
      toast("Department updated successfully", "success");
    }
  };

  const handleAdd = () => {
    if (draft.name) {
      addDepartment({
        id: `dept-${Date.now()}`,
        name: draft.name,
        description: draft.description ?? "",
        projectsPerYear: draft.projectsPerYear ?? 5,
        bomsPerProject: draft.bomsPerProject ?? 3,
        modulesPerBom: draft.modulesPerBom ?? 8,
        standardId: "IEC",
        color: COLORS[departments.length % COLORS.length],
      });
      setShowAdd(false);
      setDraft({});
      toast("Department added successfully", "success");
    }
  };

  const handleRemove = (id: string, name: string) => {
    removeDepartment(id);
    toast(`${name} removed`, "info");
  };

  // Comparison data
  const comparisonData = departments.map((dept) => ({
    name: dept.name.length > 12 ? dept.name.slice(0, 10) + "..." : dept.name,
    modules: dept.projectsPerYear * dept.bomsPerProject * dept.modulesPerBom,
    projects: dept.projectsPerYear,
    boms: dept.bomsPerProject,
    color: dept.color ?? COLORS[0],
  }));

  // Radar data for resource allocation
  const radarData = departments.map((dept) => ({
    department: dept.name.length > 10 ? dept.name.slice(0, 8) + "..." : dept.name,
    projects: dept.projectsPerYear,
    boms: dept.bomsPerProject * 3,
    modules: dept.modulesPerBom,
  }));

  // Capacity vs demand per department
  const capacityData = departments.map((dept) => {
    const deptInput = {
      ...calculationInput,
      projects: dept.projectsPerYear,
      boms: dept.bomsPerProject,
      modules: dept.modulesPerBom,
    };
    const results = calculateAllChambers(deptInput);
    const chambers = totalChambersNeeded(results);
    return {
      name: dept.name.length > 12 ? dept.name.slice(0, 10) + "..." : dept.name,
      demand: chambers,
      capacity: Math.round(chambers * 1.2), // assumed capacity with 20% buffer
      color: dept.color ?? COLORS[0],
    };
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">{departments.length} departments configured</p>
        <button onClick={() => { setShowAdd(true); setDraft({}); }} className="btn-primary">
          <Plus size={16} /> Add Department
        </button>
      </div>

      {showAdd && (
        <div className="card border-blue-200 dark:border-blue-800 bg-blue-50/30 dark:bg-blue-900/10">
          <h3 className="mb-3 font-semibold text-slate-800 dark:text-slate-200">New Department</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input placeholder="Name" value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="input-field" />
            <input placeholder="Description" value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input-field" />
            <input type="number" placeholder="Projects/Year" value={draft.projectsPerYear ?? ""} onChange={(e) => setDraft({ ...draft, projectsPerYear: Number(e.target.value) })} className="input-field" />
            <input type="number" placeholder="BoMs/Project" value={draft.bomsPerProject ?? ""} onChange={(e) => setDraft({ ...draft, bomsPerProject: Number(e.target.value) })} className="input-field" />
            <input type="number" placeholder="Modules/BoM" value={draft.modulesPerBom ?? ""} onChange={(e) => setDraft({ ...draft, modulesPerBom: Number(e.target.value) })} className="input-field" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleAdd} className="btn-primary"><Check size={16} /> Save</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary"><X size={16} /> Cancel</button>
          </div>
        </div>
      )}

      {/* Department Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <div key={dept.id} className="card relative hover-lift">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ backgroundColor: dept.color }} />
            {editingId === dept.id ? (
              <div className="space-y-2 pl-3">
                <input value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="input-field text-sm font-semibold" />
                <input value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input-field text-xs" />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400">Projects</label>
                    <input type="number" value={draft.projectsPerYear ?? 0} onChange={(e) => setDraft({ ...draft, projectsPerYear: Number(e.target.value) })} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400">BoMs</label>
                    <input type="number" value={draft.bomsPerProject ?? 0} onChange={(e) => setDraft({ ...draft, bomsPerProject: Number(e.target.value) })} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 dark:text-slate-400">Modules</label>
                    <input type="number" value={draft.modulesPerBom ?? 0} onChange={(e) => setDraft({ ...draft, modulesPerBom: Number(e.target.value) })} className="input-field" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={saveEdit} className="btn-primary text-xs"><Check size={14} /></button>
                  <button onClick={() => setEditingId(null)} className="btn-secondary text-xs"><X size={14} /></button>
                </div>
              </div>
            ) : (
              <div className="pl-3">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{dept.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">{dept.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(dept)} className="rounded p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 hover:text-slate-600 dark:hover:text-slate-300">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleRemove(dept.id, dept.name)} className="rounded p-1 text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 px-2 py-1.5">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{dept.projectsPerYear}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Projects/yr</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 px-2 py-1.5">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{dept.bomsPerProject}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">BoMs/proj</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 dark:bg-slate-700/50 px-2 py-1.5">
                    <p className="text-lg font-bold text-slate-900 dark:text-white">{dept.modulesPerBom}</p>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Modules</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Comparison Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <div className="card">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Module Demand by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisonData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip />
              <Bar dataKey="modules" name="Total Modules" radius={[6, 6, 0, 0]} animationDuration={1000}>
                {comparisonData.map((entry, i) => (
                  <rect key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Capacity vs Demand</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={capacityData} barCategoryGap="20%">
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" strokeOpacity={0.5} />
              <XAxis dataKey="name" tick={{ fontSize: 10, fill: "#64748b" }} />
              <YAxis tick={{ fontSize: 11, fill: "#64748b" }} />
              <Tooltip />
              <Bar dataKey="demand" name="Demand" fill="#ef4444" radius={[4, 4, 0, 0]} animationDuration={1000} />
              <Bar dataKey="capacity" name="Capacity" fill="#10b981" radius={[4, 4, 0, 0]} animationDuration={1000} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Resource Allocation Radar */}
      {departments.length >= 3 && (
        <div className="card">
          <h3 className="mb-3 text-sm font-semibold text-slate-900 dark:text-white">Resource Allocation Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="#e2e8f0" />
              <PolarAngleAxis dataKey="department" tick={{ fontSize: 10, fill: "#64748b" }} />
              <PolarRadiusAxis tick={{ fontSize: 10, fill: "#94a3b8" }} />
              <Radar name="Projects" dataKey="projects" stroke="#2563eb" fill="#2563eb" fillOpacity={0.15} animationDuration={1000} />
              <Radar name="BoMs (x3)" dataKey="boms" stroke="#7c3aed" fill="#7c3aed" fillOpacity={0.15} animationDuration={1000} />
              <Radar name="Modules" dataKey="modules" stroke="#059669" fill="#059669" fillOpacity={0.15} animationDuration={1000} />
              <Tooltip />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
