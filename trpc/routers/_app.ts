import { z } from "zod";
import { publicProcedure, router } from "../server";

export const appRouter = router({
  healthcheck: publicProcedure.query(() => "ok"),
  greeting: publicProcedure
    .input(z.object({ name: z.string().min(1).optional() }).optional())
    .query(({ input }) => `Hello, ${input?.name ?? "world"}!`),
});

export type AppRouter = typeof appRouter;
