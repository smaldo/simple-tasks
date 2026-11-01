import { initTRPC } from "@trpc/server";
import superjson from "superjson";

export interface Context {
  headers: Headers;
}

export const createTRPCContext = async (opts: {
  headers: Headers;
}): Promise<Context> => {
  return { headers: opts.headers };
};

const t = initTRPC.context<Context>().create({
  transformer: superjson,
});

export const router = t.router;
export const publicProcedure = t.procedure;
export const createCallerFactory = t.createCallerFactory;
