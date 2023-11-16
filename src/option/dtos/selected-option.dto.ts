import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class SelectedOptionDTO {
  @Field(() => String)
  optionText: string;

  @Field(() => String)
  questionText: string;

  @Field(() => Int)
  optionOrder: number;

  @Field(() => Int)
  questionOrder: number;

  @Field(() => Int)
  score: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
