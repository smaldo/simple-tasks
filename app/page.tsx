import { Suspense } from "react";
import { connection } from "next/server";
import { TasksManager } from "@/components/tasks-manager";
import { getServerCaller } from "@/trpc/server-client";

async function TasksList() {
  await connection();
  const caller = await getServerCaller();
  const tasks = await caller.tasks.getAll();

  return <TasksManager tasks={tasks} />;
}

export default function Home() {
  return (
    <div className="flex flex-1 justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex w-full max-w-3xl flex-col bg-white px-8 py-16 dark:bg-black">
        <Suspense fallback={<p>Loading tasks...</p>}>
          <TasksList />
        </Suspense>
      </main>
    </div>
  );
}
