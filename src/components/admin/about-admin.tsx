"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface AboutAdminProps {
  sections: Array<{ id: number; title: string; body: string; image_position: string }>;
  team: Array<{ id: number; name: string; role: string; bio: string }>;
  stats: Array<{ id: number; label: string; value: number; suffix: string }>;
}

export default function AboutAdmin({ sections, team, stats }: AboutAdminProps) {
  const [savingStats, setSavingStats] = useState(false);
  const [statValues, setStatValues] = useState(stats);
  const router = useRouter();

  async function handleSaveStats() {
    setSavingStats(true);
    for (const stat of statValues) {
      await fetch("/api/admin/stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(stat),
      });
    }
    setSavingStats(false);
    router.refresh();
  }

  return (
    <>
      {/* Stats */}
      <div className="mt-6 bg-white border border-gray-200 p-4 sm:p-6 max-w-2xl">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Stats (Counter Numbers)</h3>
        <div className="space-y-3">
          {statValues.map((stat, i) => (
            <div key={stat.id} className="flex gap-3 items-center">
              <Input
                value={stat.label}
                onChange={(e) => {
                  const updated = [...statValues];
                  updated[i] = { ...stat, label: e.target.value };
                  setStatValues(updated);
                }}
                placeholder="Label"
                className="rounded-none flex-1"
              />
              <Input
                type="number"
                value={stat.value}
                onChange={(e) => {
                  const updated = [...statValues];
                  updated[i] = { ...stat, value: Number(e.target.value) };
                  setStatValues(updated);
                }}
                className="rounded-none w-24"
              />
              <Input
                value={stat.suffix}
                onChange={(e) => {
                  const updated = [...statValues];
                  updated[i] = { ...stat, suffix: e.target.value };
                  setStatValues(updated);
                }}
                placeholder="Suffix"
                className="rounded-none w-20"
              />
            </div>
          ))}
        </div>
        <Button onClick={handleSaveStats} disabled={savingStats} className="mt-4 bg-charcoal text-white rounded-none text-xs">
          {savingStats ? "Saving..." : "Save Stats"}
        </Button>
      </div>

      {/* Story Sections */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Story Sections</h3>
        <div className="space-y-3">
          {sections.map((section) => (
            <div key={section.id} className="bg-white border border-gray-200 p-4">
              <p className="text-sm font-medium text-gray-900">{section.title || "Untitled"}</p>
              <p className="text-sm text-gray-500 mt-1 line-clamp-2">{section.body}</p>
              <p className="text-xs text-gray-400 mt-1">Image: {section.image_position}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Team */}
      <div className="mt-6">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Team Members</h3>
        {team.length === 0 ? (
          <p className="text-sm text-gray-400">No team members added yet.</p>
        ) : (
          <div className="space-y-3">
            {team.map((member) => (
              <div key={member.id} className="bg-white border border-gray-200 p-4">
                <p className="text-sm font-medium text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">{member.role}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
