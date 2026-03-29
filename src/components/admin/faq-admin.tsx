"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { addFAQ, updateFAQ, deleteFAQ, toggleFAQ } from "@/lib/actions/faq";

interface FAQItem {
  id: number;
  question: string;
  answer: string;
  is_active: boolean;
}

export default function FAQAdmin({ faqs }: { faqs: FAQItem[] }) {
  const [editing, setEditing] = useState<FAQItem | null>(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const router = useRouter();

  async function handleSave() {
    if (editing) {
      await updateFAQ(editing.id, question, answer);
    } else {
      await addFAQ(question, answer);
    }
    resetForm();
    router.refresh();
  }

  function startEdit(faq: FAQItem) {
    setEditing(faq);
    setQuestion(faq.question);
    setAnswer(faq.answer);
  }

  function resetForm() {
    setEditing(null);
    setQuestion("");
    setAnswer("");
  }

  return (
    <>
      <div className="mt-6 bg-white border border-gray-200 p-4 sm:p-6 max-w-2xl space-y-4">
        <h3 className="text-sm font-medium text-gray-700">{editing ? "Edit FAQ" : "Add New FAQ"}</h3>
        <Input value={question} onChange={(e) => setQuestion(e.target.value)} placeholder="Question" className="rounded-none" />
        <Textarea value={answer} onChange={(e) => setAnswer(e.target.value)} placeholder="Answer" rows={3} className="rounded-none resize-none" />
        <div className="flex gap-2">
          <Button onClick={handleSave} disabled={!question || !answer} className="bg-charcoal text-white rounded-none text-xs">
            {editing ? "Update" : "Add"} FAQ
          </Button>
          {editing && <Button variant="outline" onClick={resetForm} className="rounded-none text-xs">Cancel</Button>}
        </div>
      </div>

      <div className="mt-6 space-y-3">
        {faqs.map((faq) => (
          <div key={faq.id} className="bg-white border border-gray-200 p-4">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">{faq.question}</p>
                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{faq.answer}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Switch checked={faq.is_active} onCheckedChange={(v) => { toggleFAQ(faq.id, v); router.refresh(); }} />
                <Button size="sm" variant="outline" onClick={() => startEdit(faq)} className="rounded-none text-xs">Edit</Button>
                <Button size="sm" variant="outline" onClick={() => { deleteFAQ(faq.id); router.refresh(); }} className="rounded-none text-xs text-red-500 border-red-200">Delete</Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
