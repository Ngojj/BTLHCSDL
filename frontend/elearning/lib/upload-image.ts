import { upload } from "@vercel/blob/client";

/**
 * Uploads straight from the browser to Vercel Blob. The read-write token never reaches the browser:
 * /api/upload checks that the caller is a teacher and then hands out a short-lived token for this one file.
 */
export async function uploadFile(file: File): Promise<string> {
  let session: string | undefined;
  try {
    session = (JSON.parse(sessionStorage.getItem("userLogin") || "null") as { token?: string } | null)?.token;
  } catch {
    session = undefined;
  }
  if (!session) throw new Error("Bạn cần đăng nhập để tải tệp lên.");

  const blob = await upload(file.name, file, {
    access: "public",
    handleUploadUrl: "/api/upload",
    clientPayload: session, // the API token, so /api/upload can ask the backend who is uploading
  });
  return blob.url;
}
