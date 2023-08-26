"use client";

import {
  LayoutDashboard,
  MessagesSquare,
  Rocket,
  Settings,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

const navbar = [
  {
    logo: <LayoutDashboard className="mr-2 h-4 w-4" />,
    text: "Dashboard",
    path: "/",
  },
  {
    logo: <MessagesSquare className="mr-2 h-4 w-4" />,
    text: "Playground",
    path: "/playground",
  },
  {
    logo: <Rocket className="mr-2 h-4 w-4" />,
    text: "Powerups",
    path: "/powerups",
  },
  {
    logo: <Settings className="mr-2 h-4 w-4" />,
    text: "Settings",
    path: "/settings",
  },
];

export default function SidebarItems() {
  const path = usePathname();

  return (
    <div className="flex w-full flex-col space-y-1">
      {navbar.map((item, idx) => (
        <Link
          key={idx}
          href={item.path}
          className={cn(
            buttonVariants({
              variant: item.path === path ? "secondary" : "ghost",
            }),
            "justify-start"
          )}
        >
          {item.logo}
          {item.text}
        </Link>
      ))}
    </div>
  );
}
