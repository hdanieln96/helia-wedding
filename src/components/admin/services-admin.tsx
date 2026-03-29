"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  addPackage, updatePackage, deletePackage, togglePackageActive,
  addFeature, deleteFeature,
  addAddon, updateAddon, deleteAddon,
  addBookingStep, updateBookingStep, deleteBookingStep,
} from "@/lib/actions/services";

interface Package {
  id: number; name: string; subtitle: string; price: string;
  is_popular: boolean; is_active: boolean; sort_order: number;
}
interface Feature { id: number; package_id: number; feature: string; sort_order: number; }
interface Addon { id: number; name: string; description: string; price: string; }
interface Step { id: number; step_number: number; title: string; description: string; }

interface Props {
  packages: Package[];
  features: Feature[];
  addons: Addon[];
  steps: Step[];
}

export default function ServicesAdmin({ packages, features, addons, steps }: Props) {
  const [activeTab, setActiveTab] = useState<"packages" | "addons" | "steps">("packages");
  const router = useRouter();

  const tabs = [
    { key: "packages" as const, label: "Packages" },
    { key: "addons" as const, label: "Add-Ons" },
    { key: "steps" as const, label: "Booking Steps" },
  ];

  return (
    <>
      {/* Tab bar */}
      <div className="mt-6 flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2.5 text-sm transition-colors ${
              activeTab === tab.key
                ? "text-gold border-b-2 border-gold -mb-px"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "packages" && (
        <PackagesTab packages={packages} features={features} router={router} />
      )}
      {activeTab === "addons" && (
        <AddonsTab addons={addons} router={router} />
      )}
      {activeTab === "steps" && (
        <StepsTab steps={steps} router={router} />
      )}
    </>
  );
}

// ═══════════════════════════════════════════
// PACKAGES TAB
// ═══════════════════════════════════════════

