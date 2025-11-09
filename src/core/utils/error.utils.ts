import { ValidationError } from '../../videos/types/validationError';

export const createErrorMessages = (
  validationErrors: ValidationError[],
): { errorsMessages: ValidationError[] } => {
  return { errorsMessages: validationErrors };
};
