import sql from "@/lib/db";
import VideosAdmin from "@/components/admin/videos-admin";

export default async function AdminVideosPage() {
  const videos = await sql`SELECT * FROM videos ORDER BY sort_order`;
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900">Videos</h1>
      <p className="text-sm text-gray-500 mt-1">Manage video embeds from YouTube or Vimeo.</p>
      <VideosAdmin videos={videos as any} />
    </div>
  );
}
