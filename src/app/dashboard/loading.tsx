"use server";

import { Skeleton } from "~/components/ui/skeleton";

export default async function Loading() {
  return <Skeleton className="h-32 w-full" />;
}
