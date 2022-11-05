import type { DemoHabit, DemoRecord } from "@prisma/client";
import {
  add,
  eachDayOfInterval,
  eachMonthOfInterval,
  endOfMonth,
  endOfYear,
  format,
  getMonth,
  isSunday,
  isToday,
  parse,
  startOfToday,
  startOfYear,
} from "date-fns";
import { Suspense, useState } from "react";
import { FullScreenLoader } from "../components/Loader";
import { bgColor, gridOfTheMonth } from "../utils/style";
import { trpc } from "../utils/trpc";

const Home = () => {
  const habits = trpc.demo.getHabits.useQuery();

  const today = startOfToday();

  const [currentMonth, setCurrentMonth] = useState(format(today, "MMMM-yyyy"));

  const firstDayCurrentMonth = parse(currentMonth, "MMMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMMM-yyyy"));
  }

  if (habits.isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="px-4">
      <header className="mt-4 mb-4 grid grid-cols-1">
        <h1 className="mb-4 flex items-start justify-start font-serif text-7xl uppercase">
          Habit Tracker
        </h1>
        <div className="grid grid-cols-[300px_auto]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center justify-center">
            <button onClick={previousMonth} className="pb-2 text-4xl font-bold">
              {"<"}
            </button>
            <p className="text-center text-2xl uppercase">
              {format(
                parse(currentMonth, "MMMM-yyyy", new Date()),
                "MMMM yyyy"
              )}
            </p>
            <button onClick={nextMonth} className="pb-2 text-4xl font-bold">
              {">"}
            </button>
          </div>
          <ol className="grid grid-cols-12 items-center justify-center">
            {eachMonthOfInterval({
              start: startOfYear(days[1] as Date),
              end: endOfYear(days[10] as Date),
            }).map((month, index) => (
              <li
                key={month.toString()}
                className={`${
                  getMonth(firstDayCurrentMonth) === index && "bg-orange-500"
                } border border-black pl-2 text-2xl uppercase`}
              >
                {format(month, "MMM")}
              </li>
            ))}
          </ol>
        </div>
      </header>
      <main className="grid grid-cols-[300px_auto] border-y border-black">
        <div className="flex items-center justify-start border-l border-black pl-2 align-middle">
          <h2 className="text-3xl uppercase">Habit</h2>
        </div>
        <section className="border-l border-black">
          <ol className={`grid ${gridOfTheMonth(currentMonth)} `}>
            {days.map((day) => (
              <li
                key={day.toString()}
                className={`${
                  isToday(day) && "bg-orange-500"
                } border-r border-black text-center uppercase`}
              >
                <div
                  className={`grid grid-cols-1 ${
                    isSunday(day) && "bg-rose-600"
                  }`}
                >
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "E").slice(0, 2)}
                  </time>
                  <time dateTime={format(day, "yyyy-MM-dd")}>
                    {format(day, "d")}
                  </time>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <article className=" ">
        <ul>
          {habits.data?.map(({ title, id }) => (
            <li key={id} className="w-full">
              <div className="grid grid-cols-[300px_auto]">
                <HabitTitle id={id}>{title}</HabitTitle>

                <section className="border-l border-black">
                  <HabitRecords
                    key={id}
                    demoHabitId={id}
                    month={currentMonth}
                    days={days}
                  />
                </section>
              </div>
            </li>
          ))}
          <AddHabit index={habits?.data?.length.toString() as string} />
        </ul>
      </article>
    </div>
  );
};

const HabitTitle = ({ children, id }: { children: string; id: string }) => {
  const utils = trpc.useContext();

  const deleteHabit = trpc.demo.deleteHabit.useMutation({
    async onMutate(deleteHabit) {
      await utils.demo.getHabits.cancel();

      const prevHabits = utils.demo.getHabits.getData();

      utils.demo.getHabits.setData(
        prevHabits?.filter((habit) => habit.id !== deleteHabit.id)
      );

      return { prevHabits };
    },
    onError(error, variables, context) {
      utils.demo.getHabits.setData(context?.prevHabits);
    },
    onSettled() {
      utils.demo.getHabits.invalidate();
    },
  });

  function handleDelete() {
    deleteHabit.mutate({ id });
  }

  return (
    <p className="flex justify-between border-b border-l border-black pl-2 font-semibold">
      {children}
      <span className="pr-1 text-red-500">
        <button onClick={handleDelete} disabled={deleteHabit.isLoading}>
          {deleteHabit.isLoading ? (
            "Loading"
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="h-4 w-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
              />
            </svg>
          )}
        </button>
      </span>
    </p>
  );
};

