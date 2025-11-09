import express, { Express } from 'express';
import { testingRouter } from './testing/testing.router';
import { videosRouter } from './videos/routers/videos.routers';

export const setupApp = (app: Express) => {
  app.use(express.json()); // middleware для парсинга JSON в теле запроса

  // основной роут
  app.get('/', (req, res) => {
    res.status(200).send('Hello world!');
  });

  app.use('/testing', testingRouter);
  app.use('/videos', videosRouter);
};
