"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createTRPCClient, httpBatchLink } from "@trpc/client";
import { createTRPCContext } from "@trpc/tanstack-react-query";
import { useState } from "react";
import superjson from "superjson";
import type { AppRouter } from "./routers/_app";

const { TRPCProvider: BaseTRPCProvider, useTRPC } =
  createTRPCContext<AppRouter>();

export { useTRPC };

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: { queries: { staleTime: 5_000 } },
  });
}

let browserQueryClient: QueryClient | undefined;

function getQueryClient() {
  if (typeof window === "undefined") return makeQueryClient();
  if (!browserQueryClient) browserQueryClient = makeQueryClient();
  return browserQueryClient;
}

export function TRPCProvider({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const [trpcClient] = useState(() =>
    createTRPCClient<AppRouter>({
      links: [
        httpBatchLink({
          url: "/api/trpc",
          transformer: superjson,
        }),
      ],
    }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <BaseTRPCProvider trpcClient={trpcClient} queryClient={queryClient}>
        {children}
      </BaseTRPCProvider>
    </QueryClientProvider>
  );
}
