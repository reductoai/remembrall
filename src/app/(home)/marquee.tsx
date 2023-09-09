"use server";

import { cn } from "~/lib/utils";
import Marquee from "~/components/magicui/marquee";
import { getTweet, type Tweet } from "react-tweet/api";
import Image from "next/image";
import Link from "next/link";

const reviews = [
  "1700442300747264331",
  "1700528249342705694",
  "1700518619568808169",
  "1700512261066850775",
  "1700455160479109247",
  "1700438323909595207",
  "1700344834081395026",
  "1700294427334385799",
  "1700357676788539760",
  "1700323722220167202",
  "1700288991218565387",
  "1700269768954269847",
  "1700264313750245624",
  "1700259749709971678",
];
const ReviewCard = async ({ id }: { id: string }) => {
  const tweet = (await getTweet(id)) as Tweet;
  return (
    <figure
      className={cn(
        "relative h-32 w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        // light styles
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        // dark styles
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row justify-between">
        <div className="flex flex-row items-center gap-2">
          <Image
            className="rounded-full"
            width="32"
            height="32"
            alt=""
            src={tweet.user.profile_image_url_https}
          />
          <div className="flex flex-col items-start">
            <figcaption className="text-ellipsis whitespace-nowrap text-sm font-medium dark:text-white">
              {tweet.user.name}
            </figcaption>
            <p className="text-xs font-medium dark:text-white/40">
              {tweet.user.screen_name}
            </p>
          </div>
        </div>
        <Link
          href={`https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`}
        >
          <svg
            stroke="currentColor"
            fill="currentColor"
            stroke-width="0"
            viewBox="0 0 24 24"
            height="1em"
            width="1em"
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 items-start text-[#3BA9EE] transition-all ease-in-out hover:scale-105"
          >
            <g>
              <path fill="none" d="M0 0h24v24H0z"></path>
              <path d="M22.162 5.656a8.384 8.384 0 0 1-2.402.658A4.196 4.196 0 0 0 21.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 0 0-7.126 3.814 11.874 11.874 0 0 1-8.62-4.37 4.168 4.168 0 0 0-.566 2.103c0 1.45.738 2.731 1.86 3.481a4.168 4.168 0 0 1-1.894-.523v.052a4.185 4.185 0 0 0 3.355 4.101 4.21 4.21 0 0 1-1.89.072A4.185 4.185 0 0 0 7.97 16.65a8.394 8.394 0 0 1-6.191 1.732 11.83 11.83 0 0 0 6.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 0 0 2.087-2.165z"></path>
            </g>
          </svg>
        </Link>
      </div>
      <div className="mt-2 break-words text-left leading-normal tracking-tighter">
        <span className="overflow-ellipsis text-sm">
          {tweet.text
            ? tweet.text
                .split(" ")
                .filter((word) => !word.startsWith("@"))
                .join(" ")
            : "Loading..."}
        </span>
      </div>
    </figure>
  );
};

export const MarqueeDemo = () => {
  return (
    <div className="relative flex h-fit w-screen flex-col items-center justify-center gap-4 overflow-hidden rounded-lg  border py-8">
      <Marquee pauseOnHover className="[--duration:90s]">
        {reviews.map((review) => (
          <ReviewCard key={review} id={review} />
        ))}
      </Marquee>
      <Marquee reverse pauseOnHover className="[--duration:90s]">
        {reviews.map((review) => (
          <ReviewCard key={review} id={review} />
        ))}
      </Marquee>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-gray-950"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-gray-950"></div>
    </div>
  );
};
