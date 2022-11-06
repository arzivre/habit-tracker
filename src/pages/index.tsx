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
import { gridOfTheMonth } from "../utils/style";
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

  function prevYear() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -12 });
    setCurrentMonth(format(firstDayNextMonth, "MMMM-yyyy"));
  }

  function nextYear() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 12 });
    setCurrentMonth(format(firstDayNextMonth, "MMMM-yyyy"));
  }

  function getNumberFromMnothlyDate(date: string) {
    return Number(format(parse(date, "MMMM-yyyy", new Date()), "M"));
  }

  function changeMonth(index: number) {
    let month: number;
    let firstDayNextMonth;
    if (
      index < Number(format(parse(currentMonth, "MMMM-yyyy", new Date()), "M"))
    ) {
      month = Math.abs(index - getNumberFromMnothlyDate(currentMonth)) * -1;
      firstDayNextMonth = add(firstDayCurrentMonth, { months: month });
    }
    month = index - getNumberFromMnothlyDate(currentMonth);
    firstDayNextMonth = add(firstDayCurrentMonth, { months: month });
    setCurrentMonth(format(firstDayNextMonth, "MMMM-yyyy"));
  }

  if (habits.isLoading) {
    return <FullScreenLoader />;
  }

  return (
    <div className="min-h-screen bg-[##fffffe] px-4">
      <header className="mb-4 grid grid-cols-1 pt-4">
        <h1
          className="mb-4 flex items-start justify-start font-serif text-7xl 
        uppercase text-[#272343]"
        >
          Habit Tracker
        </h1>
        <h2 className="text-5xl uppercase text-[#272343]">
          {format(parse(currentMonth, "MMMM-yyyy", new Date()), "MMMM yyyy")}
        </h2>
        <div className="grid grid-cols-[300px_auto] text-[#272343]">
          <div className="grid grid-cols-[1fr_auto_1fr] items-center justify-center">
            <button onClick={prevYear} className="pb-2 text-4xl font-bold">
              {"<"}
            </button>
            <p className="text-center text-3xl uppercase">
              {format(parse(currentMonth, "MMMM-yyyy", new Date()), "yyyy")}
            </p>
            <button onClick={nextYear} className="pb-2 text-4xl font-bold">
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
                className="text-2xl uppercase hover:bg-blue-300"
              >
                <button
                  onClick={() => changeMonth(index + 1)}
                  className={`block w-full pl-2 
                  ${
                    getMonth(firstDayCurrentMonth) === index && "bg-[#ffd803]"
                  } `}
                >
                  {format(month, "MMM")}
                </button>
              </li>
            ))}
          </ol>
        </div>
      </header>
      <main className="mb-4 grid grid-cols-[300px_auto] bg-[#272343]">
        <div className="flex items-center justify-start pl-2 align-middle">
          <h2 className="text-3xl uppercase text-[#fffffe]">Habit</h2>
        </div>
        <section className=" ">
          <ol className={`grid ${gridOfTheMonth(currentMonth)} `}>
            {days.map((day) => (
              <li
                key={day.toString()}
                className={`${
                  isToday(day) && "bg-[#ffd803]"
                } text-center uppercase`}
              >
                <div
                  className={`grid grid-cols-1 text-sm text-[#fffffe] ${
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
          {habits.data?.map((habit) => (
            <li key={habit.id} className="mb-2 w-full bg-[#e3f6f5] shadow">
              <div className="grid grid-cols-[300px_auto]">
                <HabitTitle {...habit} />

                <section>
                  <HabitRecords
                    days={days}
                    key={habit.id}
                    month={currentMonth}
                    demoHabitId={habit.id}
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

interface HabitTitleProps {
  id: string;
  title: string;
  filterId: string;
}
const HabitTitle = ({ title, id, filterId }: HabitTitleProps) => {
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState("");

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

  const updateHabit = trpc.demo.updateHabit.useMutation({
    async onMutate(updateHabit) {
      await utils.demo.getHabits.cancel();

      const prevHabits = utils.demo.getHabits.getData();

      utils.demo.getHabits.setData(
        prevHabits?.filter((habit) => {
          if (habit.id === updateHabit.id) {
            return updateHabit;
          }
          return habit;
        })
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

  function handleSubmit() {
    if (newTitle === "") {
      return setShowForm(false);
    }
    updateHabit.mutate({ id, title: newTitle, filterId });
    setNewTitle("");
    setShowForm(false);
  }

  if (showForm) {
    return (
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-[1fr_auto_auto] bg-white"
      >
        <input
          type="text"
          onChange={(e) => setNewTitle(e.target.value)}
          value={newTitle}
          placeholder="Habit Title"
          className="pl-2 focus:rounded-none"
        />

        <button
          type="submit"
          className="ml-2 w-full bg-green-400 font-bold uppercase
          text-green-900 hover:bg-green-600 hover:text-green-100"
        >
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
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </button>
        <button
          onClick={() => setShowForm(false)}
          className="bg-red-200 text-red-900"
        >
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </form>
    );
  }

  return (
    <div
      className="grid grid-cols-[1fr_auto_auto] justify-between pl-2 
    font-semibold hover:bg-[#bae8e8]"
    >
      <p className="text-[#272343] uppercase">{title}</p>
      <button
        onClick={() => setShowForm(true)}
        className="text-[#2d334a] hover:bg-green-100 hover:text-green-500"
      >
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
            d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
          />
        </svg>
      </button>
      <button
        onClick={handleDelete}
        disabled={deleteHabit.isLoading}
        className="text-[#2d334a] hover:bg-red-100 hover:text-red-600"
      >
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
    </div>
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
              className="pl-2 focus:rounded-none"
            />
            <button
              type="submit"
              className="ml-2 w-full bg-green-400 font-bold uppercase
                 text-green-900 hover:bg-green-600 hover:text-green-100"
            >
              {createHabit.isLoading ? "Loading" : "Add New Habit"}
            </button>
            <button
              type="button"
              onClick={() => setShowForm(false)}
              className="mt-2 w-full bg-red-400 font-bold uppercase 
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
          className="flex justify-start"
        >
          <p
            className="bg-green-400 w-full pl-2 font-bold uppercase text-green-900 
          hover:bg-green-600 hover:text-green-100"
          >
            Add new Habit
          </p>
        </button>
        <section className=" "></section>
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

  const { data: records } = trpc.demo.getRecords.useQuery({
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
        isToday(days?.[index] as Date) && "bg-[#ffd803]"
      } text-center hover:bg-blue-400`}
    >
      <button
        type="button"
        className="w-full "
        onClick={() => handleClick(id, date, updateValues(value))}
        disabled={createRecord.isLoading || updateRecord.isLoading}
      >
        {value === "1" ? "⭐" : <span className="opacity-0">{date}</span>}
      </button>
    </li>
  ));

  return (
    <Suspense fallback={<Loading month={month} days={days} />}>
      <ol className={`grid ${gridOfTheMonth(month)}`}>{component}</ol>
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
      {days.map((day) => (
        <li
          key={day.toString()}
          className={`${
            isToday(day) && "bg-[#ffd803]"
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
