import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Survey } from './entities/survey.entity';
import {
  CreateSurveyInputDto,
  CreateSurveyOutputDto,
} from './dto/create-survey.dto';
import {
  generateErrorResponse,
  generateOkResponse,
} from '../common/utils/response.util';
import logger from '../logger/logger.service';
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
  RemoveSurveyInputDto,
  RemoveSurveyOutputDto,
} from './dto/remove-survey.dto';

@Injectable()
export class SurveyService {
  constructor(
    @InjectRepository(Survey)
    private surveyRepository: Repository<Survey>,
  ) {}

  async create(
    createSurveyInputDto: CreateSurveyInputDto,
  ): Promise<CreateSurveyOutputDto> {
    try {
      const survey = this.surveyRepository.create(createSurveyInputDto);
      await this.surveyRepository.save(survey);
      return generateOkResponse<CreateSurveyOutputDto>(200, { survey });
    } catch (error) {
      return generateErrorResponse<CreateSurveyOutputDto>(
        ['server-error'],
        500,
        error,
        'SurveyService.create',
      );
    }
  }

  async findOne(
    getSurveyInputDto: GetSurveyInputDto,
  ): Promise<GetSurveyOutputDto> {
    try {
      const survey = await this.findSurveyById(getSurveyInputDto.id);
      if (!survey) {
        return generateErrorResponse<GetSurveyOutputDto>(
          ['survey-not-found'],
          404,
        );
      }
      return generateOkResponse<GetSurveyOutputDto>(200, { survey });
    } catch (error) {
      return generateErrorResponse<GetSurveyOutputDto>(
        ['server-error'],
        500,
        error,
        'SurveyService.findOne',
      );
    }
  }

  async findAll(): Promise<GetSurveysOutputDto> {
    try {
      const surveys = await this.surveyRepository.find({
        relations: ['questions'],
      });
      return generateOkResponse<GetSurveysOutputDto>(200, { surveys });
    } catch (error) {
      return generateErrorResponse<GetSurveysOutputDto>(
        ['server-error'],
        500,
        error,
        'SurveyService.findAll',
      );
    }
  }

  async update(
    updateSurveyInputDto: UpdateSurveyInputDto,
  ): Promise<UpdateSurveyOutputDto> {
    try {
      const survey = await this.findSurveyById(updateSurveyInputDto.id);
      if (!survey) {
        return generateErrorResponse<UpdateSurveyOutputDto>(
          ['survey-not-found'],
          404,
        );
      }
      const updatedSurvey = await this.updateSurvey(
        survey,
        updateSurveyInputDto,
      );
      return generateOkResponse<UpdateSurveyOutputDto>(200, {
        survey: updatedSurvey,
      });
    } catch (error) {
      return generateErrorResponse<UpdateSurveyOutputDto>(
        ['server-error'],
        500,
        error,
        'SurveyService.update',
      );
    }
  }

  async remove(
    removeSurveyInputDto: RemoveSurveyInputDto,
  ): Promise<RemoveSurveyOutputDto> {
    try {
      const survey = await this.findSurveyById(removeSurveyInputDto.id);
      if (!survey) {
        return generateErrorResponse<RemoveSurveyOutputDto>(
          ['survey-not-found'],
          404,
        );
      }
      await this.surveyRepository.remove(survey);
      return generateOkResponse<RemoveSurveyOutputDto>(200, { survey });
    } catch (error) {
      return generateErrorResponse<RemoveSurveyOutputDto>(
        ['server-error'],
        500,
        error,
        'SurveyService.remove',
      );
    }
  }

  private async findSurveyById(id: number): Promise<Survey | undefined> {
    try {
      return await this.surveyRepository.findOne({ where: { id } });
    } catch (error) {
      throw new Error(error);
    }
  }

  private async updateSurvey(
    survey: Survey,
    updateSurveyInputDto: UpdateSurveyInputDto,
  ): Promise<Survey> {
    try {
      const updatedSurvey = await this.surveyRepository.save({
        ...survey,
        ...updateSurveyInputDto,
      });
      return updatedSurvey;
    } catch (error) {
      throw new Error(error);
    }
  }
}
