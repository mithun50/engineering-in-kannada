import React, { useEffect, useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { X, Loader2 } from "lucide-react";

interface NotesViewerProps {
  url: string;
  onClose: () => void;
}

export function NotesViewer({ url, onClose }: NotesViewerProps) {
  const [content, setContent] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const rawUrl = url
          .replace("github.com", "raw.githubusercontent.com")
          .replace("/blob/", "/");

        const response = await fetch(rawUrl);
        if (!response.ok) {
          throw new Error("Failed to fetch content");
        }
        const text = await response.text();
        setContent(text);
      } catch (err) {
        setError("Failed to load notes. Please try again later.");
        console.error("Error fetching notes:", err);
      } finally {
        setLoading(false);
      }
    };

    if (url) {
      fetchContent();
    }
  }, [url]);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="flex flex-col items-center gap-4 rounded-lg bg-dark p-8 text-white">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-lg font-medium">Loading notes...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
        <div className="text-center p-8 bg-red-500/10 rounded-xl border border-red-500/20">
          <p className="text-red-400">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 rounded-lg bg-primary px-4 py-2 text-dark"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="relative h-[80vh] w-[90vw] max-w-4xl overflow-auto rounded-lg bg-dark p-6 text-white">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="prose prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}
