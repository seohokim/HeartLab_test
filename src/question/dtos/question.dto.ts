import { OptionDTO } from '../../option/dtos/option.dto';
import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class QuestionDTO {
  @Field(() => String)
  questionText: string;

  @Field(() => Int)
  questionOrder: number;

  @Field(() => [OptionDTO], { nullable: true })
  options?: OptionDTO[];

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
