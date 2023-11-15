import { Test, TestingModule } from '@nestjs/testing';
import { QuestionResolver } from './question.resolver';
import { QuestionService } from './question.service';
import {
  GetQuestionInputDto,
  GetQuestionOutputDto,
} from './dto/get-question.dto';
import {
  CreateQuestionInputDto,
  CreateQuestionOutputDto,
} from './dto/create-question.dto';
import {
  UpdateQuestionInputDto,
  UpdateQuestionOutputDto,
} from './dto/update-question.dto';
import {
  DeleteQuestionInputDto,
  DeleteQuestionOutputDto,
} from './dto/delete-question.dto';
import { Repository } from 'typeorm';
import { Question } from './entities/question.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SurveyService } from '../survey/survey.service';
import { Survey } from '../survey/entities/survey.entity';

describe('QuestionResolver', () => {
  let resolver: QuestionResolver;
  let questionService: QuestionService;
  let questionRepository: Repository<Question>;
  let surveyService: SurveyService;
  let surveyRepository: Repository<Survey>;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        QuestionResolver,
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

    questionRepository = module.get<Repository<Question>>(
      getRepositoryToken(Question),
    );
    resolver = module.get<QuestionResolver>(QuestionResolver);
    questionService = module.get<QuestionService>(QuestionService);
    surveyService = module.get<SurveyService>(SurveyService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('question', () => {
    it('question 찾기', async () => {
      const survey = {
        id: 1,
        title: 'Test Survey',
        description: 'Test Description',
        questions: [
          {
            id: 1,
            text: 'Test Question',
            questionOrder: 1,
            survey: undefined,
            options: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const questionDto = questionService['toQuestionDto'](survey.questions[0]);
      const mockResult = {
        ok: true,
        statusCode: 200,
        questionDto,
      };
      jest
        .spyOn(questionService, 'questionFindOne')
        .mockImplementation(async () => mockResult);

      const getQuestionInput: GetQuestionInputDto = {
        surveyId: 1,
        questionOrder: 1,
      };
      const expectedResult: GetQuestionOutputDto = {
        ok: true,
        statusCode: 200,
        questionDto,
      };
      await expect(resolver.question(getQuestionInput)).resolves.toEqual(
        expectedResult,
      );
    });
  });

  describe('createQuestion', () => {
    it('question 생성', async () => {
      const surveyDto = {
        id: 2,
        title: 'Test Survey',
        description: 'Test Description',
        questions: [
          {
            text: 'Test Question',
            questionOrder: 1,
            options: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
          {
            text: 'Test Question 2',
            questionOrder: 2,
            options: [],
            createdAt: new Date(),
            updatedAt: new Date(),
          },
        ],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(questionService, 'create').mockImplementation(async () => ({
        ok: true,
        statusCode: 200,
        surveyDto,
      }));

      const createQuestionInput: CreateQuestionInputDto = {
        text: 'Test Question 2',
        surveyId: 2,
      };
      const result: CreateQuestionOutputDto = {
        ok: true,
        statusCode: 200,
        surveyDto: {
          id: 2,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: 'Test Survey',
          description: 'Test Description',
          questions: [
            {
              text: 'Test Question',
              questionOrder: 1,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              options: [],
            },
            {
              text: 'Test Question 2',
              questionOrder: 2,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              options: [],
            },
          ],
        },
      };
      expect(await resolver.createQuestion(createQuestionInput)).toEqual(
        result,
      );
    });
  });

  describe('updateQuestion', () => {
    it('question 업데이트', async () => {
      const question = {
        id: 1,
        text: 'Test Question',
        questionOrder: 1,
        survey: undefined,
        options: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const survey = new Survey();
      survey.id = 2;
      survey.title = 'Test Survey';
      survey.description = 'Test Description';
      survey.questions = [question];
      survey.createdAt = new Date();
      survey.updatedAt = new Date();

      jest.spyOn(questionService, 'update').mockImplementation(async () => ({
        ok: true,
        statusCode: 200,
        surveyDto: {
          id: 2,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: 'Test Survey',
          description: 'Test Description',
          questions: [
            {
              text: 'Updated Question',
              questionOrder: 1,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              options: [],
            },
          ],
        },
      }));

      const updateQuestionInput: UpdateQuestionInputDto = {
        surveyId: 2,
        questionOrder: 1,
        text: 'Updated Question',
      };
      const result: UpdateQuestionOutputDto = {
        ok: true,
        statusCode: 200,
        surveyDto: {
          id: 2,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: 'Test Survey',
          description: 'Test Description',
          questions: [
            {
              text: 'Updated Question',
              questionOrder: 1,
              createdAt: expect.any(Date),
              updatedAt: expect.any(Date),
              options: [],
            },
          ],
        },
      };
      expect(await resolver.updateQuestion(updateQuestionInput)).toEqual(
        result,
      );
    });
  });

  describe('removeQuestion', () => {
    it('question 제거', async () => {
      const question = {
        id: 1,
        text: 'Test Question',
        questionOrder: 1,
        survey: undefined,
        options: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      const survey = new Survey();
      survey.id = 2;
      survey.title = 'Test Survey';
      survey.description = 'Test Description';
      survey.questions = [question];
      survey.createdAt = new Date();
      survey.updatedAt = new Date();

      jest.spyOn(questionService, 'delete').mockImplementation(async () => ({
        ok: true,
        statusCode: 200,
        surveyDto: {
          id: 2,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: 'Test Survey',
          description: 'Test Description',
          questions: [],
        },
      }));

      const deleteQuestionInput: DeleteQuestionInputDto = {
        surveyId: 2,
        questionOrder: 1,
      };
      const result: DeleteQuestionOutputDto = {
        ok: true,
        statusCode: 200,
        surveyDto: {
          id: 2,
          createdAt: expect.any(Date),
          updatedAt: expect.any(Date),
          title: 'Test Survey',
          description: 'Test Description',
          questions: [],
        },
      };
      expect(await resolver.removeQuestion(deleteQuestionInput)).toEqual(
        result,
      );
    });
  });
});
