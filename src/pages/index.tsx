import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isToday,
  parse,
  startOfToday
} from "date-fns";
import { Suspense, useState } from "react";
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
interface newRecordProps {
  id: string;
  date: string;
  value: string;
  habitId: string;
}
const HabitRecords = ({ habitId, month }: HabitRecordsProps) => {
  const { data, isFetching } = trpc.demo.getDemoRecords.useQuery({
    month,
    habitId,
  });

  const firstDayCurrentMonth = parse(month, "MMMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  const newRecord: newRecordProps[] = [];
  for (let index = 0; index < days.length; index++) {
    const objIndex = data?.findIndex(
      (obj: { date: string }) => Number(obj.date) === index + 1
    );
    if (objIndex !== -1) {
      newRecord.push({
        id: data?.[objIndex as number]?.id as string,
        date: data?.[objIndex as number]?.date as string,
        value: data?.[objIndex as number]?.value as string,
        habitId,
      });
    } else {
      newRecord.push({
        id: `${index + 1}`,
        date: format(days[index] as Date, "d"),
        value: " ",
        habitId,
      });
    }
  }

  if (isFetching) {
    return <p>Loading...</p>;
  }

  if (data?.length === 0) {
    return (
      <ol className={`grid ${gridOfTheMonth()}`}>
        {days.map((day) => (
          <li key={day.toString()}>
            <div className="border">
              <p className="opacity-0">x</p>
            </div>
          </li>
        ))}
      </ol>
    );
  }

  const component = newRecord?.map(({ value }, index) => (
    <li key={index}>
      <p className="border-x">
        {value === "1" ? "✔" : <span className="opacity-0">x</span>}
      </p>
    </li>
  ));

  return (
    <ol className={`grid ${gridOfTheMonth()} border-y`}>
      <Suspense fallback={<p>Loading</p>}>{component}</Suspense>
    </ol>
  );
};

export default Home;
