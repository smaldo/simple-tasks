import "server-only";

import { cache } from "react";
import { headers } from "next/headers";
import { appRouter } from "./routers/_app";
import { createTRPCContext } from "./server";

export const getServerCaller = cache(async () => {
  const heads = new Headers(await headers());
  const context = await createTRPCContext({ headers: heads });
  return appRouter.createCaller(context);
});
