"use server";

import Track from "~/app/dashboard/track";
import { Sidebar } from "~/components/sidebar";

export default async function Home({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Track>
      <div className="flex h-full flex-row">
        <Sidebar className="w-full max-w-[16rem]" />
        <div className="h-screen min-w-0 grow overflow-auto border-l p-4">
          {children}
        </div>
      </div>
    </Track>
  );
}
