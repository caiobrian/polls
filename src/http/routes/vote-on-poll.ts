import { FastifyInstance } from 'fastify';
import { z } from 'zod';
import { randomUUID } from 'crypto';
import { prisma } from '../../lib/prisma';
import { redis } from '../../lib/redis';
import { voting } from '../../utils/VotingPubSub';

export async function voteOnPoll(app: FastifyInstance) {
  app.post('/polls/:pollId/votes', async (request, reply) => {
    const voteOnPollBody = z.object({
      pollOptionId: z.string().uuid()
    });
    const voteOnPollParams = z.object({
      pollId: z.string().uuid()
    });
    const { pollId } = voteOnPollParams.parse(request.params);
    const { pollOptionId } = voteOnPollBody.parse(request.body);
    let { sessionId } = request.cookies;
    if (sessionId) {
      const userAlreadyVoted = await prisma.vote.findUnique({
        where: {
          sessionId_pollId: {
            sessionId,
            pollId
          }
        }
      });
      if (userAlreadyVoted) {
        if (userAlreadyVoted.pollOptionId !== pollOptionId) {
          await prisma.vote.update({
            where: {
              id: userAlreadyVoted.id
            },
            data: {
              pollOptionId
            }
          });
          await redis.zincrby(
            `poll:${pollId}`,
            -1,
            userAlreadyVoted.pollOptionId
          );
          const votes = await redis.zincrby(`poll:${pollId}`, 1, pollOptionId);
          voting.emit(pollId, { pollOptionId, votes: Number(votes) });
          return reply.status(200).send({ message: 'Vote updated' });
        }
        return reply.status(400).send({ message: 'User already voted' });
      }
    }
    if (!sessionId) {
      sessionId = randomUUID();
      reply.setCookie('sessionId', sessionId, {
        path: '/',
        maxAge: 60 * 60 * 24 * 7, // 1 week
        signed: true,
        httpOnly: true
      });
    }
    await prisma.vote.create({
      data: {
        pollOptionId,
        sessionId,
        pollId
      }
    });

    const votes = await redis.zincrby(`poll:${pollId}`, 1, pollOptionId);

    voting.emit(pollId, { pollOptionId, votes: Number(votes) });

    return reply.status(201).send({ message: 'Vote created' });
  });
}
