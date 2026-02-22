"use client";

import {
  CheckCircleIcon,
  ChevronDownIcon,
  CompassIcon,
  ListTodoIcon,
  PlayIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type ReasoningStepProps = {
  type: "intent" | "planner" | "executor";
  thought: string;
  intents?: string[];
  plan?: Array<{ intent: string; steps: string[] }>;
  executionSteps?: string[];
  isStreaming?: boolean;
};

const stepConfigs = {
  intent: {
    label: "Intent",
    icon: CompassIcon,
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  planner: {
    label: "Planner",
    icon: ListTodoIcon,
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  executor: {
    label: "Executor",
    icon: PlayIcon,
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
};

export function ReasoningStep({
  type,
  thought,
  intents,
  plan,
  executionSteps,
  isStreaming,
}: ReasoningStepProps) {
  const config = stepConfigs[type];
  const Icon = config.icon;

  return (
    <Collapsible
      className="not-prose group mb-4 w-full rounded-xl border bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80"
      defaultOpen={isStreaming}
    >
      <CollapsibleTrigger className="flex w-full items-center justify-between gap-3 p-3">
        <div className="flex items-center gap-3">
          <div className={cn("flex size-8 items-center justify-center rounded-lg", config.bgColor)}>
            <Icon className={cn("size-4", config.color)} />
          </div>
          <div className="flex flex-col items-start gap-0.5">
            <span className="font-semibold text-sm leading-none">{config.label}</span>
            <span className="text-muted-foreground text-xs">Reasoning Phase</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {isStreaming ? (
            <Badge variant="secondary" className="flex items-center gap-1 rounded-full text-[10px] px-2 py-0 animate-pulse">
              <div className="size-1.5 rounded-full bg-blue-500" />
              Processing
            </Badge>
          ) : (
            <div className="flex items-center gap-1 text-green-600 text-[10px] font-medium uppercase tracking-wider">
               <CheckCircleIcon size={12} />
               Done
            </div>
          )}
          <ChevronDownIcon className="size-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <div className="border-t bg-muted/30 px-4 py-3">
          <div className="prose prose-sm dark:prose-invert max-w-none text-muted-foreground leading-relaxed">
            <p className="mb-4 text-foreground font-medium">{thought}</p>
            
            {type === "intent" && intents && intents.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Identified Intents</span>
                <ol className="list-decimal list-inside space-y-1">
                  {intents.map((intent, i) => (
                    <li key={i} className="text-sm">{intent}</li>
                  ))}
                </ol>
              </div>
            )}

            {type === "planner" && plan && plan.length > 0 && (
              <div className="mt-4 space-y-4">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Execution Plan</span>
                {plan.map((p, i) => (
                  <div key={i} className="space-y-1">
                    <p className="text-sm font-semibold text-foreground">{p.intent}</p>
                    <ul className="list-disc list-inside ml-2 space-y-1">
                      {p.steps.map((step, j) => (
                        <li key={j} className="text-xs">{step}</li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            )}

            {type === "executor" && executionSteps && executionSteps.length > 0 && (
              <div className="mt-4 space-y-2">
                <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">Execution Steps</span>
                <ul className="list-disc list-inside space-y-1">
                  {executionSteps.map((step, i) => (
                    <li key={i} className="text-sm">{step}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
