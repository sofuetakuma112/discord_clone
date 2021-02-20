import * as categoryController from '../controllers/categoryController';
import * as channelController from '../controllers/channelController';
import * as chatController from '../controllers/chatController';
import { categorySchema } from '../models/Category';
import { FastifySchema } from 'fastify'

const routes = [
  {
    method: 'GET' as 'GET',
    url: '/',
    handler: (reqest, reply) => reply.send({ hello: 'world' }),
  },
  {
    method: 'GET' as 'GET',
    url: '/api/category',
    handler: categoryController.getAllCategory
  },
  {
    method: 'GET' as 'GET',
    url: '/api/category/:id',
    handler: categoryController.getSingleCategory
  },
  {
    method: 'POST' as 'POST',
    url: '/api/category',
    handler: categoryController.createNewCategory,
    // schema: categorySchema as FastifySchema,
  },
  {
    method: 'GET' as 'GET',
    url: '/api/channel/:id',
    handler: channelController.getChannelsCategory
  },
  {
    method: 'POST' as 'POST',
    url: '/api/channel',
    handler: channelController.createNewChannel
  },
  {
    method: 'GET' as 'GET',
    url: '/api/chat/:id',
    handler: chatController.getChatsChannel
  },
  {
    method: 'POST' as 'POST',
    url: '/api/chat',
    handler: chatController.createNewChat
  }
];

export default routes;
