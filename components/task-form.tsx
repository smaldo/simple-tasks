"use client";

import { useState } from "react";

export type TaskFormValues = { title: string; description: string };

const inputClass =
  "w-full rounded border border-black/[.15] bg-transparent px-3 py-2 dark:border-white/[.145]";

export function TaskForm({
  heading,
  submitLabel,
  initialValues,
  pending,
  error,
  onSubmit,
  onCancel,
}: {
  heading: string;
  submitLabel: string;
  initialValues: TaskFormValues;
  pending: boolean;
  error: string | null;
  onSubmit: (values: TaskFormValues) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState(initialValues.title);
  const [description, setDescription] = useState(initialValues.description);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const trimmedTitle = title.trim();
    if (!trimmedTitle) return;
    onSubmit({ title: trimmedTitle, description: description.trim() });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <h2 className="text-xl font-semibold">{heading}</h2>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Title
        <input
          className={inputClass}
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          required
          autoFocus
        />
      </label>
      <label className="flex flex-col gap-1 text-sm font-medium">
        Description
        <textarea
          className={inputClass}
          rows={4}
          value={description}
          onChange={(event) => setDescription(event.target.value)}
        />
      </label>
      {error ? <p className="text-sm text-red-600">{error}</p> : null}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-black/[.08] px-4 py-2 text-sm font-medium hover:bg-black/[.04] dark:border-white/[.145] dark:hover:bg-[#1a1a1a]"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background disabled:opacity-50"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
      </div>
    </form>
  );
}
