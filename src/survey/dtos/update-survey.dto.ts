import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyDTO } from './survey.dto';

@InputType()
export class UpdateSurveyInputDto {
  @Field(() => Int)
  surveyId: number;

  @Field({ nullable: true })
  changedTitle?: string;

  @Field({ nullable: true })
  changedDescription?: string;
}

@ObjectType()
export class UpdateSurveyOutputDto extends CoreOutPut {
  @Field(() => SurveyDTO, { nullable: true })
  surveyDto?: SurveyDTO;
}
