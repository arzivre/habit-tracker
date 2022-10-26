import { router, publicProcedure } from "../trpc";
import { z } from "zod";

export const demoRouter = router({
  getDemoHabits: publicProcedure.query(({ ctx }) => {
    return ctx.prisma.demoHabit.findMany();
  }),
  getDemoRecords: publicProcedure
    .input(z.object({ month: z.string(), habitId: z.string() }))
    .query(({ ctx, input }) => {
      return ctx.prisma.demoRecord.findMany({
        where: {
          month: input.month,
          demoHabitId: input.habitId,
        },
      });
    }),
});
