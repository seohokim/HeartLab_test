import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { SurveyService } from './survey.service';
import { SurveyType } from './types/survey.type';
import { CreateSurveyInputDto } from './dto/create-surver.dto';

@Resolver((of) => SurveyType)
export class SurveyResolver {
  constructor(private surveyService: SurveyService) {}

  @Query((returns) => SurveyType)
  async survey(@Args('id', { type: () => Int }) id: number) {
    return this.surveyService.findOne(id);
  }

  @Mutation((returns) => SurveyType)
  async createSurvey(
    @Args('createSurveyInput') createSurveyInput: CreateSurveyInputDto,
  ) {
    return this.surveyService.create(createSurveyInput);
  }

  // 기타 필요한 Query와 Mutation 추가
}
