import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';
import { AnswerDTO } from './answer.dto';

@InputType()
export class GetAnswerInputDto {
  @Field(() => Int)
  answerId: number;
}

@ObjectType()
export class GetAnswerOutputDto extends CoreOutPut {
  @Field(() => AnswerDTO, { nullable: true })
  answerDto?: AnswerDTO;
}

@InputType()
export class GetAnswersInputDto {
  @Field(() => Int)
  surveyId: number;
}

@ObjectType()
export class GetAnswersOutputDto extends CoreOutPut {
  @Field(() => [AnswerDTO], { nullable: true })
  answerDtos?: AnswerDTO[];
}
