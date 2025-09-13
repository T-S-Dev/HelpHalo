"use client";

import Image from "next/image";
import Link from "next/link";
import { SignedIn, SignedOut, UserButton, SignInButton, SignUpButton } from "@clerk/nextjs";

const Header = () => {
  return (
    <header className="flex h-[8vh] justify-between border-b border-gray-400 p-3">
      <Link href="/" className="flex items-center gap-2 text-4xl font-thin">
        <Image src="https://unsplash.it/100/100" alt="" width={50} height={50} className="rounded-full" />
        <div>
          <h1>Help Halo</h1>
          <h2 className="text-sm">Customisable AI Support bot</h2>
        </div>
      </Link>

      <SignedIn>
        <UserButton />
      </SignedIn>

      <SignedOut>
        <div className="flex items-center gap-4">
          <SignInButton>
            <button className="cursor-pointer">Sign in</button>
          </SignInButton>
          <SignUpButton>
            <button className="cursor-pointer">Sign up</button>
          </SignUpButton>
        </div>
      </SignedOut>
    </header>
  );
};

export default Header;
