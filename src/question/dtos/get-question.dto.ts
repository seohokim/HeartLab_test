import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { QuestionDTO } from './question.dto';

@InputType()
export class GetQuestionInputDto {
  @Field(() => Int)
  questionOrder: number;

  @Field(() => Int)
  surveyId: number;
}

@ObjectType()
export class GetQuestionOutputDto extends CoreOutPut {
  @Field(() => QuestionDTO, { nullable: true })
  questionDto?: QuestionDTO;
}
