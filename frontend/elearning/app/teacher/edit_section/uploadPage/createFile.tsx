'use server';

import mediaUpload from "@/lib/upload-image";

export default async function CreateFile(formData: FormData) {
    return await mediaUpload(formData, 'file/create');
}
