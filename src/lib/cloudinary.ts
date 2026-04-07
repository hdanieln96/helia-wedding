import { v2 as cloudinary } from "cloudinary";

const requiredCloudinaryEnv = [
  "CLOUDINARY_CLOUD_NAME",
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
] as const;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

function ensureCloudinaryConfig() {
  const missing = requiredCloudinaryEnv.filter((key) => !process.env[key]);
  if (missing.length > 0) {
    throw new Error("Cloudinary is not configured on the server.");
  }
}

export async function uploadImage(
  file: Buffer,
  folder: string = "helia-wedding"
): Promise<{ url: string; publicId: string; width: number; height: number }> {
  ensureCloudinaryConfig();

  return new Promise((resolve, reject) => {
    cloudinary.uploader
      .upload_stream(
        {
          folder,
          resource_type: "image",
          quality: "auto",
          fetch_format: "auto",
        },
        (error, result) => {
          if (error || !result) return reject(error);
          resolve({
            url: result.secure_url,
            publicId: result.public_id,
            width: result.width,
            height: result.height,
          });
        }
      )
      .end(file);
  });
}

export async function deleteImage(publicId: string) {
  ensureCloudinaryConfig();
  return cloudinary.uploader.destroy(publicId);
}
