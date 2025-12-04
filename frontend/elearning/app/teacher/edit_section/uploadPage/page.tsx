'use client';

import { useState, useRef } from 'react';
import CreateFile from './createFile';

export default function AvatarUploadPage() {
  const inputFileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [uploadUrl, setUploadUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.type.startsWith('image/') || selectedFile.type.startsWith('video/')) {
        setFile(selectedFile);
        setErrorMessage(null);
      } else {
        setErrorMessage('Please select an image or video file.');
        setFile(null);
      }
    }
  };

  const handleUpload = async () => {
    if (!file) {
      setErrorMessage('No file selected. Please choose a file first.');
      return;
    }

    try {
      // Convert the file to a Blob or Base64 string
      const formData = new FormData();
      formData.append('file', file);

      const result = await CreateFile(formData);
      setUploadUrl(result);
      setErrorMessage(null);
    } catch (error) {
      console.error('Upload failed:', error);
      setErrorMessage('Failed to upload the file. Please try again.');
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">Upload Image or Video</h1>

      <input
        type="file"
        ref={inputFileRef}
        accept="image/*,video/*"
        onChange={handleFileChange}
        className="block w-full mb-4 border rounded p-2"
      />

      {file && <p className="mb-2">Selected File: {file.name}</p>}

      {errorMessage && <p className="text-red-500 mb-2">{errorMessage}</p>}

      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>

      {uploadUrl && (
        <p className="mt-4">
          File uploaded successfully! View it here: <a href={uploadUrl} className="text-blue-500 underline">{uploadUrl}</a>
        </p>
      )}
    </div>
  );
}
