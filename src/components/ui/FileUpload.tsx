import React, { useEffect, useRef, useState } from 'react';
import { FileText, Image as ImageIcon, Paperclip, X } from 'lucide-react';

export interface FileUploadProps {
  value?: File[];
  onChange?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxFiles?: number;
  maxSizeMb?: number;
  disabled?: boolean;
  label?: string;
}

/**
 * Frontend-only file picker. It owns no upload transport and never sends files
 * over the network. Use onChange to connect the selected files to S3,
 * Supabase Storage, Cloudinary, or your own API.
 */
export const FileUpload: React.FC<FileUploadProps> = ({
  value,
  onChange,
  accept,
  multiple = true,
  maxFiles = 5,
  maxSizeMb = 10,
  disabled = false,
  label = 'Attach files',
}) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [files, setFiles] = useState<File[]>(value ?? []);
  const [validationMessage, setValidationMessage] = useState('');

  useEffect(() => {
    if (value) setFiles(value);
  }, [value]);

  const update = (next: File[]) => {
    setFiles(next);
    onChange?.(next);
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const incoming = Array.from(event.target.files ?? []);
    const sizeLimit = maxSizeMb * 1024 * 1024;
    const tooLarge = incoming.filter((file) => file.size > sizeLimit);
    const sizeValid = incoming.filter((file) => file.size <= sizeLimit);
    const candidates = multiple ? [...files, ...sizeValid] : sizeValid.slice(0, 1);
    const next = candidates.slice(0, maxFiles);
    const messages: string[] = [];
    if (tooLarge.length) messages.push(`${tooLarge.length} file(s) exceeded the ${maxSizeMb} MB limit and were skipped.`);
    if (candidates.length > maxFiles) messages.push(`Only the first ${maxFiles} file(s) were kept.`);
    if (!multiple && incoming.length > 1) messages.push('Select one file at a time.');
    setValidationMessage(messages.join(' '));
    update(next);
    event.target.value = '';
  };

  const remove = (index: number) => update(files.filter((_, i) => i !== index));

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        className="sr-only"
        accept={accept}
        multiple={multiple}
        disabled={disabled}
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={disabled}
        onClick={() => inputRef.current?.click()}
        className="inline-flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-xs font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Paperclip className="w-3.5 h-3.5" />
        {label}
      </button>

      {validationMessage && (
        <p className="text-xs text-rose-600 dark:text-rose-400" role="status">{validationMessage}</p>
      )}

      {files.length > 0 && (
        <div className="space-y-1.5" aria-live="polite">
          {files.map((file, index) => {
            const isImage = file.type.startsWith('image/');
            return (
              <div key={`${file.name}-${file.lastModified}-${index}`} className="flex items-center gap-2 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/70 px-2.5 py-2">
                {isImage ? <ImageIcon className="w-3.5 h-3.5 text-indigo-500" /> : <FileText className="w-3.5 h-3.5 text-slate-400" />}
                <span className="min-w-0 flex-1 truncate text-xs text-slate-700 dark:text-slate-200">{file.name}</span>
                <button type="button" onClick={() => remove(index)} className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-slate-200" aria-label={`Remove ${file.name}`}>
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
