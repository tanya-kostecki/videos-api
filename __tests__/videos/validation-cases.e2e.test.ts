import request from 'supertest';
import { UpdateVideoDto } from '../../src/videos/dto/UpdateVideoDto';
import { Resolution } from '../../src/videos/types/video';
import { HttpStatus } from '../../src/core/types/http-statuses';
import express from 'express';
import { setupApp } from '../../src/setup-app';
import { CreateVideoDto } from '../../src/videos/dto/CreateVideoDto';

describe('Validation cases', () => {
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

  describe('minAgeRestriction', () => {
    it('should update video with minAgeRestriction set to 1 (minimum valid)', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const validData: UpdateVideoDto = {
        title: 'Test',
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: 1,
        publicationDate: new Date().toISOString(),
      };

      await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(validData)
        .expect(HttpStatus.NoContent);
    });

    it('should update video with minAgeRestriction set to 18 (maximum valid)', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const validData: UpdateVideoDto = {
        title: 'Test',
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: 18,
        publicationDate: new Date().toISOString(),
      };

      await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(validData)
        .expect(HttpStatus.NoContent);
    });

    it('should not update video with minAgeRestriction set to 0 (below minimum)', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const invalidData = {
        title: 'Test',
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: 0,
        publicationDate: new Date().toISOString(),
      };

      const response = await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });

    it('should not update video with minAgeRestriction set to 19 (above maximum)', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const invalidData = {
        title: 'Test',
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: 19,
        publicationDate: new Date().toISOString(),
      };

      const response = await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });
  });

  describe('Title and Author max length', () => {
    it('should create a video with title exactly 40 characters', async () => {
      const validData: CreateVideoDto = {
        title: 'a'.repeat(40),
        author: 'Author',
        availableResolutions: [Resolution.P240],
      };

      const response = await request(app).post('/videos').send(validData);
      expect(response.status).toBe(HttpStatus.Created);
      expect(response.body.author).toBe('Author');
      expect(response.body.title).toBe('a'.repeat(40));
    });

    it('should update video with title exactly 40 characters', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const validData: UpdateVideoDto = {
        title: 'b'.repeat(40),
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
      };

      await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(validData)
        .expect(HttpStatus.NoContent);
    });

    it('should not create a video with title longer than 40 characters', async () => {
      const invalidData = {
        title: 'a'.repeat(41),
        author: 'Author',
      };
      const response = await request(app).post('/videos').send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });

    it('should not update video with title longer than 40 characters', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const invalidData = {
        title: 'a'.repeat(41),
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
      };

      const response = await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });

    it('should create video with author exactly 20 characters', async () => {
      const validData: CreateVideoDto = {
        title: 'Test',
        author: 'a'.repeat(20),
        availableResolutions: [Resolution.P240],
      };

      const response = await request(app).post('/videos').send(validData);
      expect(response.status).toBe(HttpStatus.Created);
      expect(response.body.author).toBe('a'.repeat(20));
    });

    it('should update video with author exactly 20 characters', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const validData: UpdateVideoDto = {
        title: 'Test',
        author: 'a'.repeat(20),
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
      };

      await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(validData)
        .expect(HttpStatus.NoContent);
    });

    it('should not create video with author longer than 20 characters', async () => {
      const invalidData: CreateVideoDto = {
        title: 'Test',
        author: 'a'.repeat(21),
        availableResolutions: [Resolution.P240],
      };

      const response = await request(app).post('/videos').send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });

    it('should not update video with author longer than 20 characters', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const invalidData = {
        title: 'Test',
        author: 'a'.repeat(21),
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
      };

      const response = await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });
  });

  describe('publicationDate', () => {
    it('should update video with correct date format', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const validData = {
        title: 'Test',
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
      };

      const response = await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(validData);

      expect(response.status).toBe(HttpStatus.NoContent);
    });
    it('should not update video with invalid date format', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const invalidData = {
        title: 'Test',
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: 'not-a-date',
      };

      const response = await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });

    it('should not update video with empty string for publicationDate', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const invalidData = {
        title: 'Test',
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: false,
        minAgeRestriction: null,
        publicationDate: '',
      };

      const response = await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });
  });

  describe('canBeDownloaded', () => {
    it('should not update video with string value for canBeDownloaded', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const invalidData = {
        title: 'Test',
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: 'true',
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
      };

      const response = await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });

    it('should not update video with number value for canBeDownloaded', async () => {
      const targetVideo = await request(app).post('/videos').send(testVideo);
      const invalidData = {
        title: 'Test',
        author: 'Author',
        availableResolutions: [Resolution.P240],
        canBeDownloaded: 1,
        minAgeRestriction: null,
        publicationDate: new Date().toISOString(),
      };

      const response = await request(app)
        .put(`/videos/${targetVideo.body.id}`)
        .send(invalidData);

      expect(response.status).toBe(HttpStatus.BadRequest);
      expect(response.body).toHaveProperty('errorsMessages');
      expect(response.body.errorsMessages.length).toBeGreaterThan(0);
    });
  });
});
