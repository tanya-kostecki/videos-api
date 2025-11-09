import { Router, Request } from 'express';
import { HttpStatus } from '../../core/types/http-statuses';
import { db } from '../../db/in.memory.db';
import { CreateVideoDto } from '../dto/CreateVideoDto';
import { ValidationError } from '../types/validationError';
import { createVideoDtoValidation } from '../validation/createVideoDtoValidation';
import { Video } from '../types/video';
import { UpdateVideoDto } from '../dto/UpdateVideoDto';
import { updateVideoDtoValidation } from '../validation/updateVideoDtoValidation';
import { createErrorMessages } from '../../core/utils/error.utils';

export const videosRouter = Router({});

videosRouter
  .get('/', (req, res) => {
    res.status(HttpStatus.Ok).send(db.videos);
  })
  .post('/', async (req: Request<{}, {}, CreateVideoDto>, res) => {
    const validationErrors: ValidationError[] = createVideoDtoValidation(
      req.body,
    );
    if (validationErrors.length > 0) {
      res
        .status(HttpStatus.BadRequest)
        .send(createErrorMessages(validationErrors));
      return;
    }

    const createdAt = new Date();
    const publicationDate = new Date(createdAt);
    publicationDate.setDate(publicationDate.getDate() + 1);

    const newVideo: Video = {
      ...req.body,
      id: db.videos.length ? db.videos[db.videos.length - 1].id + 1 : 1,
      createdAt: createdAt.toISOString(),
      canBeDownloaded: false,
      minAgeRestriction: null,
      publicationDate: publicationDate.toISOString(),
    };
    db.videos.push(newVideo);

    res.status(HttpStatus.Created).send(newVideo);
  })

  .get('/:id', async (req: Request<{ id: string }>, res) => {
    const video = db.videos.find((video) => video.id === +req.params.id);

    if (!video) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Video not found' }]),
        );
      return;
    }

    res.status(HttpStatus.Ok).send(video);
  })

  .put(
    '/:id',
    async (req: Request<{ id: string }, {}, UpdateVideoDto>, res) => {
      const video = db.videos.find((video) => video.id === +req.params.id);
      if (!video) {
        res
          .status(HttpStatus.NotFound)
          .send(
            createErrorMessages([{ field: 'id', message: 'Video not found' }]),
          );
        return;
      }

      const validationErrors: ValidationError[] = updateVideoDtoValidation(
        req.body,
      );
      if (validationErrors.length > 0) {
        res
          .status(HttpStatus.BadRequest)
          .send(createErrorMessages(validationErrors));
        return;
      }

      Object.assign(video, req.body);

      res.sendStatus(HttpStatus.NoContent);
    },
  )
  .delete('/:id', async (req: Request<{ id: string }>, res) => {
    const video = db.videos.find((video) => video.id === +req.params.id);

    if (!video) {
      res
        .status(HttpStatus.NotFound)
        .send(
          createErrorMessages([{ field: 'id', message: 'Video not found' }]),
        );
      return;
    }

    db.videos.splice(db.videos.indexOf(video), 1);

    res.sendStatus(HttpStatus.NoContent);
  });
