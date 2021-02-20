const routes = [
  {
    method: 'GET' as 'GET',
    url: '/',
    handler: (reqest, reply) => reply.send({ hello: 'world' }),
  },
];

export default routes;
