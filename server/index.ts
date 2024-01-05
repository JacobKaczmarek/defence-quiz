import { publicProcedure, router } from "./trpc";
import { faker } from '@faker-js/faker';

export const appRouter = router({
    getLeaderboard: publicProcedure.query(async () => {
        const results = []

        for (let i = 0; i < 10; i++) {
            results.push({
                name: faker.person.fullName(),
                score: Math.floor(Math.random() * 1000)
            })
        }

        return results.toSorted((a, b) => a.score - b.score)
    })
})

export type AppRouter = typeof appRouter