import { Trophy } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "./ui/card";

type Props = {
    scores?: { name: string, score: number }[]
}
export default function Leaderboard({ scores }: Props) {
    return (
        <div>
            <Card className="min-w-[250px]">
                <CardHeader>
                    <CardTitle><div className="flex">Leaderboard <Trophy className="ml-2 text-primary"/></div></CardTitle>
                </CardHeader>

                <CardContent>
                    {scores?.map((entry, i) => (
                        <div className="my-2 flex items-center" key={entry.name}>
                            <p className="mr-2">{i+1}.</p>

                            <div>
                                <p className="text-sm font-medium leading-none">{entry.name}</p>
                                <p className="text-sm text-muted-foreground">{entry.score}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>
    )
}