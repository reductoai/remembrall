import Link from "next/link";
import { Button, buttonVariants } from "~/components/ui/button";

export default function Hello() {
  return (
    <div className="grid h-screen place-items-center space-y-2 bg-black text-5xl text-white">
      <div className="flex flex-col gap-4 space-y-4">
        <h1>Home Page Coming Soon</h1>
        <Link href="/dashboard" className={buttonVariants({})}>
          Go to Dashboard
        </Link>
      </div>
    </div>
  );
}
