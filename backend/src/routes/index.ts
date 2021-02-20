import * as categoryController from '../controllers/categoryController';
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
];

export default routes;
