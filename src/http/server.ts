import fastify from 'fastify'
import cookie from '@fastify/cookie'
import websocket from '@fastify/websocket'

import { createPoll } from './routes/create-poll'
import { getPollById, getPolls } from './routes/get-polls'
import { voteOnPoll } from './routes/vote-on-poll'
import { pollResults } from './websockets/poll-results'

const app = fastify()

app.register(cookie, {
  secret: 'app.polls.secret',
  hook: 'onRequest',
  parseOptions: {}
})
app.register(websocket)
app.register(getPolls)
app.register(createPoll)
app.register(getPollById)
app.register(voteOnPoll)
app.register(pollResults)

app.listen({ port: 3001 }).then(() => {
  console.log('Server is running on port 3001')
})