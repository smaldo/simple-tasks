"use client";

import { useState } from "react";
import type { Task } from "@/trpc/routers/tasks";

export type TaskDialog =
  | { type: "closed" }
  | { type: "create" }
  | { type: "edit"; task: Task }
  | { type: "delete"; task: Task };

export function useTaskDialog() {
  const [dialog, setDialog] = useState<TaskDialog>({ type: "closed" });

  return {
    dialog,
    close: () => setDialog({ type: "closed" }),
    openCreate: () => setDialog({ type: "create" }),
    openEdit: (task: Task) => setDialog({ type: "edit", task }),
    openDelete: (task: Task) => setDialog({ type: "delete", task }),
  };
}
