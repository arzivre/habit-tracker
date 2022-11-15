import { z } from "zod";
import { router, publicProcedure, protectedProcedure } from "../trpc";

export const HabitTrackerRouter = router({
  getSession: publicProcedure.query(({ ctx }) => {
    return ctx.session;
  }),
  getHabits: protectedProcedure
    .input(
      z.object({
        userId: z.string(),
      })
    )
    .query(({ ctx, input }) => {
      return ctx.prisma.habit.findMany({
        where: {
          userId: input.userId,
        },
      });
    }),
  createHabit: protectedProcedure
    .input(
      z.object({
        title: z.string(),
        userId: z.string(),
        filterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.habit.create({
        data: {
          title: input.title,
          userId: input.userId,
          filterId: input.filterId,
        },
      });
    }),
});
