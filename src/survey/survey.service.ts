import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';
import {
  CreateSurveyInputDto,
  CreateSurveyOutputDto,
} from './dtos/create-survey.dto';
import {
  generateOkResponse,
  handleErrorResponse,
} from '../common/utils/response.util';
import {
  GetSurveyInputDto,
  GetSurveyOutputDto,
  GetSurveysOutputDto,
} from './dtos/get-survey.dto';
import {
  UpdateSurveyInputDto,
  UpdateSurveyOutputDto,
} from './dtos/update-survey.dto';
import {
  DeleteSurveyInputDto,
  DeleteSurveyOutputDto,
} from './dtos/delete-survey.dto';
import { SurveyNotFoundError } from '../common/error/error.class';
import { QuestionDTO } from 'src/question/dtos/question.dto';
import { OptionDTO } from '../option/dtos/option.dto';
import { SurveyDTO } from './dtos/survey.dto';

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
      return generateOkResponse<CreateSurveyOutputDto>({ surveyDto });
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
      const surveyEntity = await this.findSurveyById(getSurveyInput.surveyId);
      const surveyDto = this.toSurveyDto(surveyEntity);
      return generateOkResponse<GetSurveyOutputDto>({ surveyDto });
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
        relations: ['questions', 'questions.options'],
      });
      const surveyDtos = surveyEntities.map((survey) =>
        this.toSurveyDto(survey),
      );
      return generateOkResponse<GetSurveysOutputDto>({
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
      return generateOkResponse<UpdateSurveyOutputDto>({
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
      const survey = await this.findSurveyById(deleteSurveyInput.surveyId);
      await this.surveyRepository.remove(survey);
      return generateOkResponse<DeleteSurveyOutputDto>();
    } catch (error) {
      return handleErrorResponse<DeleteSurveyOutputDto>(
        error,
        'SurveyService.delete',
      );
    }
  }

  async createAndSaveSurvey(
    createSurveyInput: CreateSurveyInputDto,
  ): Promise<Survey> {
    const survey = this.surveyRepository.create(createSurveyInput);
    await this.surveyRepository.save(survey);
    return survey;
  }

  async findSurveyById(id: number): Promise<Survey> {
    const survey = await this.surveyRepository.findOne({
      where: { id },
      relations: ['questions', 'questions.options'],
    });
    if (!survey) {
      throw new SurveyNotFoundError('Survey not found');
    }
    return survey;
  }

  async updateAndSaveSurvey(
    updateSurveyInput: UpdateSurveyInputDto,
  ): Promise<Survey> {
    const survey = await this.findSurveyById(updateSurveyInput.surveyId);
    if (updateSurveyInput.changedTitle) {
      survey.title = updateSurveyInput.changedTitle;
    }
    if (updateSurveyInput.changedDescription) {
      survey.description = updateSurveyInput.changedDescription;
    }
    await this.surveyRepository.save(survey);
    return survey;
  }

  toSurveyDto(surveyEntity: Survey): SurveyDTO {
    const { questions } = surveyEntity;
    let questionDtos: QuestionDTO[] = [];
    if (questions) {
      questionDtos = questions
        .map((question) => {
          // Option 엔티티를 OptionDTO로 변환
          let optionDtos: OptionDTO[] = [];
          if (question.options) {
            optionDtos = question.options
              .map((option) => ({
                optionText: option.optionText,
                optionOrder: option.optionOrder,
                score: option.score,
                createdAt: option.createdAt,
                updatedAt: option.updatedAt,
              }))
              .sort((a, b) => a.optionOrder - b.optionOrder);
          }
          return {
            questionText: question.questionText,
            questionOrder: question.questionOrder,
            createdAt: question.createdAt,
            updatedAt: question.updatedAt,
            options: optionDtos,
          };
        })
        .sort((a, b) => a.questionOrder - b.questionOrder);
    }
    return {
      ...surveyEntity,
      questions: questionDtos,
    };
  }
}
