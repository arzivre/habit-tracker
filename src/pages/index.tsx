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

export interface DemoProps {
  id: string;
  name: string;
  habits: Habit[];
}

export interface Habit {
  id: string;
  habit: string;
  records: Record[];
}

export interface Record {
  date: string;
  values: string;
}

const DEMO: DemoProps = {
  id: "2022-10",
  name: "Demo",
  habits: [
    {
      id: "1",
      habit: "Make the Bed",
      records: [
        {
          date: "2022-10-1",
          values: "1",
        },
        {
          date: "2022-10-2",
          values: "0",
        },
        {
          date: "2022-10-3",
          values: "1",
        },
        {
          date: "2022-10-4",
          values: "0",
        },
        {
          date: "2022-10-5",
          values: "1",
        },
        {
          date: "2022-10-6",
          values: "1",
        },
        {
          date: "2022-10-7",
          values: "0",
        },
        {
          date: "2022-10-8",
          values: "1",
        },
        {
          date: "2022-10-9",
          values: "1",
        },
        {
          date: "2022-10-10",
          values: "",
        },
        {
          date: "2022-10-11",
          values: "1",
        },
        {
          date: "2022-10-12",
          values: "1",
        },
        {
          date: "2022-10-13",
          values: "",
        },
        {
          date: "2022-10-14",
          values: "1",
        },
        {
          date: "2022-10-15",
          values: "1",
        },
        {
          date: "2022-10-16",
          values: "1",
        },
        {
          date: "2022-10-17",
          values: "",
        },
        {
          date: "2022-10-18",
          values: "1",
        },
        {
          date: "2022-10-19",
          values: "1",
        },
        {
          date: "2022-10-20",
          values: "1",
        },
        {
          date: "2022-10-21",
          values: "1",
        },
        {
          date: "2022-10-22",
          values: "",
        },
        {
          date: "2022-10-23",
          values: "1",
        },
        {
          date: "2022-10-24",
          values: "1",
        },
      ],
    },
    {
      id: "2",
      habit: "Meditate",
      records: [
        {
          date: "2022-10-1",
          values: "1",
        },
        {
          date: "2022-10-2",
          values: "0",
        },
        {
          date: "2022-10-3",
          values: "1",
        },
        {
          date: "2022-10-4",
          values: "1",
        },
        {
          date: "2022-10-5",
          values: "1",
        },
        {
          date: "2022-10-6",
          values: "0",
        },
        {
          date: "2022-10-7",
          values: "0",
        },
        {
          date: "2022-10-8",
          values: "1",
        },
        {
          date: "2022-10-9",
          values: "1",
        },
        {
          date: "2022-10-10",
          values: "1",
        },
        {
          date: "2022-10-11",
          values: "0",
        },
        {
          date: "2022-10-12",
          values: "1",
        },
        {
          date: "2022-10-13",
          values: "1",
        },
        {
          date: "2022-10-14",
          values: "1",
        },
        {
          date: "2022-10-15",
          values: "1",
        },
        {
          date: "2022-10-16",
          values: "1",
        },
        {
          date: "2022-10-17",
          values: "1",
        },
        {
          date: "2022-10-18",
          values: "1",
        },
        {
          date: "2022-10-19",
          values: "1",
        },
        {
          date: "2022-10-20",
          values: "1",
        },
        {
          date: "2022-10-21",
          values: "1",
        },
        {
          date: "2022-10-22",
          values: "1",
        },
        {
          date: "2022-10-23",
          values: "1",
        },
        {
          date: "2022-10-24",
          values: "1",
        },
      ],
    },
    {
      id: "3",
      habit: "Morning Exercise",
      records: [
        {
          date: "2022-10-1",
          values: "1",
        },
        {
          date: "2022-10-2",
          values: "0",
        },
        {
          date: "2022-10-3",
          values: "1",
        },
        {
          date: "2022-10-4",
          values: "1",
        },
        {
          date: "2022-10-5",
          values: "1",
        },
        {
          date: "2022-10-6",
          values: "1",
        },
        {
          date: "2022-10-7",
          values: "0",
        },
        {
          date: "2022-10-8",
          values: "1",
        },
        {
          date: "2022-10-9",
          values: "1",
        },
        {
          date: "2022-10-10",
          values: "1",
        },
        {
          date: "2022-10-11",
          values: "1",
        },
        {
          date: "2022-10-12",
          values: "1",
        },
        {
          date: "2022-10-13",
          values: "1",
        },
        {
          date: "2022-10-14",
          values: "1",
        },
        {
          date: "2022-10-15",
          values: "1",
        },
        {
          date: "2022-10-16",
          values: "1",
        },
        {
          date: "2022-10-17",
          values: "1",
        },
        {
          date: "2022-10-18",
          values: "1",
        },
        {
          date: "2022-10-19",
          values: "1",
        },
        {
          date: "2022-10-20",
          values: "1",
        },
        {
          date: "2022-10-21",
          values: "1",
        },
        {
          date: "2022-10-22",
          values: "1",
        },
        {
          date: "2022-10-23",
          values: "1",
        },
        {
          date: "2022-10-24",
          values: "1",
        },
      ],
    },
    {
      id: "4",
      habit: "Read a Book",
      records: [
        {
          date: "2022-10-1",
          values: "1",
        },
        {
          date: "2022-10-2",
          values: "0",
        },
        {
          date: "2022-10-3",
          values: "1",
        },
        {
          date: "2022-10-4",
          values: "1",
        },
        {
          date: "2022-10-5",
          values: "1",
        },
        {
          date: "2022-10-6",
          values: "1",
        },
        {
          date: "2022-10-7",
          values: "0",
        },
        {
          date: "2022-10-8",
          values: "1",
        },
        {
          date: "2022-10-9",
          values: "1",
        },
        {
          date: "2022-10-10",
          values: "1",
        },
        {
          date: "2022-10-11",
          values: "1",
        },
        {
          date: "2022-10-12",
          values: "1",
        },
        {
          date: "2022-10-13",
          values: "1",
        },
        {
          date: "2022-10-14",
          values: "1",
        },
        {
          date: "2022-10-15",
          values: "1",
        },
        {
          date: "2022-10-16",
          values: "1",
        },
        {
          date: "2022-10-17",
          values: "1",
        },
        {
          date: "2022-10-18",
          values: "1",
        },
        {
          date: "2022-10-19",
          values: "1",
        },
        {
          date: "2022-10-20",
          values: "1",
        },
        {
          date: "2022-10-21",
          values: "1",
        },
        {
          date: "2022-10-22",
          values: "1",
        },
        {
          date: "2022-10-23",
          values: "1",
        },
        {
          date: "2022-10-24",
          values: "1",
        },
      ],
    },
  ],
};

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

  function gridOfTheMonth() {
    const currentEndOfTheMonth = format(endOfMonth(firstDayCurrentMonth), "d");

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

  return (
    <div className="px-4">
      <header className="flex w-full justify-start">
        <h1 className="text-4xl">Habit Tracker</h1>
      </header>

      <main className="grid grid-cols-[300px_auto] border-b-2 border-b-black">
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
          {DEMO.habits.map(({ habit }) => (
            <li key={habit}>{habit}</li>
          ))}
        </ul>
        <section>
          {DEMO.habits.map((habit, index) => (
            <ol key={habit.id} className={`grid ${gridOfTheMonth()}`}>
              {DEMO.habits[index]?.records.map(({ date, values }) => (
                <li key={date.toString()} className={`mx-auto`}>
                  <p>{values === "1" ? "✔" : " "}</p>
                </li>
              ))}
            </ol>
          ))}
        </section>
      </article>
    </div>
  );
};

export default Home;
