import { Field, InputType, Int, ObjectType } from '@nestjs/graphql';
import { CoreOutPut } from '../../common/dto/core.dto';

@InputType()
export class DeleteAnswerInputDto {
  @Field(() => Int)
  answerId: number;
}

@ObjectType()
export class DeleteAnswerOutputDto extends CoreOutPut {}
