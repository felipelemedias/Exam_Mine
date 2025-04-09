import React, { forwardRef, ChangeEvent } from "react";
import { useDropzone } from 'react-dropzone';

interface FileUploadProps {
  onFileUpload: (file: File) => void;
  isUploading: boolean;
  acceptedFileTypes: string;
}

export const FileUpload = forwardRef<HTMLInputElement, FileUploadProps>(
  ({ onFileUpload, isUploading, acceptedFileTypes }, ref) => {
    const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
      console.log("File input change detected");
      const files = e.target.files;
      
      if (files && files.length > 0) {
        const file = files[0];
        
        // Check file size (5MB limit)
        const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
        if (file.size > MAX_FILE_SIZE) {
          console.error("File too large:", file.size, "bytes (max:", MAX_FILE_SIZE, "bytes)");
          alert("O arquivo é muito grande. O tamanho máximo permitido é 5MB.");
          return;
        }
        
        console.log("File selected:", file.name, "Size:", (file.size / 1024 / 1024).toFixed(2), "MB");
        onFileUpload(file);
      }
    };

    return (
      <input
        ref={ref}
        type="file"
        accept={acceptedFileTypes}
        onChange={handleFileChange}
        disabled={isUploading}
        className="hidden"
      />
    );
  }
);

FileUpload.displayName = "FileUpload";