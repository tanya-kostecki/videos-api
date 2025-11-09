import { CreateVideoDto } from '../dto/CreateVideoDto';
import { ValidationError } from '../types/validationError';
import { validatorObject } from './validatorObject';

export const createVideoDtoValidation = (data: CreateVideoDto) => {
  const errors: ValidationError[] = [];

  const titleError = validatorObject.validateTitle(data.title);
  if (titleError) {
    errors.push(titleError);
  }

  const authorError = validatorObject.validateAuthor(data.author);
  if (authorError) {
    errors.push(authorError);
  }

  const resolutionsError = validatorObject.validateResolutions(
    data.availableResolutions,
  );
  if (resolutionsError) {
    errors.push(resolutionsError);
  }

  return errors;
};
