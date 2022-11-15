import Link from "next/link";
import { ReactNode } from "react";

const Layout = ({ children }: { children: ReactNode }) => {
  return (
    <div className=" ">
      <section className="border-b-2 border-white bg-blue-900 px-4">
        <nav className="mx-auto flex max-w-screen-2xl flex-row text-2xl uppercase text-blue-50">
          <div className="basis-1/3 py-5 pr-3">
            <Link href="/">Habit Tracker</Link>
          </div>
          <div className="basis-1/3 border-l-[0.5px] border-l-blue-700 py-5 px-3">
            sosmed
          </div>
          <div className="basis-1/3 border-l-[0.5px] border-l-blue-700 py-5 px-3">
            <Link href="/signin">Sign In</Link>
          </div>
        </nav>
      </section>
      {children}
    </div>
  );
};

export default Layout;
