import { useSession } from "next-auth/react";
import Link from "next/link";
import { Suspense, ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className="">
      <nav className="border-b-2 border-white bg-blue-900 px-4">
        <ol className="mx-auto flex max-w-screen-2xl flex-row text-2xl uppercase text-blue-50">
          <li className="basis-1/4 py-5 pr-3">
            <Link href="/">Habit Tracker</Link>
          </li>
          <li className="flex basis-1/2 justify-center border-l-[0.5px] border-l-blue-700 py-5 px-3">
            <span className=" opacity-0">sosmed</span>
          </li>
          <li className="flex basis-1/2 justify-between border-l-[0.5px] border-l-blue-700 py-5 px-3">
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
      <p>Sign Out</p>
    </div>
  );
};

export default Layout;
