"use client";

import { useEffect, useRef } from "react";
import type { Task } from "@/trpc/routers/tasks";

const dateFormatter = new Intl.DateTimeFormat("en-US", {
  dateStyle: "medium",
  timeZone: "UTC",
});

export function TaskList({
  tasks,
  hasNextPage,
  isFetchingNextPage,
  onLoadMore,
  onEdit,
  onDelete,
}: {
  tasks: Task[];
  hasNextPage: boolean;
  isFetchingNextPage: boolean;
  onLoadMore: () => void;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  if (tasks.length === 0) {
    return <p className="text-zinc-600 dark:text-zinc-400">No tasks yet.</p>;
  }

  return (
    <div className="flex flex-col">
      <ul className="flex flex-col divide-y divide-black/[.08] dark:divide-white/[.145]">
        {tasks.map((task) => (
          <TaskItem key={task.id} task={task} onEdit={onEdit} onDelete={onDelete} />
        ))}
      </ul>
      <InfiniteScrollSentinel
        enabled={hasNextPage && !isFetchingNextPage}
        onVisible={onLoadMore}
      />
      {isFetchingNextPage ? (
        <p className="py-4 text-center text-sm text-zinc-500">
          Loading more tasks...
        </p>
      ) : null}
    </div>
  );
}

function InfiniteScrollSentinel({
  enabled,
  onVisible,
}: {
  enabled: boolean;
  onVisible: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const onVisibleRef = useRef(onVisible);

  useEffect(() => {
    onVisibleRef.current = onVisible;
  }, [onVisible]);

  useEffect(() => {
    const element = ref.current;
    if (!enabled || !element) return;

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        onVisibleRef.current();
      }
    });
    observer.observe(element);
    return () => observer.disconnect();
  }, [enabled]);

  return <div ref={ref} aria-hidden="true" className="h-1" />;
}

function TaskItem({
  task,
  onEdit,
  onDelete,
}: {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}) {
  return (
    <li className="flex items-start justify-between gap-4 py-4">
      <div className="flex flex-col gap-1">
        <span className="font-medium">{task.title}</span>
        {task.description ? (
          <span className="text-sm text-zinc-600 dark:text-zinc-400">
            {task.description}
          </span>
        ) : null}
        <span className="text-xs text-zinc-500">
          Created {dateFormatter.format(task.creationDate)}
        </span>
      </div>
      <div className="flex shrink-0 gap-2">
        <button
          type="button"
          onClick={() => onEdit(task)}
          className="rounded-full border border-black/[.08] px-3 py-1 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(task)}
          className="rounded-full border border-red-300 px-3 py-1 text-sm font-medium text-red-600 hover:bg-red-50 dark:border-red-900 dark:hover:bg-red-950"
        >
          Delete
        </button>
      </div>
    </li>
  );
}
