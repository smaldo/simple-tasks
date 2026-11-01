"use client";

import { useInfiniteQuery } from "@tanstack/react-query";
import { useTaskDialog } from "@/hooks/use-task-dialog";
import { useTaskMutations } from "@/hooks/use-task-mutations";
import { useTRPC } from "@/trpc/client";
import type { TasksPage } from "@/trpc/routers/tasks";
import { DeleteTaskDialog } from "./delete-task-dialog";
import { TaskFormDialog } from "./task-form-dialog";
import { TaskList } from "./task-list";
import type { TaskFormValues } from "./task-form";

export function TasksManager({ initialPage }: { initialPage: TasksPage }) {
  const trpc = useTRPC();
  const { dialog, close, openCreate, openEdit, openDelete } = useTaskDialog();
  const { createTask, updateTask, deleteTask, resetAll } =
    useTaskMutations(close);
  const tasksQuery = useInfiniteQuery(
    trpc.tasks.getPage.infiniteQueryOptions(
      {},
      {
        initialCursor: null,
        getNextPageParam: (lastPage) => lastPage.nextCursor,
        initialData: { pages: [initialPage], pageParams: [null] },
      },
    ),
  );
  const tasks = tasksQuery.data.pages.flatMap((page) => page.items);

  function handleSubmit(values: TaskFormValues) {
    const description = values.description || undefined;
    if (dialog.type === "create") {
      createTask.mutate({ title: values.title, description });
    } else if (dialog.type === "edit") {
      updateTask.mutate({
        id: dialog.task.id,
        title: values.title,
        description: description ?? "",
      });
    }
  }

  const formOpen = dialog.type === "create" || dialog.type === "edit";
  const formTask = dialog.type === "edit" ? dialog.task : null;
  const formPending = createTask.isPending || updateTask.isPending;
  const formError =
    (dialog.type === "create" ? createTask.error : updateTask.error)?.message ??
    null;

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-semibold tracking-tight">Tasks</h1>
        <button
          type="button"
          onClick={() => {
            resetAll();
            openCreate();
          }}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background"
        >
          New task
        </button>
      </div>

      <TaskList
        tasks={tasks}
        hasNextPage={tasksQuery.hasNextPage}
        isFetchingNextPage={tasksQuery.isFetchingNextPage}
        onLoadMore={() => tasksQuery.fetchNextPage()}
        onEdit={(task) => {
          resetAll();
          openEdit(task);
        }}
        onDelete={(task) => {
          resetAll();
          openDelete(task);
        }}
      />

      <TaskFormDialog
        open={formOpen}
        task={formTask}
        pending={formPending}
        error={formError}
        onSubmit={handleSubmit}
        onClose={close}
      />

      <DeleteTaskDialog
        task={dialog.type === "delete" ? dialog.task : null}
        pending={deleteTask.isPending}
        error={deleteTask.error?.message ?? null}
        onConfirm={(task) => deleteTask.mutate({ id: task.id })}
        onClose={close}
      />
    </div>
  );
}
