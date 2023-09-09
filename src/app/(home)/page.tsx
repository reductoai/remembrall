import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import Dark from "~/app/(home)/dark";
import { MarqueeDemo } from "~/app/(home)/marquee";
import GridPattern from "~/components/magicui/grid-pattern";
import LinearGradient from "~/components/magicui/linear-gradient";
import ShimmerButton from "~/components/magicui/shimmer-button";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function Hello() {
  return (
    <main className="h-screen w-screen">
      <div className="div h-screen w-screen place-items-center space-y-2 overflow-x-clip bg-white dark:bg-black">
        <header className="supports-backdrop-blur:bg-background/80 sticky top-0 z-40 h-16 w-screen overflow-clip backdrop-blur">
          <div className="container flex h-16 items-center justify-between">
            <Link href="/" className="flex flex-row items-center space-x-2">
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
              <Badge className="hidden sm:inline-block">Beta</Badge>
            </Link>
            <Dark />
          </div>
          <div className="absolute bottom-0 h-px w-full bg-[radial-gradient(50%_100%_at_50%_100%,rgba(0,0,0,.12)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(50%_100%_at_50%_100%,rgba(255,255,255,.32)_0%,rgba(255,255,255,0)_100%)]"></div>
        </header>
        <div className="mx-auto flex max-w-[48rem] flex-col items-center gap-4 space-y-4 p-8 text-center md:p-8">
          <section className="flex flex-col items-center space-y-8 pb-12 pt-20">
            <h1 className="whitespace-pre-wrap bg-gradient-to-b from-black to-gray-800/90 bg-clip-text text-center text-4xl font-semibold leading-none tracking-tight text-transparent dark:from-white dark:to-slate-300/90 sm:text-5xl md:text-6xl lg:text-8xl">
              Long-Term Memory for LLMs
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Add two lines of code to your OpenAI call and get observability,
              unlimited long-term memory, retrieval-augmented generation, and
              more.
            </p>
            <Link href="/dashboard">
              <ShimmerButton className="w-fit">
                <span className="whitespace-pre-wrap bg-slate-200  bg-clip-text text-center text-sm font-semibold leading-none tracking-tight dark:text-transparent lg:text-2xl">
                  Get Started Now
                </span>
              </ShimmerButton>
            </Link>
          </section>

          <MarqueeDemo />
        </div>
      </div>

      <GridPattern
        width={80}
        height={80}
        className={cn(
          "inset-x-0 inset-y-[-30%] -top-[1rem] h-[80%] skew-y-12",
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}
      />
      <LinearGradient to="rgb(120,119,198,0.2)" direction="top left" />
    </main>
  );
}
