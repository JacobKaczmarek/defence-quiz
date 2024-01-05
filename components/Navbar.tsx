import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { Button } from "./ui/button"
import { User } from "lucide-react"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function Navbar() {
  const session = await getServerSession(authOptions);

  return (
    <div className="w-full flex justify-between py-3 mt-2">
      <Link href='/'>
          <Button variant="ghost" className="text-lg font-semibold">
            Akademia Savage
          </Button>
      </Link>
      
      
      <div className="flex gap-1">
      <ModeToggle />
      { session?.user ? (
        <div className="ml-2 flex items-center">
          <span>{session.user.name}</span>
          {/* <Image src={session.user.image as string} width={50} height={50} alt="Profile picture" /> */}
        </div>
      ) : (
        <Button variant="ghost"><User /></Button>
        )
      }
      </div>

    </div>
  )
}