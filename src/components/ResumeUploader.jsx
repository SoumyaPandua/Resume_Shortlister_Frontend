'use client';

import { useDropzone } from 'react-dropzone';

export default function ResumeUploader({ setFiles }) {
  const onDrop = (acceptedFiles) => {
    setFiles(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
    },
    multiple: true,
    onDrop,
  });

  return (
    <div {...getRootProps()} className="border-2 border-dashed p-4 rounded cursor-pointer">
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the resumes here...</p>
      ) : (
        <p>Drag & drop resumes here (PDF/DOCX), or click to select multiple files</p>
      )}
    </div>
  );
}
