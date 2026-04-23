import { UploadCloud, ImageIcon, Sparkles, Lock, Loader2, X, ZoomIn } from "lucide-react";
import React, { useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { PublicLayout } from "@/layouts/PublicLayout";
import { useAuth } from "@/contexts/AuthContext";


const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif"];
const ACCEPTED_EXTS = ".jpg,.jpeg,.png,.webp,.gif";
const MAX_SIZE_MB = 20;

export function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const { userId } = useAuth();


  const selectFile = useCallback((selected: File) => {
    setError("");

    if (!ACCEPTED_TYPES.includes(selected.type)) {
      setError("Invalid file type. Please upload a JPG, PNG, or WebP image.");
      return;
    }
    if (selected.size > MAX_SIZE_MB * 1024 * 1024) {
      setError(`File too large. Maximum size is ${MAX_SIZE_MB}MB.`);
      return;
    }

    setFile(selected);
    // Generate an in-browser preview URL
    const url = URL.createObjectURL(selected);
    setPreview(url);
  }, []);

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (preview) URL.revokeObjectURL(preview);
    setFile(null);
    setPreview(null);
    setError("");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const dropped = e.dataTransfer.files?.[0];
    if (dropped) selectFile(dropped);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) selectFile(selected);
  };

  const handleAnalyze = async () => {
    if (!file) return;
    setLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("user_id", userId);

      const response = await fetch("/api/upload-and-analyze", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json();
        throw new Error(errData.error || "Failed to analyze document.");
      }

      const data = await response.json();
      navigate("/dashboard", { state: { analysis: data.analysis, filename: file.name } });
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An error occurred during analysis.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PublicLayout>
      <div className="grow flex items-center justify-center py-12 px-6 w-full max-w-7xl mx-auto">
        <div className="w-full max-w-[860px] bg-surface-container-lowest border border-[#E2E8F0] rounded-2xl p-6 md:p-8 lg:p-12 relative overflow-hidden shadow-[0_4px_20px_rgba(0,8,30,0.04)]">
          {/* Decorative blobs */}
          <div className="absolute -top-24 -right-24 w-64 h-64 bg-secondary/10 rounded-full blur-[60px] pointer-events-none" />
          <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-primary/5 rounded-full blur-[60px] pointer-events-none" />

          {/* Header */}
          <div className="relative z-10 flex flex-col items-center text-center space-y-3 mb-10">
            <div className="w-16 h-16 rounded-full bg-surface-container-low flex items-center justify-center mb-2 border border-surface-variant">
              <ImageIcon className="w-8 h-8 text-secondary" />
            </div>
            <h1 className="text-4xl font-bold text-primary">Upload Document Image</h1>
            <p className="text-lg text-on-surface-variant max-w-lg">
              Take a photo or screenshot of your legal contract — our AI reads and analyzes it instantly.
            </p>
          </div>

          {/* Drop Zone */}
          <div
            className="relative group cursor-pointer"
            onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleFileDrop}
            onClick={() => !file && fileInputRef.current?.click()}
          >
            <input
              type="file"
              accept={ACCEPTED_EXTS}
              className="hidden"
              ref={fileInputRef}
              onChange={handleFileSelect}
            />

            {/* Preview state */}
            {file && preview ? (
              <div className="relative rounded-2xl overflow-hidden border-2 border-secondary bg-secondary/5 shadow-[0_10px_30px_rgba(86,68,208,0.1)]">
                {/* Image preview */}
                <div className="relative max-h-[460px] flex items-center justify-center bg-surface-container-low overflow-hidden">
                  <img
                    src={preview}
                    alt="Uploaded legal document"
                    className="max-h-[460px] w-auto object-contain"
                    style={{ display: "block" }}
                  />
                  {/* Overlay hint */}
                  <div className="absolute inset-0 bg-primary/0 hover:bg-primary/5 transition-colors flex items-center justify-center opacity-0 hover:opacity-100 pointer-events-none">
                    <ZoomIn className="w-8 h-8 text-white drop-shadow-lg" />
                  </div>
                </div>

                {/* File info bar */}
                <div className="flex items-center justify-between px-5 py-3 bg-white border-t border-outline-variant/20">
                  <div className="flex items-center gap-3 min-w-0">
                    <ImageIcon className="w-5 h-5 text-secondary shrink-0" />
                    <div className="min-w-0">
                      <p className="font-semibold text-primary text-sm truncate">{file.name}</p>
                      <p className="text-xs text-on-surface-variant">
                        {(file.size / 1024 / 1024).toFixed(2)} MB · {file.type.split("/")[1].toUpperCase()}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={clearFile}
                    className="ml-4 shrink-0 p-1.5 rounded-full text-on-surface-variant hover:text-error hover:bg-error/10 transition-colors"
                    aria-label="Remove image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ) : (
              /* Empty drop zone */
              <div
                className={`border-2 border-dashed rounded-2xl p-14 flex flex-col items-center justify-center transition-all duration-300
                  ${isDragging
                    ? "border-secondary bg-secondary/10 scale-[1.01] shadow-[0_10px_30px_rgba(86,68,208,0.12)]"
                    : "border-outline-variant bg-surface-container-low group-hover:border-secondary group-hover:bg-secondary/5 group-hover:shadow-[0_10px_30px_rgba(86,68,208,0.08)]"
                  }`}
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-colors duration-300
                  ${isDragging ? "bg-secondary/20" : "bg-surface-container group-hover:bg-secondary/10"}`}
                >
                  <UploadCloud className={`w-8 h-8 transition-colors duration-300 ${isDragging ? "text-secondary" : "text-outline group-hover:text-secondary"}`} />
                </div>

                <h3 className="text-2xl font-bold text-primary mb-2">
                  {isDragging ? "Drop your image here" : "Drag & drop your image"}
                </h3>
                <p className="text-base text-on-surface-variant mb-6">
                  or <span className="text-secondary font-semibold group-hover:underline">browse your files</span>
                </p>

                {/* Format badges */}
                <div className="flex items-center gap-2 flex-wrap justify-center">
                  {["JPG", "PNG", "WebP"].map((fmt) => (
                    <span
                      key={fmt}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-surface-variant text-on-surface-variant text-label-caps border border-outline-variant/50"
                    >
                      <ImageIcon className="w-3.5 h-3.5" />
                      {fmt}
                    </span>
                  ))}
                </div>
                <p className="text-label-caps text-outline mt-4">Maximum file size: {MAX_SIZE_MB}MB</p>
              </div>
            )}
          </div>

          {/* Error message */}
          {error && (
            <div className="mt-6 p-4 bg-error-container text-on-error-container rounded-xl text-sm font-medium text-center">
              {error}
            </div>
          )}

          {/* Analyze Button */}
          <div className="mt-8 flex flex-col items-center relative z-10">
            <button
              onClick={handleAnalyze}
              disabled={!file || loading}
              className={`text-lg font-semibold px-8 sm:px-14 py-4 rounded-full flex justify-center items-center gap-3 w-full sm:w-auto transition-all duration-300 transform
                ${!file || loading
                  ? "bg-surface-variant text-on-surface-variant cursor-not-allowed"
                  : "bg-linear-to-r from-primary to-secondary text-on-primary shadow-[0_4px_20px_rgba(86,68,208,0.25)] hover:shadow-[0_10px_30px_rgba(86,68,208,0.35)] hover:opacity-95 hover:-translate-y-0.5"
                }`}
            >
              {loading ? (
                <><Loader2 className="w-5 h-5 animate-spin" /> Analyzing Image...</>
              ) : (
                <><Sparkles className="w-5 h-5 fill-current" /> Analyze Document</>
              )}
            </button>
          </div>

          {/* Trust badge */}
          <div className="mt-8 flex items-center justify-center gap-1.5 text-on-surface-variant relative z-10">
            <Lock className="w-4 h-4 text-outline" />
            <span className="text-label-caps">End-to-End Encrypted &amp; Confidential</span>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}
