"use client";

import { useState, useRef } from "react";
import { Upload, FileText, X, Loader2, CheckCircle } from "lucide-react";

interface FileUploadProps {
    onUploadComplete: (url: string) => void;
    accept?: string;
    currentUrl?: string;
    label?: string;
}

export function FileUpload({ onUploadComplete, accept = "application/pdf", currentUrl, label = "Upload File" }: FileUploadProps) {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [error, setError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = () => {
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            handleUpload(files[0]);
        }
    };

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            handleUpload(e.target.files[0]);
        }
    };

    const handleUpload = async (file: File) => {
        setError(null);
        setIsUploading(true);
        setUploadProgress(0);

        try {
            // 1. Get Presigned URL
            const res = await fetch("/api/upload/presigned", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    filename: file.name,
                    contentType: file.type
                })
            });

            if (!res.ok) throw new Error("Failed to get upload URL");

            const { uploadUrl, publicUrl } = await res.json();

            // 2. Upload to R2 via generic PUT
            const xhr = new XMLHttpRequest();
            xhr.open("PUT", uploadUrl, true);
            xhr.setRequestHeader("Content-Type", file.type);

            xhr.upload.onprogress = (e) => {
                if (e.lengthComputable) {
                    const percentComplete = (e.loaded / e.total) * 100;
                    setUploadProgress(percentComplete);
                }
            };

            xhr.onload = () => {
                if (xhr.status === 200) {
                    // Success
                    setIsUploading(false);
                    onUploadComplete(publicUrl);
                } else {
                    setError("Upload failed");
                    setIsUploading(false);
                }
            };

            xhr.onerror = () => {
                setError("Network error during upload");
                setIsUploading(false);
            };

            xhr.send(file);

        } catch (err) {
            console.error(err);
            setError("Failed to initiate upload");
            setIsUploading(false);
        }
    };

    return (
        <div className="space-y-2">
            {label && <label className="block text-xs font-bold text-gray-500 uppercase">{label}</label>}

            {!currentUrl && !isUploading ? (
                <div
                    onDragOver={handleDragOver}
                    onDragLeave={handleDragLeave}
                    onDrop={handleDrop}
                    onClick={() => fileInputRef.current?.click()}
                    className={`
                        border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
                        ${isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-indigo-400 hover:bg-gray-50'}
                    `}
                >
                    <input
                        ref={fileInputRef}
                        type="file"
                        className="hidden"
                        accept={accept}
                        onChange={handleFileSelect}
                    />
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600 font-medium">Click to upload or drag & drop</p>
                    <p className="text-xs text-gray-400 mt-1">PDF, max 10MB</p>
                    {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
                </div>
            ) : isUploading ? (
                <div className="border border-gray-200 rounded-lg p-4 bg-white">
                    <div className="flex items-center gap-3 mb-2">
                        <Loader2 className="h-5 w-5 text-indigo-600 animate-spin" />
                        <span className="text-sm font-medium text-gray-700">Uploading...</span>
                        <span className="text-xs text-gray-500 ml-auto">{Math.round(uploadProgress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div
                            className="h-full bg-indigo-600 transition-all duration-300"
                            style={{ width: `${uploadProgress}%` }}
                        />
                    </div>
                </div>
            ) : (
                // File Preview / Current State
                <div className="flex items-center gap-3 p-3 border border-indigo-100 bg-indigo-50 rounded-lg group">
                    <div className="p-2 bg-white rounded-md shrink-0">
                        <FileText className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-indigo-900 truncate">
                            {currentUrl?.split('/').pop() || "Uploaded File"}
                        </p>
                        <a href={currentUrl} target="_blank" rel="noopener noreferrer" className="text-xs text-indigo-600 hover:underline">
                            View File
                        </a>
                    </div>
                    <button
                        onClick={() => onUploadComplete("")} // Clear URL
                        className="p-1 hover:bg-white rounded-full text-indigo-400 hover:text-red-500 transition-colors"
                        title="Remove file"
                    >
                        <X className="h-4 w-4" />
                    </button>
                </div>
            )}
        </div>
    );
}
