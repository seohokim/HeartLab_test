import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyDTO } from '../../survey/dtos/survey.dto';

@InputType()
export class CreateQuestionInputDto {
  @Field(() => String)
  questionText: string;

  @Field(() => Int)
  questionOrder: number;

  @Field(() => Int)
  surveyId: number;
}

@ObjectType()
export class CreateQuestionOutputDto extends CoreOutPut {
  @Field(() => SurveyDTO, { nullable: true })
  surveyDto?: SurveyDTO;
}
