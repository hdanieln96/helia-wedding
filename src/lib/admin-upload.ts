export interface UploadResult {
  url: string;
  publicId: string;
  width?: number;
  height?: number;
}

export async function uploadAdminImage(file: File, folder: string): Promise<UploadResult> {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("folder", folder);

  const response = await fetch("/api/admin/upload", {
    method: "POST",
    body: formData,
  });

  const data = (await response.json().catch(() => null)) as
    | UploadResult
    | { error?: string }
    | null;

  if (!response.ok) {
    throw new Error(data && "error" in data && data.error ? data.error : "Upload failed");
  }

  return data as UploadResult;
}
