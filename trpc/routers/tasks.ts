import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { publicProcedure, router } from "../server";

const taskSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  creationDate: z.date(),
});

export type Task = z.infer<typeof taskSchema>;

const tasks = new Map<string, Task>();
let nextId = 1;

export function resetTaskStore() {
  tasks.clear();
  nextId = 1;
}

export const tasksRouter = router({
  getAll: publicProcedure.query(() => [...tasks.values()]),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const task: Task = {
        id: String(nextId++),
        title: input.title,
        description: input.description,
        creationDate: new Date(),
      };
      tasks.set(task.id, task);
      return task;
    }),

  update: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().min(1).optional(),
        description: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const existing = tasks.get(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Task ${input.id} not found`,
        });
      }
      const updated: Task = {
        ...existing,
        ...(input.title !== undefined ? { title: input.title } : {}),
        ...(input.description !== undefined
          ? { description: input.description }
          : {}),
      };
      tasks.set(updated.id, updated);
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const existing = tasks.get(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Task ${input.id} not found`,
        });
      }
      tasks.delete(input.id);
      return { id: input.id };
    }),
});
