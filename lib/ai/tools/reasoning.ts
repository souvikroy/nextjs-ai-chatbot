import { tool } from "ai";
import { z } from "zod";

export const intent = tool({
  description: "Capture the user's intent and specific requirements. Call this first.",
  inputSchema: z.object({
    thought: z.string().describe("Your understanding of the user's goal."),
  }),
  execute: async ({ thought }: { thought: string }) => {
    return { status: "success", thought };
  },
});

export const planner = tool({
  description: "Create a step-by-step plan to address the user's request. Call this after intent.",
  inputSchema: z.object({
    thought: z.string().describe("The detailed plan to follow."),
  }),
  execute: async ({ thought }: { thought: string }) => {
    return { status: "success", thought };
  },
});

export const executor = tool({
  description: "Signal the transition to manual execution or final response generation. Call this last.",
  inputSchema: z.object({
    thought: z.string().describe("Summary of what you are about to execute."),
  }),
  execute: async ({ thought }: { thought: string }) => {
    return { status: "success", thought };
  },
});