const AddHabit = ({ index }: { index: string }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");

  const utils = trpc.useContext();
  const createHabit = trpc.demo.createHabit.useMutation({
    async onMutate(newHabit) {
      await utils.demo.getHabits.cancel();

      const prevHabits = utils.demo.getHabits.getData();

      utils.demo.getHabits.setData([
        ...(prevHabits as DemoHabit[]),
        { id: index, ...newHabit },
      ]);

      return { prevHabits };
    },
    onError(error, variables, context) {
      utils.demo.getHabits.setData(context?.prevHabits);
    },
    onSettled() {
      utils.demo.getHabits.invalidate();
    },
  });

  function handleSubmit() {
    if (title === "") {
      return setShowForm(false);
    }
    createHabit.mutate({ title, filterId: index });
    setTitle("");
    setShowForm(false);
  }

  if (showForm) {
    return (
      <li>
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-[300px_auto]">
            <input
              type="text"
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              placeholder="Habit Title"
              className="border-b border-l border-black pl-2"
            />
            <button
              type="submit"
              className="w-full bg-green-300 uppercase
                 text-green-900 hover:bg-green-600 hover:text-green-100"
            >
              {createHabit.isLoading ? "Loading" : "Add New Habit"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="w-full bg-red-300 uppercase 
                text-red-900 hover:bg-red-600 hover:text-red-100"
            >
              Cancel
            </button>
          </div>
        </form>
      </li>
    );
  }

  return (
    <li>
      <div className="grid grid-cols-[300px_auto]">
        <button
          type="button"
          onClick={() => setShowForm(true)}
          className="flex justify-start border-l border-b border-black bg-green-400 pl-2"
        >
          <p>Add new Habit</p>
        </button>
        <section className="border-x border-b border-black"></section>
      </div>
    </li>
  );
};

interface HabitRecordsProps {
  demoHabitId: string;
  month: string;
  days: Date[];
}
const HabitRecords = ({ demoHabitId, month, days }: HabitRecordsProps) => {
  // Query and Mutation
  const utils = trpc.useContext();

  const { data: records, isFetching } = trpc.demo.getRecords.useQuery({
    month,
    demoHabitId,
  });

  const createRecord = trpc.demo.createRecord.useMutation({
    onSettled() {
      utils.demo.getRecords.invalidate({ month, demoHabitId });
    },
  });

  const updateRecord = trpc.demo.updateRecord.useMutation({
    onSettled() {
      utils.demo.getRecords.invalidate({ month, demoHabitId });
    },
  });

  // Creating new Data
  const newRecords: DemoRecord[] = [];
  for (let index = 0; index < days.length; index++) {
    const objIndex = records?.findIndex(
      (obj: { date: string }) => Number(obj.date) === index + 1
    );
    if (objIndex !== -1) {
      newRecords.push({
        id: records?.[objIndex as number]?.id as string,
        month,
        date: records?.[objIndex as number]?.date as string,
        value: records?.[objIndex as number]?.value as string,
        demoHabitId,
      });
    } else {
      newRecords.push({
        id: `${index + 1}`,
        month,
        date: format(days[index] as Date, "d"),
        value: "0",
        demoHabitId,
      });
    }
  }

  // Event action
  const handleClick = async (id: string, date: string, value: string) => {
    if (id.length > 4) {
      updateRecord.mutate({ id, month, demoHabitId, date, value });
    }
    createRecord.mutate({ month, demoHabitId, date, value });
  };

  function updateValues(value: string) {
    if (value === "1") return "0";
    return "1";
  }

  const component = newRecords?.map(({ id, value, date }, index) => (
    <li
      key={date}
      className={`${
        isToday(days?.[index] as Date) ? "bg-orange-500" : bgColor(index)
      } text-center hover:bg-blue-400`}
    >
      <button
        type="button"
        className="w-full border-b border-r border-black"
        onClick={() => handleClick(id, date, updateValues(value))}
        disabled={createRecord.isLoading || updateRecord.isLoading}
      >
        {value === "1" ? "⭐" : <span className="opacity-0">{date}</span>}
      </button>
    </li>
  ));

  // Loading State
  if (isFetching || createRecord.isLoading || updateRecord.isLoading) {
    return <Loading month={month} days={days} />;
  }

  // Empty array or no data from database
  if (records?.length === 0) {
    return <ol className={`grid ${gridOfTheMonth(month)} `}>{component}</ol>;
  }

  return (
    <Suspense fallback={<Loading month={month} days={days} />}>
      <ol className={`grid ${gridOfTheMonth(month)} `}>{component}</ol>
    </Suspense>
  );
};

interface LoadingProps {
  month: string;
  days: Date[];
}
const Loading = ({ month, days }: LoadingProps) => {
  return (
    <ol className={`grid ${gridOfTheMonth(month)}`}>
      {days.map((day, index) => (
        <li
          key={day.toString()}
          className={`${
            isToday(day) ? "bg-orange-500" : bgColor(index)
          } animate-pulse text-center hover:bg-blue-400`}
        >
          <button
            type="button"
            className="w-full border-b border-r border-black"
          >
            <span className="opacity-0">x</span>
          </button>
        </li>
      ))}
    </ol>
  );
};

export default Home;
