import { Metadata } from "next";
import { Inter } from "next/font/google";
import { Suspense } from "react";
import Providers, { PHProvider, PostHogPageview } from "~/app/providers";
import { cn } from "~/lib/utils";
import "~/styles/globals.css";
import "~/styles/mdx.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Remembrall",
  description: "LLM observability platform",
  icons: [{ rel: "icon", url: "/logo.png" }],
  verification: {
    google: "Zms-QuPbqTyS04dP9kyznU4lZ0Z5iDgpIkjKCaEM2Aw",
  },
  openGraph: {
    images: [
      {
        url: "/og.png",
        width: 2400,
        height: 1350,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <PHProvider>
        <body
          className={cn(
            "h-screen w-screen overflow-clip bg-background font-sans text-foreground",
            inter.variable
          )}
        >
          <Providers>
            <Suspense>
              <PostHogPageview />
            </Suspense>
            {children}
          </Providers>
        </body>
      </PHProvider>
    </html>
  );
}
