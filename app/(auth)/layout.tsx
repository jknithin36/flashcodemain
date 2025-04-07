"use client";

import Image from "next/image";
import React, { ReactNode } from "react";
import { usePathname } from "next/navigation";
import SocialAuthForm from "@/components/forms/SocialAuthForm";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const isSignIn = pathname.includes("sign-in");

  return (
    <main className="flex min-h-screen">
      {/* Left Side - Auth Form */}
      <div className="w-full md:w-1/2 bg-black text-white flex flex-col justify-center items-center px-8 py-12 space-y-6">
        {/* Logo */}
        <div className="flex items-center space-x-2 mb-4">
          <Image src="/flash_logo.png" alt="Logo" width={28} height={28} />
          <span className="text-lg font-semibold">FlashCode</span>
        </div>

        {/* Heading */}
        <div className="w-full max-w-sm space-y-2">
          <h2 className="text-2xl font-bold">
            {isSignIn ? "Sign in to your account" : "Sign up for an account"}
          </h2>
        </div>

        {/* Form Fields */}
        <div className="w-full max-w-sm space-y-6">
          {children}

          <div className="text-sm text-muted-foreground text-center">
            {isSignIn ? (
              <>
                Don&apos;t have an account?{" "}
                <a href="/sign-up" className="underline">
                  Sign up
                </a>
              </>
            ) : (
              <>
                Already have an account?{" "}
                <a href="/sign-in" className="underline">
                  Sign in
                </a>
              </>
            )}
          </div>

          {/* <div className="flex items-center justify-center space-x-1">
            <div className="h-px bg-gray-600 w-full" />
            <span className="text-xs text-gray-400">Or continue with</span>
            <div className="h-px bg-gray-600 w-full" />
          </div> */}
          <div className="flex items-center w-full space-x-4">
            <div className="h-px bg-gray-600 w-full" />
            <span className="whitespace-nowrap text-xs text-gray-400">
              Or continue with
            </span>
            <div className="h-px bg-gray-600 w-full" />
          </div>

          <SocialAuthForm />

          <p className="text-xs text-muted-foreground text-center">
            All rights reserved and{" "}
            <a href="/" className="underline">
              Flashcode{" "}
            </a>
            .
          </p>
        </div>
      </div>

      {/* Right Side - Testimonial Section */}
      <div className="hidden md:flex w-1/2 bg-neutral-950 text-white items-center justify-center p-10">
        <div className="text-center space-y-4 max-w-sm">
          <div className="flex justify-center -space-x-2">
            {Array.from({ length: 6 }).map((_, idx) => (
              <Image
                key={idx}
                src={`https://i.pravatar.cc/40?img=${idx + 1}`}
                width={40}
                height={40}
                alt="user"
                className="rounded-full border-2 border-neutral-800"
              />
            ))}
          </div>
          <h3 className="text-lg font-semibold">Flashes love us</h3>
          <p className="text-sm text-gray-400">
            loved by thousands of developers across the kent State univeristy.
            Be part of the community and join us.
          </p>
        </div>
      </div>
    </main>
  );
}