function PackagesTab({ packages, features, router }: { packages: Package[]; features: Feature[]; router: ReturnType<typeof useRouter> }) {
  const [showAdd, setShowAdd] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [name, setName] = useState("");
  const [subtitle, setSubtitle] = useState("");
  const [price, setPrice] = useState("");
  const [isPopular, setIsPopular] = useState(false);
  const [newFeature, setNewFeature] = useState("");

  function startEdit(pkg: Package) {
    setEditingId(pkg.id);
    setName(pkg.name);
    setSubtitle(pkg.subtitle || "");
    setPrice(pkg.price || "");
    setIsPopular(pkg.is_popular);
    setShowAdd(false);
  }

  function resetForm() {
    setEditingId(null);
    setShowAdd(false);
    setName("");
    setSubtitle("");
    setPrice("");
    setIsPopular(false);
  }

  async function handleSave() {
    if (editingId) {
      await updatePackage(editingId, name, subtitle, price, isPopular);
    } else {
      await addPackage(name, subtitle, price);
    }
    resetForm();
    router.refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this package and all its features?")) return;
    await deletePackage(id);
    router.refresh();
  }

  async function handleAddFeature(packageId: number) {
    if (!newFeature.trim()) return;
    await addFeature(packageId, newFeature);
    setNewFeature("");
    router.refresh();
  }

  async function handleDeleteFeature(id: number) {
    await deleteFeature(id);
    router.refresh();
  }

  return (
    <div className="mt-6">
      {/* Add/Edit Form */}
      {(showAdd || editingId) && (
        <div className="bg-white border border-gray-200 p-4 sm:p-6 mb-6 max-w-xl space-y-3">
          <h3 className="text-sm font-medium text-gray-700">
            {editingId ? "Edit Package" : "New Package"}
          </h3>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Package name (e.g. Premium)" className="rounded-none" />
          <Input value={subtitle} onChange={(e) => setSubtitle(e.target.value)} placeholder="Subtitle (e.g. Our most popular package)" className="rounded-none" />
          <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (e.g. $2,500 or Contact Us)" className="rounded-none" />
          <div className="flex items-center gap-2">
            <Switch checked={isPopular} onCheckedChange={setIsPopular} />
            <span className="text-xs text-gray-500">Mark as &quot;Most Popular&quot;</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!name} className="bg-charcoal text-white rounded-none text-xs">
              {editingId ? "Update" : "Add"} Package
            </Button>
            <Button variant="outline" onClick={resetForm} className="rounded-none text-xs">Cancel</Button>
          </div>
        </div>
      )}

      {!showAdd && !editingId && (
        <Button onClick={() => setShowAdd(true)} className="bg-charcoal text-white rounded-none text-xs mb-6">
          + Add Package
        </Button>
      )}

      {/* Package list */}
      <div className="space-y-4">
        {packages.map((pkg) => {
          const pkgFeatures = features.filter((f) => f.package_id === pkg.id);
          return (
            <div key={pkg.id} className="bg-white border border-gray-200 p-4 sm:p-5">
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h4 className="text-sm font-medium text-gray-900">{pkg.name}</h4>
                    {pkg.is_popular && <span className="text-[10px] bg-gold/10 text-gold px-2 py-0.5">Most Popular</span>}
                    <span className="text-sm text-gold">{pkg.price}</span>
                  </div>
                  {pkg.subtitle && <p className="text-xs text-gray-500 mt-0.5">{pkg.subtitle}</p>}
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Switch
                    checked={pkg.is_active}
                    onCheckedChange={(v) => { togglePackageActive(pkg.id, v); router.refresh(); }}
                  />
                  <Button size="sm" variant="outline" onClick={() => startEdit(pkg)} className="rounded-none text-xs">Edit</Button>
                  <Button size="sm" variant="outline" onClick={() => handleDelete(pkg.id)} className="rounded-none text-xs text-red-500 border-red-200">Delete</Button>
                </div>
              </div>

              {/* Features */}
              <div className="mt-4 border-t border-gray-100 pt-3">
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Features</p>
                <ul className="space-y-1.5">
                  {pkgFeatures.map((f) => (
                    <li key={f.id} className="flex items-center justify-between group text-sm text-gray-600">
                      <span>• {f.feature}</span>
                      <button
                        onClick={() => handleDeleteFeature(f.id)}
                        className="text-red-400 opacity-0 group-hover:opacity-100 transition-opacity text-xs px-1"
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-3">
                  <Input
                    value={editingId === pkg.id ? "" : newFeature}
                    onChange={(e) => setNewFeature(e.target.value)}
                    placeholder="Add a feature..."
                    className="rounded-none text-xs h-8 flex-1 max-w-sm"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        handleAddFeature(pkg.id);
                      }
                    }}
                  />
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleAddFeature(pkg.id)}
                    className="rounded-none text-xs h-8"
                  >
                    Add
                  </Button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// ADD-ONS TAB
// ═══════════════════════════════════════════

function AddonsTab({ addons, router }: { addons: Addon[]; router: ReturnType<typeof useRouter> }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");

  function startEdit(addon: Addon) {
    setEditingId(addon.id);
    setName(addon.name);
    setDescription(addon.description || "");
    setPrice(addon.price || "");
    setShowAdd(false);
  }

  function resetForm() {
    setEditingId(null);
    setShowAdd(false);
    setName("");
    setDescription("");
    setPrice("");
  }

  async function handleSave() {
    if (editingId) {
      await updateAddon(editingId, name, description, price);
    } else {
      await addAddon(name, description, price);
    }
    resetForm();
    router.refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this add-on?")) return;
    await deleteAddon(id);
    router.refresh();
  }

  return (
    <div className="mt-6">
      {(showAdd || editingId) && (
        <div className="bg-white border border-gray-200 p-4 sm:p-6 mb-6 max-w-xl space-y-3">
          <h3 className="text-sm font-medium text-gray-700">{editingId ? "Edit Add-On" : "New Add-On"}</h3>
          <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Add-on name" className="rounded-none" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Description" rows={2} className="rounded-none resize-none" />
          <Input value={price} onChange={(e) => setPrice(e.target.value)} placeholder="Price (e.g. $500 or Contact Us)" className="rounded-none" />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!name} className="bg-charcoal text-white rounded-none text-xs">
              {editingId ? "Update" : "Add"} Add-On
            </Button>
            <Button variant="outline" onClick={resetForm} className="rounded-none text-xs">Cancel</Button>
          </div>
        </div>
      )}

      {!showAdd && !editingId && (
        <Button onClick={() => setShowAdd(true)} className="bg-charcoal text-white rounded-none text-xs mb-6">
          + Add Add-On
        </Button>
      )}

      <div className="space-y-3">
        {addons.map((addon) => (
          <div key={addon.id} className="bg-white border border-gray-200 p-4 flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="text-sm font-medium text-gray-900">{addon.name}</p>
                {addon.price && <span className="text-xs text-gold">{addon.price}</span>}
              </div>
              {addon.description && <p className="text-xs text-gray-500 mt-0.5">{addon.description}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => startEdit(addon)} className="rounded-none text-xs">Edit</Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(addon.id)} className="rounded-none text-xs text-red-500 border-red-200">Delete</Button>
            </div>
          </div>
        ))}
        {addons.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">No add-ons yet.</p>}
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════
// BOOKING STEPS TAB
// ═══════════════════════════════════════════

function StepsTab({ steps, router }: { steps: Step[]; router: ReturnType<typeof useRouter> }) {
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showAdd, setShowAdd] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  function startEdit(step: Step) {
    setEditingId(step.id);
    setTitle(step.title);
    setDescription(step.description || "");
    setShowAdd(false);
  }

  function resetForm() {
    setEditingId(null);
    setShowAdd(false);
    setTitle("");
    setDescription("");
  }

  async function handleSave() {
    if (editingId) {
      await updateBookingStep(editingId, title, description);
    } else {
      await addBookingStep(title, description);
    }
    resetForm();
    router.refresh();
  }

  async function handleDelete(id: number) {
    if (!confirm("Delete this step?")) return;
    await deleteBookingStep(id);
    router.refresh();
  }

  return (
    <div className="mt-6">
      {(showAdd || editingId) && (
        <div className="bg-white border border-gray-200 p-4 sm:p-6 mb-6 max-w-xl space-y-3">
          <h3 className="text-sm font-medium text-gray-700">{editingId ? "Edit Step" : "New Step"}</h3>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Step title (e.g. Initial Inquiry)" className="rounded-none" />
          <Textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Step description" rows={2} className="rounded-none resize-none" />
          <div className="flex gap-2">
            <Button onClick={handleSave} disabled={!title} className="bg-charcoal text-white rounded-none text-xs">
              {editingId ? "Update" : "Add"} Step
            </Button>
            <Button variant="outline" onClick={resetForm} className="rounded-none text-xs">Cancel</Button>
          </div>
        </div>
      )}

      {!showAdd && !editingId && (
        <Button onClick={() => setShowAdd(true)} className="bg-charcoal text-white rounded-none text-xs mb-6">
          + Add Step
        </Button>
      )}

      <div className="space-y-3">
        {steps.map((step) => (
          <div key={step.id} className="bg-white border border-gray-200 p-4 flex items-start gap-4">
            <span className="w-8 h-8 bg-gold/10 text-gold text-sm flex items-center justify-center shrink-0">
              {step.step_number}
            </span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900">{step.title}</p>
              {step.description && <p className="text-xs text-gray-500 mt-0.5">{step.description}</p>}
            </div>
            <div className="flex gap-2 shrink-0">
              <Button size="sm" variant="outline" onClick={() => startEdit(step)} className="rounded-none text-xs">Edit</Button>
              <Button size="sm" variant="outline" onClick={() => handleDelete(step.id)} className="rounded-none text-xs text-red-500 border-red-200">Delete</Button>
            </div>
          </div>
        ))}
        {steps.length === 0 && <p className="text-sm text-gray-400 py-8 text-center">No booking steps yet.</p>}
      </div>
    </div>
  );
}
