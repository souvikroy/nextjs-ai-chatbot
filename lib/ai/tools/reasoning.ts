import { tool } from "ai";
import { z } from "zod";

export const intent = tool({
  description: "Capture the user's intent and specific requirements. Call this first.",
  inputSchema: z.object({
    thought: z.string().describe("Your understanding of the user's goal."),
    intents: z.array(z.string()).length(10).describe("Exactly 10 distinct intents or requirements identified from the user prompt and any attached documents."),
  }),
  execute: async ({ thought, intents }: { thought: string; intents: string[] }) => {
    return { status: "success", thought, intents };
  },
});

export const planner = tool({
  description: "Create a step-by-step plan to address the user's request. Call this after intent.",
  inputSchema: z.object({
    thought: z.string().describe("The detailed plan to follow."),
    plan: z.array(z.object({
      intent: z.string().describe("The specific intent being addressed."),
      steps: z.array(z.string()).describe("Detailed steps required for this intent."),
    })).describe("A structured plan addressing each identified intent."),
  }),
  execute: async ({ thought, plan }: { thought: string; plan: any[] }) => {
    return { status: "success", thought, plan };
  },
});

export const executor = tool({
  description: "Signal the transition to manual execution or final response generation. Call this last.",
  inputSchema: z.object({
    thought: z.string().describe("Summary of what you are about to execute."),
    executionSteps: z.array(z.string()).describe("Specific steps being executed."),
  }),
  execute: async ({ thought, executionSteps }: { thought: string; executionSteps: string[] }) => {
    return { status: "success", thought, executionSteps };
  },
});
