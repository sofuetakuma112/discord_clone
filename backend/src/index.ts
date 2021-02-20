import fastify from './server';
import routes from './routes/index';

const PORT: any = process.env.PORT || 3000;

routes.forEach((route, index) => {
  fastify.route(route);
});

const start = async () => {
  try {
    await fastify.listen(PORT, '0.0.0.0');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
