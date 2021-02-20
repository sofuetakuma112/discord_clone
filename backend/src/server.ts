import fastify, { FastifyInstance } from 'fastify';
import { Server, IncomingMessage, ServerResponse } from 'http';
import mongoose from 'mongoose';

const server: FastifyInstance<
  Server,
  IncomingMessage,
  ServerResponse
> = fastify({
  logger: true,
});

server.register(require('fastify-cors'), { 
  origin: '*',
  credentials: true,
})

// DBサーバーの立ち上げ
mongoose
  .connect('mongodb://localhost/discord_clone')
  .then(() => console.log('MongoDB connected...'))
  .catch((err) => console.log(err));

export default server;
