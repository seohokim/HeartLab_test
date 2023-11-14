import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';
import { SurveyService } from './survey.service';

describe('SurveyService', () => {
  let service: SurveyService;
  let repository: Repository<Survey>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: getRepositoryToken(Survey),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<SurveyService>(SurveyService);
    repository = module.get<Repository<Survey>>(getRepositoryToken(Survey));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('survey 생성했다면 ok return 해야함', async () => {
      const createSurveyInput = {
        title: 'Test Survey',
        description: 'Test Description',
      };
      const survey = new Survey();
      survey.title = createSurveyInput.title;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      jest.spyOn(repository, 'create').mockReturnValueOnce(survey);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(survey);
      const result = await service.create(createSurveyInput);
      expect(result).toEqual({
        ok: true,
        statusCode: 200,
        surveyDto: expect.any(Object),
      });
    });

    it('서버에 에러가 있다면, server-error return 해야함', async () => {
      const createSurveyInput = {
        title: 'Test Survey',
        description: 'Test Description',
      };
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());
      const result = await service.create(createSurveyInput);
      expect(result).toEqual({
        ok: false,
        statusCode: 500,
        message: ['server-error'],
      });
    });
  });

  describe('findOne', () => {
    it('입력한 id에 해당하는 survey가 있다면, 해당 survey return 해야함', async () => {
      const getSurveyInput = { id: 1 };
      const survey = new Survey();
      survey.id = getSurveyInput.id;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(survey);
      const result = await service.findOne(getSurveyInput);
      expect(result).toEqual({
        ok: true,
        statusCode: 200,
        surveyDto: expect.any(Object),
      });
    });

    it('입력한 id에 해당하는 survey가 없다면, surver-not-found return 해야함', async () => {
      const getSurveyInput = { id: 1 };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      const result = await service.findOne(getSurveyInput);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['survey-not-found'],
      });
    });

    it('서버에 에러가 있다면, server-error return 해야함', async () => {
      const getSurveyInput = { id: 1 };
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());
      const result = await service.findOne(getSurveyInput);
      expect(result).toEqual({
        ok: false,
        statusCode: 500,
        message: ['server-error'],
      });
    });
  });

  describe('findAll', () => {
    it('모든 survey를 return 해야함', async () => {
      const surveys = [new Survey()];
      jest.spyOn(repository, 'find').mockResolvedValueOnce(surveys);
      const result = await service.findAll();
      expect(result).toEqual({
        ok: true,
        statusCode: 200,
        surveyDtos: expect.any(Object),
      });
    });

    it('서버에 에러가 있다면, server-error return 해야함', async () => {
      jest.spyOn(repository, 'find').mockRejectedValueOnce(new Error());
      const result = await service.findAll();
      expect(result).toEqual({
        ok: false,
        statusCode: 500,
        message: ['server-error'],
      });
    });
  });

  describe('update', () => {
    it('survey update 해야함', async () => {
      const updateSurveyInput = {
        id: 1,
        title: 'Updated Survey',
        description: 'Updated Description',
      };
      const survey = new Survey();
      survey.id = updateSurveyInput.id;
      survey.title = updateSurveyInput.title;
      survey.description = updateSurveyInput.description;
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(survey);
      jest.spyOn(repository, 'save').mockResolvedValueOnce(survey);
      const result = await service.update(updateSurveyInput);
      expect(result).toEqual({
        ok: true,
        statusCode: 200,
        surveyDto: expect.any(Object),
      });
    });

    it('입력한 id에 해당하는 survey가 없다면, survey-not-found return 해야함', async () => {
      const updateSurveyInput = {
        id: 1,
        title: 'Updated Survey',
        description: 'Updated Description',
      };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      const result = await service.update(updateSurveyInput);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['survey-not-found'],
      });
    });

    it('서버에 에러가 있다면, server-error return 해야함', async () => {
      const updateSurveyInput = { id: 1, title: 'Updated Survey' };
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());
      const result = await service.update(updateSurveyInput);
      expect(result).toEqual({
        ok: false,
        statusCode: 500,
        message: ['server-error'],
      });
    });
  });

  describe('delete', () => {
    it('survey 제거해야함', async () => {
      const deleteSurveyInput = { id: 1 };
      const survey = new Survey();
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(survey);
      jest.spyOn(repository, 'remove').mockResolvedValueOnce(survey);

      const result = await service.delete(deleteSurveyInput);

      expect(result).toEqual({
        ok: true,
        statusCode: 200,
        surveyDto: expect.any(Object),
      });
    });

    it('입력한 id에 해당하는 survey가 없다면, survey-not-found return 해야함', async () => {
      const deleteSurveyInput = { id: 1 };
      jest.spyOn(repository, 'findOne').mockResolvedValueOnce(undefined);
      const result = await service.delete(deleteSurveyInput);
      expect(result).toEqual({
        ok: false,
        statusCode: 404,
        message: ['survey-not-found'],
      });
    });

    it('서버에 에러가 있다면, server-error return 해야함', async () => {
      const deleteSurveyInput = { id: 1 };
      jest.spyOn(repository, 'findOne').mockRejectedValueOnce(new Error());
      const result = await service.delete(deleteSurveyInput);
      expect(result).toEqual({
        ok: false,
        statusCode: 500,
        message: ['server-error'],
      });
    });
  });
});
