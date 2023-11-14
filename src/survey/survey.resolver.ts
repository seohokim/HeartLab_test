import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { SurveyType } from './types/survey.type';
import {
  CreateSurveyInputDto,
  CreateSurveyOutputDto,
} from './dto/create-survey.dto';
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

@Resolver((of) => SurveyType)
export class SurveyResolver {
  constructor(private surveyService: SurveyService) {}

  @Query((returns) => SurveyType)
  async readSurvey(
    @Args('getSurveyInput') getSurveyInput: GetSurveyInputDto,
  ): Promise<GetSurveyOutputDto> {
    return this.surveyService.findOne(getSurveyInput);
  }

  @Query((returns) => [SurveyType])
  async readSurveys(): Promise<GetSurveysOutputDto> {
    return this.surveyService.findAll();
  }
  @Mutation((returns) => SurveyType)
  async createSurvey(
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInputDto,
  ): Promise<CreateSurveyOutputDto> {
    return this.surveyService.create(createSurveyInput);
  }

  @Mutation((returns) => SurveyType)
  async updateSurvey(
    @Args('updateSurveyInput') updateSurveyInput: UpdateSurveyInputDto,
  ): Promise<UpdateSurveyOutputDto> {
    return this.surveyService.update(updateSurveyInput);
  }

  @Mutation((returns) => SurveyType)
  async removeSurvey(
    @Args('updateSurveyInput') removeSurveyInput: RemoveSurveyInputDto,
  ): Promise<RemoveSurveyOutputDto> {
    return this.surveyService.remove(removeSurveyInput);
  }
}
