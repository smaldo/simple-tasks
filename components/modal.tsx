"use client";

import { useEffect, useRef } from "react";

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    if (!open && dialog.open) dialog.close();
  }, [open]);

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      aria-label={title}
      className="m-auto w-full max-w-md rounded-lg bg-white p-6 text-zinc-950 shadow-xl backdrop:bg-black/40 dark:bg-zinc-900 dark:text-zinc-50"
    >
      {open ? children : null}
    </dialog>
  );
}
