import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { AnswerDTO } from './answer.dto';

@InputType()
export class CreateAnswerInputDto {
  @Field(() => Int)
  surveyId: number;

  @Field(() => [[Int]])
  questionAndOptionOrders: number[][];
}

@ObjectType()
export class CreateAnswerOutputDto extends CoreOutPut {
  @Field(() => AnswerDTO, { nullable: true })
  answerDto?: AnswerDTO;
}
