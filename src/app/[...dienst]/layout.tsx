import { Home } from "lucide-react";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Powerpoint Rehoboth",
  description: "Powerpoints",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <div className="bg-slate-700 sticky top-0">
        <div className="max-w-5xl py-2 px-8 flex gap-4">
          <Link href="/">
            <Home className="text-white" />
          </Link>
          <h1 className="text-2xl font-bold text-white">Presentatie maken</h1>
        </div>
      </div> 
      <div className="p-8">{children}</div>
    </>
  );
}
