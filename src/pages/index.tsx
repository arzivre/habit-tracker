import type { DemoRecord } from "@prisma/client";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  parse,
  startOfToday,
} from "date-fns";
import { Suspense, useState } from "react";
import { trpc } from "../utils/trpc";

function gridOfTheMonth(month: string) {
  const currentMonth = endOfMonth(
    parse(month, "MMMM-yyyy", new Date())
  ).toString();

  if (currentMonth === "28") {
    return "grid-cols-28";
  }
  if (currentMonth === "29") {
    return "grid-cols-29";
  }
  if (currentMonth === "30") {
    return "grid-cols-30";
  }
  return "grid-cols-31";
}

const Home = () => {
  const today = startOfToday();
  const habits = trpc.demo.getDemoHabits.useQuery();

  // const [selectedDay, setSelectedDay] = useState(today);
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

  return (
    <div className="px-4">
      <header className="flex w-full justify-start">
        <h1 className="text-4xl">Habit Tracker</h1>
      </header>
      <main className="grid grid-cols-[300px_auto] border-b-2 border-b-black">
        <div className="flex w-[20vw] items-center justify-start align-middle">
          <h2 className="text-3xl">Habits</h2>
        </div>
        <section>
          <div className="flex gap-8 font-semibold text-gray-900">
            <button onClick={previousMonth}>{"<"}</button>
            <div>
              <time>{format(firstDayCurrentMonth, "MMMM yyyy")}</time>
            </div>
            <button onClick={nextMonth}>{">"}</button>
          </div>
          <ol className={`grid ${gridOfTheMonth(currentMonth)}`}>
            {days.map((day) => (
              <li
                key={day.toString()}
                className={`${isToday(day) && "bg-gray-500"} m-0.5 text-center`}
              >
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </li>
            ))}
          </ol>
        </section>
      </main>
      <article className="grid grid-cols-[300px_auto]">
        <ul className="">
          {habits.data?.map(({ title, id }) => (
            <li key={id}>{title}</li>
          ))}
        </ul>
        <section>
          {habits.data?.map(({ id }) => (
            <HabitRecords
              key={id}
              habitId={id}
              month={currentMonth}
              days={days}
            />
          ))}
        </section>
      </article>
    </div>
  );
};

interface HabitRecordsProps {
  habitId: string;
  month: string;
  days: Date[];
}
const HabitRecords = ({ habitId, month, days }: HabitRecordsProps) => {
  // Query and Mutation
  const utils = trpc.useContext();
  const { data: records, isFetching } = trpc.demo.getDemoRecords.useQuery({
    month,
    habitId,
  });
  const createRecord = trpc.demo.createDemoRecord.useMutation({
    onSuccess() {
      utils.demo.getDemoRecords.invalidate({ month, habitId });
    },
  });
  const updateRecord = trpc.demo.updateDemoRecord.useMutation({
    onSuccess() {
      utils.demo.getDemoRecords.invalidate({ month, habitId });
    },
  });

  // Event action
  const handleClick = async (id: string, date: string, value: string) => {
    if (id.length > 4) {
      updateRecord.mutate({ id, month, habitId, date, value });
      console.log({ id, month, habitId, date, value });
    }
    createRecord.mutate({ month, habitId, date, value });
  };

  // Creating new Data
  const newRecord: DemoRecord[] = [];
  for (let index = 0; index < days.length; index++) {
    const objIndex = records?.findIndex(
      (obj: { date: string }) => Number(obj.date) === index + 1
    );
    if (objIndex !== -1) {
      newRecord.push({
        id: records?.[objIndex as number]?.id as string,
        month,
        date: records?.[objIndex as number]?.date as string,
        value: records?.[objIndex as number]?.value as string,
        demoHabitId: habitId,
      });
    } else {
      newRecord.push({
        id: `${index + 1}`,
        month,
        date: format(days[index] as Date, "d"),
        value: "0",
        demoHabitId: habitId,
      });
    }
  }

  // Loading State
  if (isFetching || createRecord.isLoading || updateRecord.isLoading) {
    return (
      <ol className={`grid ${gridOfTheMonth(month)}`}>
        {days.map((day) => (
          <li
            key={day.toString()}
            className={`${
              isToday(day) && "bg-gray-500"
            } animate-pulse border text-center hover:bg-blue-400`}
          >
            <button type="button" className="w-full">
              <span className="opacity-0">x</span>
            </button>
          </li>
        ))}
      </ol>
    );
  }

  // Empty array from database
  if (records?.length === 0) {
    return (
      <ol className={`grid ${gridOfTheMonth(month)}`}>
        {days.map((day, index) => (
          <li
            key={day.toString()}
            className={`${
              isToday(day) && "bg-gray-500"
            } border text-center hover:bg-blue-400`}
          >
            <button
              type="button"
              className="w-full"
              onClick={() =>
                handleClick(index.toString(), format(day as Date, "d"), "1")
              }
              disabled={createRecord.isLoading || updateRecord.isLoading}
            >
              <span className="opacity-0">{format(day as Date, "d")}</span>
            </button>
          </li>
        ))}
      </ol>
    );
  }

  function updateValues(value: string) {
    if (value === "1") return "0";
    return "1";
  }

  const component = newRecord?.map(({ id, value, date }, index) => (
    <li
      key={date}
      className={`${
        isToday(days?.[index] as Date) && "bg-gray-500"
      } border text-center hover:bg-blue-400`}
    >
      <button
        type="button"
        className="w-full"
        onClick={() => handleClick(id, date, updateValues(value))}
        disabled={createRecord.isLoading || updateRecord.isLoading}
      >
        {value === "1" ? "✔" : <span className="opacity-0">{date}</span>}
      </button>
    </li>
  ));

  return (
    <ol className={`grid ${gridOfTheMonth(month)} `}>
      <Suspense fallback={<p>Loading</p>}>{component}</Suspense>
    </ol>
  );
};

export default Home;
