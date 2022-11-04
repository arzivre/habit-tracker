import type { DemoRecord } from "@prisma/client";
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
                <p className="border-b border-l border-black pl-2 font-semibold">
                  {title}
                </p>

                <section className="border-l border-black">
                  <HabitRecords
                    key={id}
                    habitId={id}
                    month={currentMonth}
                    days={days}
                  />
                </section>
              </div>
            </li>
          ))}

          {/* <li>
            <div className="grid grid-cols-[300px_auto]">
              <button className="flex justify-start border-l border-b border-black bg-green-400 pl-2">
                <p>Add new Habit</p>
              </button>
              <section className="border-x border-b border-black"></section>
            </div>
          </li> */}
        </ul>
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
  const { data: records, isFetching } = trpc.demo.getRecords.useQuery({
    month,
    habitId,
  });
  const createRecord = trpc.demo.createRecord.useMutation({
    onSuccess() {
      utils.demo.getRecords.invalidate({ month, habitId });
    },
  });
  const updateRecord = trpc.demo.updateRecord.useMutation({
    onSuccess() {
      utils.demo.getRecords.invalidate({ month, habitId });
    },
  });

  // Event action
  const handleClick = async (id: string, date: string, value: string) => {
    if (id.length > 4) {
      updateRecord.mutate({ id, month, habitId, date, value });
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

  function updateValues(value: string) {
    if (value === "1") return "0";
    return "1";
  }

  // Loading State
  if (isFetching || createRecord.isLoading || updateRecord.isLoading) {
    return <Loading month={month} days={days} />;
  }

  // Empty array or no data from database
  if (records?.length === 0) {
    return <Loading month={month} days={days} />;
  }

  const component = newRecord?.map(({ id, value, date }, index) => (
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
          } text-center hover:bg-blue-400`}
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

function bgColor(index: number) {
  const color = [
    "bg-[#002f61]",
    "bg-[#003969]",
    "bg-[#004371]",
    "bg-[#004d78]",
    "bg-[#00567f]",
    "bg-[#005f85]",
    "bg-[#00688b]",
    "bg-[#00718f]",
    "bg-[#007a93]",
    "bg-[#008396]",
    "bg-[#008b98]",
    "bg-[#00949a]",
    "bg-[#009c9b]",
    "bg-[#00a49c]",
    "bg-[#00ad9b]",
    "bg-[#00b599]",
    "bg-[#00bd97]",
    "bg-[#00c593]",
    "bg-[#00cd8e]",
    "bg-[#01d589]",
    "bg-[#18dc82]",
    "bg-[#2ee379]",
    "bg-[#4ee870]",
    "bg-[#69ed68]",
    "bg-[#81f15e]",
    "bg-[#97f554]",
    "bg-[#adf849]",
    "bg-[#c2fa3d]",
    "bg-[#d6fc30]",
    "bg-[#ebfe1f]",
    "bg-[#ffff00]",
  ];

  return color[index];
}

export default Home;
