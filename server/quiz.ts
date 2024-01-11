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
  addSubmission: publicProcedure.input(z.object({ quizId: z.string(), userId: z.string(), score: z.number() })).mutation(async opts => {
    const { quizId, userId, score } = opts.input

    const submission = await db.submission.create({
        data: {
            quizId,
            userId,
            score
        }
    })

    return submission
  }),
  getAllQuizzes: publicProcedure.query(() => {
    return db.quiz.findMany({ include: { questions: true, submissions: true }})
  }),
  getQuiz: publicProcedure.input(z.object({ quizId: z.string() })).query(async opts => {
    const { quizId } = opts.input

    const quiz = await db.quiz.findUnique({
        where: { id: quizId },
        include: { questions: true, submissions: { include: { user: true } } }
    })

    return quiz
  }),
  getSubmissions: publicProcedure.input(z.object({ quizId: z.string() })).query(async opts => {
    const { quizId } = opts.input

    const submissions = await db.submission.findMany({
        where: { quizId },
        include: { user: true }
    })

    return submissions
  })
})