import { db } from '@/lib/db';
import { router, publicProcedure } from './trpc';
import { z } from 'zod';

const createQuizDTO = z.object({
    name: z.string(),
    userId: z.string(),
    questions: z.array(z.object({
        imageUrl: z.string(),
        offensiveX: z.number(),
        offensiveY: z.number(),
        defensiveX: z.number(),
        defensiveY: z.number()
    }))
})

export type TCreateQuizDTO = z.infer<typeof createQuizDTO>

export const quizRouter = router({
  create: publicProcedure.input(createQuizDTO).mutation(async opts => {
    const { name, userId, questions } = opts.input

    const quiz = await db.quiz.create({
        data: {
            name,
            userId,
            questions: {
                create: questions
            }
        }
    }).catch(err => { console.log(err) })

    return quiz;
  }),
  getAllQuizzes: publicProcedure.query(() => {
    return db.quiz.findMany()
  })
})