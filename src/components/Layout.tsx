import { Session } from "next-auth";
import { useSession, signOut, signIn } from "next-auth/react";
import Link from "next/link";
import { Suspense, ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  const { data: sessionData } = useSession();

  return (
    <div className="">
      <nav className="mx-auto max-w-screen-2xl bg-white">
        <ol className=" flex flex-row uppercase text-black">
          <li className="basis-1/4  border-l-[0.5px] border-b-[0.5px] border-gray-300 py-5 pr-3 pl-4 text-2xl font-bold">
            <Link href="/">Improve Eveyday</Link>
          </li>
          <li className="flex basis-2/4 items-center justify-center border-l-[0.5px] border-b-[0.5px] border-gray-300  py-5 px-3">
            <Suspense fallback={<p className="opacity-0">Loading</p>}>
              <NavMenu sessionData={sessionData as Session} />
            </Suspense>
          </li>
          <li className="flex basis-1/4 justify-between border-x-[0.5px] border-b-[0.5px] border-gray-300 py-5 pl-3 pr-4">
            <Suspense fallback={<p>Loading</p>}>
              <Avatar sessionData={sessionData as Session} />
            </Suspense>
          </li>
        </ol>
      </nav>
      {children}
    </div>
  );
};

const NavMenu = ({ sessionData }: { sessionData?: Session }) => {
  if (!sessionData) {
    return <span className="opacity-0">NavMenu</span>;
  }

  return (
    <div>
      <Link href="/habit-tracker">Habit Tracker</Link>
    </div>
  );
};

const Avatar = ({ sessionData }: { sessionData?: Session }) => {
  if (!sessionData) {
    return (
      <button
        onClick={() => signIn()}
        className="rounded bg-green-100 px-2 py-0.5 hover:bg-green-300"
      >
        <p className="text-green-600 hover:text-green-900">Sign In</p>
      </button>
    );
  }

  return (
    <div className="flex w-full justify-between">
      <Link href="/profile">
        <div className="flex items-center gap-2 whitespace-nowrap">
          <picture>
            <img
              src={sessionData?.user?.image as string}
              alt={sessionData?.user?.name as string}
              className="h-10 w-10 rounded-full"
            />
          </picture>
          <p>{sessionData?.user?.name}</p>
        </div>
      </Link>
      <button
        onClick={() => signOut()}
        className="rounded bg-rose-50 px-2 py-0.5"
      >
        <p className="text-rose-600">Sign Out</p>
      </button>
    </div>
  );
};

export default Layout;
