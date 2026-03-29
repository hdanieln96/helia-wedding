"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  addContactField,
  updateContactField,
  deleteContactField,
  toggleContactField,
  toggleContactFieldRequired,
  updateContactPageContent,
} from "@/lib/actions/contact";

interface Field {
  id: number;
  label: string;
  field_type: string;
  placeholder: string;
  is_required: boolean;
  options: string | null;
  sort_order: number;
  is_active: boolean;
}

interface Props {
  fields: Field[];
  pageTitle: string;
  pageSubtitle: string;
}

const FIELD_TYPES = [
  { value: "text", label: "Text" },
  { value: "email", label: "Email" },
  { value: "tel", label: "Phone" },
  { value: "date", label: "Date Picker" },
  { value: "select", label: "Dropdown" },
  { value: "textarea", label: "Text Area" },
  { value: "package-select", label: "Package Dropdown (auto-populated)" },
];

export default function ContactAdmin({ fields, pageTitle, pageSubtitle }: Props) {
  const [title, setTitle] = useState(pageTitle);
  const [subtitle, setSubtitle] = useState(pageSubtitle);
  const [savingContent, setSavingContent] = useState(false);
  const [savedContent, setSavedContent] = useState(false);

  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [label, setLabel] = useState("");
  const [fieldType, setFieldType] = useState("text");
  const [placeholder, setPlaceholder] = useState("");
  const [isRequired, setIsRequired] = useState(false);
  const [options, setOptions] = useState("");
  const [optionsList, setOptionsList] = useState<string[]>([]);
  const [newOption, setNewOption] = useState("");

  const router = useRouter();

  async function handleSaveContent() {
    setSavingContent(true);
    await updateContactPageContent(title, subtitle);
    setSavingContent(false);
    setSavedContent(true);
    setTimeout(() => setSavedContent(false), 3000);
  }

  function startEdit(field: Field) {
    setEditingId(field.id);
    setLabel(field.label);
    setFieldType(field.field_type);
    setPlaceholder(field.placeholder || "");
    setIsRequired(field.is_required);
    const opts = field.options ? field.options.split(",").map((o) => o.trim()).filter(Boolean) : [];
    setOptionsList(opts);
    setOptions(field.options || "");
    setNewOption("");
    setShowAdd(false);
  }

  function resetForm() {
    setEditingId(null);
    setShowAdd(false);
    setLabel("");
    setFieldType("text");
    setPlaceholder("");
    setIsRequired(false);
    setOptions("");
    setOptionsList([]);
    setNewOption("");
  }

  async function handleSaveField() {
    const optionsStr = fieldType === "select" ? optionsList.join(",") : options;
    if (editingId) {
      await updateContactField(editingId, label, fieldType, placeholder, isRequired, optionsStr);
    } else {
      await addContactField(label, fieldType, placeholder, isRequired, optionsStr);
    }
    resetForm();
    router.refresh();
  }

  async function handleDeleteField(id: number) {
    if (!confirm("Delete this field?")) return;
    await deleteContactField(id);
    router.refresh();
  }

  return (
    <>
      {/* Page Content */}
      <div className="mt-6 bg-white border border-gray-200 p-4 sm:p-6 max-w-2xl space-y-4">
        <h3 className="text-sm font-medium text-gray-700">Page Content</h3>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">Page Title</label>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 rounded-none" />
        </div>
        <div>
          <label className="text-xs text-gray-500 uppercase tracking-wider">Subtitle</label>
          <Textarea value={subtitle} onChange={(e) => setSubtitle(e.target.value)} rows={2} className="mt-1 rounded-none resize-none" />
        </div>
        <div className="flex items-center gap-3">
          <Button onClick={handleSaveContent} disabled={savingContent} className="bg-charcoal text-white rounded-none text-xs">
            {savingContent ? "Saving..." : "Save Content"}
          </Button>
          {savedContent && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </div>

      {/* Form Builder */}
      <div className="mt-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-700">Form Fields</h3>
          {!showAdd && !editingId && (
            <Button onClick={() => setShowAdd(true)} className="bg-charcoal text-white rounded-none text-xs">
              + Add Field
            </Button>
          )}
        </div>

        {/* Add/Edit Form */}
        {(showAdd || editingId) && (
          <div className="bg-white border border-gray-200 p-4 sm:p-6 mb-6 max-w-xl space-y-4">
            <h4 className="text-sm font-medium text-gray-700">
              {editingId ? "Edit Field" : "New Field"}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Label</label>
                <Input value={label} onChange={(e) => setLabel(e.target.value)} placeholder="e.g. Full Name" className="mt-1 rounded-none" />
              </div>
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Type</label>
                <select
                  value={fieldType}
                  onChange={(e) => { setFieldType(e.target.value); if (e.target.value !== "select") setOptionsList([]); }}
                  className="mt-1 w-full h-10 px-3 border border-gray-200 text-sm bg-white"
                >
                  {FIELD_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>{t.label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs text-gray-500 uppercase tracking-wider">Placeholder</label>
              <Input value={placeholder} onChange={(e) => setPlaceholder(e.target.value)} placeholder="Placeholder text" className="mt-1 rounded-none" />
            </div>
            {fieldType === "select" && (
              <div>
                <label className="text-xs text-gray-500 uppercase tracking-wider">Dropdown Options</label>
                <div className="mt-2 space-y-2">
                  {optionsList.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <Input
                        value={opt}
                        onChange={(e) => {
                          const updated = [...optionsList];
                          updated[idx] = e.target.value;
                          setOptionsList(updated);
                        }}
                        className="rounded-none flex-1 h-8 text-sm"
                      />
                      <button
                        onClick={() => setOptionsList(optionsList.filter((_, i) => i !== idx))}
                        className="text-red-400 hover:text-red-600 text-sm px-2 transition-colors"
                        type="button"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2">
                    <Input
                      value={newOption}
                      onChange={(e) => setNewOption(e.target.value)}
                      placeholder="Type an option..."
                      className="rounded-none flex-1 h-8 text-sm"
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          if (newOption.trim()) {
                            setOptionsList([...optionsList, newOption.trim()]);
                            setNewOption("");
                          }
                        }
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => {
                        if (newOption.trim()) {
                          setOptionsList([...optionsList, newOption.trim()]);
                          setNewOption("");
                        }
                      }}
                      className="rounded-none text-xs h-8"
                    >
                      + Add
                    </Button>
                  </div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Switch checked={isRequired} onCheckedChange={setIsRequired} />
              <span className="text-xs text-gray-500">Required field</span>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveField} disabled={!label} className="bg-charcoal text-white rounded-none text-xs">
                {editingId ? "Update" : "Add"} Field
              </Button>
              <Button variant="outline" onClick={resetForm} className="rounded-none text-xs">Cancel</Button>
            </div>
          </div>
        )}

        {/* Fields List */}
        <div className="space-y-2">
          {fields.map((field) => (
            <div key={field.id} className="bg-white border border-gray-200 p-3 sm:p-4 flex items-center gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <p className="text-sm font-medium text-gray-900">{field.label}</p>
                  <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5">
                    {FIELD_TYPES.find((t) => t.value === field.field_type)?.label || field.field_type}
                  </span>
                </div>
                {field.placeholder && (
                  <p className="text-xs text-gray-400 mt-0.5">Placeholder: {field.placeholder}</p>
                )}
                {field.options && (
                  <p className="text-xs text-gray-400 mt-0.5">Options: {field.options}</p>
                )}
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col items-center gap-0.5">
                  <Switch
                    checked={field.is_required}
                    onCheckedChange={(v) => { toggleContactFieldRequired(field.id, v); router.refresh(); }}
                  />
                  <span className="text-[9px] text-gray-400">Required</span>
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <Switch
                    checked={field.is_active}
                    onCheckedChange={(v) => { toggleContactField(field.id, v); router.refresh(); }}
                  />
                  <span className="text-[9px] text-gray-400">Visible</span>
                </div>
                <Button size="sm" variant="outline" onClick={() => startEdit(field)} className="rounded-none text-xs">Edit</Button>
                <Button size="sm" variant="outline" onClick={() => handleDeleteField(field.id)} className="rounded-none text-xs text-red-500 border-red-200">Delete</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
