import { z } from "zod";
import { publicProcedure, router } from "../trpc";

export const demoRouter = router({
  getHabits: publicProcedure.query(async ({ ctx }) => {
    return ctx.prisma.demoHabit.findMany();
  }),
  createHabit: publicProcedure
    .input(
      z.object({
        title: z.string(),
        filterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.demoHabit.create({
        data: {
          title: input.title,
          filterId: input.filterId,
        },
      });
    }),
  updateHabit: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string(),
        filterId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.demoHabit.update({
        where: {
          id: input.id,
        },
        data: {
          title: input.title,
          filterId: input.filterId,
        },
      });
    }),
  deleteHabit: publicProcedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.demoHabit.delete({
        where: {
          id: input.id,
        },
      });
    }),
  getRecords: publicProcedure
    .input(
      z.object({
        month: z.string(),
        habitId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      return ctx.prisma.demoRecord.findMany({
        where: {
          month: input.month,
          demoHabitId: input.habitId,
        },
      });
    }),
  createRecord: publicProcedure
    .input(
      z.object({
        date: z.string(),
        month: z.string(),
        value: z.string(),
        habitId: z.string(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.prisma.demoRecord.create({
        data: {
          demoHabitId: input.habitId,
          month: input.month,
          date: input.date,
          value: input.value,
        },
      });
    }),
  updateRecord: publicProcedure
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
      return ctx.prisma.demoRecord.update({
        where: {
          id: input.id,
        },
        data: {
          demoHabitId: input.habitId,
          month: input.month,
          date: input.date,
          value: input.value,
        },
      });
    }),
});
