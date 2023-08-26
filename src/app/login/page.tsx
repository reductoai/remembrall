import Image from "next/image";
import LoginButton from "./login-button";
import { Suspense } from "react";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "~/components/ui/card";

export default function LoginPage() {
  return (
    <Card className="mx-5 sm:mx-auto sm:w-full sm:max-w-sm sm:rounded-lg sm:shadow-md">
      <CardHeader>
        <Image
          alt="Platforms Starter Kit"
          width={200}
          height={200}
          className="relative mx-auto h-28 w-auto dark:scale-110 dark:rounded-full"
          src="/logo.png"
        />
        <h1 className="font-cal mt-6 text-center text-2xl dark:text-white">
          Remembrall
        </h1>
      </CardHeader>
      <CardContent className="text-center">
        Magical new abilities for your LLM with just one spell of code.
      </CardContent>

      <CardFooter>
        <Suspense
          fallback={
            <div className="my-2 h-10 w-full rounded-md border border-stone-200 bg-stone-100 dark:border-stone-700 dark:bg-stone-800" />
          }
        >
          <LoginButton />
        </Suspense>
      </CardFooter>
    </Card>
  );
}
