import { FastifyInstance } from "fastify"
import { z } from 'zod'

import { prisma } from "../../lib/prisma"
import { redis } from "../../lib/redis"

export async function getPolls(app: FastifyInstance) {
  app.get('/polls', async (_, reply) => {
    const polls = await prisma.poll.findMany({
      select: {
        id: true,
        title: true,
        options: {
          select: {
            id: true,
            title: true
          }
        },
      }
    })

    return reply.status(200).send(polls)
   })
}

export async function getPollById(app: FastifyInstance) {
  app.get('/polls/:pollId', async (request, reply) => {
    const getPollParams = z.object({
      pollId: z.string().uuid()
    })
    const { pollId } = getPollParams.parse(request.params)
    const poll = await prisma.poll.findUnique({
      where: {
        id: pollId
      },
      select: {
        id: true,
        title: true,
        options: {
          select: {
            id: true,
            title: true
          }
        }
      }
    })
    if (!poll) {
      return reply.status(404).send({ message: 'Poll not found' })
    }
    const result = await redis.zrange(`poll:${pollId}`, 0, -1, 'WITHSCORES')
    poll.options = poll.options.map(option => {
      return {
        ...option,
        votes: Number(result[result.indexOf(option.id) + 1]) || 0
      }
    })
    return reply.status(200).send(poll)
  })
}