import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const demoRouter = router({
  getDemoHabits: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.demoHabit.findMany();
  }),
  getDemoRecords: publicProcedure
    .input(z.object({ month: z.string(), habitId: z.string() }))
    .query(async ({ ctx, input }) => {
     return ctx.prisma.demoRecord.findMany({
        where: {
          month: input.month,
          demoHabitId: input.habitId,
        },
      });
    }),
});
