import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { SurveyType } from './types/survey.type';
import {
  CreateSurveyInputDto,
  CreateSurveyOutputDto,
} from './dtos/create-survey.dto';
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

@Resolver((of) => SurveyType)
export class SurveyResolver {
  constructor(private surveyService: SurveyService) {}

  @Query(() => GetSurveyOutputDto)
  async getSurvey(
    @Args('getSurveyInput') getSurveyInput: GetSurveyInputDto,
  ): Promise<GetSurveyOutputDto> {
    const result = await this.surveyService.findOne(getSurveyInput);
    return result;
  }

  @Query((returns) => GetSurveysOutputDto)
  async getSurveys(): Promise<GetSurveysOutputDto> {
    const result = await this.surveyService.findAll();
    return result;
  }

  @Mutation(() => CreateSurveyOutputDto)
  async createSurvey(
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInputDto,
  ): Promise<CreateSurveyOutputDto> {
    return await this.surveyService.create(createSurveyInput);
  }

  @Mutation(() => UpdateSurveyOutputDto)
  async updateSurvey(
    @Args('updateSurveyInput') updateSurveyInput: UpdateSurveyInputDto,
  ): Promise<UpdateSurveyOutputDto> {
    const result = await this.surveyService.update(updateSurveyInput);
    return result;
  }

  @Mutation(() => DeleteSurveyOutputDto)
  async deleteSurvey(
    @Args('deleteSurveyInput') deleteSurveyInput: DeleteSurveyInputDto,
  ): Promise<DeleteSurveyOutputDto> {
    return await this.surveyService.delete(deleteSurveyInput);
  }
}
