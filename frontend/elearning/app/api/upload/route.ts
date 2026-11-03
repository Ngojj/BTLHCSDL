import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:4000";
const MAX_BYTES = 1024 * 1024 * 1024; // 1 GB: lecture videos are large

// Issues short-lived upload tokens. BLOB_READ_WRITE_TOKEN is read from the server environment only
// (Vercel sets it when a Blob store is connected to the project) and is never sent to the browser.
export async function POST(request: Request) {
  const body = (await request.json()) as HandleUploadBody;

  try {
    const result = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (_pathname, clientPayload) => {
        // only teachers may upload; the backend owns the JWT secret, so ask it who this is
        const response = await fetch(`${API_BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${clientPayload ?? ""}` },
          cache: "no-store",
        });
        const me = response.ok ? await response.json() : null;
        if (me?.role !== "teacher") throw new Error("Chỉ giảng viên mới được tải tệp lên.");

        return { maximumSizeInBytes: MAX_BYTES, addRandomSuffix: true };
      },
      // required by the SDK; nothing to do here, the browser already gets the URL back
      onUploadCompleted: async () => {},
    });
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 400 });
  }
}
