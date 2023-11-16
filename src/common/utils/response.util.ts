import { CoreOutPut } from '../dto/core.dto';
import logger from '../../config/logger/logger.service';
import {
  AnswerNotFoundError,
  OptionNotFoundError,
  QuestionNotFoundError,
  SurveyNotFoundError,
} from '../error/error.class';

export function handleErrorResponse<T extends CoreOutPut>(
  error: any,
  location: string,
): T {
  if (error instanceof SurveyNotFoundError) {
    return generateErrorResponse<T>(['survey-not-found']);
  }
  if (error instanceof QuestionNotFoundError) {
    return generateErrorResponse<T>(['question-not-found']);
  }
  if (error instanceof OptionNotFoundError) {
    return generateErrorResponse<T>(['option-not-found']);
  }
  if (error instanceof AnswerNotFoundError) {
    return generateErrorResponse<T>(['answer-not-found']);
  }
  return generateErrorResponse<T>(['server-error'], error, location);
}

export function generateErrorResponse<T extends CoreOutPut>(
  message: string[],
  error?: Error,
  location?: string,
): T {
  if (error) {
    const logObject = {
      location: location ? `[${location}]` : '[Unknown Location]',
      errorMessage: `Error: ${error.message}`,
      errorStack: error.stack,
    };
    logger.error(logObject);
  }

  return {
    ok: false,
    message,
  } as T;
}

export function generateOkResponse<T extends CoreOutPut>(
  data: Partial<T> = {}, // 추가 데이터를 위한 매개변수
): T {
  return {
    ok: true,
    ...data,
  } as T;
}
