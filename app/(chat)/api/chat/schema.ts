import { z } from "zod";

const textPartSchema = z.object({
  type: z.enum(["text"]),
  // Allow empty string — user may send a doc with no typed message
  text: z.string().max(2000),
});

const filePartSchema = z.object({
  type: z.enum(["file"]),
  // Accept any mediaType so PDF/DOCX don't fail validation
  mediaType: z.string().min(1),
  name: z.string().min(1).max(100),
  url: z.string().url(),
});

const partSchema = z.union([textPartSchema, filePartSchema]);

const userMessageSchema = z.object({
  id: z.string().uuid(),
  role: z.enum(["user"]),
  parts: z.array(partSchema),
});

// For tool approval flows, we accept all messages (more permissive schema)
const messageSchema = z.object({
  id: z.string(),
  role: z.string(),
  parts: z.array(z.any()),
});

export const postRequestBodySchema = z.object({
  id: z.string().uuid(),
  // Either a single new message or all messages (for tool approvals)
  message: userMessageSchema.optional(),
  messages: z.array(messageSchema).optional(),
  selectedChatModel: z.string(),
  selectedVisibilityType: z.enum(["public", "private"]),
  fileContext: z.string().optional(),
  // Use z.string() not z.string().url() to be lenient with Blob URL formats
  textUrls: z.array(z.string()).optional(),
});

export type PostRequestBody = z.infer<typeof postRequestBodySchema>;
