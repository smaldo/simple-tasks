"use client";

import { useQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";

export function TRPCDemo() {
  const trpc = useTRPC();
  const health = useQuery(trpc.healthcheck.queryOptions());
  const greeting = useQuery(trpc.greeting.queryOptions({ name: "tRPC" }));

  return (
    <div className="flex flex-col gap-1 text-sm">
      <p>healthcheck: {health.data ?? health.status}</p>
      <p>greeting: {greeting.data ?? greeting.status}</p>
    </div>
  );
}
