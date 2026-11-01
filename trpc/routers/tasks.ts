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

export type TasksPage = { items: Task[]; nextCursor: string | null };

export const TASKS_PAGE_SIZE = 20;
export const INITIAL_TASK_COUNT = 100;

const globalStore = globalThis as typeof globalThis & {
  __taskStore?: { tasks: Map<string, Task>; nextId: number };
};

function createInitialStore() {
  const tasks = new Map<string, Task>();
  for (let index = 1; index <= INITIAL_TASK_COUNT; index++) {
    const id = String(index);
    tasks.set(id, {
      id,
      title: `Task ${index}`,
      creationDate: new Date(),
    });
  }
  return { tasks, nextId: INITIAL_TASK_COUNT + 1 };
}

const store = (globalStore.__taskStore ??= createInitialStore());

export function resetTaskStore() {
  store.tasks.clear();
  store.nextId = 1;
}

export const tasksRouter = router({
  getAll: publicProcedure.query(() => [...store.tasks.values()]),

  getPage: publicProcedure
    .input(z.object({ cursor: z.string().nullish() }))
    .query(({ input }): TasksPage => {
      const cursor = input.cursor == null ? null : Number(input.cursor);
      const remaining = [...store.tasks.values()]
        .sort((a, b) => Number(b.id) - Number(a.id))
        .filter((task) => cursor === null || Number(task.id) < cursor);
      const items = remaining.slice(0, TASKS_PAGE_SIZE);
      const hasMore = remaining.length > TASKS_PAGE_SIZE;

      return {
        items,
        nextCursor: hasMore ? items[items.length - 1].id : null,
      };
    }),

  create: publicProcedure
    .input(
      z.object({
        title: z.string().min(1),
        description: z.string().optional(),
      }),
    )
    .mutation(({ input }) => {
      const task: Task = {
        id: String(store.nextId++),
        title: input.title,
        description: input.description,
        creationDate: new Date(),
      };
      store.tasks.set(task.id, task);
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
      const existing = store.tasks.get(input.id);
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
      store.tasks.set(updated.id, updated);
      return updated;
    }),

  delete: publicProcedure
    .input(z.object({ id: z.string() }))
    .mutation(({ input }) => {
      const existing = store.tasks.get(input.id);
      if (!existing) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: `Task ${input.id} not found`,
        });
      }
      store.tasks.delete(input.id);
      return { id: input.id };
    }),
});
