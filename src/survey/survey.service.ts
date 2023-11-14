import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey, SurveyDTO } from './entities/survey.entity';
import {
  CreateSurveyInputDto,
  CreateSurveyOutputDto,
} from './dto/create-survey.dto';
import {
  generateOkResponse,
  handleErrorResponse,
} from '../common/utils/response.util';
import {
  GetSurveyInputDto,
  GetSurveyOutputDto,
  GetSurveysOutputDto,
} from './dto/get-survey.dto';
import {
  UpdateSurveyInputDto,
  UpdateSurveyOutputDto,
} from './dto/update-survey.dto';
import {
  DeleteSurveyInputDto,
  DeleteSurveyOutputDto,
} from './dto/delete-survey.dto';
import { SurveyNotFoundError } from '../common/error/error.class';
import { QuestionDTO } from 'src/question/dto/question.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  // create 메서드
  async create(
    createSurveyInput: CreateSurveyInputDto,
  ): Promise<CreateSurveyOutputDto> {
    try {
      const survey = await this.createAndSaveSurvey(createSurveyInput);
      const surveyDto = this.toSurveyDto(survey);
      return generateOkResponse<CreateSurveyOutputDto>(200, { surveyDto });
    } catch (error) {
      return handleErrorResponse<CreateSurveyOutputDto>(
        error,
        'SurveyService.create',
      );
    }
  }

  // read 메서드
  async findOne(
    getSurveyInput: GetSurveyInputDto,
  ): Promise<GetSurveyOutputDto> {
    try {
      const surveyEntity = await this.findSurveyById(getSurveyInput.id);
      const surveyDto = this.toSurveyDto(surveyEntity);
      return generateOkResponse<GetSurveyOutputDto>(200, { surveyDto });
    } catch (error) {
      return handleErrorResponse<GetSurveyOutputDto>(
        error,
        'SurveyService.findOne',
      );
    }
  }

  // readAll 메서드
  async findAll(): Promise<GetSurveysOutputDto> {
    try {
      const surveyEntities = await this.surveyRepository.find({
        relations: ['questions'],
      });
      const surveyDtos = surveyEntities.map((survey) =>
        this.toSurveyDto(survey),
      );
      return generateOkResponse<GetSurveysOutputDto>(200, {
        surveyDtos,
      });
    } catch (error) {
      return handleErrorResponse<GetSurveysOutputDto>(
        error,
        'SurveyService.findAll',
      );
    }
  }

  // update 메서드
  async update(
    updateSurveyInput: UpdateSurveyInputDto,
  ): Promise<UpdateSurveyOutputDto> {
    try {
      const updatedSurvey = await this.updateAndSaveSurvey(updateSurveyInput);
      const surveyDto = this.toSurveyDto(updatedSurvey);
      return generateOkResponse<UpdateSurveyOutputDto>(200, {
        surveyDto,
      });
    } catch (error) {
      return handleErrorResponse<UpdateSurveyOutputDto>(
        error,
        'SurveyService.update',
      );
    }
  }

  // delete 메서드
  async delete(
    deleteSurveyInput: DeleteSurveyInputDto,
  ): Promise<DeleteSurveyOutputDto> {
    try {
      const survey = await this.findSurveyById(deleteSurveyInput.id);
      await this.surveyRepository.remove(survey);
      const surveyDto = this.toSurveyDto(survey);
      return generateOkResponse<DeleteSurveyOutputDto>(200, { surveyDto });
    } catch (error) {
      return handleErrorResponse<DeleteSurveyOutputDto>(
        error,
        'SurveyService.delete',
      );
    }
  }

  private async createAndSaveSurvey(
    createSurveyInput: CreateSurveyInputDto,
  ): Promise<Survey> {
    const survey = this.surveyRepository.create(createSurveyInput);
    await this.surveyRepository.save(survey);
    return survey;
  }

  async findSurveyById(id: number): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({ where: { id } });
    if (!survey) {
      throw new SurveyNotFoundError('Survey not found');
    }
    return survey;
  }

  private async updateAndSaveSurvey(
    updateSurveyInput: UpdateSurveyInputDto,
  ): Promise<Survey> {
    const survey = await this.findSurveyById(updateSurveyInput.id);
    Object.assign(survey, updateSurveyInput);
    await this.surveyRepository.save(survey);
    return survey;
  }

  toSurveyDto(surveyEntity: Survey): SurveyDTO {
    const { questions } = surveyEntity;
    let questionDtos: QuestionDTO[] = [];
    if (questions) {
      questionDtos = questions.map((question) => {
        return {
          text: question.text,
          questionOrder: question.questionOrder,
          surveyId: question.survey.id,
          createdAt: question.createdAt,
          updatedAt: question.updatedAt,
        };
      });
    }
    return {
      ...surveyEntity,
      questions: questionDtos,
    };
  }
}
