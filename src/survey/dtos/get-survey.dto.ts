import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyDTO } from './survey.dto';

@InputType()
export class GetSurveyInputDto {
  @Field(() => Int)
  surveyId: number;
}

@ObjectType()
export class GetSurveyOutputDto extends CoreOutPut {
  @Field(() => SurveyDTO)
  surveyDto?: SurveyDTO;
}

@ObjectType()
export class GetSurveysOutputDto extends CoreOutPut {
  @Field(() => [SurveyDTO])
  surveyDtos?: SurveyDTO[];
}
