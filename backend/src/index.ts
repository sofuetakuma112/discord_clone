// importしているfastifyはrequire('fastify')({ logger: true })
import fastify from './server';
import routes from './routes/index';
import qql from 'fastify-gql';
import schema from './schema/index';

const PORT: any = process.env.PORT || 3000;

// Fastify GraphQLアダプタが必要なので、
// スキーマをインポートし、FastifyにGraphQLアダプタを登録します。
fastify.register(qql, {
  schema,
  graphiql: true,
});

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
