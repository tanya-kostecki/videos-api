import { ValidationError } from '../../videos/types/validationError';

export const createErrorMessages = (
  validationErrors: ValidationError[],
): { errorMessages: ValidationError[] } => {
  return { errorMessages: validationErrors };
};
