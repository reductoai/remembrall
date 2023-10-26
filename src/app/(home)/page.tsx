import { Github, GithubIcon, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import HomepageChat from "~/app/(home)/chat";
import Dark from "~/app/(home)/dark";
import { MarqueeDemo } from "~/app/(home)/marquee";
import { Pricing } from "~/app/(home)/pricing";
import GridPattern from "~/components/magicui/grid-pattern";
import LinearGradient from "~/components/magicui/linear-gradient";
import ShimmerButton from "~/components/magicui/shimmer-button";
import { Badge } from "~/components/ui/badge";
import { Button, buttonVariants } from "~/components/ui/button";
import { cn } from "~/lib/utils";

export default function Hello() {
  return (
    <main className="relative h-screen w-screen overflow-clip overflow-y-auto">
      <GridPattern
        width={80}
        height={80}
        className={cn(
          "inset-x-0 inset-y-[-30%] z-0 h-[100%] skew-y-12",
          "[mask-image:linear-gradient(to_bottom_right,white,transparent,transparent)]"
        )}
      />
      <div className="top-0 -z-10 h-fit w-screen place-items-center overflow-x-clip bg-white dark:bg-black">
        <LinearGradient to="rgb(120,119,198,0.2)" direction="top left" />
        <header className="supports-backdrop-blur:bg-background/80 sticky top-0 z-40 m-0 h-16 w-screen overflow-clip backdrop-blur">
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
            <div className="flex flex-row items-center space-x-2">
              {/* <Link
                href="link.reducto.ai/star"
                className={cn(
                  "",
                  buttonVariants({
                    variant: "outline",
                  })
                )}
              >
                <GithubIcon />
                <p className="ml-2">Star on Github</p>
              </Link> */}
              <Link
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "group hidden rounded-sm transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 md:flex"
                )}
                href={"https://link.reducto.ai/star"}
              >
                <Star className="mr-2 h-4 w-4 transition-all duration-300 group-hover:text-yellow-500" />
                Star on GitHub
              </Link>

              <Link
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "group hidden w-fit rounded-sm transition-all duration-300 ease-out hover:ring-2 hover:ring-primary hover:ring-offset-2 md:flex"
                )}
                href={"link.reducto.ai/star"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 640 512"
                  className="mr-2 h-5 w-5 fill-foreground"
                >
                  <path d="M524.531,69.836a1.5,1.5,0,0,0-.764-.7A485.065,485.065,0,0,0,404.081,32.03a1.816,1.816,0,0,0-1.923.91,337.461,337.461,0,0,0-14.9,30.6,447.848,447.848,0,0,0-134.426,0,309.541,309.541,0,0,0-15.135-30.6,1.89,1.89,0,0,0-1.924-.91A483.689,483.689,0,0,0,116.085,69.137a1.712,1.712,0,0,0-.788.676C39.068,183.651,18.186,294.69,28.43,404.354a2.016,2.016,0,0,0,.765,1.375A487.666,487.666,0,0,0,176.02,479.918a1.9,1.9,0,0,0,2.063-.676A348.2,348.2,0,0,0,208.12,430.4a1.86,1.86,0,0,0-1.019-2.588,321.173,321.173,0,0,1-45.868-21.853,1.885,1.885,0,0,1-.185-3.126c3.082-2.309,6.166-4.711,9.109-7.137a1.819,1.819,0,0,1,1.9-.256c96.229,43.917,200.41,43.917,295.5,0a1.812,1.812,0,0,1,1.924.233c2.944,2.426,6.027,4.851,9.132,7.16a1.884,1.884,0,0,1-.162,3.126,301.407,301.407,0,0,1-45.89,21.83,1.875,1.875,0,0,0-1,2.611,391.055,391.055,0,0,0,30.014,48.815,1.864,1.864,0,0,0,2.063.7A486.048,486.048,0,0,0,610.7,405.729a1.882,1.882,0,0,0,.765-1.352C623.729,277.594,590.933,167.465,524.531,69.836ZM222.491,337.58c-28.972,0-52.844-26.587-52.844-59.239S193.056,219.1,222.491,219.1c29.665,0,53.306,26.82,52.843,59.239C275.334,310.993,251.924,337.58,222.491,337.58Zm195.38,0c-28.971,0-52.843-26.587-52.843-59.239S388.437,219.1,417.871,219.1c29.667,0,53.307,26.82,52.844,59.239C470.715,310.993,447.538,337.58,417.871,337.58Z" />
                </svg>
                Join our Discord
              </Link>
              <Link
                href="/dashboard"
                className={cn(
                  buttonVariants({
                    variant: "outline",
                  }),
                  "ring-2 ring-primary transition-all duration-300 hover:ring-offset-2"
                )}
              >
                Get Started Now
              </Link>
            </div>
          </div>
          <div className="absolute bottom-0 h-px w-full bg-[radial-gradient(50%_100%_at_50%_100%,rgba(0,0,0,.12)_0%,rgba(255,255,255,0)_100%)] dark:bg-[radial-gradient(50%_100%_at_50%_100%,rgba(255,255,255,.32)_0%,rgba(255,255,255,0)_100%)]"></div>
        </header>
        {/* <div className="absolute -top-10 h-[80%] w-full">
          <div className="relative h-full w-full">
          </div>
        </div> */}
        <div className="flex w-full  flex-col items-center gap-4 space-y-4 p-8 text-center md:p-8">
          <section className="mx-auto flex flex-col items-center space-y-8 pt-4">
            <h1 className="max-w-[48rem] whitespace-pre-wrap bg-gradient-to-b from-black to-gray-800/90 bg-clip-text text-center text-6xl font-semibold leading-none tracking-tight text-transparent dark:from-white dark:to-slate-300/90 md:text-8xl">
              Long-term Memory for LLMs
            </h1>
            <div className="flex max-w-6xl flex-col space-y-8">
              <p className="max-w-[36rem] text-center text-lg leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                Add <b className="dark:text-white text-black">two lines</b> to your OpenAI call
                to automatically{" "}
                <b className="dark:text-white text-black">personalize responses</b> based on
                past conversations or internal documents.
              </p>

              <div className="flex flex-col items-center justify-center space-y-2">
                <Link href="/dashboard">
                  <ShimmerButton className="w-fit">
                    <span className="whitespace-pre-wrap bg-slate-200  bg-clip-text text-center text-sm font-semibold leading-none tracking-tight dark:text-transparent lg:text-2xl">
                      Get Started Now
                    </span>
                  </ShimmerButton>
                </Link>
                <h3 className="inline-flex space-x-6 text-muted-foreground">
                  Backed by{" "}
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="ml-2 mr-1"
                  >
                    <g clip-path="url(#clip0_24_57)">
                      <rect
                        width="24"
                        height="24"
                        rx="5.4"
                        fill="#FF5100"
                      ></rect>
                      <rect
                        x="0.5"
                        y="0.5"
                        width="23"
                        height="23"
                        rx="4.9"
                        stroke="#FF844B"
                      ></rect>
                      <path
                        d="M7.54102 7.31818H9.28604L11.9458 11.9467H12.0552L14.715 7.31818H16.46L12.7662 13.5028V17.5H11.2349V13.5028L7.54102 7.31818Z"
                        fill="white"
                      ></path>
                    </g>
                    <rect
                      x="0.5"
                      y="0.5"
                      width="23"
                      height="23"
                      rx="4.9"
                      stroke="#FF5100"
                      stroke-opacity="0.1"
                    ></rect>
                    <rect
                      x="0.5"
                      y="0.5"
                      width="23"
                      height="23"
                      rx="4.9"
                      stroke="url(#paint0_radial_24_57)"
                    ></rect>
                    <defs>
                      <radialGradient
                        id="paint0_radial_24_57"
                        cx="0"
                        cy="0"
                        r="1"
                        gradientUnits="userSpaceOnUse"
                        gradientTransform="translate(7.35) rotate(58.475) scale(34.1384)"
                      >
                        <stop stop-color="white" stop-opacity="0.56"></stop>
                        <stop
                          offset="0.28125"
                          stop-color="white"
                          stop-opacity="0"
                        ></stop>
                      </radialGradient>
                      <clipPath id="clip0_24_57">
                        <rect
                          width="24"
                          height="24"
                          rx="5.4"
                          fill="white"
                        ></rect>
                      </clipPath>
                    </defs>
                  </svg>{" "}
                  Combinator
                </h3>
              </div>
            </div>

            <div className="relative mx-auto grid w-full max-w-6xl grid-cols-2 gap-4 rounded-lg bg-background/50 p-8 py-8 transition-all duration-300 hover:border hover:border-white ">
              <div className="flex flex-col space-y-8">
                <HomepageChat vanilla={true} />
                <h3 className="whitespace-pre-wrap bg-gradient-to-b from-black to-gray-800/90 bg-clip-text text-center text-xl font-semibold leading-none tracking-tight text-transparent dark:from-white dark:to-slate-300/90">
                  No Memory
                </h3>
              </div>
              <div className="flex flex-col space-y-8">
                <HomepageChat />
                <h3 className="whitespace-pre-wrap bg-gradient-to-b from-black to-gray-800/90 bg-clip-text text-center text-xl font-semibold leading-none tracking-tight text-transparent dark:from-white dark:to-slate-300/90">
                  With Remembrall Memory
                </h3>
              </div>
            </div>
          </section>

          <MarqueeDemo />
        </div>

        <div className="relative -mt-8 h-fit w-screen pt-8">
          <LinearGradient to="rgb(120,119,198,0.2)" direction="bottom right" />

          <div className="relative mx-auto flex aspect-video w-full max-w-6xl rounded-lg border bg-background p-5 shadow-2xl">
            <iframe
              src="https://www.loom.com/embed/5956651e8d394650bbd40267d0af95bb?sid=cd88a03b-0fc5-4bc9-9e0a-ce90fc24d370?hide_owner=true&hide_share=true&hide_title=true&hideEmbedTopBar=true"
              frameBorder="0"
              allowFullScreen
              className="h-full w-full rounded-lg"
            ></iframe>
          </div>

          <div className="flex flex-col space-y-4 py-12">
            <h2
              id="pricing"
              className="text-center text-5xl font-semibold leading-none tracking-tight text-foreground "
            >
              Pricing
            </h2>
            <p className="mx-auto max-w-2xl pb-8 text-center text-2xl text-muted-foreground">
              Start using Remembrall for free. Upgrade for API usage in
              production. Export your data for free on any plan.
            </p>
            <Pricing />
          </div>
        </div>
      </div>
    </main>
  );
}
