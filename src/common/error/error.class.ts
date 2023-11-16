export class SurveyNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'SurveyNotFoundError';
  }
}

export class QuestionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'QuestionNotFoundError';
  }
}

export class OptionNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'OptionNotFoundError';
  }
}

export class AnswerNotFoundError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'AnswerNotFoundError';
  }
}
