import { ObjectType, Field, Int } from '@nestjs/graphql';

@ObjectType()
export class OptionType {
  @Field(() => Int)
  id: number;

  @Field(() => String)
  text: string;

  @Field(() => Int)
  score: number;

  @Field(() => Int)
  optionOrder: number;

  @Field(() => Int)
  questionOrder: number;

  @Field(() => Int)
  surveyId: number;
}
