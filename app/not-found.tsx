"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function NotFoundPage() {
  const router = useRouter();
  const { data: session } = useSession();

  const handleRedirect = () => {
    if (session) {
      router.push("/");
    } else {
      router.push("/sign-in");
    }
  };

  return (
    <div
      className="flex min-h-screen flex-col items-center justify-center bg-white
      text-center p-6 !text-black"
    >
      <div className="w-full max-w-2xl">
        <Image
          src="/images/404-d.png"
          alt="404 Not Found"
          width={900}
          height={600}
          priority
          className="mx-auto mb-8"
        />
      </div>

      <h1 className="text-5xl font-extrabold">
        Oops... You’ve wandered into the void!
      </h1>

      {session ? (
        <>
          <p className="mt-3 text-lg opacity-80">
            The page you’re looking for doesn’t exist. Maybe it{" "}
            <strong>segfaulted</strong>, or it’s{" "}
            <strong>hiding in the cache</strong>?
          </p>
          <p className="mt-1 text-md opacity-60">
            (Or maybe you just <strong>misspelled the URL</strong>. We won’t
            judge 😆)
          </p>
        </>
      ) : (
        <>
          <p className="mt-3 text-lg opacity-80">
            Looks like you’re not signed in. Some pages are only visible to
            members.
          </p>
          <p className="mt-1 text-md opacity-60">
            Sign in to explore all the cool stuff we’ve built just for you! 🚀
          </p>
        </>
      )}

      <button
        onClick={handleRedirect}
        className="mt-8 px-6 py-3 primary-gradient2 font-extrabold text-white rounded-lg shadow-lg hover:scale-105 transition"
      >
        {session ? "Take me home →" : "Sign in to explore →"}
      </button>

      <p className="mt-4 text-sm opacity-70">
        If you’re stuck here forever, at least bring snacks. 🍕
      </p>
    </div>
  );
}
