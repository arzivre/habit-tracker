// src/server/trpc/router/_app.ts
import { router } from "../trpc";
import { exampleRouter } from "./example";
import { authRouter } from "./auth";
import { demoRouter } from "./demo";
import { HabitTrackerRouter } from "./habits";

export const appRouter = router({
  habits: HabitTrackerRouter,
  demo: demoRouter,
  example: exampleRouter,
  auth: authRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
