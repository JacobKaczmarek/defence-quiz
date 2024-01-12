import Link from "next/link"
import { ModeToggle } from "./ModeToggle"
import { Button } from "./ui/button"
import { Book, LogIn, LogOut, User } from "lucide-react"
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu"

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
        { session?.user && <Link href='/quiz/list'><Button variant="ghost">Quizy <Book className="ml-2"/></Button></Link> }
        <ModeToggle />
        {session?.user ? (
          <div className="ml-2 flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  {session.user.name}
                  <User className="ml-2"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signout"><LogOut className="mr-2" /> Wyloguj</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <div className="ml-2 flex items-center">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost">
                  <User className="ml-2"/>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signin"><LogIn className="mr-2" />Zaloguj</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )
        }
      </div>
    </div>
  )
}