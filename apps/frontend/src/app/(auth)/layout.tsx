import { getAuthToken } from "@/actions/auth";
import { ModeToggle } from "@/components/ui/ThemeToggle";
import Link from "next/link";
import { redirect } from "next/navigation";
import { FaHouse } from "react-icons/fa6";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAuthToken();
  console.log(session);
  if (session) return redirect("/dashboard");

  return (
    <div className="bg-muted h-screen flex items-center justify-center">
      <div className="absolute top-4 right-6">
        <ModeToggle />
      </div>
      <div className=" absolute top-5 left-5 md:top-10 md:left-10 bg-zinc-200 dark:bg-zinc-700 shadow-md p-1 md:p-2 rounded-full">
        <Link href={"/"} className="cursor-pointer">
          <FaHouse className="h-5 w-5 shadow-lg" />
        </Link>
      </div>
      {children}
    </div>
  );
}
