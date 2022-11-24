import { z } from "zod";
import { protectedProcedure, router } from "../trpc";

export const HabitTrackerRouter = router({
  getAll: protectedProcedure
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
  delete: protectedProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.habit.delete({
        where: {
          id: input.id,
        },
      });
    }),
  update: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        userId: z.string(),
        filterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.habit.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          userId: input.userId,
          filterId: input.filterId,
        },
      });
    }),
  create: protectedProcedure
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
  getRecords: protectedProcedure
    .input(
      z.object({
        month: z.string(),
        habitId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.record.findMany({
        where: {
          month: input.month,
          habitId: input.habitId,
        },
      });
    }),
  updateRecord: protectedProcedure
    .input(
      z.object({
        id: z.string(),
        date: z.string(),
        month: z.string(),
        value: z.string(),
        habitId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.record.update({
        where: {
          id: input.id,
        },
        data: {
          date: input.date,
          value: input.value,
          month: input.month,
          habitId: input.habitId,
        },
      });
    }),
  createRecord: protectedProcedure
    .input(
      z.object({
        date: z.string(),
        month: z.string(),
        value: z.string(),
        habitId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.record.create({
        data: {
          date: input.date,
          value: input.value,
          month: input.month,
          habitId: input.habitId,
        },
      });
    }),
});
