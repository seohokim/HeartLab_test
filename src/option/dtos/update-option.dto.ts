import { InputType, Field, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { SurveyDTO } from '../../survey/dtos/survey.dto';

@InputType()
export class UpdateOptionInputDto {
  @Field(() => Int)
  optionOrder: number;

  @Field(() => Int)
  questionOrder: number;

  @Field(() => Int)
  surveyId: number;

  @Field({ nullable: true })
  changedText?: string;

  @Field({ nullable: true })
  changedScore?: number;
}

@ObjectType()
export class UpdateOptionOutputDto extends CoreOutPut {
  @Field(() => SurveyDTO, { nullable: true })
  surveyDto?: SurveyDTO;
}
