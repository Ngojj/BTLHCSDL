import { put } from "@vercel/blob"
export async function uploadFile(file: File): Promise<string> {
    const token = "vercel_blob_rw_8GXIMOY1JIq3HADb_BypdLjG2fSuBeFX1txgalryRRK7l4D"
    console.log(token);
    const formData = new FormData();
    formData.append('file', file);
  
    const response = await put(file.name, file, {
        contentType: file.type,
        access: 'public',
        token: token,
      });
  
      return await response.url;
  }
  