import { ValidationError } from '../types/validationError';
import { validatorObject } from './validatorObject';
import { UpdateVideoDto } from '../dto/UpdateVideoDto';

export const updateVideoDtoValidation = (data: UpdateVideoDto) => {
  const errors: ValidationError[] = [];

  if (data.title === undefined) {
    errors.push({ field: 'title', message: 'Title is required' });
  } else {
    const titleError = validatorObject.validateTitle(data.title);
    if (titleError) {
      errors.push(titleError);
    }
  }

  if (data.author === undefined) {
    errors.push({ field: 'author', message: 'Author is required' });
  } else {
    const authorError = validatorObject.validateAuthor(data.author);
    if (authorError) {
      errors.push(authorError);
    }
  }

  if (data.availableResolutions === undefined) {
    errors.push({
      field: 'availableResolutions',
      message: 'Available resolutions is required',
    });
  } else {
    const resolutionsError = validatorObject.validateResolutions(
      data.availableResolutions,
    );
    if (resolutionsError) {
      errors.push(resolutionsError);
    }
  }

  if (data.canBeDownloaded === undefined) {
    errors.push({
      field: 'canBeDownloaded',
      message: 'canBeDownloaded is required',
    });
  } else if (typeof data.canBeDownloaded !== 'boolean') {
    errors.push({
      field: 'canBeDownloaded',
      message: 'Invalid canBeDownloaded',
    });
  }

  if (data.minAgeRestriction === undefined) {
    errors.push({
      field: 'minAgeRestriction',
      message: 'minAgeRestriction is required',
    });
  } else if (data.minAgeRestriction !== null) {
    if (
      typeof data.minAgeRestriction !== 'number' ||
      data.minAgeRestriction < 1 ||
      data.minAgeRestriction > 18
    ) {
      errors.push({
        field: 'minAgeRestriction',
        message: 'Invalid minAgeRestriction',
      });
    }
  }

  if (data.publicationDate === undefined) {
    errors.push({
      field: 'publicationDate',
      message: 'publicationDate is required',
    });
  } else {
    if (typeof data.publicationDate !== 'string' || !data.publicationDate) {
      errors.push({
        field: 'publicationDate',
        message: 'Invalid publicationDate',
      });
    } else {
      const date = new Date(data.publicationDate);
      if (isNaN(date.getTime())) {
        errors.push({
          field: 'publicationDate',
          message: 'Invalid publicationDate format',
        });
      }
    }
  }

  return errors;
};
