import type { Habit, Record } from "@prisma/client";
import {
  add,
  eachDayOfInterval,
  endOfMonth,
  format,
  isSunday,
  isToday,
  parse,
  startOfToday
} from "date-fns";
import { useSession } from "next-auth/react";
import Head from "next/head";
import { useState } from "react";
import { FullScreenLoader } from "../../components/Loader";
import { gridOfTheMonth } from "../../utils/style";
import { trpc } from "../../utils/trpc";

const HabitTracker = () => {
  const { data: sessionData, status } = useSession();

  const habits = trpc.habits.getAll.useQuery(
    { userId: sessionData?.user?.id as string },
    { enabled: sessionData?.user !== undefined }
  );

  const today = startOfToday();

  const [currentMonth, setCurrentMonth] = useState(format(today, "MMMM-yyyy"));

  const firstDayCurrentMonth = parse(currentMonth, "MMMM-yyyy", new Date());

  const days = eachDayOfInterval({
    start: firstDayCurrentMonth,
    end: endOfMonth(firstDayCurrentMonth),
  });

  function prevMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: -1 });
    setCurrentMonth(format(firstDayNextMonth, "MMMM-yyyy"));
  }

  function nextMonth() {
    const firstDayNextMonth = add(firstDayCurrentMonth, { months: 1 });
    setCurrentMonth(format(firstDayNextMonth, "MMMM-yyyy"));
  }

  if (status === "unauthenticated") {
    return <p>Access Denied</p>;
  }

  if (habits.isLoading || status === "loading") {
    return <FullScreenLoader />;
  }

  return (
    <>
      <Head>
        <title>Habit Tracker</title>
        <meta
          name="description"
          content="Open source habit tracker app that helps you to build good habits, reach your goals."
        />
        <meta name="keywords" content="habit, habit-tracker" />
      </Head>

      <div className="min-h-screen bg-[##fffffe]">
        <header className="mb-4 flex flex-row pt-4">
          <section className="flex basis-3/4 flex-row">
            <h1 className=" pl-4 text-3xl font-bold uppercase text-black">
              {format(firstDayCurrentMonth, "MMMM")}
            </h1>
            <p className=" mx-2 text-3xl font-bold uppercase  text-[#272343] ">
              /
            </p>
            <p className=" text-2xl font-bold uppercase text-gray-500">
              {format(firstDayCurrentMonth, "yyyy")}
            </p>
          </section>
          <div className="flex basis-1/4 gap-4 px-4 text-gray-600">
            <div
              className="grid w-full grid-cols-[1fr_1fr] items-center
             justify-center rounded"
            >
              <button onClick={prevMonth} className="pb-2 text-3xl font-bold">
                {"<"}
              </button>
              <button onClick={nextMonth} className="pb-2 text-3xl font-bold">
                {">"}
              </button>
            </div>
          </div>
        </header>
        <main className="flex w-full flex-row bg-black py-0.5 text-white">
          <div className="flex basis-1/4 items-center justify-start pl-4 align-middle">
            <h2 className="text-3xl uppercase ">Habit</h2>
          </div>
          <section className="basis-3/4">
            <ol className={`grid ${gridOfTheMonth(currentMonth)} `}>
              {days.map((day) => (
                <li
                  key={day.toString()}
                  className={`${
                    isToday(day) && "bg-[#ffd803] text-black"
                  } text-center font-semibold uppercase`}
                >
                  <div
                    className={`grid grid-cols-1 text-sm ${
                      isSunday(day) ? "text-rose-600" : ""
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
        <article>
          <ul>
            {habits.data?.map((habit) => (
              <li
                key={habit.id}
                className="w-full border-b-[0.5px] border-gray-300"
              >
                <div className="flex flex-row">
                  <HabitTitle {...habit} />

                  <section className="flex-grow">
                    <HabitRecords
                      days={days}
                      key={habit.id}
                      month={currentMonth}
                      habitId={habit.id}
                    />
                  </section>
                </div>
              </li>
            ))}
            <AddHabit
              index={habits?.data?.length.toString() as string}
              userId={sessionData?.user?.id as string}
            />
          </ul>
        </article>
      </div>
      <p className="my-6 text-center text-[#272343] hover:text-blue-600">
        <a
          href="https://github.com/arzivre/habit-tracker"
          target="_blank"
          rel="noopener noreferrer"
        >
          This App is open source on GitHub
        </a>
      </p>
    </>
  );
};

const HabitTitle = ({ id, title, filterId, userId }: Habit) => {
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState(title ?? "");

  const utils = trpc.useContext();
  const deleteHabit = trpc.habits.delete.useMutation({
    onSettled() {
      utils.habits.getAll.invalidate();
    },
  });

  const updateHabit = trpc.habits.update.useMutation({
    onSettled() {
      utils.habits.getAll.invalidate();
    },
  });

  function handleDelete() {
    deleteHabit.mutate({ id });
  }

  function handleSubmit() {
    if (newTitle === "") {
      return setShowForm(false);
    }
    updateHabit.mutate({
      id,
      filterId,
      title: newTitle,
      userId: userId as string,
    });
    setNewTitle("");
    setShowForm(false);
  }

  if (showForm) {
    return (
      <form
        onSubmit={handleSubmit}
        className="grid basis-1/4 grid-cols-[1fr_auto_auto] justify-between pl-4 
        font-semibold hover:bg-[#bae8e8]"
      >
        <input
          type="text"
          onChange={(e) => setNewTitle(e.target.value)}
          value={newTitle}
          placeholder="Habit Title"
          className="pl-4 focus:rounded-none"
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
      className="grid basis-1/4 grid-cols-[1fr_auto_auto] justify-between pl-4 
    font-semibold hover:bg-[#bae8e8] border-r"
    >
      <p className="text-[#272343]">{title}</p>
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

const AddHabit = ({ index, userId }: { index: string; userId: string }) => {
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");

  const utils = trpc.useContext();
  const createHabit = trpc.habits.create.useMutation({
    onSettled() {
      utils.habits.getAll.invalidate();
    },
  });

  function handleSubmit() {
    if (title === "") {
      return setShowForm(false);
    }
    createHabit.mutate({ title, userId, filterId: index });
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
              className="pl-4 focus:rounded-none"
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
            className="w-full bg-green-400 pl-2 font-bold uppercase text-green-900 
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
  habitId: string;
  month: string;
  days: Date[];
}
const HabitRecords = ({ habitId, month, days }: HabitRecordsProps) => {
  // Query and Mutation
  const utils = trpc.useContext();

  const { data: records } = trpc.habits.getRecords.useQuery({
    month,
    habitId,
  });

  const createRecord = trpc.habits.createRecord.useMutation({
    onSettled() {
      utils.habits.getRecords.invalidate({ month, habitId });
    },
  });

  const updateRecord = trpc.habits.updateRecord.useMutation({
    onSettled() {
      utils.habits.getRecords.invalidate({ month, habitId });
    },
  });

  // Creating new Data
  const newRecords: Record[] = [];

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
        habitId,
      });
    } else {
      newRecords.push({
        id: `${index + 1}`,
        month,
        date: format(days[index] as Date, "d"),
        value: "0",
        habitId,
      });
    }
  }

  // Event action
  const handleClick = async (id: string, date: string, value: string) => {
    if (id.length > 4) {
      updateRecord.mutate({ id, month, habitId, date, value });
    }
    createRecord.mutate({ month, habitId, date, value });
  };

  function updateValues(value: string) {
    if (value === "1") return "0";
    return "1";
  }

  const component = newRecords?.map(({ id, value, date }, index) => (
    <li
      key={date}
      className={`${
        isToday(days?.[index] as Date) && "bg-yellow-200"
      } border-r-[0.5px] border-gray-200 text-center hover:bg-blue-400`}
    >
      <button
        type="button"
        className="w-full"
        onClick={() => handleClick(id, date, updateValues(value))}
        disabled={createRecord.isLoading || updateRecord.isLoading}
      >
        {value === "1" ? "⭐" : <span className="opacity-0">{date}</span>}
      </button>
    </li>
  ));

  return <ol className={`grid ${gridOfTheMonth(month)}`}>{component}</ol>;
};

export default HabitTracker;
