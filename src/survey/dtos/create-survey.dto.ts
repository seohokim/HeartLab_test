import { InputType, Field, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyDTO } from './survey.dto';

@InputType()
export class CreateSurveyInputDto {
  @Field(() => String)
  title: string;

  @Field(() => String)
  description: string;
}

@ObjectType()
export class CreateSurveyOutputDto extends CoreOutPut {
  @Field(() => SurveyDTO, { nullable: true })
  surveyDto?: SurveyDTO;
}
