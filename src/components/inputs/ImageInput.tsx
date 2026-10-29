import { useCallback, useRef } from 'react';
import { UploadCloud, ImageIcon, X } from 'lucide-react';

interface ImageInputProps {
  preview: string | null;
  fileName: string;
  error: string;
  dragging: boolean;
  setDragging: (v: boolean) => void;
  onFile: (file: File) => void;
  onReset: () => void;
}

const ACCEPTED = ['image/jpeg', 'image/png', 'image/webp'];

export function ImageInput({
  preview,
  fileName,
  error,
  dragging,
  setDragging,
  onFile,
  onReset,
}: ImageInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragging(false);
      const file = e.dataTransfer.files?.[0];
      if (file) onFile(file);
    },
    [onFile, setDragging],
  );

  return (
    <div>
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        className={`relative grid place-items-center rounded-2xl border-2 border-dashed transition-all px-6 py-10 text-center ${
          dragging
            ? 'border-brand-500 bg-brand-50/60 scale-[1.01]'
            : 'border-navy-200 bg-navy-50/40'
        }`}
      >
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED.join(',')}
          className="sr-only"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFile(f);
          }}
        />

        {preview ? (
          <div className="w-full">
            <div className="relative mx-auto max-w-xs">
              <img
                src={preview}
                alt="Leaf preview"
                className="rounded-xl object-cover w-full h-56 shadow-card"
              />
              <button
                onClick={onReset}
                className="absolute -top-2 -right-2 grid h-8 w-8 place-items-center rounded-full bg-navy-950 text-white shadow-lg hover:bg-navy-800"
                aria-label="Remove image"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-navy-700">
              <ImageIcon className="h-4 w-4 text-brand-600" />
              {fileName}
            </p>
          </div>
        ) : (
          <button
            onClick={() => inputRef.current?.click()}
            className="flex flex-col items-center gap-3 text-navy-500"
          >
            <span className="grid h-16 w-16 place-items-center rounded-2xl bg-white border border-navy-100 shadow-sm text-brand-600">
              <UploadCloud className="h-7 w-7" />
            </span>
            <span className="text-base font-semibold text-navy-800">
              Drag & drop a leaf image
            </span>
            <span className="text-sm text-navy-500">
              or click to browse · JPG, PNG, WebP · max 8MB
            </span>
          </button>
        )}
      </div>
      {error && (
        <p className="mt-3 text-xs text-red-600 flex items-center gap-1.5">
          {error}
        </p>
      )}
    </div>
  );
}
