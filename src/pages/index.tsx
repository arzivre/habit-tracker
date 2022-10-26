import { DemoRecord } from "@prisma/client";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  parse,
  startOfToday,
} from "date-fns";
import { useState } from "react";
import { trpc } from "../utils/trpc";

function gridOfTheMonth() {
  const currentEndOfTheMonth = format(endOfMonth(new Date()), "d");
 if (currentEndOfTheMonth === "28") {
   return "grid-cols-28";
 }
 if (currentEndOfTheMonth === "29") {
   return "grid-cols-29";
 }
 if (currentEndOfTheMonth === "30") {
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
          <ol className={`grid ${gridOfTheMonth()}`}>
            {days.map((day) => (
              <li
                key={day.toString()}
                className={`${isToday(day) && "bg-gray-500"} mx-auto`}
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
            <HabitRecords key={id} habitId={id} month={currentMonth} />
          ))}
        </section>
      </article>
    </div>
  );
};

interface HabitRecordsProps {
  habitId: string;
  month: string;
}
const HabitRecords = ({ habitId, month }: HabitRecordsProps) => {
  const records = trpc.demo.getDemoRecords.useQuery({
    month,
    habitId,
  });

  const firstDayCurrentMonth = parse(month, "MMMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  // TODO:
  // create variable from loop a records data
  // compare withs days or filter
  // iif filter is true then render data
  // if filter false render skeleton
  // take the result to prints conditionaly

  // alternative
  // write for loop if data exist push data
  // if data not exist push skeleton
 
  const component = records.data?.map(({ id, value,date }: DemoRecord, index) => (
    <li key={id}>
      <p>{value === "1" ? "✔" : " "}</p>
      <p>
        {date.toString()}
      </p>
      <p>
        {index}
      </p>
    </li>
  ));

  if (records.data?.length === 0) {
    return (
      <ol className={`grid ${gridOfTheMonth()}`}>
        {days.map((day) => (
          <li key={day.toString()}>
            <p className="border">
              <div className="opacity-0">
                <time dateTime={format(day, "yyyy-MM-dd")}>
                  {format(day, "d")}
                </time>
              </div>
            </p>
          </li>
        ))}
      </ol>
    );
  }

  return <ol className={` flex border`}>{component}</ol>;
};

export default Home;
