import { Inter } from "next/font/google";
import { Suspense } from "react";
import Providers, { PostHogPageview } from "~/app/providers";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";
import "~/styles/mdx.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata = {
  title: "Remembrall",
  description: "LLM observability platform",
  icons: [{ rel: "icon", url: "/logo.png" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Suspense>
        <PostHogPageview />
      </Suspense>
      <Providers>
        <body
          className={cn(
            "bg-background font-sans text-foreground",
            inter.variable
          )}
        >
          {children}
        </body>
      </Providers>
    </html>
  );
}
