"use client";

import { useState } from "react";
import { markAsRead, archiveSubmission } from "@/lib/actions/submissions";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";

interface Submission {
  id: number;
  full_name: string;
  email: string;
  phone: string | null;
  event_date: string | null;
  event_type: string | null;
  package_interest: string | null;
  venue: string | null;
  referral_source: string | null;
  message: string | null;
  is_read: boolean;
  created_at: string;
}

export default function SubmissionsClient({ submissions }: { submissions: Submission[] }) {
  const [selected, setSelected] = useState<Submission | null>(null);

  async function handleOpen(sub: Submission) {
    setSelected(sub);
    if (!sub.is_read) {
      await markAsRead(sub.id);
    }
  }

  return (
    <>
      <div className="mt-6 bg-white border border-gray-200 overflow-x-auto">
        {submissions.length === 0 ? (
          <p className="p-8 text-center text-gray-500">No submissions yet.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50">
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Name</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden sm:table-cell">Email</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Type</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase tracking-wider hidden md:table-cell">Date</th>
                <th className="text-left p-3 font-medium text-gray-500 text-xs uppercase tracking-wider">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {submissions.map((sub) => (
                <tr
                  key={sub.id}
                  onClick={() => handleOpen(sub)}
                  className="cursor-pointer hover:bg-gray-50 transition-colors"
                >
                  <td className="p-3">
                    <span className={sub.is_read ? "text-gray-600" : "text-gray-900 font-medium"}>
                      {sub.full_name}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500 hidden sm:table-cell">{sub.email}</td>
                  <td className="p-3 text-gray-500 hidden md:table-cell">{sub.event_type || "—"}</td>
                  <td className="p-3 text-gray-500 hidden md:table-cell">
                    {new Date(sub.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-3">
                    {sub.is_read ? (
                      <span className="text-xs text-gray-400">Read</span>
                    ) : (
                      <span className="text-xs text-gold font-medium">New</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Detail slide-out */}
      <Sheet open={!!selected} onOpenChange={() => setSelected(null)}>
        <SheetContent className="w-full sm:max-w-lg overflow-y-auto">
          <SheetHeader>
            <SheetTitle>{selected?.full_name}</SheetTitle>
          </SheetHeader>
          {selected && (
            <div className="mt-6 space-y-4">
              {[
                { label: "Email", value: selected.email },
                { label: "Phone", value: selected.phone },
                { label: "Event Date", value: selected.event_date ? new Date(selected.event_date).toLocaleDateString() : null },
                { label: "Event Type", value: selected.event_type },
                { label: "Package Interest", value: selected.package_interest },
                { label: "Venue", value: selected.venue },
                { label: "Referral", value: selected.referral_source },
              ]
                .filter((f) => f.value)
                .map((field) => (
                  <div key={field.label}>
                    <p className="text-xs text-gray-400 uppercase tracking-wider">{field.label}</p>
                    <p className="text-sm text-gray-900 mt-0.5">{field.value}</p>
                  </div>
                ))}

              {selected.message && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider">Message</p>
                  <p className="text-sm text-gray-900 mt-0.5 whitespace-pre-wrap leading-relaxed">
                    {selected.message}
                  </p>
                </div>
              )}

              <div className="pt-4 border-t border-gray-200">
                <p className="text-xs text-gray-400">
                  Submitted {new Date(selected.created_at).toLocaleString()}
                </p>
              </div>

              <div className="flex gap-2 pt-2">
                <a href={`mailto:${selected.email}`}>
                  <Button size="sm" className="bg-charcoal text-white rounded-none text-xs">
                    Reply via Email
                  </Button>
                </a>
                <Button
                  size="sm"
                  variant="outline"
                  className="rounded-none text-xs"
                  onClick={async () => {
                    await archiveSubmission(selected.id);
                    setSelected(null);
                  }}
                >
                  Archive
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </>
  );
}
