import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyDTO } from '../../survey/dtos/survey.dto';

@InputType()
export class DeleteQuestionInputDto {
  @Field(() => Int)
  surveyId: number;

  @Field(() => Int)
  questionOrder: number;
}

@ObjectType()
export class DeleteQuestionOutputDto extends CoreOutPut {
  @Field(() => SurveyDTO, { nullable: true })
  surveyDto?: SurveyDTO;
}
