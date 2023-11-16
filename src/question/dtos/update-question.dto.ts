import { Field, InputType, Int, ObjectType, PickType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyDTO } from '../../survey/dtos/survey.dto';

@InputType()
export class UpdateQuestionInputDto {
  @Field(() => String, { nullable: true })
  chaingedText?: string;

  @Field(() => Int)
  questionOrder: number;

  @Field(() => Int)
  surveyId: number;
}

@ObjectType()
export class UpdateQuestionOutputDto extends CoreOutPut {
  @Field(() => SurveyDTO, { nullable: true })
  surveyDto?: SurveyDTO;
}
