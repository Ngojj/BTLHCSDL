'use server';

import { uploadFile } from "@/lib/upload-image";

export default async function CreateFile(formData: FormData) {
    const file = formData.get('file');

    if (!(file instanceof File)) {
        throw new Error('No file provided');
    }

    return await uploadFile(file);
}
