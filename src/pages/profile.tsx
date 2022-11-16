import { signIn, signOut, useSession } from "next-auth/react";
import { trpc } from "../utils/trpc";

const Profile = () => {
  const { data: sessionData } = useSession();

  const { data: secretMessage } = trpc.auth.getSecretMessage.useQuery(
    undefined, // no input
    { enabled: sessionData?.user !== undefined }
  );

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      {sessionData && (
        <div className="mx-auto flex flex-col justify-center text-2xl text-blue-500">
          <p>Name {sessionData?.user?.name}</p>
          <p>Id {sessionData?.user?.id}</p>
          <p>Email {sessionData?.user?.email}</p>
          <div>
            Image
            {sessionData?.user?.image}
            <picture>
              <img
                src={sessionData?.user?.image as string}
                alt={sessionData?.user?.name as string}
              />
            </picture>
          </div>
        </div>
      )}
      {secretMessage && (
        <p className="text-2xl text-blue-500">{secretMessage}</p>
      )}
      <button
        className="rounded-md border border-black bg-violet-50 px-4 py-2 text-xl shadow-lg hover:bg-violet-100"
        onClick={sessionData ? () => signOut() : () => signIn()}
      >
        {sessionData ? "Sign out" : "Sign in"}
      </button>
    </div>
  );
};

export default Profile;
