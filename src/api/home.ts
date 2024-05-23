import express from 'express';
import { AppContext } from '../context';

const makeRouter = (ctx: AppContext) => {
  const router = express.Router();

  router.get('/', (_req, res) => {
      res.sendFile(__dirname + '/static/test-feed.html');
  });

  return router;
};
export default makeRouter;
