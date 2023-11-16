import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyDTO } from '../../survey/dtos/survey.dto';

@InputType()
export class CreateOptionInputDto {
  @Field(() => String)
  optionText: string;

  @Field(() => Int)
  score: number;

  @Field(() => Int)
  optionOrder: number;

  @Field(() => Int)
  questionOrder: number;

  @Field(() => Int)
  surveyId: number;
}

@ObjectType()
export class CreateOptionOutputDto extends CoreOutPut {
  @Field(() => SurveyDTO, { nullable: true })
  surveyDto?: SurveyDTO;
}
