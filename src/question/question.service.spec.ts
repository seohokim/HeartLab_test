import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { QuestionService } from './question.service';
import { Question } from './entities/question.entity';
import { Survey } from '../survey/entities/survey.entity';
import {
  CreateQuestionInputDto,
  CreateQuestionOutputDto,
} from './dto/create-question.dto';
import {
  GetQuestionInputDto,
  GetQuestionOutputDto,
} from './dto/get-question.dto';
import {
  UpdateQuestionInputDto,
  UpdateQuestionOutputDto,
} from './dto/update-question.dto';
import {
  DeleteQuestionInputDto,
  DeleteQuestionOutputDto,
} from './dto/delete-question.dto';
import {
  QuestionNotFoundError,
  SurveyNotFoundError,
} from '../common/error/error.class';
import { QuestionDTO } from './dto/question.dto';
import { SurveyService } from '../survey/survey.service';

describe('QuestionService', () => {
  let service: QuestionService;
  let questionRepository: Repository<Question>;
  let surveyRepository: Repository<Survey>;
  let surveyService: SurveyService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionService,
        SurveyService,
        {
          provide: getRepositoryToken(Question),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(Survey),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<QuestionService>(QuestionService);
    surveyService = module.get<SurveyService>(SurveyService);
    questionRepository = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
    surveyRepository = module.get<Repository<Survey>>(
      getRepositoryToken(Survey),
    );
  });

  describe('create', () => {
    it('question 생성', async () => {
      const createQuestionInput: CreateQuestionInputDto = {
        surveyId: 1,
        text: 'What is your favorite color?',
      };
      const survey = new Survey();
      survey.id = 1;
      survey.questions = [];
      jest.spyOn(surveyRepository, 'findOne').mockResolvedValue(survey);
      jest
        .spyOn(questionRepository, 'save')
        .mockImplementation((question: Question) => {
          return Promise.resolve({
            ...question,
            id: 1,
            questionOrder: 1,
          } as Question);
        });

      const result: CreateQuestionOutputDto =
        await service.create(createQuestionInput);
      const surveyDto = surveyService['toSurveyDto'](survey);
      expect(surveyRepository.findOne).toHaveBeenCalledWith({
        where: { id: createQuestionInput.surveyId },
        relations: ['questions'],
      });
      expect(questionRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          text: createQuestionInput.text,
          survey: survey,
          questionOrder: 1,
        }),
      );
      expect(result).toEqual({
        ok: true,
        statusCode: 200,
        surveyDto,
      });
    });

    it('입력한 id에 해당하는 survey가 없다면 SurveyNotFoundError return', async () => {
      const createQuestionInput: CreateQuestionInputDto = {
        surveyId: 1,
        text: 'What is your favorite color?',
      };
      jest.spyOn(surveyRepository, 'findOne').mockResolvedValue(undefined);

      const result = await service.create(createQuestionInput);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['survey-not-found'],
      });
    });
  });

  describe('findOne', () => {
    it('question 찾기', async () => {
      const getQuestionInputDto: GetQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
      };
      const question = new Question();
      question.id = 1;
      question.text = 'What is your favorite color?';
      question.questionOrder = 1;
      question.survey = new Survey();
      question.survey.id = 1;
      question.survey.questions = [question];
      jest
        .spyOn(surveyRepository, 'findOne')
        .mockResolvedValue(question.survey);

      const result: GetQuestionOutputDto =
        await service.findOne(getQuestionInputDto);
      const questionDto = service['toQuestionDto'](question);
      expect(surveyRepository.findOne).toHaveBeenCalledWith({
        where: { id: getQuestionInputDto.surveyId },
        relations: ['questions'],
      });
      expect(result).toEqual({
        ok: true,
        statusCode: 200,
        questionDto,
      });
    });

    it('id에 해당하는 survey 없으면 SurveyNotFoundError return', async () => {
      const getQuestionInputDto: GetQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
      };
      jest.spyOn(surveyRepository, 'findOne').mockResolvedValue(undefined);

      const result = await service.findOne(getQuestionInputDto);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['survey-not-found'],
      });
    });

    it('order에 해당하는 question 없으면 QuestionNotFoundError return', async () => {
      const getQuestionInputDto: GetQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
      };
      const survey = new Survey();
      survey.id = 1;
      survey.questions = [];
      jest.spyOn(surveyRepository, 'findOne').mockResolvedValue(survey);

      const result = await service.findOne(getQuestionInputDto);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['question-not-found'],
      });
    });
  });

  describe('update', () => {
    it('should update a question', async () => {
      const updateQuestionInputDto: UpdateQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
        text: 'What is your favorite animal?',
      };
      const survey = new Survey();
      survey.id = 1;
      survey.title = 'Test Survey';
      survey.description = 'Test Description';
      survey.createdAt = new Date();
      survey.updatedAt = new Date();
      survey.questions = [];
      survey.questions[0] = new Question();
      survey.questions[0].id = 1;
      survey.questions[0].text = 'What is your favorite color?';
      survey.questions[0].questionOrder = 1;
      survey.questions[0].survey = survey;
      survey.questions[0].options = [];
      jest
        .spyOn(service as any, 'findQuestion')
        .mockResolvedValue(survey.questions[0]);

      jest.spyOn(surveyRepository, 'findOne').mockResolvedValueOnce(survey);
      jest
        .spyOn(questionRepository, 'save')
        .mockResolvedValueOnce(survey.questions[0]);

      const result: UpdateQuestionOutputDto = await service.update(
        updateQuestionInputDto,
      );

      expect(result).toEqual({
        ok: true,
        statusCode: 200,
        surveyDto: {
          id: survey.id,
          title: survey.title,
          description: survey.description,
          createdAt: survey.createdAt,
          updatedAt: survey.updatedAt,
          questions: [
            {
              text: updateQuestionInputDto.text,
              questionOrder: 1,
              options: [],
              createdAt: survey.questions[0].createdAt,
              updatedAt: survey.questions[0].updatedAt,
            },
          ],
        },
      });
    });

    it('id에 해당하는 survey 없으면 SurveyNotFoundError return', async () => {
      const updateQuestionInputDto: UpdateQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
        text: 'What is your favorite animal?',
      };
      jest
        .spyOn(service, 'findQuestion' as any)
        .mockRejectedValue(new SurveyNotFoundError('Survey not found'));

      const result = await service.update(updateQuestionInputDto);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['survey-not-found'],
      });
    });

    it('order에 해당하는 question 없으면 QuestionNotFoundError return', async () => {
      const updateQuestionInputDto: UpdateQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
        text: 'What is your favorite animal?',
      };
      jest
        .spyOn(service as any, 'findQuestion')
        .mockRejectedValue(new QuestionNotFoundError('Question not found'));
      const result = await service.update(updateQuestionInputDto);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['question-not-found'],
      });
    });
  });

  describe('delete', () => {
    it('question 삭제', async () => {
      const deleteQuestionInputDto: DeleteQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
      };
      const question = new Question();
      question.id = 1;
      question.text = 'What is your favorite color?';
      question.survey = new Survey();
      question.survey.id = 1;
      question.survey.questions = [question];
      jest.spyOn(service as any, 'findQuestion').mockResolvedValue(question);
      jest.spyOn(questionRepository, 'remove').mockResolvedValue(undefined);
      jest
        .spyOn(surveyRepository, 'findOne')
        .mockResolvedValue(question.survey);
      jest.spyOn(surveyRepository, 'save').mockResolvedValue(question.survey);

      const result: DeleteQuestionOutputDto = await service.delete(
        deleteQuestionInputDto,
      );
      const surveyDto = surveyService['toSurveyDto'](question.survey);
      expect((service as any).findQuestion).toHaveBeenCalledWith(
        deleteQuestionInputDto.surveyId,
        deleteQuestionInputDto.questionOrder,
      );
      expect(questionRepository.remove).toHaveBeenCalledWith(question);
      expect(surveyRepository.findOne).toHaveBeenCalledWith({
        where: { id: deleteQuestionInputDto.surveyId },
        relations: ['questions'],
      });
      expect(surveyRepository.save).toHaveBeenCalledWith(
        question.survey.questions,
      );
      expect(result).toEqual({
        ok: true,
        statusCode: 200,
        surveyDto,
      });
    });

    it('id에 해당하는 survey 없으면 SurveyNotFoundError return', async () => {
      const deleteQuestionInputDto: DeleteQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
      };
      jest
        .spyOn(service as any, 'findQuestion')
        .mockRejectedValue(new SurveyNotFoundError('Survey not found'));

      const result = await service.delete(deleteQuestionInputDto);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['survey-not-found'],
      });
    });

    it('order에 해당하는 question 없으면 QuestionNotFoundError return', async () => {
      const deleteQuestionInputDto: DeleteQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
      };
      jest
        .spyOn(service as any, 'findQuestion')
        .mockRejectedValue(new QuestionNotFoundError('Question not found'));

      const result = await service.delete(deleteQuestionInputDto);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['question-not-found'],
      });
    });
  });

  describe('toQuestionDto', () => {
    it('Question을 QuestionDto로 변환', () => {
      const question = new Question();
      question.id = 1;
      question.text = 'What is your favorite color?';
      question.questionOrder = 1;
      question.survey = new Survey();
      question.survey.id = 1;
      question.options = [
        {
          id: 1,
          text: 'Red',
          optionOrder: 1,
          score: 1,
          createdAt: new Date(),
          updatedAt: new Date(),
          question: question,
        },
        {
          id: 2,
          text: 'Blue',
          optionOrder: 2,
          score: 2,
          createdAt: new Date(),
          updatedAt: new Date(),
          question: question,
        },
      ];

      const result: QuestionDTO = service['toQuestionDto'](question);

      expect(result).toEqual({
        text: question.text,
        questionOrder: question.questionOrder,
        options: [
          {
            text: 'Red',
            optionOrder: 1,
            score: 1,
            createdAt: question.options[0].createdAt,
            updatedAt: question.options[0].updatedAt,
          },
          {
            text: 'Blue',
            optionOrder: 2,
            score: 2,
            createdAt: question.options[1].createdAt,
            updatedAt: question.options[1].updatedAt,
          },
        ],
        updatedAt: question.updatedAt,
        createdAt: question.createdAt,
      });
    });
  });
});
