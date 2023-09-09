"use server";

import {
  BookOpenIcon,
  HelpCircle,
  LayoutDashboard,
  MessagesSquare,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import LogoutButton from "~/app/login/logout-button";
import SidebarItems from "~/components/sidebar-items";
import { Badge } from "~/components/ui/badge";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";
import { getServerAuthSession } from "~/server/auth";
import { getServerSidePath } from "~/server/utils";

export async function Sidebar({
  className,
}: React.HTMLAttributes<HTMLDivElement>) {
  const session = await getServerAuthSession();

  const path = getServerSidePath();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className={cn("py-0", className)}>
      <div className="flex h-full flex-col justify-between px-4 py-4">
        <div className="flex flex-col space-y-4">
          <Link
            href="/"
            className="mx-auto flex w-fit flex-row items-center space-x-2"
          >
            <Image
              src="/logo.png"
              alt="remembrall logo"
              width={36}
              height={36}
              className="h-6 w-6"
            />
            <span className="hidden text-2xl font-semibold sm:inline-block">
              Remembrall
            </span>
            <Badge>Beta</Badge>
          </Link>

          <SidebarItems />
        </div>
        <div className="flex flex-col space-y-4 text-sm">
          <div className="flex flex-col space-y-2">
            {/* <Link
              href="/"
              className="flex flex-row items-center pl-2  text-muted-foreground hover:text-foreground"
            >
              <BookOpenIcon className="mr-2 h-4 w-4" /> Documentation
            </Link> */}
            <Link
              href="mailto:raunakdoesdev@gmail.com"
              className="flex flex-row items-center pl-2 text-muted-foreground hover:text-foreground"
            >
              <HelpCircle className="mr-2 h-4 w-4" /> Help & Support
            </Link>
          </div>
          <div className="flex w-full items-center justify-between">
            <Link
              href="/dashboard/settings"
              className="flex w-full flex-1 items-center space-x-3 rounded-lg px-2 py-1.5 transition-all duration-150 ease-in-out hover:bg-stone-200 active:bg-stone-300 dark:text-white dark:hover:bg-stone-700 dark:active:bg-stone-800"
            >
              <Image
                src={
                  session.user.image ??
                  `https://avatar.vercel.sh/${session.user.email}`
                }
                width={40}
                height={40}
                alt={session.user.name ?? "User avatar"}
                className="h-6 w-6 rounded-full"
              />
              <span className="truncate text-sm font-medium">
                {session.user.name}
              </span>
            </Link>
            <LogoutButton />
          </div>
        </div>
      </div>
    </div>
  );
}
