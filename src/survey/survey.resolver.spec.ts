import { Test, TestingModule } from '@nestjs/testing';
import { SurveyResolver } from './survey.resolver';
import { SurveyService } from './survey.service';
import {
  CreateSurveyInputDto,
  CreateSurveyOutputDto,
} from './dtos/create-survey.dto';
import { GetSurveyInputDto, GetSurveyOutputDto } from './dtos/get-survey.dto';
import {
  UpdateSurveyInputDto,
  UpdateSurveyOutputDto,
} from './dtos/update-survey.dto';
import {
  DeleteSurveyInputDto,
  DeleteSurveyOutputDto,
} from './dtos/delete-survey.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Survey } from './entities/survey.entity';
import { Repository } from 'typeorm';

describe('SurveyResolver', () => {
  let resolver: SurveyResolver;
  let service: SurveyService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyResolver,
        SurveyService,
        {
          provide: getRepositoryToken(Survey),
          useClass: Repository,
        },
      ],
    }).compile();

    resolver = module.get<SurveyResolver>(SurveyResolver);
    service = module.get<SurveyService>(SurveyService);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });

  describe('readSurvey', () => {
    it('survey 찾기', async () => {
      const survey = {
        id: 1,
        title: 'Test Survey',
        description: 'Test Description',
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'findOne').mockImplementation(async () => ({
        ok: true,
        statusCode: 200,
        survey,
      }));

      const getSurveyInput: GetSurveyInputDto = { id: 1 };
      const result: GetSurveyOutputDto =
        await resolver.getSurvey(getSurveyInput);

      expect(service.findOne).toHaveBeenCalledWith(getSurveyInput);
      expect(result).toEqual({ ok: true, statusCode: 200, survey });
    });
  });

  describe('readSurveys', () => {
    it('모든 survey 찾기', async () => {
      const surveys = [
        {
          id: 1,
          title: 'Test Survey 1',
          description: 'Test Description 1',
          questions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          id: 2,
          title: 'Test Survey 2',
          description: 'Test Description 2',
          questions: [],
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ];
      jest.spyOn(service, 'findAll').mockImplementation(async () => ({
        ok: true,
        statusCode: 200,
        surveys,
      }));

      const result = await resolver.getSurveys();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual({ ok: true, statusCode: 200, surveys });
    });
  });

  describe('createSurvey', () => {
    it('survey 생성', async () => {
      const survey = {
        id: 1,
        title: 'Test Survey',
        description: 'Test Description',
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'create').mockImplementation(async () => ({
        ok: true,
        statusCode: 200,
        survey,
      }));

      const createSurveyInput: CreateSurveyInputDto = {
        title: 'Test Survey',
        description: 'Test Description',
      };
      const result: CreateSurveyOutputDto =
        await resolver.createSurvey(createSurveyInput);

      expect(service.create).toHaveBeenCalledWith(createSurveyInput);
      expect(result).toEqual({ ok: true, statusCode: 200, survey });
    });
  });

  describe('updateSurvey', () => {
    it('survey 업데이트', async () => {
      const survey = {
        id: 1,
        title: 'Test Survey',
        description: 'Test Description',
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'update').mockImplementation(async () => ({
        ok: true,
        statusCode: 200,
        survey,
      }));

      const updateSurveyInput: UpdateSurveyInputDto = {
        id: 1,
        changedTitle: 'Updated Test Survey',
        changedDescription: 'Updated Test Description',
      };
      const result: UpdateSurveyOutputDto =
        await resolver.updateSurvey(updateSurveyInput);

      expect(service.update).toHaveBeenCalledWith(updateSurveyInput);
      expect(result).toEqual({ ok: true, statusCode: 200, survey });
    });
  });

  describe('removeSurvey', () => {
    it('survey 삭제', async () => {
      const survey = {
        id: 1,
        title: 'Test Survey',
        description: 'Test Description',
        questions: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      jest.spyOn(service, 'delete').mockImplementation(async () => ({
        ok: true,
        statusCode: 200,
        survey,
      }));

      const removeSurveyInput: DeleteSurveyInputDto = { id: 1 };
      const result: DeleteSurveyOutputDto =
        await resolver.deleteSurvey(removeSurveyInput);

      expect(service.delete).toHaveBeenCalledWith(removeSurveyInput);
      expect(result).toEqual({ ok: true, statusCode: 200, survey });
    });
  });
});
