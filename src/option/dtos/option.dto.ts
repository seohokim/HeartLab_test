import { Field, Int, ObjectType } from '@nestjs/graphql';

@ObjectType()
export class OptionDTO {
  @Field(() => String)
  optionText: string;

  @Field(() => Int)
  optionOrder: number;

  @Field(() => Int)
  score: number;

  @Field(() => Date)
  createdAt: Date;

  @Field(() => Date)
  updatedAt: Date;
}
