"use client";

import { CheckIcon, FileTextIcon, LoaderIcon } from "lucide-react";
import { ChevronDownIcon } from "lucide-react";
import { memo, useState } from "react";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type FileProcessingStage = "uploading" | "parsing" | "done" | "error";

export interface ProcessingFile {
  name: string;
  stage: FileProcessingStage;
  /** Populated when stage === "done" */
  parsedText?: string;
  /** Error message when stage === "error" */
  error?: string;
}

// ─── Individual file row ───────────────────────────────────────────────────────

const StageIcon = memo(({ stage }: { stage: FileProcessingStage }) => {
  if (stage === "done") {
    return (
      <span className="flex size-4 items-center justify-center rounded-full bg-emerald-500/15">
        <CheckIcon className="size-2.5 text-emerald-500" />
      </span>
    );
  }
  if (stage === "error") {
    return (
      <span className="flex size-4 items-center justify-center rounded-full bg-destructive/15">
        <span className="size-2.5 text-destructive">✕</span>
      </span>
    );
  }
  return (
    <LoaderIcon
      className={cn(
        "size-3.5",
        stage === "uploading" && "animate-spin text-muted-foreground",
        stage === "parsing" && "animate-spin text-primary"
      )}
    />
  );
});
StageIcon.displayName = "StageIcon";

const StageLabel = memo(({ stage }: { stage: FileProcessingStage }) => {
  const labels: Record<FileProcessingStage, string> = {
    uploading: "Uploading…",
    parsing: "Extracting text…",
    done: "Ready as context",
    error: "Failed",
  };
  const colors: Record<FileProcessingStage, string> = {
    uploading: "text-muted-foreground",
    parsing: "text-primary",
    done: "text-emerald-500",
    error: "text-destructive",
  };
  return (
    <span className={cn("text-[10px] font-medium", colors[stage])}>
      {labels[stage]}
    </span>
  );
});
StageLabel.displayName = "StageLabel";

// ─── Collapsible text preview for a done file ─────────────────────────────────

const FileTextPreview = memo(
  ({ name, parsedText }: { name: string; parsedText: string }) => {
    const [open, setOpen] = useState(false);
    const preview = parsedText.trim().slice(0, 600);
    return (
      <Collapsible open={open} onOpenChange={setOpen}>
        <CollapsibleTrigger className="flex items-center gap-1 rounded px-1 py-0.5 text-[10px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <ChevronDownIcon
            className={cn("size-2.5 transition-transform", open && "rotate-180")}
          />
          {open ? "Hide" : "Preview extracted text"}
        </CollapsibleTrigger>
        <CollapsibleContent>
          <div className="mt-1.5 max-h-40 overflow-y-auto rounded-md border border-border/50 bg-muted/30 p-2.5">
            <p className="whitespace-pre-wrap text-[10px] leading-relaxed text-muted-foreground">
              {preview}
              {parsedText.length > 600 && (
                <span className="opacity-50">
                  {"\n\n"}…{parsedText.length - 600} more characters
                </span>
              )}
            </p>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
);
FileTextPreview.displayName = "FileTextPreview";

// ─── Main panel ───────────────────────────────────────────────────────────────

export interface FileProcessingPanelProps {
  files: ProcessingFile[];
  onRemove?: (name: string) => void;
  className?: string;
}

export const FileProcessingPanel = memo(
  ({ files, onRemove, className }: FileProcessingPanelProps) => {
    const [open, setOpen] = useState(true);

    const doneCount = files.filter((f) => f.stage === "done").length;
    const isAnyProcessing = files.some(
      (f) => f.stage === "uploading" || f.stage === "parsing"
    );

    if (files.length === 0) return null;

    const headerLabel = isAnyProcessing
      ? "Processing files…"
      : `${doneCount} file${doneCount !== 1 ? "s" : ""} ready`;

    return (
      <Collapsible
        className={cn("not-prose w-full", className)}
        open={open}
        onOpenChange={setOpen}
      >
        {/* Header trigger — mirrors ReasoningTrigger style */}
        <CollapsibleTrigger className="flex items-center gap-1.5 rounded-md px-1.5 py-1 text-[11px] text-muted-foreground transition-colors hover:bg-muted hover:text-foreground">
          <FileTextIcon className="size-3" />
          {isAnyProcessing && (
            <LoaderIcon className="size-3 animate-spin text-primary" />
          )}
          {!isAnyProcessing && (
            <span className="flex size-3.5 items-center justify-center rounded-full bg-emerald-500/15">
              <CheckIcon className="size-2 text-emerald-500" />
            </span>
          )}
          <span>{headerLabel}</span>
          <ChevronDownIcon
            className={cn(
              "size-2.5 transition-transform",
              open ? "rotate-180" : "rotate-0"
            )}
          />
        </CollapsibleTrigger>

        {/* File rows — mirrors ReasoningContent style */}
        <CollapsibleContent className="mt-1.5 data-[state=closed]:fade-out-0 data-[state=closed]:slide-out-to-top-2 data-[state=open]:slide-in-from-top-2 outline-hidden data-[state=closed]:animate-out data-[state=open]:animate-in">
          <div className="rounded-md border border-border/50 bg-muted/30 p-2.5">
            <div className="flex flex-col gap-2">
              {files.map((file) => (
                <div key={file.name} className="flex flex-col gap-1">
                  <div className="flex items-center gap-2">
                    <StageIcon stage={file.stage} />
                    <span className="flex-1 truncate text-[11px] text-foreground/80">
                      {file.name}
                    </span>
                    <StageLabel stage={file.stage} />
                    {onRemove && (file.stage === "done" || file.stage === "error") && (
                      <button
                        type="button"
                        onClick={() => onRemove(file.name)}
                        className="ml-1 rounded p-0.5 text-muted-foreground/50 transition-colors hover:bg-muted hover:text-foreground"
                        aria-label="Remove"
                      >
                        <svg viewBox="0 0 10 10" className="size-2" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                          <path d="M1 1l8 8M9 1L1 9" />
                        </svg>
                      </button>
                    )}
                  </div>

                  {/* Progress bar for active stages */}
                  {(file.stage === "uploading" || file.stage === "parsing") && (
                    <div className="ml-6 h-0.5 overflow-hidden rounded-full bg-border">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all",
                          file.stage === "uploading"
                            ? "w-1/3 animate-pulse bg-muted-foreground"
                            : "w-2/3 animate-pulse bg-primary"
                        )}
                      />
                    </div>
                  )}

                  {/* Extracted text preview */}
                  {file.stage === "done" && file.parsedText && (
                    <div className="ml-6">
                      <FileTextPreview
                        name={file.name}
                        parsedText={file.parsedText}
                      />
                    </div>
                  )}

                  {/* Error message */}
                  {file.stage === "error" && file.error && (
                    <p className="ml-6 text-[10px] text-destructive">
                      {file.error}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  }
);
FileProcessingPanel.displayName = "FileProcessingPanel";
