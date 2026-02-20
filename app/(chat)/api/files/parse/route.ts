import { generateText } from "ai";
import { gateway } from "@ai-sdk/gateway";
import { put } from "@vercel/blob";
import mammoth from "mammoth";
import { NextResponse } from "next/server";
import Papa from "papaparse";
import { auth } from "@/app/(auth)/auth";

const SUPPORTED_TYPES: Record<string, "pdf" | "docx" | "csv"> = {
  "application/pdf": "pdf",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
    "docx",
  "text/csv": "csv",
  "application/csv": "csv",
};

// Gemini 2.5 Flash Lite supports PDF file parts natively via the Vercel AI Gateway.
// Claude does NOT support PDF file parts — do not swap for getArtifactModel().
const PDF_PARSE_MODEL = gateway.languageModel("google/gemini-2.5-flash-lite");

/**
 * POST /api/files/parse
 *
 * Accepts JSON body: { url: string, contentType: string, name: string }
 *  - url: the public Vercel Blob URL of the already-uploaded file
 *  - contentType: MIME type of the file
 *  - name: original filename
 *
 * Flow:
 *   1. Fetch file from Blob URL
 *   2. Extract text (VLM for PDF, mammoth for DOCX, papaparse for CSV)
 *   3. Save extracted text as a new .txt blob in Vercel Blob
 *   4. Return { parsedText, textUrl, name }
 */
export async function POST(request: Request) {
  const session = await auth();

  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { url, contentType, name } = await request.json();

    if (!url || !contentType) {
      return NextResponse.json(
        { error: "url and contentType are required" },
        { status: 400 }
      );
    }

    const fileKind = SUPPORTED_TYPES[contentType];
    if (!fileKind) {
      return NextResponse.json(
        { error: `Unsupported file type: ${contentType}` },
        { status: 400 }
      );
    }

    let parsedText = "";

    if (fileKind === "csv") {
      // --- CSV: fetch from Blob, parse directly ---
      const res = await fetch(url);
      if (!res.ok) {
        return NextResponse.json(
          { error: `Failed to fetch file from Blob: ${res.statusText}` },
          { status: 502 }
        );
      }
      const text = await res.text();
      const { data } = Papa.parse<string[]>(text, { skipEmptyLines: true });
      if (!data.length) {
        return NextResponse.json(
          { error: "CSV file appears to be empty" },
          { status: 400 }
        );
      }
      const [headers, ...rows] = data;
      parsedText = [
        headers.join(" | "),
        headers.map(() => "---").join(" | "),
        ...rows.map((row) => row.join(" | ")),
      ].join("\n");

    } else if (fileKind === "docx") {
      // --- DOCX: fetch from Blob, extract with mammoth ---
      const res = await fetch(url);
      if (!res.ok) {
        return NextResponse.json(
          { error: `Failed to fetch file from Blob: ${res.statusText}` },
          { status: 502 }
        );
      }
      const arrayBuffer = await res.arrayBuffer();
      const { value } = await mammoth.extractRawText({
        buffer: Buffer.from(arrayBuffer),
      });
      parsedText = value;

    } else {
      // --- PDF: fetch from Blob as base64, send to Gemini Vision ---
      const res = await fetch(url);
      if (!res.ok) {
        return NextResponse.json(
          { error: `Failed to fetch file from Blob: ${res.statusText}` },
          { status: 502 }
        );
      }
      const arrayBuffer = await res.arrayBuffer();
      const base64 = Buffer.from(arrayBuffer).toString("base64");

      const { text } = await generateText({
        model: PDF_PARSE_MODEL,
        messages: [
          {
            role: "user",
            content: [
              {
                type: "file",
                data: base64,
                mediaType: "application/pdf",
              },
              {
                type: "text",
                text: "Extract and return all text content from this PDF document. Preserve the structure (headings, paragraphs, tables) where possible. Return only the extracted text — no commentary.",
              },
            ],
          },
        ],
      });
      parsedText = text;
    }

    // Save the extracted text as a new blob for persistence
    const baseName = name.replace(/\.[^.]+$/, ""); // strip extension
    const textBlob = new Blob([parsedText], { type: "text/plain" });
    const { url: textUrl } = await put(
      `extracted/${baseName}-${Date.now()}.txt`,
      textBlob,
      { access: "public" }
    );

    return NextResponse.json({ parsedText, textUrl, name });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to parse file";
    console.error("[parse] error:", message, error);
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
