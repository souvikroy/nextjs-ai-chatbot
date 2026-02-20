import Image from "next/image";
import type { Attachment } from "@/lib/types";
import { Loader } from "./elements/loader";
import { CrossSmallIcon } from "./icons";
import { Button } from "./ui/button";

function DocumentIcon({ contentType }: { contentType: string }) {
  if (contentType === "application/pdf") {
    return (
      <div className="flex flex-col items-center justify-center gap-0.5">
        <svg className="size-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4H5zm0 2h9v3h3v11H5V5zm5.5 5a.5.5 0 000 1h3a.5.5 0 000-1h-3zm-2 2.5a.5.5 0 01.5-.5h5a.5.5 0 010 1h-5a.5.5 0 01-.5-.5zm0 2a.5.5 0 01.5-.5h3a.5.5 0 010 1h-3a.5.5 0 01-.5-.5z" />
        </svg>
        <span className="text-[9px] font-medium text-red-500">PDF</span>
      </div>
    );
  }
  if (
    contentType ===
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
  ) {
    return (
      <div className="flex flex-col items-center justify-center gap-0.5">
        <svg className="size-6 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4H5zm0 2h9v3h3v11H5V5zm2 5v6l2-3 2 3v-6h-1v4l-1-1.5L8 14V10H7zm6 1h-1v4h1v-4z" />
        </svg>
        <span className="text-[9px] font-medium text-blue-500">DOCX</span>
      </div>
    );
  }
  if (contentType === "text/csv" || contentType === "application/csv") {
    return (
      <div className="flex flex-col items-center justify-center gap-0.5">
        <svg className="size-6 text-green-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M5 3a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V7l-4-4H5zm0 2h9v3h3v11H5V5zm2 5v1h10v-1H7zm0 2v1h10v-1H7zm0 2v1h7v-1H7z" />
        </svg>
        <span className="text-[9px] font-medium text-green-500">CSV</span>
      </div>
    );
  }
  // generic document (application/document)
  return (
    <div className="flex flex-col items-center justify-center gap-0.5">
      <svg className="size-6 text-muted-foreground" fill="none" stroke="currentColor" strokeWidth={1.5} viewBox="0 0 24 24">
        <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <span className="text-[9px] font-medium text-muted-foreground">DOC</span>
    </div>
  );
}

export const PreviewAttachment = ({
  attachment,
  isUploading = false,
  onRemove,
}: {
  attachment: Attachment;
  isUploading?: boolean;
  onRemove?: () => void;
}) => {
  const { name, url, contentType } = attachment;

  return (
    <div
      className="group relative size-16 overflow-hidden rounded-lg border bg-muted"
      data-testid="input-attachment-preview"
    >
      {contentType?.startsWith("image") ? (
        <Image
          alt={name ?? "An image attachment"}
          className="size-full object-cover"
          height={64}
          src={url}
          width={64}
        />
      ) : (
        <div className="flex size-full items-center justify-center text-muted-foreground text-xs">
          <DocumentIcon contentType={contentType ?? ""} />
        </div>
      )}

      {isUploading && (
        <div
          className="absolute inset-0 flex items-center justify-center bg-black/50"
          data-testid="input-attachment-loader"
        >
          <Loader size={16} />
        </div>
      )}

      {onRemove && !isUploading && (
        <Button
          className="absolute top-0.5 right-0.5 size-4 rounded-full p-0 opacity-0 transition-opacity group-hover:opacity-100"
          onClick={onRemove}
          size="sm"
          variant="destructive"
        >
          <CrossSmallIcon size={8} />
        </Button>
      )}

      <div className="absolute inset-x-0 bottom-0 truncate bg-linear-to-t from-black/80 to-transparent px-1 py-0.5 text-[10px] text-white">
        {name}
      </div>
    </div>
  );
};

