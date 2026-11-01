"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/components/toast";
import { useTRPC } from "@/trpc/client";

export function useTaskMutations(onDone: () => void) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { show } = useToast();

  const refresh = () => {
    onDone();
    queryClient.invalidateQueries(trpc.tasks.getPage.pathFilter());
  };

  const createTask = useMutation(
    trpc.tasks.create.mutationOptions({
      onSuccess: (task) => {
        show("success", `Task "${task.title}" created`);
        refresh();
      },
      onError: (error) => show("error", `Could not create task: ${error.message}`),
    }),
  );
  const updateTask = useMutation(
    trpc.tasks.update.mutationOptions({
      onSuccess: (task) => {
        show("success", `Task "${task.title}" updated`);
        refresh();
      },
      onError: (error) => {
        show("error", `Could not update task: ${error.message}`);
        if (error.data?.code === "NOT_FOUND") refresh();
      },
    }),
  );
  const deleteTask = useMutation(
    trpc.tasks.delete.mutationOptions({
      onSuccess: () => {
        show("success", "Task deleted");
        refresh();
      },
      onError: (error) => {
        show("error", `Could not delete task: ${error.message}`);
        if (error.data?.code === "NOT_FOUND") refresh();
      },
    }),
  );

  function resetAll() {
    createTask.reset();
    updateTask.reset();
    deleteTask.reset();
  }

  return { createTask, updateTask, deleteTask, resetAll };
}
