import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format, isToday,
  parse, startOfToday
} from "date-fns";
import { useState } from "react";

const Home = () => {
  const today = startOfToday();
  const [selectedDay, setSelectedDay] = useState(today);
  const [currentMonth, setCurrentMonth] = useState(format(today, "MMM-yyyy"));

  const firstDayCurrentMonth = parse(currentMonth, "MMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function previousMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMM-yyyy"));
  }

  function valueEndofTheMonth() {
    if (format(endOfMonth(firstDayCurrentMonth), "d") === "28") {
      return "grid-cols-28";
    }
    if (format(endOfMonth(firstDayCurrentMonth), "d") === "29") {
      return "grid-cols-29";
    }
    if (format(endOfMonth(firstDayCurrentMonth), "d") === "30") {
      return "grid-cols-30";
    }
    return "grid-cols-31";
  }

  return (
    <div className="px-4">
      <header className="flex w-full justify-start">
        <h1 className="text-4xl">Habit Tracker</h1>
      </header>
      <main className="grid grid-cols-[300px_auto]">
        <section className="flex w-[20vw] items-center justify-start align-middle">
          <h2 className="text-3xl">Habits</h2>
        </section>
        <section>
          <div className="flex gap-8 font-semibold text-gray-900">
            <button onClick={previousMonth}>{"<"}</button>
            <div>
              <time>{format(firstDayCurrentMonth, "MMMM yyyy")}</time>
            </div>
            <button onClick={nextMonth}>{">"}</button>
          </div>
          <ol className={`grid ${valueEndofTheMonth()}`}>
            {days.map((day) => (
              <li
                key={day.toString()}
                className={`${isToday(day) && "bg-red-500"}`}
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
          <li>Morning Exercise</li>
          <li>Read a Book</li>
        </ul>
        <section>
          <ol className={`grid ${valueEndofTheMonth()}`}>
            {days.map((day) => (
              <li
                key={day.toString()}
                className={`${isToday(day) && "bg-red-500"}`}
              >
                <p>{format(day, "d")}</p>
              </li>
            ))}
          </ol>
          <ol className={`grid ${valueEndofTheMonth()}`}>
            {days.map((day) => (
              <li
                key={day.toString()}
                className={`${isToday(day) && "bg-red-500"}`}
              >
                <p>{format(day, "d")}</p>
              </li>
            ))}
          </ol>
        </section>
      </article>
    </div>
  );
};

export default Home;
