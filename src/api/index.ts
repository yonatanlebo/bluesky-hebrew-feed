import path from 'path';
import express from 'express';
import promBundle from 'express-prom-bundle';
import morgan from 'morgan';
import feedGeneration from './feed-generation';
import describeGenerator from './describe-generator';
import { createHealthCheckRoute as healthCheckRoute } from './health-check';
import wellKnown from './well-known';
import home from './home';
import { createServer } from '../lexicon';
import './configure-morgan';
import { AppContext } from '../context';
import { collectDefaultMetrics } from 'prom-client';

export function createApi(ctx: AppContext) {
  const app = express();
  app.use(morgan('bsky-feed-generator'));
  app.use(promBundle({ includePath: true }));
  collectDefaultMetrics();

  const server = createServer({
    validateResponse: true,
    payload: {
      jsonLimit: 100 * 1024, // 100kb
      textLimit: 100 * 1024, // 100kb
      blobLimit: 5 * 1024 * 1024, // 5mb
    },
  });
  feedGeneration(server, ctx);
  describeGenerator(server, ctx);
  app.use(server.xrpc.router);
  app.use(wellKnown(ctx));
  app.use(home(ctx));
  app.get('/health', healthCheckRoute(ctx.db, ctx.firehose));
  app.use(express.static(path.join(__dirname, 'static')));

  return app;
}
