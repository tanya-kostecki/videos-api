import { Resolution } from '../types/video';

export type UpdateVideoDto = {
  title: string;
  author: string;
  availableResolutions: Resolution[];
  canBeDownloaded: boolean;
  minAgeRestriction: number | null;
  publicationDate: string;
};
