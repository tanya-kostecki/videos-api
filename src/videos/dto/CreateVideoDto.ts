import { Resolution } from '../types/video';

export type CreateVideoDto = {
  title: string;
  author: string;
  availableResolutions: Resolution[];
};
