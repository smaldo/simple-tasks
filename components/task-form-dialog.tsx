"use client";

import type { Task } from "@/trpc/routers/tasks";
import { Modal } from "./modal";
import { TaskForm, type TaskFormValues } from "./task-form";

export function TaskFormDialog({
  open,
  task,
  pending,
  error,
  onSubmit,
  onClose,
}: {
  open: boolean;
  task: Task | null;
  pending: boolean;
  error: string | null;
  onSubmit: (values: TaskFormValues) => void;
  onClose: () => void;
}) {
  const heading = task ? "Edit task" : "New task";

  return (
    <Modal open={open} title={heading} onClose={onClose}>
      {open ? (
        <TaskForm
          key={task?.id ?? "create"}
          heading={heading}
          submitLabel={task ? "Save changes" : "Create task"}
          initialValues={{
            title: task?.title ?? "",
            description: task?.description ?? "",
          }}
          pending={pending}
          error={error}
          onSubmit={onSubmit}
          onCancel={onClose}
        />
      ) : null}
    </Modal>
  );
}
