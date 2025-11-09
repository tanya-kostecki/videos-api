import { Resolution, Video } from '../videos/types/video';

export const db = {
  videos: <Video[]>[
    {
      id: 1,
      title: 'Awesome video',
      author: 'Super cool artist',
      canBeDownloaded: true,
      minAgeRestriction: null,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableResolutions: [Resolution.P720, Resolution.P1080],
    },
    {
      id: 2,
      title: 'Super cool video',
      author: 'Another random artist',
      canBeDownloaded: false,
      minAgeRestriction: 16,
      createdAt: new Date().toISOString(),
      publicationDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      availableResolutions: [Resolution.P720, Resolution.P1080],
    },
  ],
};
