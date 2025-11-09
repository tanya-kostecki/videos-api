import { Resolution } from '../types/video';

export const validatorObject = {
  validateTitle: (title: string) => {
    if (!title || typeof title !== 'string' || title.trim().length > 40) {
      return { field: 'title', message: 'Invalid title.' };
    }
  },

  validateAuthor: (author: string) => {
    if (!author || typeof author !== 'string' || author.trim().length > 20) {
      return { field: 'author', message: 'Invalid author' };
    }
  },

  validateResolutions: (resolutions: Resolution[]) => {
    const validResolutions = Object.values(Resolution);

    if (!Array.isArray(resolutions) || resolutions.length === 0) {
      return {
        field: 'availableResolutions',
        message: 'At least one resolution must be provided',
      };
    } else if (!resolutions.every((res) => validResolutions.includes(res))) {
      return {
        field: 'availableResolutions',
        message: 'Invalid resolution value',
      };
    }
  },
};
