import express from 'express';
import request from 'supertest';
import { setupApp } from '../../src/setup-app';
import { Resolution } from '../../src/videos/types/video';
import { CreateVideoDto } from '../../src/videos/dto/CreateVideoDto';
import { HttpStatus } from '../../src/core/types/http-statuses';
import { UpdateVideoDto } from '../../src/videos/dto/UpdateVideoDto';

describe('Videos API', () => {
  const app = express();
  setupApp(app);

  const testVideo: CreateVideoDto = {
    title: 'Test video',
    author: 'Test author',
    availableResolutions: [Resolution.P240, Resolution.P360],
  };

  beforeAll(async () => {
    await request(app).delete('/testing/all-data').expect(HttpStatus.NoContent);
  });

  beforeEach(async () => {
    await request(app).delete('/testing/all-data');
  });

  it('should return status 200 and an empty array of videos', async () => {
    const response = await request(app).get('/videos/');

    expect(response.status).toBe(HttpStatus.Ok);
    expect(response.body).toStrictEqual([]);
  });

  it('should create a new video with valid data', async () => {
    const response = await request(app).post('/videos').send(testVideo);

    expect(response.status).toBe(HttpStatus.Created);
    expect(response.body).toHaveProperty('id');
    const createdVideo = await request(app).get('/videos');
    expect(createdVideo.body).toStrictEqual([response.body]);
  });

  it('should not create a new video if the input is invalid', async () => {
    const invalidData = {
      title: '',
      author: '',
      availableResolutions: ['blah-resolution'],
    };
    const response = await request(app).post('/videos').send(invalidData);

    expect(response.status).toBe(HttpStatus.BadRequest);
    expect(response.body).toHaveProperty('errorMessages');
    expect(response.body.errorMessages).toHaveLength(3);

    const allVideos = await request(app).get('/videos');
    expect(allVideos.body).toStrictEqual([]);
  });

  it('should return a video by id', async () => {
    const createdVideo = await request(app).post('/videos/').send(testVideo);
    const videoById = await request(app).get(`/videos/${createdVideo.body.id}`);

    expect(videoById.status).toBe(HttpStatus.Ok);
    expect(videoById.body).toStrictEqual(createdVideo.body);
  });

  it('should not return a video if id does not exist', async () => {
    const nonExistentVideo = await request(app).get('/videos/999');

    expect(nonExistentVideo.status).toBe(HttpStatus.NotFound);
  });

  it('should update a video with valid data', async () => {
    const targetVideo = await request(app).post('/videos').send(testVideo);
    const validData: UpdateVideoDto = {
      title: 'Super cool video',
      author: 'Cool artist',
      canBeDownloaded: false,
      minAgeRestriction: 16,
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableResolutions: [
        Resolution.P720,
        Resolution.P1080,
        Resolution.P240,
      ],
    };

    await request(app)
      .put(`/videos/${targetVideo.body.id}`)
      .send(validData)
      .expect(HttpStatus.NoContent);

    const updated = await request(app).get(`/videos/${targetVideo.body.id}`);
    expect(updated.body.title).toBe('Super cool video');
    expect(updated.body.author).toBe('Cool artist');
  });

  it('should not update a video with invalid data', async () => {
    const targetVideo = await request(app).post('/videos').send(testVideo);
    const invalidData = {
      title: '',
      author: '',
      canBeDownloaded: false,
      minAgeRestriction: null,
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableResolutions: [],
    };
    const response = await request(app)
      .put(`/videos/${targetVideo.body.id}`)
      .send(invalidData);

    expect(response.status).toBe(HttpStatus.BadRequest);
    expect(response.body).toHaveProperty('errorMessages');
    expect(response.body.errorMessages).toHaveLength(3);

    const notUpdated = await request(app).get(`/videos/${targetVideo.body.id}`);
    expect(notUpdated.body.title).toBe('Test video');
    expect(notUpdated.body.author).toBe('Test author');
    expect(notUpdated.body.availableResolutions).toHaveLength(2);
    expect(notUpdated.body.availableResolutions).toStrictEqual(
      testVideo.availableResolutions,
    );
  });

  it('should not update a video when not enough data is provided', async () => {
    const targetVideo = await request(app).post('/videos').send(testVideo);
    const invalidData = {
      title: 'Super cool video',
      author: 'Cool artist',
      canBeDownloaded: false,
    };

    const response = await request(app)
      .put(`/videos/${targetVideo.body.id}`)
      .send(invalidData);
    expect(response.status).toBe(HttpStatus.BadRequest);
    expect(response.body).toHaveProperty('errorMessages');
    expect(response.body.errorMessages).toHaveLength(3);

    const notUpdated = await request(app).get(`/videos/${targetVideo.body.id}`);
    expect(notUpdated.body.title).toBe('Test video');
    expect(notUpdated.body.author).toBe('Test author');
    expect(notUpdated.body.availableResolutions).toHaveLength(2);
    expect(notUpdated.body.availableResolutions).toStrictEqual(
      testVideo.availableResolutions,
    );
  });

  it('should not update a video with nonexistent id', async () => {
    const validData: UpdateVideoDto = {
      title: 'Super cool video',
      author: 'Cool artist',
      canBeDownloaded: false,
      minAgeRestriction: 16,
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableResolutions: [
        Resolution.P720,
        Resolution.P1080,
        Resolution.P240,
      ],
    };

    const response = await request(app).put('/videos/111').send(validData);
    expect(response.status).toBe(HttpStatus.NotFound);
  });

  it('should delete the video by id', async () => {
    const targetVideo = await request(app).post('/videos').send(testVideo);

    await request(app)
      .delete(`/videos/${targetVideo.body.id}`)
      .expect(HttpStatus.NoContent);
    await request(app)
      .get(`/videos/${targetVideo.body.id}`)
      .expect(HttpStatus.NotFound);
  });

  it('should return 404 when deleting a nonexistent video', async () => {
    await request(app).delete('/videos/999').expect(HttpStatus.NotFound);
  });
});
