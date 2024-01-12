import { Button } from "@/components/ui/button";
import { Book, LogIn  } from 'lucide-react'
import Link from "next/link";
import Image from "next/image";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <div className="flex flex-col gap-4 md:flex-row h-[calc(100%-20vh)] mt-[10vh] md:mt-[20vh]">
      <div className="h-fit md:flex-1">
        <h1 className="text-4xl font-bold my-5">Witaj w Akademii Savage</h1>

        <p className="mb-6 md:mb-12">To strona, na której możesz przetestować swoje umiejętności boiskowe w zakresie teoretycznym. Rozwiązuj quizy i rywalizuj z innymi zawodnikami z twojej drużyny</p>

        {session?.user ?
          <Link href="/quiz/list"><Button>Przejdź do quizów <Book className="ml-2"/></Button></Link> :
          <Link href="/api/auth/signin"><Button>Dołącz do gry <LogIn className="ml-2"/></Button></Link>
        }
      </div>

      <div className="flex-1 mt-8">
        <div className="relative h-full w-full max-h-[400px] mx-auto">
          <Image src="/images/team.jpg" alt="Team photo" fill sizes="100vw" className="rounded-sm object-cover w-full h-auto"/>
        </div>
      </div>
    </div>
  )
}
