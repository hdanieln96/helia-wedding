export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export async function uploadAdminImage(file: File, folder: string): Promise<UploadResult> {
  // Step 1: Get a signed upload signature from our server (tiny request, no file)
  const sigRes = await fetch("/api/admin/upload-signature", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ folder }),
  });

  if (!sigRes.ok) {
    const err = await sigRes.json().catch(() => null);
    throw new Error(err?.error ?? "Failed to get upload signature");
  }

  const { signature, timestamp, cloudName, apiKey } = await sigRes.json();

  // Step 2: Upload directly to Cloudinary from the browser (bypasses Vercel size limits)
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);
  formData.append("timestamp", String(timestamp));
  formData.append("api_key", apiKey);
  formData.append("signature", signature);

  const uploadRes = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    { method: "POST", body: formData }
  );

  if (!uploadRes.ok) {
    const err = await uploadRes.json().catch(() => null);
    throw new Error(err?.error?.message ?? "Upload to Cloudinary failed");
  }

  const data = await uploadRes.json();
  return {
    url: data.secure_url,
    publicId: data.public_id,
    width: data.width,
    height: data.height,
  };
}
