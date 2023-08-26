import { Sidebar } from "~/components/sidebar";

export default async function Home({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="h-screen">
      <div className="flex h-full flex-row">
        <Sidebar className="w-full max-w-[16rem]" />
        <div className="h-screen min-w-0 grow overflow-auto border-l p-4">
          {children}
        </div>
      </div>
    </main>
  );
}
