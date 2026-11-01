"use client";

import type { Task } from "@/trpc/routers/tasks";
import { Modal } from "./modal";

export function DeleteTaskDialog({
  task,
  pending,
  error,
  onConfirm,
  onClose,
}: {
  task: Task | null;
  pending: boolean;
  error: string | null;
  onConfirm: (task: Task) => void;
  onClose: () => void;
}) {
  return (
    <Modal open={task !== null} title="Delete task" onClose={onClose}>
      {task ? (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">Delete task?</h2>
          <p className="text-sm">
            <span className="font-medium">{task.title}</span> will be
            permanently deleted.
          </p>
          {error ? <p className="text-sm text-red-600">{error}</p> : null}
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-full border border-black/[.08] px-4 py-2 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
            >
              Cancel
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => onConfirm(task)}
              className="rounded-full bg-red-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
            >
              {pending ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      ) : null}
    </Modal>
  );
}
