// As early as possible in your application, require and configure dotenv.
// https://www.npmjs.com/package/dotenv#usage
require('dotenv').config();

const { DomainError } = require('./lib/domain/errors');
const { InfrastructureError } = require('./lib/infrastructure/errors');
const errorManager = require('./lib/infrastructure/utils/error-manager');

const Hapi = require('@hapi/hapi');

const routes = require('./lib/routes');
const plugins = require('./lib/plugins');
const config = require('./lib/config');
const security = require('./lib/infrastructure/security');
const Boom = require('boom');

const createServer = async () => {

  const server = new Hapi.server({
    routes: {
      validate: {
        failAction: async (request, h, err) => {
          if (process.env.NODE_ENV === 'production') {
            // In prod, log a limited error message and throw the default Bad Request error.
            console.error('ValidationError:', err.message);
            throw Boom.badRequest('The server could not understand the request due to invalid syntax.');
          } else {
            // During development, log and respond with the full error.
            console.error(err);
            throw err;
          }
        }
      },
      cors: {
        origin: ['*'],
        additionalHeaders: ['X-Requested-With']
      },
      response: {
        emptyStatusCode: 204
      }
    },
    port: config.port,
    router: {
      isCaseSensitive: false,
      stripTrailingSlash: true
    }
  });

  const preResponse = function(request, h) {
    const response = request.response;

    if (response instanceof DomainError || response instanceof InfrastructureError) {
      return errorManager.send(h, response);
    }

    return h.continue;
  };

  server.ext('onPreResponse', preResponse);

  server.auth.scheme('jwt-access-token', security.scheme);
  server.auth.strategy('default', 'jwt-access-token');
  server.auth.default('default');

  const configuration = [].concat(plugins, routes);

  await server.register(configuration);

  return server;
};

module.exports = createServer;
