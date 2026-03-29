"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { updateSettings } from "@/lib/actions/settings";
import { updateSocialLink } from "@/lib/actions/social";

interface SocialLinkData {
  id: number;
  platform: string;
  url: string;
  is_active: boolean;
}

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({});
  const [socialLinks, setSocialLinks] = useState<SocialLinkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [savingSocial, setSavingSocial] = useState(false);
  const [savedSocial, setSavedSocial] = useState(false);
  const [uploadingImage, setUploadingImage] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch("/api/admin/settings").then((r) => r.json()),
      fetch("/api/admin/social").then((r) => r.json()),
    ]).then(([settingsData, socialData]) => {
      const map: Record<string, string> = {};
      for (const s of settingsData) map[s.key] = s.value;
      setSettings(map);
      setSocialLinks(socialData);
      setLoading(false);
    });
  }, []);

  async function handleSave() {
    setSaving(true);
    await updateSettings(settings);
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  }

  async function handleSaveSocial() {
    setSavingSocial(true);
    for (const link of socialLinks) {
      await updateSocialLink(link.id, link.url, link.is_active);
    }
    setSavingSocial(false);
    setSavedSocial(true);
    setTimeout(() => setSavedSocial(false), 3000);
  }

  const fields = [
    { key: "tagline", label: "Tagline" },
    { key: "email", label: "Email" },
    { key: "phone", label: "Phone" },
    { key: "address", label: "Address" },
    { key: "office_hours", label: "Office Hours" },
    { key: "showreel_url", label: "Showreel Video URL" },
  ];

  const showShowreel = settings["show_showreel"] === "true";
  const showStarRating = settings["show_star_rating"] !== "false";

  if (loading) return <p className="text-gray-500">Loading settings...</p>;

  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Site Settings</h1>
      <p className="text-sm text-gray-500 mt-1">Manage your contact info, social links, and site details.</p>

      {/* General Settings */}
      <div className="mt-6 bg-white border border-gray-200 p-4 sm:p-6 space-y-5 max-w-2xl">
        <h3 className="text-sm font-medium text-gray-700">General</h3>
        {fields.map((field) => (
          <div key={field.key}>
            <Label className="text-xs tracking-wider uppercase text-gray-500">
              {field.label}
            </Label>
            <Input
              value={settings[field.key] || ""}
              onChange={(e) => setSettings({ ...settings, [field.key]: e.target.value })}
              className="mt-1 rounded-none"
            />
          </div>
        ))}

        <div className="bg-gray-50 p-4 -mx-1 rounded text-xs text-gray-500 leading-relaxed">
          <p className="font-medium text-gray-700 text-sm mb-2">How to add your showreel video:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Upload your video to <strong>Google Drive</strong> (free, 15GB storage)</li>
            <li>Right click the file → Share → set to <strong>&quot;Anyone with the link&quot;</strong></li>
            <li>Copy the link and paste it in the &quot;Showreel Video URL&quot; field above</li>
            <li>Toggle on &quot;Show Showreel Section&quot; below</li>
          </ol>
          <p className="mt-2 text-gray-400">You can also use YouTube, Vimeo, or Dropbox links.</p>
        </div>

        <div className="flex items-center gap-3 pt-2 border-t border-gray-100 mt-2">
          <Switch
            checked={showShowreel}
            onCheckedChange={(v) => setSettings({ ...settings, show_showreel: v ? "true" : "false" })}
          />
          <div>
            <span className="text-sm text-gray-700">Show Showreel Section</span>
            <p className="text-xs text-gray-400">Display the video showreel on the home page</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Switch
            checked={showStarRating}
            onCheckedChange={(v) => setSettings({ ...settings, show_star_rating: v ? "true" : "false" })}
          />
          <div>
            <span className="text-sm text-gray-700">Show Star Ratings</span>
            <p className="text-xs text-gray-400">Display star ratings on reviews (turn off for text-only reviews)</p>
          </div>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <Button
            onClick={handleSave}
            disabled={saving}
            className="bg-charcoal hover:bg-charcoal/90 text-white rounded-none px-8"
          >
            {saving ? "Saving..." : "Save Settings"}
          </Button>
          {saved && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </div>

      {/* Social Media */}
      <div className="mt-8 bg-white border border-gray-200 p-4 sm:p-6 max-w-2xl">
        <h3 className="text-sm font-medium text-gray-700 mb-4">Social Media</h3>
        <p className="text-xs text-gray-400 mb-5">Toggle on the platforms you use and add your profile URLs.</p>

        <div className="space-y-4">
          {socialLinks.map((link, i) => (
            <div key={link.id} className="flex items-center gap-4">
              <div className="flex flex-col items-center gap-0.5 shrink-0 w-12">
                <Switch
                  checked={link.is_active}
                  onCheckedChange={(v) => {
                    const updated = [...socialLinks];
                    updated[i] = { ...link, is_active: v };
                    setSocialLinks(updated);
                  }}
                />
              </div>
              <div className="flex-1">
                <Label className="text-xs tracking-wider uppercase text-gray-500">
                  {link.platform}
                </Label>
                <Input
                  value={link.url}
                  onChange={(e) => {
                    const updated = [...socialLinks];
                    updated[i] = { ...link, url: e.target.value };
                    setSocialLinks(updated);
                  }}
                  placeholder={`https://${link.platform.toLowerCase().replace(/[^a-z]/g, "")}.com/...`}
                  className={`mt-1 rounded-none ${!link.is_active ? "opacity-40" : ""}`}
                  disabled={!link.is_active}
                />
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 pt-5">
          <Button
            onClick={handleSaveSocial}
            disabled={savingSocial}
            className="bg-charcoal hover:bg-charcoal/90 text-white rounded-none px-8"
          >
            {savingSocial ? "Saving..." : "Save Social Links"}
          </Button>
          {savedSocial && <span className="text-sm text-green-600">Saved!</span>}
        </div>
      </div>

      {/* Site Images */}
      <div className="mt-8 bg-white border border-gray-200 p-4 sm:p-6 max-w-2xl">
        <h3 className="text-sm font-medium text-gray-700 mb-2">Site Images</h3>
        <p className="text-xs text-gray-400 mb-6">Upload images used across the site. These replace the default placeholders.</p>

        <div className="space-y-6">
          {siteImages.map((img) => (
            <div key={img.key} className="flex items-start gap-4">
              <div className="relative w-24 h-16 sm:w-32 sm:h-20 bg-gray-100 shrink-0 overflow-hidden">
                {settings[img.key] ? (
                  <Image src={settings[img.key]} alt={img.label} fill className="object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-300 text-xs">
                    No image
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700">{img.label}</p>
                <p className="text-xs text-gray-400 mt-0.5">{img.description}</p>
                <label className="cursor-pointer inline-block mt-2">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      setUploadingImage(img.key);
                      const formData = new FormData();
                      formData.append("file", file);
                      formData.append("folder", "helia-wedding/site");
                      const res = await fetch("/api/admin/upload", { method: "POST", body: formData });
                      const { url } = await res.json();
                      const updated = { ...settings, [img.key]: url };
                      setSettings(updated);
                      await updateSettings({ [img.key]: url });
                      setUploadingImage(null);
                    }}
                  />
                  <span className={`text-xs px-3 py-1.5 border border-gray-200 hover:border-gold/50 transition-colors ${uploadingImage === img.key ? "opacity-50" : "cursor-pointer"}`}>
                    {uploadingImage === img.key ? "Uploading..." : settings[img.key] ? "Replace" : "Upload"}
                  </span>
                </label>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const siteImages = [
  { key: "image_story", label: "Home — Story Section", description: "The parallax photo next to 'Our Story' text" },
  { key: "image_testimonial_bg", label: "Home — Testimonial Background", description: "Dark cinematic photo behind the client quote" },
  { key: "image_showreel_thumb", label: "Home — Showreel Thumbnail", description: "Preview image before video plays" },
  { key: "image_contact", label: "Contact Page — Photo", description: "Image next to the contact form" },
  { key: "image_header_portfolio", label: "Portfolio Page — Header", description: "Full-width background at the top" },
  { key: "image_header_services", label: "Services Page — Header", description: "Full-width background at the top" },
  { key: "image_header_about", label: "About Page — Header", description: "Full-width background at the top" },
];
