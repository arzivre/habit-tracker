import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { Suspense, ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      <nav className="mx-auto max-w-screen-2xl bg-white">
        <ol className=" flex flex-row text-2xl uppercase text-black">
          <li className="basis-1/4 border-l-[0.5px] border-b-[0.5px] border-gray-300 py-5 pr-3 pl-4 font-bold">
            <Link href="/">Habit Tracker</Link>
          </li>
          <li className="flex basis-2/4 justify-center border-l-[0.5px] border-b-[0.5px] border-gray-300  py-5 px-3">
            <span className="opacity-0">sosmed</span>
          </li>
          <li className="flex basis-1/4 justify-between border-x-[0.5px] border-b-[0.5px] border-gray-300 py-5 pl-3 pr-4">
            <Suspense fallback={<p>Loading</p>}>
              <Avatar />
            </Suspense>
          </li>
        </ol>
      </nav>
      {children}
    </div>
  );
};

const Avatar = () => {
  const { data: sessionData } = useSession();
  if (!sessionData) {
    return <Link href="/signin">Sign In</Link>;
  }

  return (
    <div className="flex w-full justify-between">
      <p>
        <Link href="/profile">{sessionData?.user?.name}</Link>
      </p>
      <button onClick={() => signOut()}>
        <p>Sign Out</p>
      </button>
    </div>
  );
};

export default Layout;
