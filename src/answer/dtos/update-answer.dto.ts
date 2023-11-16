import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { AnswerDTO } from './answer.dto';

@InputType()
export class UpdateAnswerInputDto {
  @Field(() => Int)
  answerId: number;

  @Field(() => [[Int]])
  questionAndOptionOrders: number[][];
}

@ObjectType()
export class UpdateAnswerOutputDto extends CoreOutPut {
  @Field(() => AnswerDTO, { nullable: true })
  answerDto?: AnswerDTO;
}
