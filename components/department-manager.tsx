"use client";

import { useState } from "react";
import { Plus, Pencil, Trash2, X, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import type { Department } from "@/lib/types";

const COLORS = ["#2563eb", "#7c3aed", "#059669", "#d97706", "#dc2626", "#0891b2", "#be185d"];

export default function DepartmentManager() {
  const { departments, addDepartment, removeDepartment, updateDepartment } = useAppStore();
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
    }
  };

  const handleAdd = () => {
    if (draft.name) {
      addDepartment({
        id: `dept-${Date.now()}`,
        name: draft.name,
        description: draft.description ?? "",
        defaultProjectsPerYear: draft.defaultProjectsPerYear ?? 5,
        defaultBomsPerProject: draft.defaultBomsPerProject ?? 3,
        defaultModulesPerBom: draft.defaultModulesPerBom ?? 8,
        standardId: 'IEC_61215',
        color: COLORS[departments.length % COLORS.length],
      });
      setShowAdd(false);
      setDraft({});
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500">{departments.length} departments configured</p>
        <button onClick={() => { setShowAdd(true); setDraft({}); }} className="btn-primary">
          <Plus size={16} /> Add Department
        </button>
      </div>

      {showAdd && (
        <div className="card border-blue-200 bg-blue-50/30">
          <h3 className="mb-3 font-semibold text-slate-800">New Department</h3>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <input placeholder="Name" value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="input-field" />
            <input placeholder="Description" value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input-field" />
            <input type="number" placeholder="Projects/Year" value={draft.defaultProjectsPerYear ?? ""} onChange={(e) => setDraft({ ...draft, defaultProjectsPerYear: Number(e.target.value) })} className="input-field" />
            <input type="number" placeholder="BoMs/Project" value={draft.defaultBomsPerProject ?? ""} onChange={(e) => setDraft({ ...draft, defaultBomsPerProject: Number(e.target.value) })} className="input-field" />
            <input type="number" placeholder="Modules/BoM" value={draft.defaultModulesPerBom ?? ""} onChange={(e) => setDraft({ ...draft, defaultModulesPerBom: Number(e.target.value) })} className="input-field" />
          </div>
          <div className="mt-3 flex gap-2">
            <button onClick={handleAdd} className="btn-primary"><Check size={16} /> Save</button>
            <button onClick={() => setShowAdd(false)} className="btn-secondary"><X size={16} /> Cancel</button>
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {departments.map((dept) => (
          <div key={dept.id} className="card relative">
            <div className="absolute left-0 top-0 h-full w-1 rounded-l-xl" style={{ backgroundColor: dept.color || COLORS[0] }} />
            {editingId === dept.id ? (
              <div className="space-y-2 pl-3">
                <input value={draft.name ?? ""} onChange={(e) => setDraft({ ...draft, name: e.target.value })} className="input-field text-sm font-semibold" />
                <input value={draft.description ?? ""} onChange={(e) => setDraft({ ...draft, description: e.target.value })} className="input-field text-xs" />
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="text-xs text-slate-500">Projects</label>
                    <input type="number" value={draft.defaultProjectsPerYear ?? 0} onChange={(e) => setDraft({ ...draft, defaultProjectsPerYear: Number(e.target.value) })} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">BoMs</label>
                    <input type="number" value={draft.defaultBomsPerProject ?? 0} onChange={(e) => setDraft({ ...draft, defaultBomsPerProject: Number(e.target.value) })} className="input-field" />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500">Modules</label>
                    <input type="number" value={draft.defaultModulesPerBom ?? 0} onChange={(e) => setDraft({ ...draft, defaultModulesPerBom: Number(e.target.value) })} className="input-field" />
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
                    <h3 className="font-semibold text-slate-900">{dept.name}</h3>
                    <p className="mt-0.5 text-xs text-slate-500">{dept.description}</p>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => startEdit(dept)} className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => removeDepartment(dept.id)} className="rounded p-1 text-slate-400 hover:bg-red-50 hover:text-red-500">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
                <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                  <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                    <p className="text-lg font-bold text-slate-900">{dept.defaultProjectsPerYear}</p>
                    <p className="text-[10px] text-slate-500">Projects/yr</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                    <p className="text-lg font-bold text-slate-900">{dept.defaultBomsPerProject}</p>
                    <p className="text-[10px] text-slate-500">BoMs/proj</p>
                  </div>
                  <div className="rounded-lg bg-slate-50 px-2 py-1.5">
                    <p className="text-lg font-bold text-slate-900">{dept.defaultModulesPerBom}</p>
                    <p className="text-[10px] text-slate-500">Modules</p>
                  </div>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
