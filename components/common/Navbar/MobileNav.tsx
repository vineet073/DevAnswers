"use client";

import { sidebarLinks } from "@/constants";
import { usePathname } from "next/navigation";
import React from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import Link from "next/link";
import Image from "next/image";
import { SignedOut } from "@clerk/nextjs";
import { Button } from "../../ui/button";

function NavContent() {
  const pathName = usePathname();

  return (
    <section className="flex h-full flex-col gap-6 pt-16">
      {sidebarLinks.map((item) => {
        const isActive =
          (pathName.includes(item.route) && item.route.length > 1) ||
          pathName === item.route;
        return (
          <SheetClose key={item.label} asChild>
            <Link
              href={item.route}
              className={`${
                isActive ? "primary-gradient rounded-lg" : ""
              } text-dark300_light900 flex items-center justify-start gap-4 bg-transparent p-4`}
            >
              <Image
                src={item.imgURL}
                alt={item.label}
                width={20}
                height={20}
                className="invert dark:invert-0"
              />

              <p className={`${isActive ? "base-bold" : "base-medium"}`}>
                {item.label}
              </p>
            </Link>
          </SheetClose>
        );
      })}
    </section>
  );
}

const MobileNav = () => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Image
          src="/assets/icons/hamburger.svg"
          width={36}
          height={36}
          alt="Menu"
          className="invert-colors sm:hidden"
        />
      </SheetTrigger>

      <SheetContent
        side="left"
        className="background-light900_dark200 border-none">

        <Link href="/" className="flex items-center gap-1">
          <Image
            src="/assets/images/site-logo.svg"
            alt="DevAnswers"
            width={23}
            height={23}
            className=""
          />

          <p className="h2-bold text-dark-100 dark:text-light-900">
            Dev<span className="text-primary-500">Answers</span>
          </p>
        </Link>

        <div className="flex flex-col gap-5">

          <SheetClose asChild>
            <NavContent />
          </SheetClose>

          <SignedOut>
            <SheetClose asChild>
              <Link href={"/sign-in"}>
                <Button
                  className="small-medium btn-secondary
                                min-h-[41px] w-full rounded-lg px-4 py-3 shadow-none"
                >
                  <span className="primary-text-gradient">Sign In</span>
                </Button>
              </Link>
            </SheetClose>

            <SheetClose asChild>
              <Link href="/sign-up">
                <Button
                  className="small-medium light-border-2 btn-tertiary text-dark400_light900 min-h-[41px] w-full 
                  rounded-lg px-4 py-3 shadow-none">
                  Sign Up
                </Button>
              </Link>
            </SheetClose>
          </SignedOut>

        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
